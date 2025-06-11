'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchCurrentUser, updateUserSettings } from '@/lib/user';
import type CurrentUser from "@/lib/user";
import Loader from '@/components/Loader';

const SettingsPage = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showNotificationEdit, setShowNotificationEdit] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchCurrentUser();
      if (data) {
        setUser(data);
        setUsername(data.user.username);
        setEmail(data.user.email);
        setEmailNotifications(data.email_notifications);
        setSmsNotifications(data.sms_notifications);
        setPushNotifications(data.push_notifications);
        setWhatsappNotifications(data.whatsapp_notifications);
      }
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await updateUserSettings({
        username,
        email,
      });
      setEditMode(false);
      setShowProfileEdit(false);
      
      // Refresh user data to get updated profile information
      const updatedUser  = await fetchCurrentUser ();
      if (updatedUser ) {
        setUser (updatedUser );
        setUsername(updatedUser .user.username);
        setEmail(updatedUser .user.email);
      }
    } catch (error) {
      setSaveError('Failed to save profile settings');
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await updateUserSettings({
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        push_notifications: pushNotifications,
        whatsapp_notifications: whatsappNotifications,
      });
      setShowNotificationEdit(false);
      
      // Refresh user data to get updated notification settings
      const updatedUser  = await fetchCurrentUser ();
      if (updatedUser ) {
        setUser (updatedUser );
        setEmailNotifications(updatedUser .email_notifications);
        setSmsNotifications(updatedUser .sms_notifications);
        setPushNotifications(updatedUser.push_notifications);
        setWhatsappNotifications(updatedUser.whatsapp_notifications);
      }
    } catch (error) {
      setSaveError('Failed to save notification settings');
      console.error('Error saving notifications:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    setShowImageOptions(true);
  };

  const handleImageEdit = () => {
    fileInputRef.current?.click();
    setShowImageOptions(false);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        setSaveError(null);
        await updateUserSettings({
          profile_picture: file
        });
        
        // Refresh user data to get new profile picture URL
        const updatedUser = await fetchCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
      } catch (error) {
        setSaveError('Failed to update profile picture');
        console.error('Error updating profile picture:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="p-4 w-full overflow-x-hidden font-mono flex flex-col space-y-7">

      {/* Header - Avatar and Edit Profile Button */}
      <div className="rounded-md border border-gray-400 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div 
              className="h-16 w-16 bg-gray-300 rounded-full relative overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleImageClick}
            >
              {user?.profile_picture_url ? (
                <Image 
                  alt="user" 
                  src={user.profile_picture_url} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-2xl text-gray-600">
                    {user?.user.username?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            {showImageOptions && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-32">
                <button
                  onClick={handleImageEdit}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Edit
                </button>
                {user?.profile_picture_url && (
                  <a
                    href={user.profile_picture_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setShowImageOptions(false)}
                  >
                    View
                  </a>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h5 className="text-sm font-bold">{user?.user.username || 'Loading...'}</h5>
            <p className="text-xs">{user?.user.email}</p>
          </div>
        </div>
        <button
          className='w-12 h-12 rounded-full bgg-main opacity-75 p-3'
          onClick={() => {
            setShowProfileEdit((prev) => !prev);
            setEditMode(true);
          }}
          disabled 
        >
          <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {/* Profile Edit Section */}
      {showProfileEdit && (
        <div className="border rounded p-4 space-y-2 bg-gray-50">
          <h4 className="text-sm font-bold text-gray-800">Edit Profile</h4>
          <input
            className="border rounded w-full p-2"
            disabled={!editMode}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="border rounded w-full p-2"
            disabled={!editMode}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {editMode && (
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          )}
          {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
        </div>
      )}

      {/* Notification Preferences Toggle */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Account Settings</h4>
        <div className="rounded-md border border-gray-400 h-14 flex justify-between items-center p-2">
          <div className="flex items-center space-x-3">
            <div className='h-10 w-10 bgg-main opacity-75 rounded-lg flex items-center justify-center'>
              <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h5 className="text-xs">Notification Preferences</h5>
          </div>
          <button className='p-3' onClick={() => setShowNotificationEdit(prev => !prev)}>
            <svg className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notification Edit Section */}
      {showNotificationEdit && (
        <div className="mt-2 border border-gray-200 rounded p-4 bg-gray-50 space-y-2">
          <div className="flex justify-between items-center">
            <label>Email Notifications</label>
            <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
          </div>
          <div className="flex justify-between items-center">
            <label>SMS Notifications</label>
            <input type="checkbox" checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
          </div>
          <div className="flex justify-between items-center">
            <label>Push Notifications</label>
            <input type="checkbox" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
          </div>
          <div className="flex justify-between items-center">
            <label>WhatsApp Notifications</label>
            <input type="checkbox" checked={whatsappNotifications} onChange={() => setWhatsappNotifications(!whatsappNotifications)} />
          </div>
          <button
            onClick={handleSaveNotifications}
            disabled={isSaving}
            className="w-full bgg-main text-black py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
          >
            {isSaving ? 'Saving...' : 'Save Notifications'}
          </button>
          {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
        </div>
        )}

      {/* Subscription Info */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Subscription</h4>
        <div className="rounded-md border border-gray-400 h-14 flex justify-between items-center p-2">
          <div className="flex items-center space-x-3">
            <div className='h-10 w-10 bgg-main opacity-75 rounded-lg flex items-center justify-center'>
              <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h5 className="text-xs">{user?.subscription_plan.name} Plan</h5>
              <p className="text-vvs fff-main">Active until May 15, 2025</p>
            </div>
          </div>
          <button className='p-2 flex items-center space-x-1 text-gray-800'>
            <span className="text-vvs">Renew</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
