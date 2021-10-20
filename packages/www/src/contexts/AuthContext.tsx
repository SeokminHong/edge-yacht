import { createContext, useEffect, useState, ReactNode } from 'react';

type User = {
  sub: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: Date;
};

const AuthContext = createContext({
  user: null as User | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: User | null) => {},
});

export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null as User | null);

  useEffect(() => {
    fetch(`/userinfo`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((body) => {
        setUser(body);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
