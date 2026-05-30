import { MoonStar, SunMedium } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleDarkMode } from '../../store/uiSlice';
import { Button } from '../ui/button';

export function ThemeToggle() {
  const darkMode = useAppSelector((state) => state.ui.darkMode);
  const dispatch = useAppDispatch();

  return (
    <Button
      variant="outline"
      className="h-10 w-10 p-0"
      onClick={() => dispatch(toggleDarkMode())}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
