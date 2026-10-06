import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export function SortableTable({
  columns = [],
  data = [],
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = 'No records found.',
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <tr>
            {columns.map((col) => {
              const isSorted = sortBy === col.key;
              const isSortable = col.sortable !== false;

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-6 py-4 ${
                    isSortable ? 'cursor-pointer select-none hover:bg-slate-100/80 transition-colors' : ''
                  } ${col.className || ''}`}
                  onClick={() => {
                    if (isSortable && onSort) {
                      onSort(col.key);
                    }
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {isSortable && (
                      <span className="text-slate-400">
                        {isSorted ? (
                          sortOrder === 'asc' ? (
                            <ChevronUp className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 hover:text-slate-600" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50/70 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-4 ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
