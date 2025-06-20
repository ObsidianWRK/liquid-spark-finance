import { describe, it, expect } from 'vitest';
import { useWidgetsStore as store } from '@/features/widgets/store';

describe('Widgets Store', () => {
  it('lists and manages widgets', async () => {
    await (store as any).getState().refresh();
    const widgets = (store as any).getState().widgets;
    expect(widgets.length).toBeGreaterThan(0);

    await (store as any).getState().create('balance');
    const updated = (store as any).getState().widgets;
    expect(updated.length).toBeGreaterThan(widgets.length);
  });
});
