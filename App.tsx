import { useEffect, type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AccessTypePage from './pages/AccessTypePage';
import LoginPage from './pages/LoginPage';
import { roleRouteConfig } from './routes/roleRoutes';
import type { AppRole } from './routes/types';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

const App: FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { setTheme } = useUIStore();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/access-type" element={<AccessTypePage />} />
        <Route path="*" element={<Navigate to="/access-type" />} />
      </Routes>
    );
  }

  const role: AppRole = user?.role === 'teacher' ? 'teacher' : 'director';
  const { layout: LayoutComponent, routes, fallback } = roleRouteConfig[role];

  return (
    <LayoutComponent>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<Navigate to={fallback} />} />
      </Routes>
    </LayoutComponent>
  );
};

export default App;
