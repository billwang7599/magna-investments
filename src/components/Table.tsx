import React from "react";
import clsx from "clsx";

export type TableColumn<T> = {
    header: React.ReactNode;
    accessor?: keyof T;
    render?: (row: T, rowIndex: number) => React.ReactNode;
    className?: string;
};

export type TableProps<T> = {
    columns: TableColumn<T>[];
    data: T[];
    rowKey?: (row: T, rowIndex: number) => React.Key;
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    emptyText?: React.ReactNode;
};

export function Table<T>({
    columns,
    data,
    rowKey,
    className,
    headerClassName,
    bodyClassName,
    emptyText = "No data found.",
}: TableProps<T>) {
    return (
        <div className={clsx("overflow-x-auto", className)}>
            <table className="min-w-full border border-border rounded-md">
                <thead
                    className={clsx(
                        "bg-surface-200 text-content-primary",
                        headerClassName,
                    )}
                >
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={clsx(
                                    "px-4 py-2 text-left font-semibold",
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={bodyClassName}>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center text-content-secondary py-8 bg-surface-100"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                                className="border-t border-border bg-surface-100 even:bg-surface-200"
                            >
                                {columns.map((col, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className={clsx(
                                            "px-4 py-2 text-content-primary",
                                            col.className,
                                        )}
                                    >
                                        {col.render
                                            ? col.render(row, rowIndex)
                                            : col.accessor
                                              ? ((
                                                    row as unknown as Record<
                                                        string,
                                                        unknown
                                                    >
                                                )[
                                                    col.accessor as string
                                                ] as React.ReactNode)
                                              : null}
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

export default Table;
