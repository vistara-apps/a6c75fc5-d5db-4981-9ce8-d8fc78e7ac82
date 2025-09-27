'use client';

import { Check, Crown, Zap, Star } from 'lucide-react';
import { SubscriptionTier } from '@/lib/types';

interface SubscriberTierCardProps {
  tier: SubscriptionTier;
  variant?: 'featured' | 'standard';
  isCurrentTier?: boolean;
  onSelect?: (tierId: string) => void;
}

export function SubscriberTierCard({ 
  tier, 
  variant = 'standard',
  isCurrentTier = false,
  onSelect 
}: SubscriberTierCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <div className={`relative glass-card p-6 transition-all duration-300 hover:scale-105 ${
      isFeatured ? 'neon-border nft-glow' : 'hover:border-accent'
    } ${isCurrentTier ? 'bg-accent bg-opacity-10' : ''}`}>
      
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1 bg-accent px-3 py-1 rounded-full text-xs font-bold text-bg">
            <Crown className="h-3 w-3" />
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      {/* Current Tier Badge */}
      {isCurrentTier && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-green-500 px-2 py-1 rounded text-xs font-bold text-white">
            <Check className="h-3 w-3" />
            <span>CURRENT</span>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          {tier.id === 'free' && <Zap className="h-8 w-8 text-accent" />}
          {tier.id === 'creator' && <Star className="h-8 w-8 text-accent" />}
          {tier.id === 'pro' && <Crown className="h-8 w-8 text-accent" />}
        </div>
        
        <h3 className="text-xl font-bold text-fg mb-2">{tier.name}</h3>
        
        <div className="flex items-baseline justify-center space-x-1">
          <span className="text-3xl font-bold text-accent">
            ${tier.price}
          </span>
          {tier.price > 0 && (
            <span className="text-text-secondary text-sm">/month</span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm text-text-secondary">{feature}</span>
          </div>
        ))}
      </div>

      {/* Limits Info */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-text-secondary">Videos/month</span>
            <div className="font-semibold text-fg">
              {tier.limits.videosPerMonth === -1 ? 'Unlimited' : tier.limits.videosPerMonth}
            </div>
          </div>
          <div>
            <span className="text-text-secondary">Templates</span>
            <div className="font-semibold text-fg capitalize">
              {tier.limits.templatesAccess}
            </div>
          </div>
          <div>
            <span className="text-text-secondary">NFT Minting</span>
            <div className="font-semibold text-fg">
              {tier.limits.nftMinting ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <span className="text-text-secondary">Support</span>
            <div className="font-semibold text-fg">
              {tier.limits.prioritySupport ? 'Priority' : 'Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect?.(tier.id)}
        disabled={isCurrentTier}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
          isCurrentTier
            ? 'bg-surface text-text-secondary cursor-not-allowed'
            : isFeatured
            ? 'cyber-button'
            : 'bg-surface border border-border text-fg hover:border-accent hover:text-accent'
        }`}
      >
        {isCurrentTier ? 'Current Plan' : tier.price === 0 ? 'Get Started' : 'Upgrade'}
      </button>

      {/* Glow Effect for Featured */}
      {isFeatured && (
        <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none" style={{
          background: 'linear-gradient(45deg, var(--color-accent), var(--color-accent-secondary))',
          filter: 'blur(20px)',
          zIndex: -1
        }} />
      )}
    </div>
  );
}
