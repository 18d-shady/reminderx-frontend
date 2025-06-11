'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateParticular, updateReminder, fetchCurrentUser } from '@/lib/user';
import CurrentUser from '@/lib/user';
import api from '@/lib/api';
import Loader from './Loader';

type Reminder = {
  id: number;
  scheduled_date: string;
  reminder_methods: string[];
  reminder_message: string;
  recurrence: string;
  start_days_before: number;
};

type Particular = {
  id: number;
  title: string;
  category: string;
  expiry_date: string;
  notes: string;
  document_url?: string;
  reminders: Reminder[];
};

const EditDocumentForm = () => {
  const params = useParams();
  const router = useRouter();
  const [particular, setParticular] = useState<Particular | null>(null);
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('other');
  const [notes, setNotes] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [reminderMethods, setReminderMethods] = useState<string[]>([]);
  const [recurrence, setRecurrence] = useState('none');
  const [startDaysBefore, setStartDaysBefore] = useState(3);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await fetchCurrentUser();
      setUserProfile(profile);
    };
    loadUserProfile();
  }, []);

  useEffect(() => {
    const fetchParticular = async () => {
      try {
        const response = await api.get(`/api/particulars/${params.id}/`);
        const data = response.data;
        setParticular(data);
        
        // Set form values from fetched data
        setTitle(data.title);
        setExpiryDate(data.expiry_date);
        setCategory(data.category);
        setNotes(data.notes || '');
        
        // Set reminder values from the first reminder
        if (data.reminders && data.reminders.length > 0) {
          const reminder = data.reminders[0];
          // Format the datetime for the input field (YYYY-MM-DDThh:mm)
          const scheduledDate = new Date(reminder.scheduled_date);
          const formattedDate = scheduledDate.toISOString().slice(0, 16);
          setScheduleDate(formattedDate);
          setReminderMethods(reminder.reminder_methods || []);
          setRecurrence(reminder.recurrence);
          setStartDaysBefore(reminder.start_days_before);
        }
      } catch (err) {
        setError('Failed to fetch document details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchParticular();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!particular) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('expiry_date', expiryDate);
    formData.append('category', category);
    formData.append('notes', notes);
    if (document) {
      formData.append('document', document);
    }
  
    try {
      // 1. Update Particular
      await updateParticular(particular.id, formData);
  
      // 2. Update Reminder
      if (particular.reminders && particular.reminders.length > 0) {
        // Convert the datetime-local input value to ISO string
        const scheduledDate = new Date(scheduleDate);
        const reminderPayload = {
          scheduled_date: scheduledDate.toISOString(),
          reminder_methods: reminderMethods,
          recurrence,
          start_days_before: startDaysBefore,
        };
        await updateReminder(particular.reminders[0].id, reminderPayload);
      }
  
      router.push('/documents');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Failed to update document');
    }
  };

  const getEnabledMethods = () => {
    if (!userProfile) return [];
    return [
      userProfile.email_notifications && 'email',
      userProfile.sms_notifications && 'sms',
      userProfile.push_notifications && 'push',
      userProfile.whatsapp_notifications && 'whatsapp',
    ].filter(Boolean) as string[];
  };

  const enabledMethods = getEnabledMethods();

  if (isLoading) {
    return <Loader />;
  }

  if (!particular) {
    return <div className="p-6 text-center text-red-500">Document not found</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg font-mono">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className='text-gray-800 text-sm'>Document Name<span className="text-red-700">*</span></label>
        <input
          className="border border-gray-400 p-4 rounded-full text-sm mb-2"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Document Name"
          required
        />

        <label className='text-gray-800 text-sm'>Document Type<span className="text-red-700">*</span></label>
        <select
          className="border border-gray-400 p-4 rounded-full text-sm mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="vehicle">Vehicle</option>
          <option value="travels">Travels</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="professional">Professional</option>
          <option value="household">Household</option>
          <option value="finance">Finance</option>
          <option value="health">Health</option>
          <option value="social">Social</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>

        <label className='text-gray-800 text-sm'>Expiry Date<span className="text-red-700">*</span></label>
        <input
          className="border border-gray-400 p-4 rounded-full text-sm mb-2"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
        
        <label className='text-gray-800 text-sm'>Notes</label>
        <textarea
          className="border border-gray-400 p-4 rounded-lg text-sm mb-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />

        <label className='text-gray-800 text-sm'>Upload Document</label>
        <input
          className="border border-gray-400 p-4 rounded-lg text-sm mb-2"
          type="file"
          onChange={(e) => setDocument(e.target.files?.[0] || null)}
        />
        {particular.document_url && (
          <p className="text-sm text-gray-600 mb-2">
            Current document: <a href={particular.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
          </p>
        )}

        <h2 className="text-gray-800 font-semibold mt-6">Reminder Settings</h2>
        
        <label className='text-gray-800 text-sm'>Reminder Date<span className="text-red-700">*</span></label>
        <input
          className="border border-gray-400 p-4 rounded-full text-sm mb-2"
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          required
        />

        <label className='text-gray-800 text-sm'>Notification Preference<span className="text-red-700">*</span></label>
        <div className="flex flex-col gap-2">
          {['email', 'sms', 'push', 'whatsapp'].map(method => {
            const isEnabled = enabledMethods.includes(method);
            return (
              <label 
                key={method} 
                className={`flex items-center gap-2 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  value={method}
                  checked={reminderMethods.includes(method)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setReminderMethods([...reminderMethods, method]);
                    } else {
                      setReminderMethods(reminderMethods.filter(m => m !== method));
                    }
                  }}
                  disabled={!isEnabled}
                />
                {method.charAt(0).toUpperCase() + method.slice(1)}
                {!isEnabled && <span className="text-sm text-gray-500">(Disabled in profile)</span>}
              </label>
            );
          })}
        </div>

        <label className='text-gray-800 text-sm'>Recurring Reminder<span className="text-red-700">*</span></label>
        <select
          className="border border-gray-400 p-4 rounded-full text-sm mb-2"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="every_2_days">Every 2 Days</option>
        </select>

        <label className='text-gray-800 text-sm'>Start Day Before Expiry Date</label>
        <input
          className={`border border-gray-400 p-4 rounded-full text-sm mb-6 ${recurrence === 'none' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          type="number"
          value={startDaysBefore}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > 7) {
              setStartDaysBefore(7);
            } else if (value < 1) {
              setStartDaysBefore(1);
            } else {
              setStartDaysBefore(value);
            }
          }}
          min={1}
          max={7}
          disabled={recurrence === 'none'}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          type="submit"
          className="bgg-main text-white p-5 rounded-3xl"
        >
          Update Document
        </button>
      </form>
    </div>
  );
};

export default EditDocumentForm;
