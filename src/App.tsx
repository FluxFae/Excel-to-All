import { AppProvider, useAppState } from './context/AppContext';
import { Header } from './components/Header';
import { UploadScreen } from './components/UploadScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { ExportScreen } from './components/ExportScreen';

function AppContent() {
  const { step } = useAppState();

  return (
    <div className="min-h-screen bg-surface-base transition-colors duration-200">
      <Header />
      <main>
        {step === 'upload' && <UploadScreen />}
        {step === 'preview' && <PreviewScreen />}
        {step === 'export' && <ExportScreen />}
      </main>
      <footer className="text-center py-6 text-content-tertiary text-xs border-t border-edge mt-8">
        Excel to All · Built with React + TypeScript + Tailwind
      </footer>
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
