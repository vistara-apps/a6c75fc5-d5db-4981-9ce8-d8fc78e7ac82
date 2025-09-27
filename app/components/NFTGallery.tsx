'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Copy, Share2, Eye, Coins } from 'lucide-react';
import { NFT } from '@/lib/database';

interface NFTGalleryProps {
  walletAddress?: string;
  projectId?: string;
  onNFTSelect?: (nft: NFT) => void;
}

export function NFTGallery({ walletAddress, projectId, onNFTSelect }: NFTGalleryProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  useEffect(() => {
    loadNFTs();
  }, [walletAddress, projectId]);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      let nftList: NFT[] = [];

      if (walletAddress) {
        // Load user's NFTs
        const response = await fetch(`/api/nfts?walletAddress=${walletAddress}`);
        if (response.ok) {
          const data = await response.json();
          nftList = data.nfts || [];
        }
      } else if (projectId) {
        // Load project NFTs
        const response = await fetch(`/api/nfts?projectId=${projectId}`);
        if (response.ok) {
          const data = await response.json();
          nftList = data.nfts || [];
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft);
    onNFTSelect?.(nft);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getOpenSeaUrl = (contractAddress: string, tokenId: string) => {
    // Base Sepolia OpenSea URL
    return `https://testnets.opensea.io/assets/base_sepolia/${contractAddress}/${tokenId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <Coins className="h-12 w-12 text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fg mb-2">No NFTs Found</h3>
        <p className="text-text-secondary">
          {walletAddress ? 'You haven\'t minted any NFTs yet.' : 'No NFTs found for this project.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fg">NFT Gallery</h2>
          <p className="text-text-secondary">
            {walletAddress ? 'Your minted NFTs' : 'Project NFTs'}
          </p>
        </div>
        <div className="text-sm text-text-secondary">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.nftId}
            className="glass-card p-4 hover:border-accent transition-all duration-200 cursor-pointer group"
            onClick={() => handleNFTClick(nft)}
          >
            {/* NFT Preview */}
            <div className="aspect-square bg-surface rounded-lg mb-4 overflow-hidden relative">
              {nft.type === 'video' ? (
                <video
                  src={nft.metadataUrl} // This would be the video URL from metadata
                  className="w-full h-full object-cover"
                  muted
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                  <Coins className="h-12 w-12 text-bg" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            {/* NFT Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-fg text-sm truncate">
                {nft.nftId}
              </h3>
              <p className="text-xs text-text-secondary">
                Token ID: {nft.tokenId}
              </p>
              <p className="text-xs text-text-secondary">
                {new Date(nft.mintedAt).toLocaleDateString()}
              </p>

              {nft.price && (
                <p className="text-xs text-accent font-medium">
                  {nft.price} ETH
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(getOpenSeaUrl(nft.contractAddress, nft.tokenId), '_blank');
                }}
                className="flex items-center space-x-1 text-xs text-accent hover:text-accent-secondary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>View</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(`${window.location.origin}/nft/${nft.nftId}`);
                }}
                className="flex items-center space-x-1 text-xs text-text-secondary hover:text-fg transition-colors"
              >
                <Share2 className="h-3 w-3" />
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="max-w-2xl w-full glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-fg">NFT Details</h3>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-text-secondary hover:text-fg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NFT Preview */}
              <div className="aspect-square bg-surface rounded-lg overflow-hidden">
                {selectedNFT.type === 'video' ? (
                  <video
                    src={selectedNFT.metadataUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                    <Coins className="h-16 w-16 text-bg" />
                  </div>
                )}
              </div>

              {/* NFT Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-fg mb-2">Token #{selectedNFT.tokenId}</h4>
                  <p className="text-sm text-text-secondary">
                    Contract: {selectedNFT.contractAddress.slice(0, 6)}...{selectedNFT.contractAddress.slice(-4)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Owner:</span>
                    <span className="text-fg font-mono text-xs">
                      {selectedNFT.ownerWalletAddress.slice(0, 6)}...{selectedNFT.ownerWalletAddress.slice(-4)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Minted:</span>
                    <span className="text-fg">
                      {new Date(selectedNFT.mintedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {selectedNFT.price && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Price:</span>
                      <span className="text-accent font-medium">
                        {selectedNFT.price} ETH
                      </span>
                    </div>
                  )}

                  {selectedNFT.royalty && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Royalty:</span>
                      <span className="text-fg">{selectedNFT.royalty}%</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => window.open(getOpenSeaUrl(selectedNFT.contractAddress, selectedNFT.tokenId), '_blank')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-bg rounded-lg hover:bg-accent-secondary transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View on OpenSea</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/nft/${selectedNFT.nftId}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg text-fg hover:border-accent transition-colors text-sm"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Transaction Hash */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Transaction:</span>
                    <button
                      onClick={() => copyToClipboard(selectedNFT.transactionHash)}
                      className="text-xs text-accent hover:text-accent-secondary font-mono"
                    >
                      {selectedNFT.transactionHash.slice(0, 10)}...{selectedNFT.transactionHash.slice(-8)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

