import { useAppState, useAppDispatch } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import type { Step } from '../types';

const steps: { key: Step; label: string; number: number }[] = [
  { key: 'upload', label: 'Upload', number: 1 },
  { key: 'preview', label: 'Preview & Filter', number: 2 },
  { key: 'export', label: 'Export', number: 3 },
];

export function Header() {
  const { step, parsedFile } = useAppState();
  const dispatch = useAppDispatch();
  const { theme, toggle } = useTheme();

  const canNavigate = (target: Step) => {
    if (target === 'upload') return true;
    if (!parsedFile) return false;
    if (target === 'export') return step === 'export' || step === 'preview';
    return true;
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-nav border-b border-edge" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-md bg-flux-wine flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span className="font-semibold text-content-primary text-sm tracking-tight hidden sm:block group-hover:text-flux-magenta transition-colors duration-200">
            Excel to All
          </span>
        </button>

        {/* Step Indicator */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Progress">
          {steps.map((s, i) => {
            const isActive = step === s.key;
            const stepIndex = steps.findIndex((st) => st.key === step);
            const isPast = steps.findIndex((st) => st.key === s.key) < stepIndex;
            const clickable = canNavigate(s.key);

            return (
              <div key={s.key} className="flex items-center gap-1 sm:gap-2">
                {i > 0 && (
                  <div className={`w-6 sm:w-10 h-px transition-colors duration-200 ${isPast ? 'bg-flux-magenta' : 'bg-edge'}`} />
                )}
                <button
                  onClick={() => clickable && dispatch({ type: 'SET_STEP', payload: s.key })}
                  disabled={!clickable}
                  className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-flux-wine text-white'
                      : isPast
                        ? 'text-flux-magenta hover:bg-surface-drop-active cursor-pointer'
                        : clickable
                          ? 'text-content-secondary hover:text-content-primary cursor-pointer'
                          : 'text-content-tertiary cursor-not-allowed'
                    }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors duration-200
                    ${isActive
                      ? 'bg-white text-flux-wine border-transparent'
                      : isPast
                        ? 'border-flux-magenta text-flux-magenta'
                        : 'border-current'
                    }`}>
                    {isPast ? '✓' : s.number}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-md flex items-center justify-center text-content-secondary hover:text-flux-magenta hover:bg-surface-drop transition-all duration-200"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
