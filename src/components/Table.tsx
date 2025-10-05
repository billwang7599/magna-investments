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
            <table className="min-w-full bg-surface border border-border rounded-lg">
                <thead
                    className={clsx(
                        "bg-surface text-primary sticky top-0 z-10 transition-colors duration-200",
                        headerClassName,
                    )}
                >
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={clsx(
                                    "px-6 py-4 text-left font-semibold text-secondary text-sm border-b border-border",
                                    "transition-colors duration-200",
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody
                    className={clsx("divide-y divide-border", bodyClassName)}
                >
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center text-tertiary py-8 bg-surface"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                                className="bg-surface even:bg-background transition-colors duration-200 hover:bg-accent/5 cursor-pointer"
                            >
                                {columns.map((col, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className={clsx(
                                            "px-6 py-4 text-primary align-middle transition-colors duration-200",
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
