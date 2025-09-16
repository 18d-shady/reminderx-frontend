import { create } from 'zustand';

interface SubscriptionState {
  plan: 'free' | 'premium' | 'enterprise' | 'multiusers' | null;
  setPlan: (plan: 'free' | 'premium' | 'enterprise' | 'multiusers') => void;
  clear: () => void;
}

export const useSubscription = create<SubscriptionState>((set) => ({
  plan: null,
  setPlan: (plan) => set({ plan }),
  clear: () => set({ plan: null }),
}));
