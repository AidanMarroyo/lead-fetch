'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnDef, flexRender, HeaderContext } from '@tanstack/react-table';

type DataTableSkeletonProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  rowCount?: number;
};

export function DataTableSkeleton<TData, TValue>({
  columns,
  rowCount = 5,
}: DataTableSkeletonProps<TData, TValue>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={`skeleton-head-${index}`}>
              {typeof column.header === 'function'
                ? flexRender(column.header, {
                    column,
                    table: {},
                  } as HeaderContext<TData, TValue>)
                : (column.header ?? '')}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIdx) => (
          <TableRow key={`skeleton-${rowIdx}`}>
            {columns.map((_, colIdx) => (
              <TableCell key={`skeleton-${rowIdx}-${colIdx}`}>
                <div className='h-4 w-full bg-gray-200 rounded animate-pulse' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
