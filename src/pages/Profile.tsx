import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Edit3
} from 'lucide-react';
import LiquidGlassSVGFilters from '@/components/ui/LiquidGlassSVGFilters';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [profileData, setProfileData] = useState({
    username: 'alexproudadhd',
    pronouns: 'he/him',
    age: '29',
    customFields: [
      { label: 'My ADHD as animal', value: 'Lucky possum', emoji: '🦔' },
      { label: 'I always forget my', value: '', emoji: '🧠' }
    ],
    email: 's***n@gmail.com',
    phone: '(xxx) xxx-x379',
    verified: true
  });

  const menuItems = [
    { id: 'edit-profile', label: 'Edit Profile', icon: User },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'personal-info', label: 'Personal Information', icon: Smartphone },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
  ];

  const renderEditProfile = () => (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
              {profileData.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 liquid-glass-card"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
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
          <Label htmlFor="pronouns">Pronouns</Label>
          <Input
            id="pronouns"
            value={profileData.pronouns}
            onChange={(e) => setProfileData(prev => ({ ...prev, pronouns: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            value={profileData.age}
            onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
            className="liquid-glass-input"
          />
        </div>
      </div>

      {/* Custom Fields */}
      <div className="space-y-4">
        <Label>About Me</Label>
        {profileData.customFields.map((field, index) => (
          <div key={index} className="liquid-glass-card p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{field.emoji}</span>
              <div className="flex-1 space-y-2">
                <div className="text-sm font-medium text-white/80">{field.label}</div>
                <Input
                  value={field.value}
                  onChange={(e) => {
                    const newFields = [...profileData.customFields];
                    newFields[index].value = e.target.value;
                    setProfileData(prev => ({ ...prev, customFields: newFields }));
                  }}
                  className="liquid-glass-input bg-transparent"
                  placeholder="Enter something about yourself..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full liquid-glass-button bg-blue-500 hover:bg-blue-600">
        Save Changes
      </Button>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="liquid-glass-card p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-red-500 text-white">A</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">alexsmithmobbin8ee5580a2f261c1c</div>
            <div className="text-sm text-white/60">alexsmith.mobbing@gmail.com</div>
          </div>
        </div>
        
        <div className="text-sm text-white/80">
          17 MB out of 20 GB used
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
        </div>
        <div className="text-xs text-white/60 mt-1">Monthly limit resets in 9 days</div>
        
        <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
          View Current Plan
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5" />
            <span>Devices</span>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5" />
            <span>Evernote email</span>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5" />
            <span>Sign out</span>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Account Switching */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-white/80 uppercase tracking-wide">
          Switch Accounts
        </div>
        
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-red-500 text-white">A</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">alexsmithmobbin8ee5580a2f261c1c</div>
              <div className="text-xs text-white/60">alexsmith.mobbing@gmail.com</div>
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-500 text-white">+</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Add account</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div>
            <div className="font-medium">Username</div>
            <div className="text-sm text-white/60">qloll269</div>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div>
            <div className="font-medium">Email address</div>
            <div className="text-sm text-white/60">{profileData.email}</div>
            <div className="text-xs text-red-400">Not verified</div>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-4 liquid-glass-card rounded-lg">
          <div>
            <div className="font-medium">Phone number</div>
            <div className="text-sm text-white/60">{profileData.phone}</div>
            <div className="text-xs text-green-400">Verified</div>
          </div>
          <Button variant="ghost" size="sm">
            <Edit3 className="w-4 h-4" />
          </Button>
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
      case 'personal-info':
        return renderPersonalInfo();
      default:
        return renderEditProfile();
    }
  };

  return (
    <>
      <LiquidGlassSVGFilters />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex space-x-6">
            {/* Sidebar */}
            <div className="w-80 liquid-glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
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
              <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
              
              {/* Mobile Menu Tabs */}
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {menuItems.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      activeSection === item.id
                        ? 'liquid-glass-menu-item active text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
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