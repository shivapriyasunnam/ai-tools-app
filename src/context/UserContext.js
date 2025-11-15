import { createContext, useContext, useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await storageService.getUserProfile();
      setUserName(profile.name || '');
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserName = async (name) => {
    try {
      await storageService.saveUserProfile({ name });
      setUserName(name);
      return true;
    } catch (error) {
      console.error('Error saving user name:', error);
      return false;
    }
  };

  const value = {
    userName,
    saveUserName,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
