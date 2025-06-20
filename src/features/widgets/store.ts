import { create } from 'zustand';
import { widgetService } from '@/features/widgets/api/widgetService';
import { HomeWidget } from '@/shared/types/shared';

interface WidgetsState {
  widgets: HomeWidget[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  create: (type: 'balance' | 'safe_to_spend') => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export const useWidgetsStore = create<WidgetsState>((set, get) => ({
  widgets: [],
  loading: false,
  error: undefined,
  refresh: async () => {
    set({ loading: true, error: undefined });
    try {
      const widgets = await widgetService.listWidgets();
      set({ widgets, loading: false });
    } catch (err: any) {
      set({ error: err.message ?? 'Unknown', loading: false });
    }
  },
  create: async (type) => {
    await widgetService.createWidget(type);
    await get().refresh();
  },
  delete: async (id) => {
    await widgetService.deleteWidget(id);
    await get().refresh();
  },
}));
