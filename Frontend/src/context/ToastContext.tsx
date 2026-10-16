import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon, IconName } from '../components/ui/Icon';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 light:text-emerald-700 icon-emerald',
            error: 'bg-rose-500/15 border-rose-500/30 text-rose-400 light:text-rose-700 icon-rose',
            warning: 'bg-amber-500/15 border-amber-500/30 text-amber-400 light:text-amber-700 icon-amber',
            info: 'bg-blue-500/15 border-blue-500/30 text-blue-400 light:text-blue-700 icon-blue',
          }[toast.type];

          const iconMap: Record<ToastType, IconName> = {
            success: 'check',
            error: 'close',
            warning: 'shield',
            info: 'dumbbell',
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-up bg-surface-card border-surface-border text-xs font-semibold`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    toast.type === 'success'
                      ? 'bg-emerald-500 text-black'
                      : toast.type === 'error'
                      ? 'bg-rose-500 text-white'
                      : toast.type === 'warning'
                      ? 'bg-amber-500 text-black'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <Icon name={iconMap[toast.type]} className="w-4 h-4" />
                </div>
                <p className="text-slate-900 dark:text-slate-100 text-xs font-semibold leading-tight">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <Icon name="close" className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
