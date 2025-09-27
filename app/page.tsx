'use client';

import { useState, useEffect } from 'react';
import { 
  Video, 
  Palette, 
  Coins, 
  TrendingUp, 
  Users, 
  Play,
  Sparkles,
  Zap,
  Crown,
  ArrowRight
} from 'lucide-react';
import { AppShell } from './components/AppShell';
import { VideoTemplateCard } from './components/VideoTemplateCard';
import { SubscriberTierCard } from './components/SubscriberTierCard';
import { NFTMintingForm } from './components/NFTMintingForm';
import { SUBSCRIPTION_TIERS } from '@/lib/constants';
import { Template } from '@/lib/types';

// Mock data
const mockTemplates: Template[] = [
  {
    templateId: '1',
    name: 'Cyberpunk Gaming Intro',
    description: 'High-energy gaming intro with neon effects and glitch transitions',
    previewUrl: '/preview1.mp4',
    thumbnailUrl: '/thumb1.jpg',
    category: 'Gaming',
    customizableFields: [
      { id: 'title', type: 'text', label: 'Channel Name', defaultValue: 'Your Channel' },
      { id: 'color', type: 'color', label: 'Accent Color', defaultValue: '#00ff41' }
    ],
    isPremium: false
  },
  {
    templateId: '2',
    name: 'Social Media Story',
    description: 'Perfect for Instagram stories and TikTok videos',
    previewUrl: '/preview2.mp4',
    thumbnailUrl: '/thumb2.jpg',
    category: 'Social Media',
    customizableFields: [
      { id: 'text', type: 'text', label: 'Main Text', defaultValue: 'Your Message' },
      { id: 'bg', type: 'image', label: 'Background', defaultValue: null }
    ],
    isPremium: true
  },
  {
    templateId: '3',
    name: 'Corporate Presentation',
    description: 'Professional template for business presentations',
    previewUrl: '/preview3.mp4',
    thumbnailUrl: '/thumb3.jpg',
    category: 'Corporate',
    customizableFields: [
      { id: 'logo', type: 'image', label: 'Company Logo', defaultValue: null },
      { id: 'title', type: 'text', label: 'Presentation Title', defaultValue: 'Your Title' }
    ],
    isPremium: true
  }
];

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showNFTForm, setShowNFTForm] = useState(false);
  const [stats, setStats] = useState({
    videosCreated: 0,
    nftsMinted: 0,
    totalEarnings: 0,
    subscribers: 0
  });

  useEffect(() => {
    // Animate stats on load
    const timer = setTimeout(() => {
      setStats({
        videosCreated: 1247,
        nftsMinted: 89,
        totalEarnings: 12.5,
        subscribers: 3421
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleCreateVideo = () => {
    if (selectedTemplate) {
      // Navigate to video creation flow
      console.log('Creating video with template:', selectedTemplate);
    }
  };

  const handleMintNFT = () => {
    setShowNFTForm(true);
  };

  return (
    <AppShell variant="glass">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="glass-card p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-accent animate-pulse-neon" />
            </div>
            <h1 className="text-4xl font-bold text-fg mb-4">
              Welcome to <span className="text-accent">CreatorVerse</span>
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Automate Video Creation, Monetize with NFTs, and Engage Your Fans
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="cyber-button flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Start Creating</span>
              </button>
              <button 
                onClick={handleMintNFT}
                className="flex items-center space-x-2 px-6 py-3 bg-surface border border-border rounded-lg text-fg hover:border-accent transition-colors"
              >
                <Coins className="h-5 w-5" />
                <span>Mint NFT</span>
              </button>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 animate-float">
            <div className="w-16 h-16 bg-accent bg-opacity-20 rounded-lg backdrop-blur-sm border border-accent"></div>
          </div>
          <div className="absolute bottom-4 right-4 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-accent-secondary bg-opacity-20 rounded-full backdrop-blur-sm border border-accent-secondary"></div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <Video className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-fg">{stats.videosCreated.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">Videos Created</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Coins className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-fg">{stats.nftsMinted}</div>
            <div className="text-sm text-text-secondary">NFTs Minted</div>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-fg">{stats.totalEarnings} ETH</div>
            <div className="text-sm text-text-secondary">Total Earnings</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-fg">{stats.subscribers.toLocaleString()}</div>
            <div className="text-sm text-text-secondary">Subscribers</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 hover:border-accent transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-colors">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-fg">Create Video</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Choose from our library of professional templates and customize them to match your brand.
            </p>
            <div className="flex items-center text-accent text-sm font-medium">
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="glass-card p-6 hover:border-accent transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-colors">
                <Coins className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-fg">Mint NFT</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Turn your videos into unique digital collectibles and create new revenue streams.
            </p>
            <div className="flex items-center text-accent text-sm font-medium">
              <span>Start Minting</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="glass-card p-6 hover:border-accent transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-colors">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-fg">Engage Fans</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Build stronger relationships with exclusive content and NFT-gated experiences.
            </p>
            <div className="flex items-center text-accent text-sm font-medium">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Featured Templates */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-fg">Featured Templates</h2>
            <button className="text-accent hover:text-accent-secondary font-medium">
              View All Templates
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <VideoTemplateCard
                key={template.templateId}
                template={template}
                variant={selectedTemplate?.templateId === template.templateId ? 'selected' : 'default'}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>

          {selectedTemplate && (
            <div className="mt-6 glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-fg mb-2">
                    Selected: {selectedTemplate.name}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Ready to customize this template and create your video?
                  </p>
                </div>
                <button 
                  onClick={handleCreateVideo}
                  className="cyber-button flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Customize & Create</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Tiers */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-fg mb-4">Choose Your Plan</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Unlock more features and capabilities with our flexible subscription plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier, index) => (
              <SubscriberTierCard
                key={tier.id}
                tier={tier}
                variant={index === 1 ? 'featured' : 'standard'}
                isCurrentTier={tier.id === 'free'}
                onSelect={(tierId) => console.log('Selected tier:', tierId)}
              />
            ))}
          </div>
        </div>

        {/* NFT Minting Form Modal */}
        {showNFTForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setShowNFTForm(false)}
                  className="absolute top-4 right-4 z-10 text-text-secondary hover:text-fg"
                >
                  ✕
                </button>
                <NFTMintingForm
                  variant="advanced"
                  onMint={(nftData) => {
                    console.log('NFT minted:', nftData);
                    setShowNFTForm(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
