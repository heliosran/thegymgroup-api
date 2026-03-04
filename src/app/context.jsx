import { createContext, useContext } from 'react';

export const GymAppContext = createContext(null);

export function useGymApp() {
  const value = useContext(GymAppContext);
  if (!value) throw new Error('useGymApp must be used within GymAppContext.Provider');
  return value;
}
