'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { differenceInDays, parseISO } from 'date-fns';
import api from "@/lib/api";
import Link from 'next/link';
import { deleteParticular } from '@/lib/user';
import Modal from './Modal';
import { getFileTypeIcon } from '@/lib/getFileIcon';

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

const DocumentDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [particular, setParticular] = useState<Particular | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  useEffect(() => {
    const fetchParticular = async () => {
      const response = await api.get(`/api/particulars/${id}/`);
      setParticular(response.data);
    };

    fetchParticular();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteParticular(Number(id));
      router.push('/documents');
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (!particular) return <div className="p-5">Loading...</div>;
    const expiryDate = parseISO(particular.expiry_date);
    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);

    const isExpiringSoon = daysLeft < 30;
    const bgColor = isExpiringSoon ? 'bg-red-100' : 'bg-green-100';
    const Icon = isExpiringSoon ? (
    // Warning icon
    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.643-1.14 1.057-2.006L13.057 4.994a1.2 1.2 0 00-2.114 0L4.025 17.994c-.586.866.003 2.006 1.057 2.006z" />
    </svg>
    ) : (
    // Check icon
    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    );

    // Renewal links by category
    const renewalLinks: Record<string, { label: string; url: string }[]> = {
      "driver": [
        { label: "Renew Driver's License (Nigerian Government)", url: "https://www.nigeriadriverslicence.org/dlApplication/renew" },
        { label: "FRSC Driver's License Portal", url: "https://www.nigeriadriverslicence.org/" },
      ],
      "vehicle": [
        { label: "Renew Vehicle License (Lagos State)", url: "https://www.lsmvaapvs.org/" },
        { label: "Renew Vehicle License (Nigerian Government)", url: "https://www.nigeriavehiclelicence.com/" },
      ],
      "international passport": [
        { label: "Renew International Passport", url: "https://portal.immigration.gov.ng/" },
      ],
      "default": [
        { label: "General Renewal Portal", url: "https://www.nigeria.gov.ng/" },
      ],
    };
    const categoryKey = (particular.category || '').toLowerCase();
    const links = renewalLinks[categoryKey] || renewalLinks['default'];

    return(
      <div className="flex flex-col space-y-5 font-mono">
        <div className="border border-gray-300 p-4 rounded-lg">
          <div className="flex flex-row justify-start space-x-4">
            <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center">
              {particular.document_url ? (
                (() => {
                  const type = getFileTypeIcon(particular.document_url);

                  if (type === 'image') {
                    return (
                      <img src={particular.document_url} alt={particular.title} className="w-full max-w-sm h-auto object-contain"
                          onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                          }}
                      />
                    );
                  } else {
                    return (
                      <a href={particular.document_url} target="_blank" rel="noopener noreferrer" className="fff-main text-vvs">
                          {type.toUpperCase()}
                      </a>
                    );
                  }
                })()
              ) : (
                <div className='w-full h-full bgg-main opacity-75 p-2 rounded-md'>
                  <svg className="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />  
                    <polyline points="14 2 14 8 20 8" />  
                    <line x1="16" y1="13" x2="8" y2="13" />  
                    <line x1="16" y1="17" x2="8" y2="17" />  
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <h4 className="text-sm text-gray-800 dark:text-gray-500 font-semibold">{particular.title}</h4>
              <h5 className="text-gray-700 dark:text-gray-500 text-xs">{particular.category}</h5>
            </div>
          </div>

          <div className={`flex mt-5 flex-row justify-between p-3 rounded-md ${bgColor}`}>
            <div className="flex flex-col justify-between">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-500">Expires In</h4>
              <h5 className="text-gray-700 text-xs">
                {daysLeft} days ({particular.expiry_date})
              </h5>
            </div>
            {Icon}
          </div>
        </div>

        <div className='flex flex-row justify-between items-center'>
          <h4 className='text-sm font-semibold text-gray-800 dark:text-gray-500'>Document Details</h4>
          {isExpiringSoon ? (
            <button
              className='bgg-main bgg-hover text-white px-3 py-1 text-sm rounded-md'
              onClick={() => setIsRenewModalOpen(true)}
            >
              Renew
            </button>
          ):(
            <span></span>
          )}
        </div>

        <div className="border border-gray-300 p-4 rounded-lg text-gray-800 dark:text-gray-500">
          <div className='flex flex-row justify-between text-sm my-1'>
            <h4>Document Name</h4>
            <h4>{particular.title}</h4>
          </div>

          <div className='flex flex-row justify-between text-sm my-1'>
            <h4>Expiry Date</h4>
            <h4>{particular.expiry_date}</h4>
          </div>

          <h4 className='font-semibold text-sm mt-4 mb-2 text-gray-800 dark:text-gray-500'>Reminder Settings:</h4>

          {particular.reminders.length > 0 ? (
            <div className='space-y-4'>
              {particular.reminders.map((reminder) => (
                <div className="rounded-lg shadow p-1">
                  <div key={reminder.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-500 mb-1">Reminder Date</h3>
                      <p className="text-gray-800 dark:text-gray-500 text-sm">
                        {reminder.scheduled_date ? new Date(reminder.scheduled_date).toLocaleString() : 'Not set'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-500 mb-1">Recurrence</h3>
                      <p className="text-gray-800 dark:text-gray-500 text-sm">
                        {reminder.recurrence === 'none' ? 'No recurrence' : 
                        reminder.recurrence === 'daily' ? 'Daily' : 
                        reminder.recurrence === 'every_2_days' ? 'Every 2 days' : 
                        reminder.recurrence}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-500 mb-1">Start Days Before Expiry</h3>
                      <p className="text-gray-800 dark:text-gray-500 text-sm">
                        {reminder.recurrence === 'none' ? 'N/A' : 
                        `${reminder.start_days_before} days`}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-500 mb-1">Notification Methods</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {reminder.reminder_methods.map((method) => (
                          <span 
                            key={method} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                          >
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No reminders set.</p>
          )}
        </div>

        <Link href={`/documents/${id}/edit`} className="px-4 py-4 text-xs text-white bgg-main bgg-hover rounded-3xl text-center">
          Edit Document
        </Link>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className='px-4 py-4 text-xs text-white bg-red-600 rounded-3xl text-center hover:bg-red-700'
        >
          Delete Document
        </button>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Document"
          size="sm"
          footer={
            <>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this document? This action cannot be undone.
          </p>
        </Modal>

        <Modal
          isOpen={isRenewModalOpen}
          onClose={() => setIsRenewModalOpen(false)}
          title={`Renew ${particular.title}`}
          size="sm"
          footer={null}
        >
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Choose a renewal option:</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      </div>
    );
};

export default DocumentDetails;
