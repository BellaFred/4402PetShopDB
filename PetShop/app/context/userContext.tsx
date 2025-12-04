import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  email: string | null;
  name: string | null;
  customerId: string | null;
  setEmail: (email: string | null) => void;
  setName: (name: string | null) => void;
  setCustomerId: (id: string | null) => void;
};

const UserContext = createContext<UserContextType>({
  email: null,
  name: null,
  customerId: null,
  setEmail: () => {},
  setName: () => {},
  setCustomerId: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{ email, name, customerId, setEmail, setName, setCustomerId }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
