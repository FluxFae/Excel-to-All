import { useState, useRef, useCallback } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { parseExcelFile, formatFileSize } from '../utils/excel-parser';

const ACCEPTED = '.xlsx,.xls,.xlsb,.xlsm,.csv';

const FORMAT_INFO = [
  { ext: 'JSON', desc: 'Structured data', color: 'text-flux-terracotta' },
  { ext: 'CSV', desc: 'Tabular export', color: 'text-flux-sage' },
  { ext: 'SQL', desc: 'Database ready', color: 'text-flux-slate' },
  { ext: 'HTML', desc: 'Web tables', color: 'text-flux-magenta' },
  { ext: 'Markdown', desc: 'Documentation', color: 'text-content-secondary' },
  { ext: 'XML', desc: 'Data interchange', color: 'text-flux-terracotta' },
  { ext: 'YAML', desc: 'Config files', color: 'text-flux-sage' },
];

export function UploadScreen() {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const parsed = await parseExcelFile(file);
      if (parsed.sheets.length === 0 || parsed.sheets.every((s) => s.totalRows === 0)) {
        setError('The file contains no data. Please upload a file with at least one row of data.');
        setLoading(false);
        return;
      }
      dispatch({ type: 'SET_FILE', payload: parsed });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-content-primary tracking-tight mb-3" style={{ letterSpacing: '-0.8px' }}>
          Transform Your Excel Data
        </h1>
        <p className="text-content-secondary text-base sm:text-lg max-w-xl mx-auto">
          Upload your spreadsheet and convert it to <span className="text-flux-magenta font-medium">7 different formats</span> with
          real-time preview and filtering.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative mx-auto max-w-2xl rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 group
          ${dragging
            ? 'border-flux-magenta bg-surface-drop-active scale-[1.01]'
            : 'border-edge hover:border-flux-wine bg-surface-drop hover:bg-surface-drop-active'
          }
          ${loading ? 'pointer-events-none opacity-60' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Drop zone — click or drag a file here"
      >
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-flux-magenta border-t-transparent rounded-full animate-spin" />
              <p className="text-content-secondary text-sm font-medium">Parsing your file…</p>
            </div>
          ) : (
            <>
              {/* Upload Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-5 transition-all duration-200
                ${dragging ? 'bg-flux-magenta text-white scale-110' : 'bg-surface-elevated text-content-secondary group-hover:text-flux-magenta group-hover:bg-surface-drop-active'}`}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <p className="text-content-primary font-semibold text-base mb-1">
                {dragging ? 'Drop your file here' : 'Drag & drop your Excel file'}
              </p>
              <p className="text-content-secondary text-sm mb-4">
                or <span className="text-flux-magenta font-medium underline underline-offset-2">browse files</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['.xlsx', '.xls', '.xlsb', '.xlsm', '.csv'].map((ext) => (
                  <span key={ext} className="px-2.5 py-1 rounded-md bg-surface-elevated text-content-tertiary text-xs font-mono font-medium">
                    {ext}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          onChange={onSelect}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-2xl mt-4 p-4 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Output Formats */}
      <div className="mx-auto max-w-3xl mt-10 sm:mt-14">
        <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-content-tertiary mb-5">
          Supported Output Formats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {FORMAT_INFO.map((f) => (
            <div
              key={f.ext}
              className="bg-surface-card border border-edge rounded-lg px-3 py-3 text-center hover:border-flux-wine/40 transition-all duration-200 group/card"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <p className={`font-mono font-semibold text-sm ${f.color} group-hover/card:scale-105 transition-transform duration-200`}>
                {f.ext}
              </p>
              <p className="text-content-tertiary text-[10px] mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Guide */}
      <div className="mx-auto max-w-2xl mt-10 sm:mt-14">
        <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-content-tertiary mb-5">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Upload', desc: 'Drop your Excel or CSV file into the upload zone above.' },
            { step: '2', title: 'Preview & Filter', desc: 'Search, filter, and verify your data before converting.' },
            { step: '3', title: 'Export', desc: 'Choose your format, configure options, and download.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-4 rounded-lg bg-surface-card border border-edge" style={{ boxShadow: 'var(--shadow-card)' }}>
              <span className="w-7 h-7 shrink-0 rounded-full bg-flux-wine/10 text-flux-wine flex items-center justify-center text-xs font-bold">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-content-primary text-sm">{item.title}</p>
                <p className="text-content-secondary text-xs mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
