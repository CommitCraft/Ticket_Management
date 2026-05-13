import { MoonStar, SunMedium } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleDarkMode } from '../../store/uiSlice';
import { Button } from '../ui/button';

export function ThemeToggle() {
  const darkMode = useAppSelector((state) => state.ui.darkMode);
  const dispatch = useAppDispatch();

  return (
    <Button variant="outline" className="h-10 px-3" onClick={() => dispatch(toggleDarkMode())}>
      {darkMode ? <SunMedium className="mr-2 h-4 w-4" /> : <MoonStar className="mr-2 h-4 w-4" />}
      {darkMode ? 'Light' : 'Dark'}
    </Button>
  );
}
