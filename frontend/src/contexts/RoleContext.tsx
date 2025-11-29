import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'tax-clerk' | 'client';

interface User {
  name: string;
  role: UserRole;
  roleLabel: string;
}

interface RoleContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const availableUsers: User[] = [
  {
    name: 'Sabine Kramer',
    role: 'tax-clerk',
    roleLabel: 'Steuerfachangestellte'
  },
  {
    name: 'Muster-Mandant GmbH',
    role: 'client',
    roleLabel: 'Mandant'
  }
];

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(availableUsers[0]);

  return (
    <RoleContext.Provider value={{ currentUser, setCurrentUser, users: availableUsers }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
