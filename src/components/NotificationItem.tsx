import React from 'react';

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, message, time }) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  return (
    <div className='w-full h-16 bg-white text-gray-700 border border-gray-300 rounded-md p-3 flex flex-row space-x-3 items-center'>
      <div className='h-5 w-5 bg-red-200 rounded-full'></div>

      <div className='flex flex-col justify-between w-full'>
        <div className='flex flex-row justify-between'>
          <h5 className='text-xs font-semibold'>{title}</h5>
          <p className='text-vvs text-gray-600'>{formatTime(time)}</p>
        </div>

        <p className='text-vvs text-gray-600'>{message}</p>
      </div>

      <div className='hidden md:flex items-center justify-center bgg-main text-white w-9 h-9 rounded-md'>
        <svg className="h-5 w-5"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />
        </svg>

      </div>
      
    </div>
  );
};

export default NotificationItem;
