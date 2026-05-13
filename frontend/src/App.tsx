import { useEffect } from 'react';
import { useBootstrapAuth } from './hooks/useBootstrapAuth';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useAppSelector } from './hooks/useAppSelector';
import { setDarkMode } from './store/uiSlice';
import { LoadingScreen } from './components/layout/LoadingScreen';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  useBootstrapAuth();
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.auth);
  const darkMode = useAppSelector((state) => state.ui.darkMode);

  useEffect(() => {
    const savedTheme = localStorage.getItem('helpdesk-theme') === 'dark';
    dispatch(setDarkMode(savedTheme));
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('helpdesk-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return <AppRoutes />;
}
