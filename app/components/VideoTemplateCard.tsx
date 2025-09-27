'use client';

import { useState } from 'react';
import { Play, Star, Crown, Zap } from 'lucide-react';
import { Template } from '@/lib/types';

interface VideoTemplateCardProps {
  template: Template;
  variant?: 'default' | 'selected';
  onSelect?: (template: Template) => void;
}

export function VideoTemplateCard({ 
  template, 
  variant = 'default',
  onSelect 
}: VideoTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`template-card relative group ${
        variant === 'selected' ? 'neon-border bg-accent bg-opacity-10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(template)}
    >
      {/* Premium Badge */}
      {template.isPremium && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center space-x-1 bg-accent-secondary px-2 py-1 rounded text-xs font-bold text-white">
            <Crown className="h-3 w-3" />
            <span>PRO</span>
          </div>
        </div>
      )}

      {/* Template Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-surface to-bg rounded-lg overflow-hidden mb-3">
        <img
          src={template.thumbnailUrl}
          alt={template.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml,${encodeURIComponent(`
              <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1a1a2e"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#00ff41" font-family="monospace" font-size="16">
                  ${template.name}
                </text>
              </svg>
            `)}`;
          }}
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-accent bg-opacity-20 backdrop-blur-sm rounded-full p-4 border border-accent">
            <Play className="h-8 w-8 text-accent fill-current" />
          </div>
        </div>

        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} style={{
          background: 'linear-gradient(45deg, transparent, rgba(0, 255, 65, 0.1), transparent)',
          filter: 'blur(1px)'
        }} />
      </div>

      {/* Template Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-fg text-sm line-clamp-2">
            {template.name}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-accent">
            <Star className="h-3 w-3 fill-current" />
            <span>4.8</span>
          </div>
        </div>
        
        <p className="text-xs text-text-secondary line-clamp-2">
          {template.description}
        </p>

        {/* Category & Features */}
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-surface rounded text-text-secondary">
            {template.category}
          </span>
          
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-accent" />
            <span className="text-xs text-text-secondary">
              {template.customizableFields.length} fields
            </span>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} style={{
        boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
        zIndex: -1
      }} />
    </div>
  );
}
