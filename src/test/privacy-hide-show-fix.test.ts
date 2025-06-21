import { describe, it, expect, beforeEach } from 'vitest';
import { usePrivacyStore } from '@/features/privacy-hide-amounts/store';
import { formatCurrency } from '@/shared/utils/formatters';

describe('Privacy Hide/Show Functionality', () => {
  beforeEach(() => {
    // Reset privacy store to default state
    usePrivacyStore.setState({
      setting: {
        hideAmounts: false,
        updatedAt: new Date().toISOString(),
      },
    });
  });

  it('should show actual currency amounts when privacy is disabled', () => {
    const { setting } = usePrivacyStore.getState();
    expect(setting.hideAmounts).toBe(false);
    
    const formattedAmount = formatCurrency(1234.56);
    expect(formattedAmount).toContain('$1,234.56');
    expect(formattedAmount).not.toContain('•');
  });

  it('should hide currency amounts when privacy is enabled', () => {
    // Toggle privacy on
    usePrivacyStore.getState().toggle();
    
    const { setting } = usePrivacyStore.getState();
    expect(setting.hideAmounts).toBe(true);
    
    const formattedAmount = formatCurrency(1234.56);
    expect(formattedAmount).toContain('•');
    expect(formattedAmount).not.toContain('1234');
  });

  it('should toggle privacy state correctly', () => {
    const { toggle } = usePrivacyStore.getState();
    
    // Initial state should be false
    expect(usePrivacyStore.getState().setting.hideAmounts).toBe(false);
    
    // Toggle to true
    toggle();
    expect(usePrivacyStore.getState().setting.hideAmounts).toBe(true);
    
    // Toggle back to false
    toggle();
    expect(usePrivacyStore.getState().setting.hideAmounts).toBe(false);
  });

  it('should update timestamp when toggling privacy', () => {
    const initialTimestamp = usePrivacyStore.getState().setting.updatedAt;
    
    // Wait a moment to ensure timestamp difference
    setTimeout(() => {
      usePrivacyStore.getState().toggle();
      const newTimestamp = usePrivacyStore.getState().setting.updatedAt;
      expect(newTimestamp).not.toBe(initialTimestamp);
    }, 10);
  });
}); 