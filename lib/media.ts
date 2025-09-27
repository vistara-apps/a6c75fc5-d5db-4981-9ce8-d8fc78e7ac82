import { db, MediaAsset } from './database';

// Stock media sources (royalty-free)
export const STOCK_MEDIA_SOURCES = {
  unsplash: {
    baseUrl: 'https://api.unsplash.com',
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
  },
  pexels: {
    baseUrl: 'https://api.pexels.com/v1',
    accessKey: process.env.PEXELS_API_KEY,
  },
};

export class MediaService {
  static async searchStockImages(query: string, page: number = 1, perPage: number = 20): Promise<any[]> {
    try {
      const results: any[] = [];

      // Search Unsplash
      if (STOCK_MEDIA_SOURCES.unsplash.accessKey) {
        const unsplashResponse = await fetch(
          `${STOCK_MEDIA_SOURCES.unsplash.baseUrl}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${STOCK_MEDIA_SOURCES.unsplash.accessKey}`,
            },
          }
        );

        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json();
          results.push(...unsplashData.results.map((item: any) => ({
            id: `unsplash_${item.id}`,
            name: item.description || item.alt_description || `Unsplash Image ${item.id}`,
            url: item.urls.regular,
            thumbnailUrl: item.urls.thumb,
            type: 'image' as const,
            licensingInfo: 'Unsplash License (Free to use)',
            tags: item.tags?.map((tag: any) => tag.title) || [],
            isPremium: false,
            source: 'unsplash',
            width: item.width,
            height: item.height,
          })));
        }
      }

      // Search Pexels
      if (STOCK_MEDIA_SOURCES.pexels.accessKey) {
        const pexelsResponse = await fetch(
          `${STOCK_MEDIA_SOURCES.pexels.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`,
          {
            headers: {
              'Authorization': STOCK_MEDIA_SOURCES.pexels.accessKey,
            },
          }
        );

        if (pexelsResponse.ok) {
          const pexelsData = await pexelsResponse.json();
          results.push(...pexelsData.photos.map((item: any) => ({
            id: `pexels_${item.id}`,
            name: item.alt || `Pexels Image ${item.id}`,
            url: item.src.large,
            thumbnailUrl: item.src.medium,
            type: 'image' as const,
            licensingInfo: 'Pexels License (Free to use)',
            tags: [], // Pexels doesn't provide tags in search results
            isPremium: false,
            source: 'pexels',
            width: item.width,
            height: item.height,
          })));
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching stock images:', error);
      return [];
    }
  }

  static async getStockVideos(query: string, page: number = 1, perPage: number = 20): Promise<any[]> {
    try {
      const results: any[] = [];

      // Pexels videos
      if (STOCK_MEDIA_SOURCES.pexels.accessKey) {
        const pexelsResponse = await fetch(
          `${STOCK_MEDIA_SOURCES.pexels.baseUrl}/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
          {
            headers: {
              'Authorization': STOCK_MEDIA_SOURCES.pexels.accessKey,
            },
          }
        );

        if (pexelsResponse.ok) {
          const pexelsData = await pexelsResponse.json();
          results.push(...pexelsData.videos.map((item: any) => ({
            id: `pexels_video_${item.id}`,
            name: item.url.split('/').pop() || `Pexels Video ${item.id}`,
            url: item.video_files[0]?.link || '',
            thumbnailUrl: item.image,
            type: 'video' as const,
            licensingInfo: 'Pexels License (Free to use)',
            tags: [],
            isPremium: false,
            source: 'pexels',
            duration: item.duration,
            width: item.width,
            height: item.height,
          })));
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching stock videos:', error);
      return [];
    }
  }

  static async getCuratedMediaAssets(): Promise<MediaAsset[]> {
    try {
      // Get popular assets from database
      const popularAssets = await db.getPopularMediaAssets(50);

      // Add some curated stock assets if database is empty
      if (popularAssets.length < 10) {
        const curatedAssets: Omit<MediaAsset, 'createdAt'>[] = [
          {
            mediaAssetId: 'curated_bg_1',
            name: 'Cyberpunk City Background',
            url: '/media/cyberpunk-bg-1.jpg',
            type: 'image',
            licensingInfo: 'CreatorVerse Curated (Free to use)',
            tags: ['cyberpunk', 'city', 'background', 'urban'],
            isPremium: false,
            usageCount: 150,
          },
          {
            mediaAssetId: 'curated_bg_2',
            name: 'Neon Grid Background',
            url: '/media/neon-grid-bg.jpg',
            type: 'image',
            licensingInfo: 'CreatorVerse Curated (Free to use)',
            tags: ['neon', 'grid', 'background', 'tech'],
            isPremium: false,
            usageCount: 120,
          },
          {
            mediaAssetId: 'curated_music_1',
            name: 'Cyber Synth Beat',
            url: '/media/cyber-synth-beat.mp3',
            type: 'audio',
            licensingInfo: 'CreatorVerse Curated (Free to use)',
            tags: ['electronic', 'synth', 'cyberpunk', 'beats'],
            isPremium: false,
            usageCount: 200,
          },
          {
            mediaAssetId: 'curated_fx_1',
            name: 'Digital Glitch Effect',
            url: '/media/digital-glitch.mp4',
            type: 'video',
            licensingInfo: 'CreatorVerse Curated (Free to use)',
            tags: ['glitch', 'digital', 'effect', 'cyberpunk'],
            isPremium: false,
            usageCount: 80,
          },
        ];

        // Add curated assets to database if they don't exist
        for (const asset of curatedAssets) {
          const existing = await db.getMediaAsset(asset.mediaAssetId);
          if (!existing) {
            await db.createMediaAsset(asset);
          }
        }

        return [...popularAssets, ...curatedAssets] as MediaAsset[];
      }

      return popularAssets;
    } catch (error) {
      console.error('Error getting curated media assets:', error);
      return [];
    }
  }

  static async uploadMediaAsset(
    file: File,
    uploadedBy: string,
    tags: string[] = []
  ): Promise<MediaAsset | null> {
    try {
      // In a real implementation, you would upload to IPFS or cloud storage
      // For now, we'll simulate the upload
      const mediaAssetId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Determine file type
      const type = file.type.startsWith('image/') ? 'image' :
                  file.type.startsWith('video/') ? 'video' :
                  file.type.startsWith('audio/') ? 'audio' : 'graphic';

      const asset = await db.createMediaAsset({
        mediaAssetId,
        name: file.name,
        url: `/uploads/${mediaAssetId}_${file.name}`, // Simulated URL
        type,
        licensingInfo: 'User Uploaded',
        tags,
        isPremium: false,
        uploadedBy,
      });

      return asset;
    } catch (error) {
      console.error('Error uploading media asset:', error);
      return null;
    }
  }

  static async getMediaByCategory(category: string): Promise<MediaAsset[]> {
    try {
      const allAssets = await db.getMediaAssets();

      const categoryMappings: Record<string, string[]> = {
        backgrounds: ['background', 'bg', 'wallpaper'],
        music: ['music', 'audio', 'soundtrack', 'beats'],
        effects: ['effect', 'fx', 'transition', 'glitch'],
        graphics: ['graphic', 'icon', 'logo', 'text'],
        footage: ['footage', 'video', 'clip'],
      };

      const searchTags = categoryMappings[category] || [category];

      return allAssets.filter(asset =>
        searchTags.some(tag =>
          asset.tags.some(assetTag =>
            assetTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    } catch (error) {
      console.error('Error getting media by category:', error);
      return [];
    }
  }
}

