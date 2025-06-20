import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PrivacySetting } from '@/shared/types/shared';

interface PrivacyState {
  setting: PrivacySetting;
  toggle: () => void;
}

export const usePrivacyStore = create<PrivacyState>(
  persist(
    (set, get) => ({
      setting: {
        hideAmounts: false,
        updatedAt: new Date().toISOString(),
      },
      toggle: () => {
        const current = get().setting.hideAmounts;
        set({
          setting: {
            hideAmounts: !current,
            updatedAt: new Date().toISOString(),
          },
        });
      },
    }),
    {
      name: 'privacy-setting',
    }
  )
);
