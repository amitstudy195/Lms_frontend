import React from "react";

export const Loader = () => {
  return (
    <div className="space-y-8">
      <div className="h-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-44 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-60 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
