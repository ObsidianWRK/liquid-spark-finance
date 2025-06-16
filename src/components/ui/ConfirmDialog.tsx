import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  loading?: boolean;
  children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
  children,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error handling can be done in the parent component
      console.error('Confirmation action failed:', error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: XCircle,
          iconColor: 'text-red-400',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-400',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-400',
          confirmButton: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-400',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const Icon = variantStyles.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="liquid-glass-card border-0 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center">
            <Icon className={cn('w-6 h-6', variantStyles.iconColor)} />
          </div>
          
          <DialogTitle className="text-xl font-semibold text-white">
            {title}
          </DialogTitle>
          
          {description && (
            <DialogDescription className="text-white/70 text-base leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && (
          <div className="py-4">
            {children}
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              'w-full sm:w-auto px-4 py-2 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed',
              variantStyles.confirmButton,
              loading && 'cursor-wait'
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook for easier usage
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    props: Partial<ConfirmDialogProps>;
  }>({
    open: false,
    props: {},
  });

  const confirm = (props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        props: {
          ...props,
          onConfirm: async () => {
            await props.onConfirm();
            resolve(true);
          },
          onCancel: () => {
            props.onCancel?.();
            resolve(false);
          },
        },
      });
    });
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      {...(dialogState.props as ConfirmDialogProps)}
      open={dialogState.open}
      onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
    />
  );

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
};

export default ConfirmDialog; 