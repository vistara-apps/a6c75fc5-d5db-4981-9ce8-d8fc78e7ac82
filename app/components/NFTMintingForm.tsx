'use client';

import { useState, useEffect } from 'react';
import { Upload, Coins, Zap, AlertCircle, CheckCircle, Wallet } from 'lucide-react';
import { NFT_TYPES } from '@/lib/constants';
import { NFTService } from '@/lib/nft';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface NFTMintingFormProps {
  variant?: 'simple' | 'advanced';
  projectId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  onMint?: (nftData: any) => void;
}

export function NFTMintingForm({
  variant = 'simple',
  projectId,
  videoUrl,
  thumbnailUrl,
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
  const [estimatedCost, setEstimatedCost] = useState<{
    gasCost: string;
    platformFee: string;
    total: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Estimate minting cost on component mount
    const estimateCost = async () => {
      try {
        const cost = await NFTService.estimateMintingCost();
        setEstimatedCost(cost);
      } catch (error) {
        console.error('Error estimating cost:', error);
      }
    };

    estimateCost();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
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

  const handleConnectWallet = () => {
    connect({ connector: injected() });
  };

  const handleMint = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    // Validate form data
    const validation = NFTService.validateNFTData({
      name: formData.name,
      description: formData.description,
      imageUrl: thumbnailUrl,
      videoUrl: videoUrl,
      attributes: formData.attributes,
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsMinting(true);
    setMintStatus('idle');

    try {
      // Generate metadata
      const metadata = NFTService.generateMetadata(
        formData.name,
        formData.description,
        thumbnailUrl || '',
        videoUrl,
        formData.attributes,
        formData.unlockableContent,
        address
      );

      // Create NFT
      const nftResult = await NFTService.createNFT(
        projectId || 'default',
        metadata,
        address,
        formData.price || undefined
      );

      const nftData = {
        ...formData,
        ...nftResult,
        projectId,
        mintedAt: new Date(),
        ownerAddress: address,
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

      {/* Wallet Connection */}
      {!isConnected ? (
        <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-text-secondary" />
            <span className="text-sm text-text-secondary">Connect your wallet to mint NFTs</span>
          </div>
          <button
            onClick={handleConnectWallet}
            className="px-4 py-2 bg-accent text-bg rounded-lg hover:bg-accent-secondary transition-colors text-sm font-medium"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-400">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
          <button
            onClick={() => disconnect()}
            className="text-xs text-text-secondary hover:text-fg"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Cost Estimation */}
      {estimatedCost && (
        <div className="p-4 bg-surface border border-border rounded-lg">
          <h4 className="text-sm font-medium text-fg mb-2">Estimated Cost</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Gas Fee:</span>
              <span className="text-fg">{estimatedCost.gasCost} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Platform Fee:</span>
              <span className="text-fg">{estimatedCost.platformFee} ETH</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-fg">Total:</span>
              <span className="text-accent">{estimatedCost.total} ETH</span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Please fix the following errors:</span>
          </div>
          <ul className="text-sm text-red-400 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

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
        {!isConnected ? (
          <button
            onClick={handleConnectWallet}
            className="cyber-button flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet to Mint</span>
          </button>
        ) : (
          <button
            onClick={handleMint}
            disabled={isMinting || !formData.name || validationErrors.length > 0}
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
        )}
      </div>
    </div>
  );
}
