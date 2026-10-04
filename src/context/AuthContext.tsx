import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role, Address } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: Role, credentials: any) => Promise<boolean>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
  updateAddress: (address: Address) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingLogin, setPendingLogin] = useState<Partial<User> | null>(null);

  const login = async (role: Role, credentials: any) => {
    if (role === 'admin') {
      // Stricter admin check
      if (credentials.username === 'admin' && credentials.password === 'Admin@1234!') {
        setUser({
          id: 'admin-1',
          name: 'Chief Librarian',
          email: 'admin@library.com',
          phone: '0000000000',
          role: 'admin',
          addresses: []
        });
        return true;
      }
      return false;
    } else {
      // User login - initiates OTP flow
      setPendingLogin({
        email: credentials.email,
        phone: credentials.phone,
        role: 'user'
      });
      return true; // Signal that OTP is sent
    }
  };

  const verifyOtp = async (otp: string) => {
    if (otp === '1234' && pendingLogin) {
      setUser({
        id: 'user-' + Date.now(),
        name: 'Library Member',
        email: pendingLogin.email!,
        phone: pendingLogin.phone!,
        role: 'user',
        addresses: []
      });
      setPendingLogin(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setPendingLogin(null);
  };

  const updateAddress = (newAddress: Address) => {
    if (user) {
      setUser({ ...user, addresses: [...user.addresses, newAddress] });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyOtp, updateAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
