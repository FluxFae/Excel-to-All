import { useEffect, useRef } from 'react';
import { AppProvider, useAppState } from './context/AppContext';
import { UploadScreen } from './components/UploadScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { ExportScreen } from './components/ExportScreen';
import { ArrowRightLeft } from 'lucide-react';

function AppContent() {
  const { step } = useAppState();
  const headerRef = useRef<any>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Set initial state matching HTML
    const isDark = document.documentElement.classList.contains('dark');
    header.setAttribute('theme', isDark ? 'dark' : 'light');

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'light' | 'dark' }>;
      const newTheme = customEvent.detail.theme;

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    };

    header.addEventListener('theme-change', handleThemeChange);
    return () => {
      header.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-base transition-colors duration-200 flex flex-col">
      <ui-header ref={headerRef}>
        {/* Logo and Identity */}
        <div slot="app-icon" className="w-10 h-10 rounded-xl bg-flux-burgundy flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 text-white" />
        </div>
        <div slot="app-title" className="font-semibold text-lg text-content-primary">File converter (Excel & CSV)</div>
        <div slot="app-description" className="text-content-tertiary text-sm">Convert Excel and CSV files into other formats.</div>

        {/* Navigation context in the center */}
        <div slot="app-context" className="flex items-center gap-4 text-sm font-medium">
          <span className={step === 'upload' ? 'text-flux-burgundy' : 'text-content-tertiary'}>
            (1) Upload
          </span>

          <span className="w-8 h-px bg-edge"></span>
          <span className={step === 'preview' ? 'text-flux-burgundy' : 'text-content-tertiary'}>
            (2) Preview & Filter
          </span>

          <span className="w-8 h-px bg-edge"></span>
          <span className={step === 'export' ? 'text-flux-burgundy' : 'text-content-tertiary'}>
            (3) Export
          </span>
        </div>
      </ui-header>

      <main className="flex-1">
        {step === 'upload' && <UploadScreen />}
        {step === 'preview' && <PreviewScreen />}
        {step === 'export' && <ExportScreen />}
      </main>

      <ui-footer className="mt-auto" githubUrl="https://github.com/FluxFae/Excel-to-All">
        <div slot="footer-license" style={{ fontSize: '0.75rem', opacity: 0.5 }}>MIT License</div>
        <div slot="footer-version">
          <span>v1.0.5</span>
        </div>
      </ui-footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
