import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { AppState, Step, ParsedFile, ExportFormat } from '../types';

const initialState: AppState = {
  step: 'upload',
  parsedFile: null,
  activeSheetIndex: 0,
  searchQuery: '',
  columnFilters: {},
  selectedFormat: null,
  pageSize: 25,
  currentPage: 0,
};

type Action =
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_FILE'; payload: ParsedFile }
  | { type: 'SET_ACTIVE_SHEET'; payload: number }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_COLUMN_FILTER'; payload: { column: string; value: string } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_FORMAT'; payload: ExportFormat }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_FILE':
      return {
        ...state,
        parsedFile: action.payload,
        step: 'preview',
        activeSheetIndex: 0,
        searchQuery: '',
        columnFilters: {},
        currentPage: 0,
      };
    case 'SET_ACTIVE_SHEET':
      return {
        ...state,
        activeSheetIndex: action.payload,
        searchQuery: '',
        columnFilters: {},
        currentPage: 0,
      };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload, currentPage: 0 };
    case 'SET_COLUMN_FILTER': {
      const next = { ...state.columnFilters };
      if (action.payload.value) {
        next[action.payload.column] = action.payload.value;
      } else {
        delete next[action.payload.column];
      }
      return { ...state, columnFilters: next, currentPage: 0 };
    }
    case 'CLEAR_FILTERS':
      return { ...state, searchQuery: '', columnFilters: {}, currentPage: 0 };
    case 'SET_FORMAT':
      return { ...state, selectedFormat: action.payload };
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, currentPage: 0 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<AppState>(initialState);
const DispatchContext = createContext<Dispatch<Action>>(() => {});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}

export function useAppDispatch() {
  return useContext(DispatchContext);
}

/** Convenience: returns filtered rows for active sheet */
export function useFilteredRows() {
  const { parsedFile, activeSheetIndex, searchQuery, columnFilters } =
    useAppState();

  return useCallback(() => {
    if (!parsedFile) return [];
    const sheet = parsedFile.sheets[activeSheetIndex];
    if (!sheet) return [];

    let rows = sheet.rows;

    // Global search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? '').toLowerCase().includes(q),
        ),
      );
    }

    // Column filters
    for (const [col, filter] of Object.entries(columnFilters)) {
      if (!filter.trim()) continue;
      const f = filter.toLowerCase();
      rows = rows.filter((row) =>
        String(row[col] ?? '').toLowerCase().includes(f),
      );
    }

    return rows;
  }, [parsedFile, activeSheetIndex, searchQuery, columnFilters]);
}
