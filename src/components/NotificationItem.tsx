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
    </div>
  );
};

export default NotificationItem;
