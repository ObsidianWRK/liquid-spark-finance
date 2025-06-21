import { NavigateFunction } from 'react-router-dom';

export const goBack = (
  navigate: NavigateFunction,
  fallbackPath: string = '/'
) => {
  // If there is at least one previous entry we can pop, use it
  // Safari/iOS counts differently, so >= 2 is brittle – just check > 1
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallbackPath);
  }
}; 