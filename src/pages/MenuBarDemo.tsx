import React, { useState } from 'react';
import LiquidGlassTopMenuBar from '@/components/LiquidGlassTopMenuBar';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/shared/ui/menubar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

const MenuBarDemo = () => {
  const [selectedAction, setSelectedAction] = useState<string>('');

  const handleMenuItemClick = (item: string) => {
    setSelectedAction(item);
    // Menu item clicked handler
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      {/* Top Menu Bar */}
      <LiquidGlassTopMenuBar onMenuItemClick={handleMenuItemClick} />

      {/* Main Content */}
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Liquid Glass Menu Bar Demo
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Experience the iOS 26-style liquid glass effect in your web
            applications. This implementation features advanced backdrop
            filters, SVG distortion effects, and smooth animations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Traditional Menubar Demo */}
          <Card className="liquid-glass-card border-0 bg-transparent">
            <CardHeader>
              <CardTitle className="text-white">
                Enhanced Radix UI Menubar
              </CardTitle>
              <CardDescription className="text-white/60">
                Traditional dropdown menubar with liquid glass styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Menubar className="bg-transparent border-0">
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem
                      onClick={() => handleMenuItemClick('New File')}
                    >
                      New File <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuItemClick('Open')}>
                      Open... <MenubarShortcut>⌘O</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuItemClick('Save')}>
                      Save <MenubarShortcut>⌘S</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={() => handleMenuItemClick('Undo')}>
                      Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuItemClick('Redo')}>
                      Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => handleMenuItemClick('Copy')}>
                      Copy <MenubarShortcut>⌘C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuItemClick('Paste')}>
                      Paste <MenubarShortcut>⌘V</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem
                      onClick={() => handleMenuItemClick('Dashboard')}
                    >
                      Dashboard <MenubarShortcut>⌘1</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={() => handleMenuItemClick('Reports')}>
                      Reports <MenubarShortcut>⌘2</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem
                      onClick={() => handleMenuItemClick('Settings')}
                    >
                      Settings <MenubarShortcut>⌘,</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </CardContent>
          </Card>

          {/* Action Log */}
          <Card className="liquid-glass-card border-0 bg-transparent">
            <CardHeader>
              <CardTitle className="text-white">Action Log</CardTitle>
              <CardDescription className="text-white/60">
                See real-time interactions with menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedAction ? (
                  <div className="liquid-glass-button p-3 rounded-xl">
                    <p className="text-white/90 text-sm">
                      Last action:{' '}
                      <span className="font-semibold text-blue-300">
                        {selectedAction}
                      </span>
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <div className="text-white/40 text-sm p-3">
                    Click any menu item to see it logged here
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="liquid-glass-card border-0 bg-transparent">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                🌊 Liquid Glass Effect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">
                Advanced backdrop filters and SVG distortion effects create an
                authentic liquid glass appearance.
              </p>
            </CardContent>
          </Card>

          <Card className="liquid-glass-card border-0 bg-transparent">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                ⚡ Smooth Animations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">
                Cubic-bezier transitions and transform effects provide fluid,
                natural motion.
              </p>
            </CardContent>
          </Card>

          <Card className="liquid-glass-card border-0 bg-transparent">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                🎯 Interactive States
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">
                Enhanced hover, focus, and active states with dynamic visual
                feedback.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Browser Compatibility Note */}
        <Card className="liquid-glass-card border-0 bg-transparent">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-white/60 text-sm">
                <strong>Note:</strong> This liquid glass effect works best in
                Chromium-based browsers (Chrome, Edge, Opera). Limited support
                in Safari and Firefox due to varying backdrop-filter
                implementation.
              </p>
              <p className="text-white/40 text-xs mt-2">
                Inspired by Apple's iOS 26 design language • Enhanced with
                modern web technologies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenuBarDemo;
