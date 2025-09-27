'use client';

import { useState } from 'react';
import { Upload, Coins, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { NFT_TYPES } from '@/lib/constants';

interface NFTMintingFormProps {
  variant?: 'simple' | 'advanced';
  projectId?: string;
  onMint?: (nftData: any) => void;
}

export function NFTMintingForm({ 
  variant = 'simple',
  projectId,
  onMint 
}: NFTMintingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'video',
    supply: 1,
    price: '',
    royalty: 5,
    unlockableContent: '',
    attributes: [] as { trait_type: string; value: string }[]
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleMint = async () => {
    setIsMinting(true);
    setMintStatus('idle');
    
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const nftData = {
        ...formData,
        projectId,
        mintedAt: new Date(),
        tokenId: Math.random().toString(36).substr(2, 9)
      };
      
      onMint?.(nftData);
      setMintStatus('success');
    } catch (error) {
      console.error('Minting failed:', error);
      setMintStatus('error');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-accent bg-opacity-20 rounded-lg">
          <Coins className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-fg">Mint NFT</h2>
          <p className="text-sm text-text-secondary">
            Create a unique digital collectible from your video
          </p>
        </div>
      </div>

      {mintStatus === 'success' && (
        <div className="flex items-center space-x-2 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-green-400 text-sm">NFT minted successfully!</span>
        </div>
      )}

      {mintStatus === 'error' && (
        <div className="flex items-center space-x-2 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-400 text-sm">Minting failed. Please try again.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              NFT Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent"
              placeholder="My Awesome Video NFT"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent resize-none"
              placeholder="Describe your NFT..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              NFT Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent"
            >
              {NFT_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Supply */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Supply
            </label>
            <input
              type="number"
              value={formData.supply}
              onChange={(e) => handleInputChange('supply', parseInt(e.target.value) || 1)}
              min="1"
              max="10000"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Price (ETH)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              step="0.001"
              min="0"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent"
              placeholder="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Royalty (%)
            </label>
            <input
              type="number"
              value={formData.royalty}
              onChange={(e) => handleInputChange('royalty', parseInt(e.target.value) || 0)}
              min="0"
              max="20"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {variant === 'advanced' && (
        <>
          {/* Unlockable Content */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Unlockable Content
            </label>
            <textarea
              value={formData.unlockableContent}
              onChange={(e) => handleInputChange('unlockableContent', e.target.value)}
              rows={2}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-accent resize-none"
              placeholder="Special message, link, or content for NFT owners..."
            />
          </div>

          {/* Attributes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-text-secondary">
                Attributes
              </label>
              <button
                onClick={addAttribute}
                className="text-accent hover:text-accent-secondary text-sm font-medium"
              >
                + Add Attribute
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.attributes.map((attr, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={attr.trait_type}
                    onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                    className="flex-1 bg-surface border border-border rounded px-3 py-2 text-fg text-sm focus:outline-none focus:border-accent"
                    placeholder="Trait type"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    className="flex-1 bg-surface border border-border rounded px-3 py-2 text-fg text-sm focus:outline-none focus:border-accent"
                    placeholder="Value"
                  />
                  <button
                    onClick={() => removeAttribute(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mint Button */}
      <div className="flex justify-end">
        <button
          onClick={handleMint}
          disabled={isMinting || !formData.name}
          className="cyber-button flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMinting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent" />
              <span>Minting...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Mint NFT</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
