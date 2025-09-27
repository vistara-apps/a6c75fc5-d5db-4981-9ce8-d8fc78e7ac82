'use client';

import { useState } from 'react';
import { 
  Video, 
  Palette, 
  Coins, 
  Users, 
  Settings2, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useTheme } from './ThemeProvider';

interface AppShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
}

export function AppShell({ children, variant = 'default' }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Video, current: true },
    { name: 'Templates', href: '/templates', icon: Palette, current: false },
    { name: 'NFT Studio', href: '/nft', icon: Coins, current: false },
    { name: 'Community', href: '/community', icon: Users, current: false },
    { name: 'Settings', href: '/settings', icon: Settings2, current: false },
  ];

  const themes = [
    { id: 'default', name: 'CreatorVerse' },
    { id: 'celo', name: 'Celo' },
    { id: 'solana', name: 'Solana' },
    { id: 'base', name: 'Base' },
    { id: 'coinbase', name: 'Coinbase' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-fg">CreatorVerse</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-text-secondary" />
            </button>
          </div>
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current
                    ? 'bg-accent bg-opacity-20 text-accent border border-accent'
                    : 'text-text-secondary hover:text-fg hover:bg-surface'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className={`h-full ${variant === 'glass' ? 'glass-card' : 'bg-surface'} border-r border-border`}>
          <div className="flex items-center space-x-2 p-6">
            <Sparkles className="h-8 w-8 text-accent animate-pulse-neon" />
            <span className="text-xl font-bold text-fg">CreatorVerse</span>
          </div>
          
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.current
                    ? 'bg-accent bg-opacity-20 text-accent neon-border'
                    : 'text-text-secondary hover:text-fg hover:bg-surface hover:bg-opacity-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Theme Selector */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass-card p-3">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full bg-surface border border-border rounded px-3 py-2 text-fg text-sm focus:outline-none focus:border-accent"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className={`sticky top-0 z-40 ${variant === 'glass' ? 'glass-card' : 'bg-surface'} border-b border-border`}>
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-text-secondary hover:text-fg"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1" />
            
            <Wallet>
              <ConnectWallet className="cyber-button">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6" />
                  <Name className="text-sm" />
                </div>
              </ConnectWallet>
            </Wallet>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
