import { toast } from '@/hooks/use-toast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private defaultDurations = {
    success: 4000,
    error: 6000,
    warning: 5000,
    info: 4000,
  };

  success(message: string, options?: NotificationOptions) {
    return this.show('success', message, options);
  }

  error(message: string, options?: NotificationOptions) {
    return this.show('error', message, options);
  }

  warning(message: string, options?: NotificationOptions) {
    return this.show('warning', message, options);
  }

  info(message: string, options?: NotificationOptions) {
    return this.show('info', message, options);
  }

  private show(type: NotificationType, message: string, options?: NotificationOptions) {
    const duration = options?.duration || this.defaultDurations[type];
    
    const toastConfig = {
      title: options?.title || this.getDefaultTitle(type),
      description: message,
      duration,
      variant: this.getToastVariant(type),
      action: options?.action ? {
        altText: options.action.label,
        action: (
          <button
            onClick={options.action.onClick}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
          >
            {options.action.label}
          </button>
        ),
      } : undefined,
    };

    // Screen reader live region update
    const srRegion = document.getElementById('sr-toast-live');
    if (srRegion) {
      srRegion.textContent = `${options?.title || this.getDefaultTitle(type)}. ${message}`;

      // Clear after it is announced
      setTimeout(() => {
        if (srRegion.textContent === `${options?.title || this.getDefaultTitle(type)}. ${message}`) {
          srRegion.textContent = '';
        }
      }, 1000);
    }

    return toast(toastConfig);
  }

  private getDefaultTitle(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  }

  private getToastVariant(type: NotificationType) {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  }

  // Preset notifications for common actions
  loading(message: string = 'Loading...') {
    return this.info(message, { duration: 0 }); // Infinite duration
  }

  saved(itemName?: string) {
    const message = itemName ? `${itemName} saved successfully` : 'Changes saved successfully';
    return this.success(message);
  }

  deleted(itemName?: string) {
    const message = itemName ? `${itemName} deleted successfully` : 'Item deleted successfully';
    return this.success(message);
  }

  networkError() {
    return this.error('Network error occurred. Please check your connection and try again.');
  }

  unauthorized() {
    return this.error('You are not authorized to perform this action.');
  }

  invalidForm() {
    return this.error('Please check the form for errors and try again.');
  }

  comingSoon(feature?: string) {
    const message = feature ? `${feature} is coming soon!` : 'This feature is coming soon!';
    return this.info(message);
  }
}

export const notificationService = new NotificationService(); 