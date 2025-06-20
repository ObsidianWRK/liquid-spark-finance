import React from 'react';

export const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[18rem] gap-6">
    {children}
  </div>
);
