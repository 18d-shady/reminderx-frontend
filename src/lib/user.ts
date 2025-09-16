import api from '@/lib/api';
import { useSubscription } from './useSubscription'; // Adjust path if needed

interface CurrentUser {
  user: {
    username: string;
    email: string;
  };
  phone_number: string | null;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  whatsapp_notifications: boolean;
  subscription_plan: number | null;
  profile_picture_url: string | null;
  role: "admin" | "staff"; // added role
  organization?: {
    id: number;                // organization database id
    organizational_id: string; // 6-digit ID
    name: string;
    icon_url: string | null;
    admin?: {
      id: number;
      username: string;
      email: string;
    } | null;
  } | null;
}
export default CurrentUser;

export const planMap: Record<number, 'free' | 'premium' | 'enterprise' | 'multiusers'> = {
  1: 'free',
  2: 'premium',
  3: 'enterprise',
  4: 'multiusers',
};


export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await api.get<CurrentUser>('/api/me/');
    const user = response.data;

    // ✅ update Zustand store
    const { setPlan, clear } = useSubscription.getState();

    if (user.subscription_plan && planMap[user.subscription_plan]) {
      setPlan(planMap[user.subscription_plan]);
    } else {
      clear();
    }

    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // clear plan on failure
    const { clear } = useSubscription.getState();
    clear();

    return null;
  }
};

export const updateUserSettings = async (payload: {
  username?: string;
  email?: string;
  phone_number?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  whatsapp_notifications?: boolean;
  push_notifications?: boolean;
  profile_picture?: File;
}) => {
  const formData = new FormData();
  
  // Handle file upload
  if (payload.profile_picture) {
    formData.append('profile_picture', payload.profile_picture);
  }
  
  // Handle other fields
  Object.entries(payload).forEach(([key, value]) => {
    if (key !== 'profile_picture' && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  const response = await api.patch<CurrentUser>('/api/me/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProfile = async (): Promise<void> => {
  try {
    await api.delete('/api/me/');
  } catch (error) {
    console.error('Failed to delete profile:', error);
    throw error;
  }
};

// lib/api/particulars.ts
//import api from '@/lib/api';

export interface Particular {
  id: number;
  title: string;
  expiry_date: string;
  reminders: {
    id: number;
    scheduled_date: string;
    recurrence: string;
    start_days_before: number;
  }[];
}

export const fetchParticulars = async (): Promise<Particular[]> => {
  try {
    const response = await api.get<Particular[]>('/api/particulars/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch particulars:', error);
    return [];
  }
};

export async function createParticular(data: FormData) {
  const response = await api.post('/api/particulars/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function createReminder(data: {
  particular: number;
  scheduled_date: string;
  reminder_methods: string[];
  recurrence: string;
  start_days_before: number;
}) {
  const response = await api.post('/api/reminders/', data);
  return response.data;
}

export const searchParticulars = async (query: string): Promise<Particular[]> => {
  try {
    const response = await api.get<Particular[]>(`/api/particulars/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Failed to search particulars:', error);
    return [];
  }
};

// Update a particular by ID (PATCH)
export async function updateParticular(id: number, formData: FormData) {
  const response = await api.patch(`/api/particulars/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Update a reminder by ID (PATCH)
export async function updateReminder(id: number, data: {
  scheduled_date?: string;
  reminder_method?: string;
  recurrence?: string;
  start_days_before?: number;
}) {
  const response = await api.patch(`/api/reminders/${id}/`, data);
  return response.data;
}

export interface Notification {
  id: number;
  particular_title: string;
  message: string;
  created_at: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get<Notification[]>('/api/notifications/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

// Delete a particular and its reminders
export async function deleteParticular(id: number) {
  try {
    const response = await api.delete(`/api/particulars/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete particular:', error);
    throw error;
  }
}


