
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import LiquidGlassNavigation from '@/components/navigation/LiquidGlassNavigation';
import MountainLandscape from '@/components/backgrounds/MountainLandscape';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import the magical styles
import '@/styles/liquid-glass-navigation.css';

const Dashboard = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Breathtaking mountain landscape */}
      <MountainLandscape />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <Layout>
          <div className="container mx-auto px-4 py-8">
            {/* Welcome section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vueni
                </span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto font-display">
                Experience the future of financial management with our magical liquid glass interface
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className={cn(
                'backdrop-blur-md bg-white/10 border-white/20',
                'hover:bg-white/15 transition-all duration-300',
                'hover:scale-105 hover:shadow-2xl'
              )}>
                <CardHeader>
                  <CardTitle className="text-white font-display">Smart Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Get AI-powered insights into your spending patterns and financial health.
                  </p>
                </CardContent>
              </Card>

              <Card className={cn(
                'backdrop-blur-md bg-white/10 border-white/20',
                'hover:bg-white/15 transition-all duration-300',
                'hover:scale-105 hover:shadow-2xl'
              )}>
                <CardHeader>
                  <CardTitle className="text-white font-display">Real-time Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Monitor your transactions and balances in real-time with beautiful visualizations.
                  </p>
                </CardContent>
              </Card>

              <Card className={cn(
                'backdrop-blur-md bg-white/10 border-white/20',
                'hover:bg-white/15 transition-all duration-300',
                'hover:scale-105 hover:shadow-2xl'
              )}>
                <CardHeader>
                  <CardTitle className="text-white font-display">Goal Setting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">
                    Set and track your financial goals with our intuitive planning tools.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to action */}
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className={cn(
                  'bg-white/20 backdrop-blur-md border-white/30',
                  'hover:bg-white/30 hover:scale-105',
                  'text-white font-semibold py-4 px-8',
                  'transition-all duration-300',
                  'shadow-lg hover:shadow-xl',
                  'font-display'
                )}
              >
                Explore Your Dashboard
              </Button>
            </div>
          </div>
        </Layout>
      </div>

      {/* The magical liquid glass navigation */}
      <LiquidGlassNavigation />
    </div>
  );
};

export default Dashboard;
