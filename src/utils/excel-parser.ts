import * as XLSX from 'xlsx';
import type { ParsedFile, SheetData, ColumnInfo } from '../types';

function detectColumnType(values: unknown[]): ColumnInfo['type'] {
  const nonEmpty = values.filter(
    (v) => v !== null && v !== undefined && v !== '',
  );
  if (nonEmpty.length === 0) return 'empty';

  const types = new Set<string>();
  for (const v of nonEmpty) {
    if (typeof v === 'number') types.add('number');
    else if (typeof v === 'boolean') types.add('boolean');
    else if (v instanceof Date) types.add('date');
    else types.add('string');
  }

  if (types.size === 1) return types.values().next().value as ColumnInfo['type'];
  return 'mixed';
}

function analyzeColumn(name: string, rows: Record<string, unknown>[]): ColumnInfo {
  const values = rows.map((r) => r[name]);
  const nonEmpty = values.filter(
    (v) => v !== null && v !== undefined && v !== '',
  );
  const unique = new Set(nonEmpty.map(String));

  return {
    name,
    type: detectColumnType(values),
    emptyCount: values.length - nonEmpty.length,
    uniqueCount: unique.size,
    sampleValues: nonEmpty.slice(0, 5),
  };
}

export function parseExcelFile(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const sheets: SheetData[] = workbook.SheetNames.map((name) => {
          const worksheet = workbook.Sheets[name];
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
            worksheet,
            { defval: '' },
          );
          const headers =
            rows.length > 0 ? Object.keys(rows[0]) : [];
          const columns = headers.map((h) => analyzeColumn(h, rows));

          return {
            name,
            headers,
            rows,
            columns,
            totalRows: rows.length,
          };
        });

        resolve({
          fileName: file.name,
          sheets,
          fileSize: file.size,
          parsedAt: new Date(),
        });
      } catch (err) {
        reject(new Error(`Failed to parse file: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
