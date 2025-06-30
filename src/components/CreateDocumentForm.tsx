'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createParticular, createReminder, fetchCurrentUser} from '@/lib/user';
import CurrentUser from '@/lib/user';

const CreateDocumentForm = () => {
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('other');
  const [notes, setNotes] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [reminderMethods, setReminderMethods] = useState<string[]>([]);
  const [recurrence, setRecurrence] = useState('none');
  const [startDaysBefore, setStartDaysBefore] = useState(3);
  const [userProfile, setUserProfile] = useState<CurrentUser | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await fetchCurrentUser();
      setUserProfile(profile);
    };
    loadUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (reminderMethods.length === 0) {
      setError('Please select at least one notification preference.');
      return;
    }

    const today = new Date();
    const expiry = new Date(expiryDate);
    const reminder = new Date(scheduleDate);

    // Validation: expiry date must be after today
    if (expiry <= today) {
      setError('Expiry date must be after today.');
      return;
    }

    // Validation: reminder must be after or equal to today
    if (reminder < today) {
      setError('Reminder date cannot be before today.');
      return;
    }

    // Validation: reminder must not be after expiry
    if (reminder > expiry) {
      setError('Reminder date cannot be after expiry date.');
      return;
    }
    
    if (document && document.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB.');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('expiry_date', expiryDate);
    formData.append('category', category);
    formData.append('notes', notes);
    if (document) {
      formData.append('document', document);
    }
  
    try {
      // 1. Create Particular
      const particular = await createParticular(formData);
      const particularId = particular.id;
  
      // 2. Create Reminder
      // Convert the datetime-local input value to ISO string
      const scheduledDate = new Date(scheduleDate);
      const reminderPayload = {
        particular: particularId,
        scheduled_date: scheduledDate.toISOString(),
        reminder_methods: reminderMethods,
        recurrence,
        start_days_before: startDaysBefore,
      };
      await createReminder(reminderPayload);
  
      router.push('/documents');
    } catch (err: any) {
      console.error(err?.response?.data);
      setError(err?.response?.data?.detail || 'Failed to create document or reminder');
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

  return (
    <div className="p-6 max-w-xl mx-auto shadow rounded-lg font-mono">
      {/*<h1 className="text-xl font-bold mb-4 text-gray-800">Create New Document</h1>*/}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-gray-800">
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

        <label className='text-gray-800 text-sm'>Upload Document <span className="text-gray-500 text-xs">(Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, JPEG, PNG, GIF, BMP, SVG, WEBP. Max 20MB)</span></label>
        <input
          className="border border-gray-400 p-4 rounded-lg text-sm mb-2"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,image/*"
          onChange={(e) => setDocument(e.target.files?.[0] || null)}
        />
        <h2 className="text-gray-800 font-semibold mt-6">Reminder Settings</h2>
        
        <label className='text-gray-800 text-sm'>Reminder Date<span className="text-red-700">*</span></label>
        <small className="text-gray-500 mb-1 block">
          e.g., 10/06/2025 at 09:30 AM
        </small>
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

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bgg-main bgg-hover text-white p-5 rounded-3xl"
        >
          Create Document
        </button>
      </form>
    </div>
  );
};

export default CreateDocumentForm;
