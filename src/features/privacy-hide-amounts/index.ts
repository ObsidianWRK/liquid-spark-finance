export { usePrivacyStore } from './store';
export { PrivacyToggle } from './components/PrivacyToggle';

export const maskCurrency = (formatted: string) => {
  return formatted.replace(/\d/g, '•');
};
