import { createContext, ReactNode, useEffect, useState } from 'react';

const CanvasContext = createContext({ dpr: 1 });

export default CanvasContext;

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [dpr, setDpr] = useState(1);
  useEffect(() => {
    addEventListener('resize', () => {
      setDpr(window.devicePixelRatio);
    });
  }, []);
  return (
    <CanvasContext.Provider value={{ dpr }}>{children}</CanvasContext.Provider>
  );
};
