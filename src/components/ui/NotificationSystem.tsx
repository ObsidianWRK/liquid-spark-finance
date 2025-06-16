import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell, BellRing } from 'lucide-react';
import SimpleGlassCard from './SimpleGlassCard';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      duration: notification.duration ?? (notification.persistent ? undefined : 5000)
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove non-persistent notifications
    if (!notification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

interface ToastNotificationProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "border-l-4";
    switch (notification.type) {
      case 'success':
        return `${baseStyles} border-green-400 bg-green-400/10`;
      case 'error':
        return `${baseStyles} border-red-400 bg-red-400/10`;
      case 'warning':
        return `${baseStyles} border-yellow-400 bg-yellow-400/10`;
      case 'info':
        return `${baseStyles} border-blue-400 bg-blue-400/10`;
      default:
        return `${baseStyles} border-blue-400 bg-blue-400/10`;
    }
  };

  return (
    <div className={cn(
      "transition-all duration-300 ease-out transform",
      isVisible && !isRemoving 
        ? "translate-x-0 opacity-100 scale-100" 
        : "translate-x-full opacity-0 scale-95"
    )}>
      <SimpleGlassCard className={cn("p-4 max-w-sm w-full", getStyles())}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm">
              {notification.title}
            </h4>
            <p className="text-white/80 text-sm mt-1 leading-relaxed">
              {notification.message}
            </p>
            
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {notification.action.label}
              </button>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </SimpleGlassCard>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <ToastNotification
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const { notifications } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.persistent).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={cn(
          "relative p-2 rounded-full transition-all duration-200",
          hasUnread 
            ? "text-blue-400 hover:text-blue-300 bg-blue-400/10" 
            : "text-white/70 hover:text-white hover:bg-white/10",
          className
        )}
        aria-label={`Notifications ${hasUnread ? `(${unreadCount} unread)` : ''}`}
      >
        {hasUnread ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto">
          <SimpleGlassCard className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Notifications</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium">
                          {notification.title}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {notification.message}
                        </p>
                        <span className="text-white/50 text-xs">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/60 text-sm">No notifications</p>
              </div>
            )}
          </SimpleGlassCard>
        </div>
      )}
    </div>
  );
};

// Helper function to get notification icon
const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'info':
      return <Info className="w-4 h-4 text-blue-400" />;
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
};

// Helper function to format time
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Hook for common notification patterns
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  const showSuccess = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'success', title, message, action });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'error', title, message, persistent: true, action });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'warning', title, message, action });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, action?: Notification['action']) => {
    addNotification({ type: 'info', title, message, action });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default NotificationContainer; 