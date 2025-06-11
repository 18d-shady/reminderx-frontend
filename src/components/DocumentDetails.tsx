'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { differenceInDays, parseISO } from 'date-fns';
import api from "@/lib/api";
import Link from 'next/link';

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
  const [particular, setParticular] = useState<Particular | null>(null);

  useEffect(() => {
    const fetchParticular = async () => {
      const response = await api.get(`/api/particulars/${id}/`);
      setParticular(response.data);
    };

    fetchParticular();
  }, [id]);

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

    return(
      <div className="flex flex-col space-y-5 font-mono">
        <div className="border border-gray-300 p-4 rounded-lg">
          <div className="flex flex-row justify-start space-x-4">
            <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center">
              {particular.document_url ? (
                <>
                    {particular.document_url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img
                        src={particular.document_url}
                        alt={particular.title}
                        className="w-full max-w-sm h-auto object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    ) : (
                    <a
                        href={particular.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="text-blue-600 underline text-vvs"
                    >
                        View or Download
                    </a>
                    )}
                </>
                ) : (
                <div className='w-full h-full bgg-main opacity-75 p-2 rounded-md'>
                  <svg className="h-8 w-8 text-gray-800"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  
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
              <h4 className="text-sm font-semibold">{particular.title}</h4>
              <h5 className="text-gray-700 text-xs">{particular.category}</h5>
            </div>
          </div>

          <div className={`flex mt-5 flex-row justify-between p-3 rounded-md ${bgColor}`}>
            <div className="flex flex-col justify-between">
              <h4 className="font-semibold text-sm">Expires In</h4>
              <h5 className="text-gray-700 text-xs">
                {daysLeft} days ({particular.expiry_date})
              </h5>
            </div>
            {Icon}
          </div>
        </div>

        <h4 className='text-sm font-semibold'>Document Details</h4>

        <div className="border border-gray-300 p-4 rounded-lg">
          <div className='flex flex-row justify-between text-sm my-1'>
            <h4>Document Name</h4>
            <h4>{particular.title}</h4>
          </div>

          <div className='flex flex-row justify-between text-sm my-1'>
            <h4>Expiry Date</h4>
            <h4>{particular.expiry_date}</h4>
          </div>

          <div className='flex flex-row justify-between text-sm my-1'>
            <h4>Issuing Authority</h4>
            <h4 className='fff-main'>www.bla bla</h4>
          </div>

          <h4 className='font-semibold text-sm mt-4 mb-2'>Reminder Settings:</h4>

          {particular.reminders.length > 0 ? (
            <div className='space-y-4'>
              {particular.reminders.map((reminder) => (
                <div key={reminder.id} className='text-sm border-l-2 border-gray-200 pl-4'>
                  <p className='my-1'><strong>Date:</strong> {new Date(reminder.scheduled_date).toLocaleString()}</p>
                  <p className='my-1'><strong>Methods:</strong></p>
                  <ul className='list-disc list-inside ml-4'>
                    {reminder.reminder_methods.map((method, index) => (
                      <li key={index} className='text-xs capitalize'>{method}</li>
                    ))}
                  </ul>
                  <p className='my-1'><strong>Message:</strong> {reminder.reminder_message || 'N/A'}</p>
                  <p className='my-1'><strong>Recurrence:</strong> {reminder.recurrence}</p>
                  <p className='my-1'><strong>Start Days Before:</strong> {reminder.start_days_before}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>No reminders set.</p>
          )}
        </div>

        <Link href={`/documents/${id}/edit`} className="px-4 py-4 text-xs text-white bgg-main rounded-3xl text-center">
          Edit Document
        </Link>
      </div>
    );
};

export default DocumentDetails;
