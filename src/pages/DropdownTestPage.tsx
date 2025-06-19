import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Settings, LogOut, Check } from 'lucide-react';
import BackHeader from '@/components/ui/BackHeader';

const DropdownTestPage = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [position, setPosition] = React.useState('bottom');

  return (
    <div className="w-full min-h-screen">
      <BackHeader title="Dropdown Visibility Test" />
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Enhanced Dropdown Menu Visibility
          </h1>
          <p className="text-white/70 text-lg">
            Testing improved contrast, readability, and accessibility across all dropdown variations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Dropdown */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Dropdown</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  User Menu
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Checkbox Dropdown */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Checkbox Options</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  View Options
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Panel Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={bookmarksChecked}
                  onCheckedChange={setBookmarksChecked}
                >
                  Show Bookmarks Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={urlsChecked}
                  onCheckedChange={setUrlsChecked}
                >
                  Show Full URLs
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Radio Group Dropdown */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Radio Selection</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Position: {position}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Complex Dropdown */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Complex Menu</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Actions Menu
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>New Document</span>
                  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Import Data</span>
                  <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Recent Items</DropdownMenuLabel>
                <DropdownMenuItem>Budget_2024.xlsx</DropdownMenuItem>
                <DropdownMenuItem>Transactions_Q1.csv</DropdownMenuItem>
                <DropdownMenuItem>Investment_Portfolio.pdf</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Clear History</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dark Background Test */}
          <div className="bg-black/30 border border-white/[0.15] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dark Background</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Test Visibility
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Visibility Test</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>High Contrast Item</DropdownMenuItem>
                <DropdownMenuItem>Medium Contrast Item</DropdownMenuItem>
                <DropdownMenuItem>Standard Item</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Check className="mr-2 h-4 w-4" />
                  <span>With Icon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Light Background Test */}
          <div className="bg-white/[0.15] border border-white/[0.25] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Light Background</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Contrast Test
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Light Mode Test</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Readable Text Item</DropdownMenuItem>
                <DropdownMenuItem>Another Test Item</DropdownMenuItem>
                <DropdownMenuItem>Third Test Item</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Final Test Item</span>
                  <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Visibility Improvements Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
            <div>
              <h4 className="font-semibold text-white mb-2">Enhanced Features:</h4>
              <ul className="space-y-1 text-sm">
                <li>• High contrast backgrounds (black/95 opacity)</li>
                <li>• Strong white borders (20% opacity)</li>
                <li>• Improved text contrast (white/90)</li>
                <li>• Enhanced hover states (white/10 background)</li>
                <li>• Better focus visibility</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Accessibility:</h4>
              <ul className="space-y-1 text-sm">
                <li>• WCAG AA compliant contrast ratios</li>
                <li>• Clear focus indicators</li>
                <li>• Larger click targets</li>
                <li>• Improved separator visibility</li>
                <li>• Consistent styling across variants</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownTestPage; 