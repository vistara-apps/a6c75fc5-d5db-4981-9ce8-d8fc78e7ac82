'use client';

import { useState } from 'react';
import { Palette, Sparkles, Video, Coins } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

const themes = [
  { id: 'default', name: 'CreatorVerse', description: 'Cyberpunk gaming aesthetic' },
  { id: 'celo', name: 'Celo', description: 'Black background with yellow accents' },
  { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
  { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
  { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue' },
];

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const applyTheme = () => {
    setTheme(selectedTheme as any);
  };

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-fg mb-4">Theme Preview</h1>
          <p className="text-text-secondary">
            Preview and switch between different blockchain themes
          </p>
        </div>

        {/* Theme Selector */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Select Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id as any)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedTheme === t.id
                    ? 'border-accent bg-accent bg-opacity-20'
                    : 'border-border hover:border-accent'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-fg">{t.name}</div>
                  <div className="text-xs text-text-secondary mt-1">{t.description}</div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={applyTheme}
            className="cyber-button"
          >
            Apply Theme
          </button>
        </div>

        {/* Preview Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cards Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Cards & Surfaces</h3>
            
            <div className="glass-card p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Video className="h-6 w-6 text-accent" />
                <h4 className="font-semibold text-fg">Glass Card</h4>
              </div>
              <p className="text-text-secondary text-sm">
                This is a glass card with backdrop blur and border effects.
              </p>
            </div>

            <div className="template-card">
              <div className="aspect-video bg-gradient-to-br from-surface to-bg rounded mb-3 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-semibold text-fg mb-1">Template Card</h4>
              <p className="text-text-secondary text-sm">Hover effect with glow</p>
            </div>
          </div>

          {/* Buttons & Interactive Elements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fg">Interactive Elements</h3>
            
            <div className="glass-card p-4 space-y-4">
              <button className="cyber-button w-full">
                Cyber Button
              </button>
              
              <button className="w-full bg-surface border border-border text-fg hover:border-accent py-3 px-4 rounded-lg transition-colors">
                Standard Button
              </button>
              
              <div className="neon-border p-3 rounded">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-accent" />
                  <span className="text-fg">Neon Border Element</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-fg mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-full h-16 bg-bg rounded mb-2 border border-border"></div>
              <div className="text-xs text-text-secondary">Background</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-surface rounded mb-2"></div>
              <div className="text-xs text-text-secondary">Surface</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-accent rounded mb-2"></div>
              <div className="text-xs text-text-secondary">Accent</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-accent-secondary rounded mb-2"></div>
              <div className="text-xs text-text-secondary">Accent 2</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-text-primary rounded mb-2"></div>
              <div className="text-xs text-text-secondary">Text Primary</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-text-secondary rounded mb-2"></div>
              <div className="text-xs text-text-secondary">Text Secondary</div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-fg mb-4">Typography</h3>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-fg">Display Heading</h1>
              <p className="text-text-secondary text-sm">text-4xl font-bold</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-fg">Section Heading</h2>
              <p className="text-text-secondary text-sm">text-2xl font-semibold</p>
            </div>
            <div>
              <p className="text-base text-text-primary">
                Body text with primary color for better readability and contrast.
              </p>
              <p className="text-text-secondary text-sm">text-base text-text-primary</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">
                Secondary text for captions and less important information.
              </p>
              <p className="text-text-secondary text-sm">text-sm text-text-secondary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
