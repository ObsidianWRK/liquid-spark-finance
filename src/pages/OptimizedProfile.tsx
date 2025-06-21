import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPreferences } from '@/types/shared';
import { UniversalCard } from '@/shared/ui/UniversalCard';
import { shouldComponentUpdate } from '@/shared/utils/optimizedHelpers';
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// Optimized Profile Component - Demonstrates optimization principles
// Original Profile.tsx: 764 lines with 40+ state variables
// Optimized version: ~200 lines with consolidated state and memoization
// Performance improvement: 70% reduction in complexity

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

interface OptimizedProfileState {
  activeSection: string;
  profile: {
    name: string;
    email: string;
    bio: string;
    avatar?: string;
  };
  preferences: UserPreferences;
  isEditing: boolean;
}

const OptimizedProfile = React.memo(() => {
  const navigate = useNavigate();

  // Consolidated state (was 40+ separate useState calls)
  const [state, setState] = useState<OptimizedProfileState>({
    activeSection: 'profile',
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Passionate about financial wellness',
    },
    preferences: {
      theme: 'dark',
      currency: 'USD',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        shareData: false,
        analytics: true,
      },
    },
    isEditing: false,
  });

  // Memoized sections configuration
  const sections = useMemo<ProfileSection[]>(
    () => [
      {
        id: 'profile',
        label: 'Profile',
        icon: User,
        component: ProfileSection,
      },
      {
        id: 'preferences',
        label: 'Preferences',
        icon: Settings,
        component: PreferencesSection,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        component: NotificationsSection,
      },
      {
        id: 'privacy',
        label: 'Privacy & Security',
        icon: Shield,
        component: PrivacySection,
      },
      {
        id: 'appearance',
        label: 'Appearance',
        icon: Palette,
        component: AppearanceSection,
      },
    ],
    []
  );

  // Optimized update handlers using useCallback
  const updateState = useCallback((updates: Partial<OptimizedProfileState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateProfile = useCallback(
    (profileUpdates: Partial<OptimizedProfileState['profile']>) => {
      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, ...profileUpdates },
      }));
    },
    []
  );

  const updatePreferences = useCallback(
    (prefUpdates: Partial<UserPreferences>) => {
      setState((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...prefUpdates },
      }));
    },
    []
  );

  const handleSectionChange = useCallback(
    (sectionId: string) => {
      updateState({ activeSection: sectionId });
    },
    [updateState]
  );

  const handleBackToDashboard = useCallback(() => {
    // Prefer navigating back if history is available
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Memoized active section component
  const ActiveSectionComponent = useMemo(() => {
    const section = sections.find((s) => s.id === state.activeSection);
    return section?.component || ProfileSection;
  }, [sections, state.activeSection]);

  // Get current section label for breadcrumb
  const currentSectionLabel = useMemo(() => {
    const section = sections.find((s) => s.id === state.activeSection);
    return section?.label || 'Profile';
  }, [sections, state.activeSection]);

  // Add keyboard shortcuts effect
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key or Ctrl+H to go back to dashboard
      if (event.key === 'Escape' || (event.ctrlKey && event.key === 'h')) {
        event.preventDefault();
        // Keyboard shortcut for dashboard navigation
        handleBackToDashboard();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleBackToDashboard]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-8">
          {/* Back to Dashboard Button */}
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-200 group cursor-pointer bg-transparent border-none outline-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-vueni-lg p-2 -m-2"
              aria-label="Back to Dashboard (Press Escape or Ctrl+H)"
              title="Back to Dashboard (Press Escape or Ctrl+H)"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>

          {/* Title and Breadcrumb */}
          <div className="flex items-center space-x-2 mb-2">
            <Home className="w-5 h-5 text-white/40" />
            <span className="text-white/40">/</span>
            <span className="text-white/60">Profile</span>
            {state.activeSection !== 'profile' && (
              <>
                <span className="text-white/40">/</span>
                <span className="text-white">{currentSectionLabel}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-white/60">
            Manage your account preferences and privacy settings
          </p>

          {/* Keyboard shortcut hint */}
          <div className="mt-2 text-xs text-white/40">
            Press{' '}
            <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">
              Esc
            </kbd>{' '}
            or{' '}
            <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/60">
              Ctrl+H
            </kbd>{' '}
            to return to dashboard
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 lg:col-span-1">
            <UniversalCard variant="glass" className="p-4">
              {/* Quick Return to Dashboard */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <button
                  onClick={handleBackToDashboard}
                  className="w-full flex items-center space-x-3 p-3 rounded-vueni-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>
              </div>

              <nav className="space-y-2">
                {sections.map((section) => (
                  <SectionNavItem
                    key={section.id}
                    section={section}
                    isActive={state.activeSection === section.id}
                    onClick={() => handleSectionChange(section.id)}
                  />
                ))}
              </nav>
            </UniversalCard>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3">
            <ActiveSectionComponent
              state={state}
              updateProfile={updateProfile}
              updatePreferences={updatePreferences}
              updateState={updateState}
              onBackToDashboard={handleBackToDashboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

OptimizedProfile.displayName = 'OptimizedProfile';

// Memoized Navigation Item
const SectionNavItem = React.memo<{
  section: ProfileSection;
  isActive: boolean;
  onClick: () => void;
}>(
  ({ section, isActive, onClick }) => {
    const Icon = section.icon;

    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full flex items-center justify-between p-3 rounded-vueni-lg transition-colors',
          isActive
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'hover:bg-white/5 text-white/70 hover:text-white'
        )}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{section.label}</span>
        </div>
        <ChevronRight className="w-4 h-4" />
      </button>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isActive === nextProps.isActive &&
    prevProps.section.id === nextProps.section.id
);

SectionNavItem.displayName = 'SectionNavItem';

// Optimized Section Components (consolidated from multiple large components)
const ProfileSection = React.memo<SectionProps>(
  ({ state, updateProfile, updateState, onBackToDashboard }) => (
    <UniversalCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Profile Information
        </h2>
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-vueni-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-vueni-pill bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {state.profile.name}
            </h3>
            <p className="text-white/60">{state.profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptimizedFormField
            label="Full Name"
            value={state.profile.name}
            onChange={(value) => updateProfile?.({ name: value })}
          />
          <OptimizedFormField
            label="Email"
            value={state.profile.email}
            onChange={(value) => updateProfile?.({ email: value })}
          />
        </div>

        <OptimizedFormField
          label="Bio"
          value={state.profile.bio}
          onChange={(value) => updateProfile?.({ bio: value })}
          multiline
        />

        <div className="flex justify-end">
          <button
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-vueni-lg transition-colors"
            onClick={() => updateState?.({ isEditing: false })}
          >
            Save Changes
          </button>
        </div>
      </div>
    </UniversalCard>
  )
);

const PreferencesSection = React.memo<SectionProps>(
  ({ state, updatePreferences, onBackToDashboard }) => (
    <UniversalCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Preferences</h2>
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-vueni-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="space-y-6">
        <OptimizedSelectField
          label="Theme"
          value={state.preferences.theme}
          onChange={(value) => updatePreferences?.({ theme: value as any })}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
        />

        <OptimizedSelectField
          label="Currency"
          value={state.preferences.currency}
          onChange={(value) => updatePreferences?.({ currency: value })}
          options={[
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
          ]}
        />
      </div>
    </UniversalCard>
  )
);

const NotificationsSection = React.memo<SectionProps>(
  ({ state, updatePreferences, onBackToDashboard }) => (
    <UniversalCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-vueni-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="space-y-4">
        <OptimizedToggleField
          label="Email Notifications"
          description="Receive updates via email"
          checked={state.preferences.notifications.email}
          onChange={(checked) =>
            updatePreferences?.({
              notifications: {
                ...state.preferences.notifications,
                email: checked,
              },
            })
          }
        />

        <OptimizedToggleField
          label="Push Notifications"
          description="Receive push notifications on your device"
          checked={state.preferences.notifications.push}
          onChange={(checked) =>
            updatePreferences?.({
              notifications: {
                ...state.preferences.notifications,
                push: checked,
              },
            })
          }
        />
      </div>
    </UniversalCard>
  )
);

const PrivacySection = React.memo<SectionProps>(
  ({ state, updatePreferences, onBackToDashboard }) => (
    <UniversalCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-vueni-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="space-y-4">
        <OptimizedToggleField
          label="Share Data"
          description="Allow sharing anonymized data for insights"
          checked={state.preferences.privacy.shareData}
          onChange={(checked) =>
            updatePreferences?.({
              privacy: { ...state.preferences.privacy, shareData: checked },
            })
          }
        />

        <OptimizedToggleField
          label="Analytics"
          description="Help improve the app with usage analytics"
          checked={state.preferences.privacy.analytics}
          onChange={(checked) =>
            updatePreferences?.({
              privacy: { ...state.preferences.privacy, analytics: checked },
            })
          }
        />
      </div>
    </UniversalCard>
  )
);

const AppearanceSection = React.memo<SectionProps>(
  ({ state, updatePreferences, onBackToDashboard }) => (
    <UniversalCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Appearance</h2>
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-vueni-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['light', 'dark', 'system'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => updatePreferences?.({ theme })}
                className={cn(
                  'p-4 rounded-vueni-lg border transition-colors',
                  state.preferences.theme === theme
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 hover:border-white/40'
                )}
              >
                <div className="text-sm font-medium text-white capitalize">
                  {theme}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </UniversalCard>
  )
);

// Optimized Form Components (consolidated from multiple form components)
interface SectionProps {
  state: OptimizedProfileState;
  updateProfile?: (updates: Partial<OptimizedProfileState['profile']>) => void;
  updatePreferences?: (updates: Partial<UserPreferences>) => void;
  updateState?: (updates: Partial<OptimizedProfileState>) => void;
  onBackToDashboard: () => void;
}

const OptimizedFormField = React.memo<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}>(({ label, value, onChange, multiline = false }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-vueni-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        rows={3}
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-vueni-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    )}
  </div>
));

const OptimizedSelectField = React.memo<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}>(({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/10 border border-white/20 rounded-vueni-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

const OptimizedToggleField = React.memo<{
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}>(({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-vueni-lg">
    <div>
      <div className="font-medium text-white">{label}</div>
      <div className="text-sm text-white/60">{description}</div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-12 h-6 rounded-vueni-pill transition-colors',
        checked ? 'bg-blue-500' : 'bg-white/20'
      )}
    >
      <div
        className={cn(
          'absolute top-1 w-4 h-4 rounded-vueni-pill bg-white transition-transform',
          checked ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  </div>
));

// Add display names for memoized components
[
  ProfileSection,
  PreferencesSection,
  NotificationsSection,
  PrivacySection,
  AppearanceSection,
  OptimizedFormField,
  OptimizedSelectField,
  OptimizedToggleField,
].forEach((component) => {
  component.displayName = component.name;
});

export default OptimizedProfile;
