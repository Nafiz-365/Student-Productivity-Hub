import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface QuickShortcutsProps {
  children: React.ReactNode;
}

const QuickShortcuts: React.FC<QuickShortcutsProps> = ({ children }) => {
  const { toggleDarkMode } = useApp();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + D for dark mode toggle
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        toggleDarkMode();
      }

      // Ctrl/Cmd + K for quick search (can be expanded)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Future: Could open a global search modal
        console.log('Quick search activated');
      }

      // Escape to close any open modals
      if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          if (modal.getAttribute('aria-hidden') !== 'true') {
            // Simulate click on close button or backdrop
            (modal as HTMLElement).style.display = 'none';
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleDarkMode]);

  return <>{children}</>;
};

export default QuickShortcuts;