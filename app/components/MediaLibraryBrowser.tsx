'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Image as ImageIcon,
  Video,
  Music,
  Zap,
  Grid3X3,
  List,
  X,
  Plus,
  Upload
} from 'lucide-react';
import { MediaService } from '@/lib/media';
import { MediaAsset } from '@/lib/database';

interface MediaLibraryBrowserProps {
  variant?: 'grid' | 'list';
  onSelectAsset?: (asset: MediaAsset) => void;
  selectedAssets?: string[];
  maxSelection?: number;
  filterByType?: 'image' | 'video' | 'audio' | 'graphic';
}

export function MediaLibraryBrowser({
  variant = 'grid',
  onSelectAsset,
  selectedAssets = [],
  maxSelection = 1,
  filterByType
}: MediaLibraryBrowserProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [stockAssets, setStockAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(variant);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Assets', icon: Grid3X3 },
    { id: 'backgrounds', name: 'Backgrounds', icon: ImageIcon },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'effects', name: 'Effects', icon: Zap },
    { id: 'graphics', name: 'Graphics', icon: ImageIcon },
    { id: 'footage', name: 'Footage', icon: Video },
  ];

  useEffect(() => {
    loadMediaAssets();
  }, [selectedCategory, filterByType]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchStockMedia();
    }
  }, [searchQuery]);

  const loadMediaAssets = async () => {
    setLoading(true);
    try {
      let mediaAssets: MediaAsset[] = [];

      if (selectedCategory === 'all') {
        mediaAssets = await MediaService.getCuratedMediaAssets();
      } else {
        mediaAssets = await MediaService.getMediaByCategory(selectedCategory);
      }

      // Filter by type if specified
      if (filterByType) {
        mediaAssets = mediaAssets.filter(asset => asset.type === filterByType);
      }

      setAssets(mediaAssets);
    } catch (error) {
      console.error('Error loading media assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchStockMedia = async () => {
    try {
      const stockResults = await MediaService.searchStockImages(searchQuery, 1, 12);
      setStockAssets(stockResults);
    } catch (error) {
      console.error('Error searching stock media:', error);
    }
  };

  const handleAssetSelect = (asset: MediaAsset) => {
    if (onSelectAsset) {
      if (maxSelection === 1) {
        onSelectAsset(asset);
      } else if (selectedAssets.length < maxSelection && !selectedAssets.includes(asset.mediaAssetId)) {
        onSelectAsset(asset);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // In a real implementation, this would upload to IPFS/cloud storage
      // For now, we'll simulate it
      const tags = ['uploaded', file.type.split('/')[0]];
      const uploadedAsset = await MediaService.uploadMediaAsset(file, 'current-user', tags);

      if (uploadedAsset) {
        setAssets(prev => [uploadedAsset, ...prev]);
        setShowUpload(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const renderAssetCard = (asset: MediaAsset | any, isStock: boolean = false) => {
    const isSelected = selectedAssets.includes(asset.mediaAssetId || asset.id);
    const canSelect = maxSelection === 1 || selectedAssets.length < maxSelection;

    return (
      <div
        key={asset.mediaAssetId || asset.id}
        className={`glass-card p-4 hover:border-accent transition-all duration-200 cursor-pointer group ${
          isSelected ? 'border-accent bg-accent bg-opacity-10' : ''
        } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => canSelect && handleAssetSelect(asset)}
      >
        <div className="aspect-video bg-surface rounded-lg mb-3 overflow-hidden relative">
          {asset.type === 'image' || asset.type === 'graphic' ? (
            <img
              src={asset.thumbnailUrl || asset.url}
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : asset.type === 'video' ? (
            <video
              src={asset.thumbnailUrl || asset.url}
              className="w-full h-full object-cover"
              muted
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent bg-opacity-20">
              <Music className="h-8 w-8 text-accent" />
            </div>
          )}

          {isStock && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Stock
            </div>
          )}

          {isSelected && (
            <div className="absolute inset-0 bg-accent bg-opacity-20 flex items-center justify-center">
              <div className="bg-accent text-bg rounded-full p-2">
                <Download className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-fg text-sm truncate">{asset.name}</h4>
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="capitalize">{asset.type}</span>
            {!isStock && asset.usageCount && (
              <span>{asset.usageCount} uses</span>
            )}
          </div>

          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {asset.tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-surface px-2 py-1 rounded text-text-secondary"
                >
                  {tag}
                </span>
              ))}
              {asset.tags.length > 2 && (
                <span className="text-xs text-text-secondary">
                  +{asset.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fg">Media Library</h2>
          <p className="text-text-secondary">Browse royalty-free assets for your videos</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg text-fg hover:border-accent transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>

          <div className="flex items-center space-x-1 bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-bg' : 'text-text-secondary hover:text-fg'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent text-bg' : 'text-text-secondary hover:text-fg'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search stock photos, videos, music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-fg focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-accent text-bg'
                  : 'bg-surface text-text-secondary hover:text-fg hover:border-accent border border-transparent'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Stock Results */}
          {searchQuery.length > 2 && stockAssets.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-fg mb-4">Stock Results</h3>
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {stockAssets.map((asset) => renderAssetCard(asset, true))}
              </div>
            </div>
          )}

          {/* Curated Assets */}
          <div>
            <h3 className="text-lg font-semibold text-fg mb-4">
              {selectedCategory === 'all' ? 'Popular Assets' : `${categories.find(c => c.id === selectedCategory)?.name}`}
            </h3>

            {assets.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No assets found in this category</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {assets.map((asset) => renderAssetCard(asset))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="max-w-md w-full glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-fg">Upload Media</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-text-secondary hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent file:text-bg hover:file:bg-accent-secondary"
                />
              </div>

              {uploading && (
                <div className="flex items-center space-x-2 text-accent">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

