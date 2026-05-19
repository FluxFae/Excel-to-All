import { useState, useMemo, useCallback } from 'react';
import { useAppState, useAppDispatch, useFilteredRows } from '../context/AppContext';
import { convert, defaultConfigs, formatExtensions, formatLabels } from '../utils/converters';
import type { ExportFormat, FormatConfig } from '../types';

const FORMAT_META: { key: ExportFormat; icon: string; desc: string; color: string }[] = [
  { key: 'json', icon: '{ }', desc: 'Structured key-value data', color: 'text-flux-terracotta' },
  { key: 'csv', icon: '⊟', desc: 'Comma-separated values', color: 'text-flux-sage' },
  { key: 'sql', icon: 'SQL', desc: 'Database insert statements', color: 'text-flux-slate' },
  { key: 'html', icon: '</>', desc: 'Styled web table', color: 'text-flux-magenta' },
  { key: 'markdown', icon: 'MD', desc: 'Documentation tables', color: 'text-content-secondary' },
  { key: 'xml', icon: '< />', desc: 'Structured data interchange', color: 'text-flux-terracotta' },
  { key: 'yaml', icon: '---', desc: 'Human-readable config', color: 'text-flux-sage' },
];

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const mimeTypes: Record<string, string> = {
  json: 'application/json', csv: 'text/csv', sql: 'application/sql',
  html: 'text/html', markdown: 'text/markdown', xml: 'application/xml', yaml: 'text/yaml',
};

export function ExportScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const getFiltered = useFilteredRows();

  const { parsedFile, activeSheetIndex, selectedFormat } = state;
  const [configs, setConfigs] = useState<FormatConfig>({ ...defaultConfigs });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exported, setExported] = useState(false);

  const sheet = parsedFile?.sheets[activeSheetIndex];
  const filteredRows = useMemo(() => getFiltered(), [getFiltered]);

  const updateConfig = useCallback(<K extends ExportFormat>(format: K, patch: Partial<FormatConfig[K]>) => {
    setConfigs((prev) => ({ ...prev, [format]: { ...prev[format], ...patch } }));
  }, []);

  const output = useMemo(() => {
    if (!selectedFormat || !sheet) return '';
    try {
      return convert(selectedFormat, filteredRows, sheet.headers, configs[selectedFormat]);
    } catch { return '// Error generating output'; }
  }, [selectedFormat, sheet, filteredRows, configs]);

  const handleExport = useCallback(() => {
    if (!selectedFormat || !parsedFile) return;
    const base = parsedFile.fileName.replace(/\.[^.]+$/, '');
    const ext = formatExtensions[selectedFormat];
    downloadBlob(output, `${base}${ext}`, mimeTypes[selectedFormat]);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }, [selectedFormat, parsedFile, output]);

  if (!parsedFile || !sheet) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back to preview */}
      <button
        onClick={() => dispatch({ type: 'SET_STEP', payload: 'preview' })}
        className="flex items-center gap-1.5 text-content-secondary hover:text-flux-magenta text-sm mb-5 transition-colors duration-200"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Preview
      </button>

      <h1 className="text-2xl font-bold text-content-primary tracking-tight mb-1" style={{ letterSpacing: '-0.5px' }}>
        Export Data
      </h1>
      <p className="text-content-secondary text-sm mb-6">
        {filteredRows.length.toLocaleString()} rows from <span className="font-medium text-content-primary">{sheet.name}</span> sheet
      </p>

      {/* Format selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {FORMAT_META.map((f) => (
          <button
            key={f.key}
            onClick={() => { dispatch({ type: 'SET_FORMAT', payload: f.key }); setPreviewOpen(false); }}
            className={`relative bg-surface-card border rounded-xl px-3 py-4 text-center transition-all duration-200 group/fmt
              ${selectedFormat === f.key
                ? 'border-flux-magenta ring-2 ring-flux-magenta/20'
                : 'border-edge hover:border-flux-wine/40'
              }`}
            style={{ boxShadow: selectedFormat === f.key ? 'var(--shadow-premium)' : 'var(--shadow-card)' }}
          >
            <p className={`font-mono font-bold text-lg ${selectedFormat === f.key ? 'text-flux-magenta' : f.color} transition-colors duration-200`}>
              {f.icon}
            </p>
            <p className="font-semibold text-content-primary text-sm mt-1">{formatLabels[f.key]}</p>
            <p className="text-content-tertiary text-[10px] mt-0.5">{f.desc}</p>
            {selectedFormat === f.key && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-flux-magenta flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Config panel + Preview */}
      {selectedFormat && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Config */}
          <div className="bg-surface-card border border-edge rounded-xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-tertiary mb-4">
              {formatLabels[selectedFormat]} Options
            </h3>
            <div className="space-y-4">
              {selectedFormat === 'json' && (
                <>
                  <Label label="Format">
                    <Toggle checked={configs.json.pretty} onChange={(v) => updateConfig('json', { pretty: v })} label="Pretty print" />
                  </Label>
                  <Label label="Style">
                    <select value={configs.json.arrayStyle} onChange={(e) => updateConfig('json', { arrayStyle: e.target.value as 'objects' | 'arrays' })} className="select-input">
                      <option value="objects">Array of Objects</option>
                      <option value="arrays">Array of Arrays</option>
                    </select>
                  </Label>
                  <Label label="Indent">
                    <select value={configs.json.indent} onChange={(e) => updateConfig('json', { indent: Number(e.target.value) })} className="select-input">
                      {[2, 4, 8].map((n) => <option key={n} value={n}>{n} spaces</option>)}
                    </select>
                  </Label>
                </>
              )}
              {selectedFormat === 'csv' && (
                <>
                  <Label label="Delimiter">
                    <select value={configs.csv.delimiter} onChange={(e) => updateConfig('csv', { delimiter: e.target.value as ',' | ';' | '\t' | '|' })} className="select-input">
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value={'\t'}>Tab</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </Label>
                  <Toggle checked={configs.csv.includeHeaders} onChange={(v) => updateConfig('csv', { includeHeaders: v })} label="Include headers" />
                  <Toggle checked={configs.csv.quoteAll} onChange={(v) => updateConfig('csv', { quoteAll: v })} label="Quote all fields" />
                </>
              )}
              {selectedFormat === 'sql' && (
                <>
                  <Label label="Table Name">
                    <input value={configs.sql.tableName} onChange={(e) => updateConfig('sql', { tableName: e.target.value })} className="text-input" placeholder="data_table" />
                  </Label>
                  <Toggle checked={configs.sql.createTable} onChange={(v) => updateConfig('sql', { createTable: v })} label="CREATE TABLE" />
                  <Toggle checked={configs.sql.dropTable} onChange={(v) => updateConfig('sql', { dropTable: v })} label="DROP TABLE IF EXISTS" />
                </>
              )}
              {selectedFormat === 'html' && (
                <>
                  <Toggle checked={configs.html.includeStyles} onChange={(v) => updateConfig('html', { includeStyles: v })} label="Include inline styles" />
                  <Toggle checked={configs.html.responsive} onChange={(v) => updateConfig('html', { responsive: v })} label="Responsive wrapper" />
                  <Label label="Table CSS Class">
                    <input value={configs.html.tableClass} onChange={(e) => updateConfig('html', { tableClass: e.target.value })} className="text-input" placeholder="flux-table" />
                  </Label>
                </>
              )}
              {selectedFormat === 'markdown' && (
                <Label label="Column Alignment">
                  <select value={configs.markdown.alignment} onChange={(e) => updateConfig('markdown', { alignment: e.target.value as 'left' | 'center' | 'right' })} className="select-input">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </Label>
              )}
              {selectedFormat === 'xml' && (
                <>
                  <Label label="Root Element">
                    <input value={configs.xml.rootElement} onChange={(e) => updateConfig('xml', { rootElement: e.target.value })} className="text-input" placeholder="data" />
                  </Label>
                  <Label label="Row Element">
                    <input value={configs.xml.rowElement} onChange={(e) => updateConfig('xml', { rowElement: e.target.value })} className="text-input" placeholder="record" />
                  </Label>
                  <Toggle checked={configs.xml.declaration} onChange={(v) => updateConfig('xml', { declaration: v })} label="XML declaration" />
                </>
              )}
              {selectedFormat === 'yaml' && (
                <Label label="Indent">
                  <select value={configs.yaml.indent} onChange={(e) => updateConfig('yaml', { indent: Number(e.target.value) })} className="select-input">
                    {[2, 4, 8].map((n) => <option key={n} value={n}>{n} spaces</option>)}
                  </select>
                </Label>
              )}
            </div>

            {/* Export button */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleExport}
                className={`flex-1 py-3 rounded-md font-semibold text-sm transition-all duration-200
                  ${exported
                    ? 'bg-ok text-white'
                    : 'bg-flux-wine text-white hover:bg-flux-hover'
                  }`}
                style={{ letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(107, 31, 63, 0.25)' }}
              >
                {exported ? '✓ Downloaded!' : `Download ${formatLabels[selectedFormat]}`}
              </button>
              <button
                onClick={() => setPreviewOpen((v) => !v)}
                className="px-4 py-3 rounded-md border-2 border-flux-magenta text-flux-magenta font-semibold text-sm hover:bg-flux-magenta hover:text-white transition-all duration-200"
              >
                {previewOpen ? 'Hide' : 'Preview'}
              </button>
            </div>
          </div>

          {/* Output preview */}
          <div className={`bg-surface-card border border-edge rounded-xl overflow-hidden transition-all duration-300 ${previewOpen ? 'opacity-100' : 'lg:opacity-100 max-h-0 lg:max-h-none overflow-hidden'}`} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-edge bg-surface-table-header">
              <span className="text-xs font-semibold uppercase tracking-wider text-content-tertiary">Output Preview</span>
              <span className="text-[10px] font-mono text-content-tertiary">{(output.length / 1024).toFixed(1)} KB</span>
            </div>
            <pre className="p-4 text-xs font-mono text-content-primary overflow-auto max-h-[500px] whitespace-pre-wrap break-words bg-surface-code leading-relaxed">
              {output.slice(0, 10000)}{output.length > 10000 ? '\n\n… (truncated)' : ''}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Shared sub-components ─── */
function Label({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-content-tertiary mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0
          ${checked ? 'bg-flux-magenta' : 'bg-edge'}`}
        style={{ height: '22px' }}
      >
        <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 shadow-sm
          ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
          style={{ width: '18px', height: '18px' }}
        />
      </button>
      <span className="text-sm text-content-secondary group-hover:text-content-primary transition-colors duration-200">{label}</span>
    </label>
  );
}
