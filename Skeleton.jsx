import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md ${className}`}></div>
    );
};

export const CardSkeleton = () => (
    <div className="glass-card p-6 border border-slate-100 dark:border-dark-border">
        <div className="flex items-start justify-between mb-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="w-12 h-6 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
    </div>
);

export const TableRowSkeleton = () => (
    <tr className="border-b border-slate-50 dark:border-slate-800/50">
        <td className="py-4 px-4"><Skeleton className="h-5 w-32" /></td>
        <td className="py-4 px-4"><Skeleton className="h-5 w-24" /></td>
        <td className="py-4 px-4"><Skeleton className="h-5 w-16" /></td>
        <td className="py-4 px-4"><Skeleton className="h-8 w-20 rounded-full" /></td>
        <td className="py-4 px-4"><Skeleton className="h-8 w-24 rounded-lg ml-auto" /></td>
    </tr>
);

export default Skeleton;
