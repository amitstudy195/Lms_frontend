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

export const ErrorBanner = ({ error, onReconnect }) => {
  return (
    <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-650 dark:text-red-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            Data Connection Refused
          </h3>
          <p className="text-xs text-red-655 dark:text-red-400 mt-0.5">
            {error}
          </p>
        </div>
      </div>
      <button
        onClick={onReconnect}
        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
      >
        Reconnect Backend
      </button>
    </div>
  );
};
