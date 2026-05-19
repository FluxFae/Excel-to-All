import * as yaml from 'js-yaml';
import type {
  JsonConfig, CsvConfig, SqlConfig, HtmlConfig,
  MarkdownConfig, XmlConfig, YamlConfig,
} from '../types';

type Row = Record<string, unknown>;

/* ─── Helpers ─── */
function esc(val: unknown): string {
  const s = String(val ?? '');
  return s.replace(/'/g, "''");
}

function escXml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inferSqlType(val: unknown): string {
  if (typeof val === 'number') return Number.isInteger(val) ? 'INTEGER' : 'REAL';
  if (typeof val === 'boolean') return 'BOOLEAN';
  if (val instanceof Date) return 'TEXT';
  return 'TEXT';
}

/* ─── JSON ─── */
export function toJson(rows: Row[], headers: string[], config: JsonConfig): string {
  const data = config.arrayStyle === 'arrays'
    ? [headers, ...rows.map((r) => headers.map((h) => r[h]))]
    : rows;
  return config.pretty
    ? JSON.stringify(data, null, config.indent)
    : JSON.stringify(data);
}

/* ─── CSV ─── */
export function toCsv(rows: Row[], headers: string[], config: CsvConfig): string {
  const d = config.delimiter;
  const q = (v: unknown) => {
    const s = String(v ?? '');
    if (config.quoteAll || s.includes(d) || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines: string[] = [];
  if (config.includeHeaders) lines.push(headers.map(q).join(d));
  for (const row of rows) {
    lines.push(headers.map((h) => q(row[h])).join(d));
  }
  return lines.join('\n');
}

/* ─── SQL ─── */
export function toSql(rows: Row[], headers: string[], config: SqlConfig): string {
  const tbl = config.tableName || 'data_table';
  const lines: string[] = [];

  if (config.dropTable) {
    lines.push(`DROP TABLE IF EXISTS "${tbl}";`, '');
  }

  if (config.createTable && rows.length > 0) {
    const cols = headers.map((h) => {
      const sample = rows.find((r) => r[h] !== '' && r[h] != null);
      const type = sample ? inferSqlType(sample[h]) : 'TEXT';
      return `  "${h}" ${type}`;
    });
    lines.push(`CREATE TABLE "${tbl}" (`, cols.join(',\n'), ');', '');
  }

  for (const row of rows) {
    const vals = headers.map((h) => {
      const v = row[h];
      if (v === null || v === undefined || v === '') return 'NULL';
      if (typeof v === 'number') return String(v);
      if (typeof v === 'boolean') return v ? '1' : '0';
      return `'${esc(v)}'`;
    });
    lines.push(`INSERT INTO "${tbl}" (${headers.map((h) => `"${h}"`).join(', ')}) VALUES (${vals.join(', ')});`);
  }

  return lines.join('\n');
}

/* ─── HTML ─── */
export function toHtml(rows: Row[], headers: string[], config: HtmlConfig): string {
  const cls = config.tableClass ? ` class="${config.tableClass}"` : '';
  const lines: string[] = [];

  if (config.includeStyles) {
    lines.push(`<style>
  table { border-collapse: collapse; width: 100%; font-family: Inter, sans-serif; font-size: 14px; }
  th { background: #1A1A1A; color: #FFF; padding: 12px 16px; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
  td { padding: 12px 16px; border-bottom: 1px solid #3D3D3D; }
  tr:nth-child(even) { background: #F8F8F8; }
  tr:hover { background: rgba(107,31,63,0.05); }
${config.responsive ? '  .table-wrap { overflow-x: auto; }' : ''}
</style>`);
  }

  if (config.responsive) lines.push('<div class="table-wrap">');
  lines.push(`<table${cls}>`);
  lines.push('  <thead>', '    <tr>');
  for (const h of headers) lines.push(`      <th>${escXml(h)}</th>`);
  lines.push('    </tr>', '  </thead>', '  <tbody>');
  for (const row of rows) {
    lines.push('    <tr>');
    for (const h of headers) lines.push(`      <td>${escXml(row[h])}</td>`);
    lines.push('    </tr>');
  }
  lines.push('  </tbody>', '</table>');
  if (config.responsive) lines.push('</div>');

  return lines.join('\n');
}

/* ─── Markdown ─── */
export function toMarkdown(rows: Row[], headers: string[], config: MarkdownConfig): string {
  const align = config.alignment === 'center' ? ':---:' : config.alignment === 'right' ? '---:' : '---';
  const lines: string[] = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => align).join(' | ')} |`);
  for (const row of rows) {
    lines.push(`| ${headers.map((h) => String(row[h] ?? '')).join(' | ')} |`);
  }
  return lines.join('\n');
}

/* ─── XML ─── */
export function toXml(rows: Row[], headers: string[], config: XmlConfig): string {
  const sp = ' '.repeat(config.indent);
  const lines: string[] = [];
  if (config.declaration) lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(`<${config.rootElement}>`);
  for (const row of rows) {
    lines.push(`${sp}<${config.rowElement}>`);
    for (const h of headers) {
      const tag = h.replace(/[^a-zA-Z0-9_]/g, '_');
      lines.push(`${sp}${sp}<${tag}>${escXml(row[h])}</${tag}>`);
    }
    lines.push(`${sp}</${config.rowElement}>`);
  }
  lines.push(`</${config.rootElement}>`);
  return lines.join('\n');
}

/* ─── YAML ─── */
export function toYaml(rows: Row[], _headers: string[], config: YamlConfig): string {
  return yaml.dump(rows, { indent: config.indent, flowLevel: config.flowLevel < 0 ? -1 : config.flowLevel });
}

/* ─── Default configs ─── */
export const defaultConfigs = {
  json: { pretty: true, arrayStyle: 'objects' as const, indent: 2 },
  csv: { delimiter: ',' as const, includeHeaders: true, quoteAll: false },
  sql: { tableName: 'data_table', dialect: 'sqlite' as const, dropTable: false, createTable: true },
  html: { includeStyles: true, tableClass: 'flux-table', responsive: true },
  markdown: { alignment: 'left' as const },
  xml: { rootElement: 'data', rowElement: 'record', declaration: true, indent: 2 },
  yaml: { indent: 2, flowLevel: -1 },
};

/* ─── Dispatch converter ─── */
export function convert(
  format: string,
  rows: Row[],
  headers: string[],
  config: Record<string, unknown>,
): string {
  switch (format) {
    case 'json': return toJson(rows, headers, config as unknown as JsonConfig);
    case 'csv': return toCsv(rows, headers, config as unknown as CsvConfig);
    case 'sql': return toSql(rows, headers, config as unknown as SqlConfig);
    case 'html': return toHtml(rows, headers, config as unknown as HtmlConfig);
    case 'markdown': return toMarkdown(rows, headers, config as unknown as MarkdownConfig);
    case 'xml': return toXml(rows, headers, config as unknown as XmlConfig);
    case 'yaml': return toYaml(rows, headers, config as unknown as YamlConfig);
    default: throw new Error(`Unsupported format: ${format}`);
  }
}

export const formatExtensions: Record<string, string> = {
  json: '.json',
  csv: '.csv',
  sql: '.sql',
  html: '.html',
  markdown: '.md',
  xml: '.xml',
  yaml: '.yaml',
};

export const formatLabels: Record<string, string> = {
  json: 'JSON',
  csv: 'CSV',
  sql: 'SQL',
  html: 'HTML',
  markdown: 'Markdown',
  xml: 'XML',
  yaml: 'YAML',
};
