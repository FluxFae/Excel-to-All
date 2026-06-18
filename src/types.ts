export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'mixed' | 'empty';
  emptyCount: number;
  uniqueCount: number;
  sampleValues: unknown[];
}

export interface SheetData {
  name: string;
  headers: string[];
  rows: Record<string, unknown>[];
  columns: ColumnInfo[];
  totalRows: number;
}

export interface ParsedFile {
  fileName: string;
  sheets: SheetData[];
  fileSize: number;
  parsedAt: Date;
}

export type ExportFormat = 'json' | 'csv' | 'sql' | 'html' | 'markdown' | 'xml' | 'yaml';

export interface JsonConfig {
  pretty: boolean;
  arrayStyle: 'objects' | 'arrays';
  indent: number;
}

export interface CsvConfig {
  delimiter: ',' | ';' | '\t' | '|';
  includeHeaders: boolean;
  quoteAll: boolean;
}

export interface SqlConfig {
  tableName: string;
  dialect: 'sqlite' | 'mysql' | 'postgresql';
  dropTable: boolean;
  createTable: boolean;
}

export interface HtmlConfig {
  includeStyles: boolean;
  tableClass: string;
  responsive: boolean;
}

export interface MarkdownConfig {
  alignment: 'left' | 'center' | 'right';
}

export interface XmlConfig {
  rootElement: string;
  rowElement: string;
  declaration: boolean;
  indent: number;
}

export interface YamlConfig {
  indent: number;
  flowLevel: number;
}

export type FormatConfig = {
  json: JsonConfig;
  csv: CsvConfig;
  sql: SqlConfig;
  html: HtmlConfig;
  markdown: MarkdownConfig;
  xml: XmlConfig;
  yaml: YamlConfig;
};

export type Step = 'upload' | 'preview' | 'export';

export interface AppState {
  step: Step;
  parsedFile: ParsedFile | null;
  activeSheetIndex: number;
  searchQuery: string;
  columnFilters: Record<string, string>;
  selectedFormat: ExportFormat | null;
  pageSize: number;
  currentPage: number;
}

import type {} from 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    slot?: string;
  }
}
