import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Settings, 
  Smartphone, 
  Mail, 
  Shield, 
  CreditCard, 
  HelpCircle,
  LogOut,
  Plus,
  Camera,
  Edit3,
  Bell,
  Eye,
  Palette,
  Accessibility,
  Download,
  Trash2,
  Key,
  ChevronRight,
  MessageSquare,
  Star,
  FileText,
  Database,
  Globe
} from 'lucide-react';
import LiquidGlassSVGFilters from '@/components/ui/LiquidGlassSVGFilters';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [profileData, setProfileData] = useState({
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about financial wellness and smart investing.',
    location: 'San Francisco, CA',
    verified: true
  });

  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      transactionAlerts: true,
      budgetAlerts: true,
      securityAlerts: true,
      promotionalEmails: false
    },
    privacy: {
      profileVisibility: 'friends',
      showOnlineStatus: true,
      allowDataCollection: false,
      shareAnalytics: false,
      twoFactorAuth: true
    },
    appearance: {
      theme: 'dark',
      language: 'en',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY'
    },
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    }
  });

  const menuItems = [
    { id: 'edit-profile', label: 'Edit Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: Eye },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'devices', label: 'Connected Devices', icon: Smartphone },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderEditProfile = () => (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
              {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 liquid-glass-button"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">{profileData.firstName} {profileData.lastName}</h3>
          <p className="text-white/60">@{profileData.username}</p>
          {profileData.verified && (
            <Badge className="mt-2 bg-blue-500">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={profileData.username}
            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profileData.location}
            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          className="liquid-glass-input min-h-[100px]"
          placeholder="Tell us about yourself..."
        />
      </div>

      <Button className="w-full liquid-glass-button bg-blue-500 hover:bg-blue-600">
        Save Changes
      </Button>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="liquid-glass-card p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-blue-500 text-white">
              {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{profileData.firstName} {profileData.lastName}</div>
            <div className="text-sm text-white/60">{profileData.email}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Account Status</span>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Two-Factor Authentication</span>
            <Badge className={settings.privacy.twoFactorAuth ? "bg-green-500" : "bg-red-500"}>
              {settings.privacy.twoFactorAuth ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Security Settings</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5" />
              <div>
                <div className="font-medium">Change Password</div>
                <div className="text-sm text-white/60">Last updated 30 days ago</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5" />
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-white/60">Extra security for your account</div>
              </div>
            </div>
            <Switch 
              checked={settings.privacy.twoFactorAuth}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, twoFactorAuth: checked }
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Transaction Alerts</div>
              <div className="text-sm text-white/60">Get notified of all transactions</div>
            </div>
            <Switch 
              checked={settings.notifications.transactionAlerts}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, transactionAlerts: checked }
                }))
              }
            />
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Budget Alerts</div>
              <div className="text-sm text-white/60">Notifications when you exceed budgets</div>
            </div>
            <Switch 
              checked={settings.notifications.budgetAlerts}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, budgetAlerts: checked }
                }))
              }
            />
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-white/60">Receive updates via email</div>
            </div>
            <Switch 
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailNotifications: checked }
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Profile Visibility</div>
              <div className="text-sm text-white/60">Who can see your profile</div>
            </div>
            <select 
              value={settings.privacy.profileVisibility}
              onChange={(e) => 
                setSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, profileVisibility: e.target.value }
                }))
              }
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1"
            >
              <option value="public" className="bg-black">Public</option>
              <option value="friends" className="bg-black">Friends Only</option>
              <option value="private" className="bg-black">Private</option>
            </select>
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Allow Data Collection</div>
              <div className="text-sm text-white/60">Help improve our services</div>
            </div>
            <Switch 
              checked={settings.privacy.allowDataCollection}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  privacy: { ...prev.privacy, allowDataCollection: checked }
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Theme & Display</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-white/60">Choose your preferred theme</div>
            </div>
            <select 
              value={settings.appearance.theme}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1"
            >
              <option value="light" className="bg-black">Light</option>
              <option value="dark" className="bg-black">Dark</option>
              <option value="auto" className="bg-black">Auto</option>
            </select>
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Currency</div>
              <div className="text-sm text-white/60">Default currency display</div>
            </div>
            <select 
              value={settings.appearance.currency}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1"
            >
              <option value="USD" className="bg-black">USD ($)</option>
              <option value="EUR" className="bg-black">EUR (€)</option>
              <option value="GBP" className="bg-black">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibility = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Display & Text</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Font Size</div>
              <div className="text-sm text-white/60">Adjust text size for better readability</div>
            </div>
            <select 
              value={settings.accessibility.fontSize}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1"
            >
              <option value="small" className="bg-black">Small</option>
              <option value="medium" className="bg-black">Medium</option>
              <option value="large" className="bg-black">Large</option>
              <option value="extra-large" className="bg-black">Extra Large</option>
            </select>
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">High Contrast</div>
              <div className="text-sm text-white/60">Increase contrast for better visibility</div>
            </div>
            <Switch 
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  accessibility: { ...prev.accessibility, highContrast: checked }
                }))
              }
            />
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Reduced Motion</div>
              <div className="text-sm text-white/60">Minimize animations and motion effects</div>
            </div>
            <Switch 
              checked={settings.accessibility.reducedMotion}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  accessibility: { ...prev.accessibility, reducedMotion: checked }
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Connected Devices</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-8 h-8 text-blue-400" />
              <div>
                <div className="font-medium">iPhone 15 Pro</div>
                <div className="text-sm text-white/60">Current device • Last active now</div>
              </div>
            </div>
            <Badge className="bg-green-500">Current</Badge>
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-8 h-8 text-gray-400" />
              <div>
                <div className="font-medium">MacBook Pro</div>
                <div className="text-sm text-white/60">Chrome • Last active 2 hours ago</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-400">
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="liquid-glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Current Plan</h3>
            <p className="text-white/60">You're on the Pro plan</p>
          </div>
          <Badge className="bg-blue-500 text-lg px-4 py-2">Pro</Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Monthly Cost</span>
            <span className="text-lg font-semibold">$29.99/month</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Next Billing Date</span>
            <span className="text-sm text-white/60">January 15, 2025</span>
          </div>
        </div>
        
        <Button className="w-full mt-4 liquid-glass-button bg-blue-500 hover:bg-blue-600">
          Manage Plan
        </Button>
      </div>
    </div>
  );

  const renderData = () => (
    <div className="space-y-6">
      <div className="liquid-glass-card p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Storage Usage</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Used Space</span>
              <span>2.3 GB of 10 GB</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Data Management</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <div>
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-white/60">Download all your data</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Get Help</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5" />
              <div>
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-white/60">Get help from our support team</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <div>
                <div className="font-medium">Help Center</div>
                <div className="text-sm text-white/60">Browse articles and guides</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">About</h3>
        
        <div className="liquid-glass-card p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">App Version</span>
              <span className="text-sm text-white/60">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Terms of Service</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-400">
                View
              </Button>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Privacy Policy</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-400">
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'edit-profile':
        return renderEditProfile();
      case 'account':
        return renderAccount();
      case 'notifications':
        return renderNotifications();
      case 'privacy':
        return renderPrivacy();
      case 'appearance':
        return renderAppearance();
      case 'accessibility':
        return renderAccessibility();
      case 'devices':
        return renderDevices();
      case 'billing':
        return renderBilling();
      case 'data':
        return renderData();
      case 'help':
        return renderHelp();
      default:
        return renderEditProfile();
    }
  };

  return (
    <>
      <LiquidGlassSVGFilters />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto p-4">
          {/* Desktop Layout */}
          <div className="hidden md:flex space-x-6">
            {/* Sidebar */}
            <div className="w-80 liquid-glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'liquid-glass-menu-item active text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              {/* Sign Out Button */}
              <div className="mt-8 pt-4 border-t border-white/20">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-all">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 liquid-glass-card p-8">
              <h1 className="text-2xl font-bold text-white mb-6">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h1>
              {renderContent()}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            <div className="liquid-glass-card p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
              
              {/* Mobile Menu Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {menuItems.slice(0, 4).map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'liquid-glass-menu-item active text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                      <span className="text-xs text-center">{item.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile; 