import { apiClient } from '@/src/services/apiClient';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/user/profile')
      .then(profile => setUserName(profile.name || ''))
      .catch(() => setUserName(''))
      .finally(() => setIsLoading(false));
  }, []);

  const saveUserName = async (name) => {
    try {
      await apiClient.put('/api/user/profile', { name });
      setUserName(name);
      return true;
    } catch (error) {
      console.error('Error saving user name:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ userName, saveUserName, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export default UserContext;
