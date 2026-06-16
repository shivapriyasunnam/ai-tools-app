import { createContext, useContext, useState } from 'react';

const HeaderContext = createContext({ rightAction: null, setRightAction: () => {} });

export function HeaderProvider({ children }) {
  const [rightAction, setRightAction] = useState(null);
  return (
    <HeaderContext.Provider value={{ rightAction, setRightAction }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderAction() {
  return useContext(HeaderContext);
}
