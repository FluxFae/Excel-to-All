import { useMemo } from 'react';
import { useAppState, useAppDispatch, useFilteredRows } from '../context/AppContext';
import { formatFileSize } from '../utils/excel-parser';

export function PreviewScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const getFiltered = useFilteredRows();

  const { parsedFile, activeSheetIndex, searchQuery, columnFilters, pageSize, currentPage } = state;
  if (!parsedFile) return null;

  const sheet = parsedFile.sheets[activeSheetIndex];
  const filteredRows = useMemo(() => getFiltered(), [getFiltered]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const activeFilterCount = Object.keys(columnFilters).length + (searchQuery ? 1 : 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top bar: file info + sheet tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-flux-wine/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-flux-wine">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-content-primary text-sm truncate max-w-[200px] sm:max-w-xs">{parsedFile.fileName}</p>
            <p className="text-content-tertiary text-xs">{formatFileSize(parsedFile.fileSize)} · {sheet.totalRows.toLocaleString()} rows · {sheet.headers.length} columns</p>
          </div>
        </div>

        {/* Sheet tabs */}
        {parsedFile.sheets.length > 1 && (
          <div className="flex gap-1 overflow-x-auto">
            {parsedFile.sheets.map((s, i) => (
              <button
                key={s.name}
                onClick={() => dispatch({ type: 'SET_ACTIVE_SHEET', payload: i })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150
                  ${i === activeSheetIndex
                    ? 'bg-flux-wine text-white'
                    : 'text-content-secondary hover:text-flux-magenta hover:bg-surface-drop'
                  }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Rows', value: sheet.totalRows.toLocaleString(), icon: '⊞' },
          { label: 'Columns', value: sheet.headers.length.toString(), icon: '⊟' },
          { label: 'Filtered', value: filteredRows.length.toLocaleString(), icon: '⊜' },
          {
            label: 'Data Quality',
            value: `${Math.round((1 - sheet.columns.reduce((a, c) => a + c.emptyCount, 0) / Math.max(1, sheet.totalRows * sheet.headers.length)) * 100)}%`,
            icon: '◉',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-card border border-edge rounded-lg px-4 py-3" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-content-tertiary text-[10px] font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-content-primary font-mono font-bold text-xl mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search + filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Global search */}
        <div className="relative flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search all columns…"
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full bg-surface-input border border-edge rounded-md pl-9 pr-3 py-2.5 text-sm text-content-primary placeholder-content-tertiary focus:border-edge-active focus:outline-none transition-colors duration-200"
            style={{ boxShadow: searchQuery ? '0 0 0 3px rgba(217, 70, 166, 0.1)' : undefined }}
          />
          {searchQuery && (
            <button
              onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-elevated text-content-tertiary hover:text-content-primary flex items-center justify-center text-xs"
            >×</button>
          )}
        </div>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) => dispatch({ type: 'SET_PAGE_SIZE', payload: Number(e.target.value) })}
          className="bg-surface-input border border-edge rounded-md px-3 py-2.5 text-sm text-content-primary focus:border-edge-active focus:outline-none transition-colors duration-200"
        >
          {[25, 50, 100, 250].map((n) => (
            <option key={n} value={n}>{n} rows</option>
          ))}
        </select>

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-danger hover:bg-danger/5 border border-danger/20 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
          </button>
        )}

        {/* Continue to export */}
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'export' })}
          className="px-5 py-2.5 rounded-md bg-flux-wine text-white text-sm font-semibold hover:bg-flux-hover transition-all duration-200 whitespace-nowrap"
          style={{ letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(107, 31, 63, 0.2)' }}
        >
          Export →
        </button>
      </div>

      {/* Data table */}
      <div className="bg-surface-card border border-edge rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-table-header border-b-2 border-edge">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-content-tertiary w-12">#</th>
                {sheet.headers.map((h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-content-tertiary">{h}</span>
                      <input
                        type="text"
                        placeholder="Filter…"
                        value={columnFilters[h] || ''}
                        onChange={(e) => dispatch({ type: 'SET_COLUMN_FILTER', payload: { column: h, value: e.target.value } })}
                        className="w-full bg-surface-input border border-edge rounded px-2 py-1 text-xs text-content-primary placeholder-content-tertiary focus:border-edge-active focus:outline-none transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={sheet.headers.length + 1} className="px-4 py-12 text-center text-content-tertiary text-sm">
                    {activeFilterCount > 0 ? 'No rows match your filters.' : 'No data to display.'}
                  </td>
                </tr>
              ) : (
                pageRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-edge hover:bg-surface-row-hover transition-colors duration-100
                      ${i % 2 === 0 ? '' : 'bg-surface-table-stripe'}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-content-tertiary">
                      {currentPage * pageSize + i + 1}
                    </td>
                    {sheet.headers.map((h) => {
                      const val = row[h];
                      const isEmpty = val === null || val === undefined || val === '';
                      return (
                        <td
                          key={h}
                          className={`px-4 py-3 max-w-[300px] truncate ${isEmpty ? 'text-content-tertiary italic' : 'text-content-primary'}
                            ${typeof val === 'number' ? 'font-mono text-right' : ''}`}
                        >
                          {isEmpty ? '—' : String(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-edge">
            <p className="text-xs text-content-tertiary">
              Showing {(currentPage * pageSize + 1).toLocaleString()}–{Math.min((currentPage + 1) * pageSize, filteredRows.length).toLocaleString()} of {filteredRows.length.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 0}
                onClick={() => dispatch({ type: 'SET_PAGE', payload: currentPage - 1 })}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-content-secondary hover:text-flux-magenta hover:bg-surface-drop disabled:text-content-tertiary disabled:cursor-not-allowed transition-all duration-150"
              >← Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let page: number;
                if (totalPages <= 5) {
                  page = idx;
                } else if (currentPage < 3) {
                  page = idx;
                } else if (currentPage > totalPages - 4) {
                  page = totalPages - 5 + idx;
                } else {
                  page = currentPage - 2 + idx;
                }
                return (
                  <button
                    key={page}
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: page })}
                    className={`w-8 h-8 rounded text-xs font-medium transition-all duration-150
                      ${page === currentPage
                        ? 'bg-flux-wine text-white'
                        : 'text-content-secondary hover:text-flux-magenta hover:bg-surface-drop'
                      }`}
                  >{page + 1}</button>
                );
              })}
              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => dispatch({ type: 'SET_PAGE', payload: currentPage + 1 })}
                className="px-2.5 py-1.5 rounded text-xs font-medium text-content-secondary hover:text-flux-magenta hover:bg-surface-drop disabled:text-content-tertiary disabled:cursor-not-allowed transition-all duration-150"
              >Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Column info */}
      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-content-tertiary mb-3">Column Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sheet.columns.map((col) => (
            <div key={col.name} className="bg-surface-card border border-edge rounded-lg px-4 py-3 flex items-center justify-between gap-2" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="min-w-0">
                <p className="font-medium text-content-primary text-sm truncate">{col.name}</p>
                <p className="text-content-tertiary text-xs mt-0.5">
                  {col.uniqueCount} unique · {col.emptyCount > 0 ? <span className="text-warn">{col.emptyCount} empty</span> : 'No gaps'}
                </p>
              </div>
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase
                ${col.type === 'number' ? 'bg-flux-slate/15 text-flux-slate'
                  : col.type === 'date' ? 'bg-flux-terracotta/15 text-flux-terracotta'
                  : col.type === 'boolean' ? 'bg-flux-sage/15 text-flux-sage'
                  : col.type === 'empty' ? 'bg-muted/15 text-muted'
                  : col.type === 'mixed' ? 'bg-warn/15 text-warn'
                  : 'bg-flux-magenta/10 text-flux-magenta'
                }`}
              >{col.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
