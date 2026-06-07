"use client";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  rows, columns, searchKeys = [], loading, emptyMessage = "No records found",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    return [...filtered].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="pl-9"
          />
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => c.sortValue && toggleSort(c.key)}
                    className={cn(
                      "px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400",
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                      c.sortValue && "cursor-pointer hover:text-white transition",
                    )}
                  >
                    <div className={cn("inline-flex items-center gap-1", c.align === "right" && "flex-row-reverse")}>
                      {c.header}
                      {sortKey === c.key && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-b-0">
                      {columns.map((c) => (
                        <td key={c.key} className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                      ))}
                    </tr>
                  ))
                : sorted.length === 0
                ? <tr><td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-gray-400">{emptyMessage}</td></tr>
                : sorted.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition">
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className={cn(
                            "px-5 py-4 text-gray-200",
                            c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                            c.className,
                          )}
                        >
                          {c.render(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && sorted.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 text-xs text-gray-400">
            <span>{sorted.length} of {rows.length} records</span>
          </div>
        )}
      </div>
    </div>
  );
}
