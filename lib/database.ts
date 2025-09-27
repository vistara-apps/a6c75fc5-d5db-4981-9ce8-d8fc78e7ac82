import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Database schema types
export interface User {
  userId: string;
  walletAddress: string;
  email?: string;
  subscriptionTier: 'free' | 'creator' | 'pro';
  createdAt: Date;
  updatedAt: Date;
  totalVideosCreated: number;
  totalEarnings: number;
}

export interface Project {
  projectId: string;
  userId: string;
  templateId: string;
  title: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  mediaAssets: string[];
  customizations: Record<string, any>;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  templateId: string;
  name: string;
  description: string;
  previewUrl: string;
  thumbnailUrl: string;
  category: string;
  customizableFields: CustomizableField[];
  isPremium: boolean;
  usageCount: number;
  createdAt: Date;
}

export interface CustomizableField {
  id: string;
  type: 'text' | 'image' | 'color' | 'font' | 'duration';
  label: string;
  defaultValue: any;
  constraints?: Record<string, any>;
}

export interface NFT {
  nftId: string;
  projectId: string;
  tokenId: string;
  contractAddress: string;
  ownerWalletAddress: string;
  mintedAt: Date;
  metadataUrl: string;
  type: 'video' | 'collectible' | 'access';
  price?: string;
  royalty?: number;
  transactionHash: string;
}

export interface MediaAsset {
  mediaAssetId: string;
  name: string;
  url: string;
  type: 'video' | 'audio' | 'image' | 'graphic';
  licensingInfo: string;
  tags: string[];
  isPremium: boolean;
  uploadedBy?: string;
  usageCount: number;
  createdAt: Date;
}

// Database operations
export class Database {
  private static instance: Database;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // User operations
  async createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const userData: User = {
      ...user,
      createdAt: now,
      updatedAt: now,
      totalVideosCreated: 0,
      totalEarnings: 0,
    };

    await this.redis.hset(`user:${user.userId}`, userData);
    await this.redis.sadd('users', user.userId);

    return userData;
  }

  async getUser(userId: string): Promise<User | null> {
    const user = await this.redis.hgetall(`user:${userId}`);
    if (!user || Object.keys(user).length === 0) return null;

    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    } as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    await this.redis.hset(`user:${userId}`, updatedUser);
    return updatedUser;
  }

  // Project operations
  async createProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date();
    const projectData: Project = {
      ...project,
      createdAt: now,
      updatedAt: now,
    };

    await this.redis.hset(`project:${project.projectId}`, projectData);
    await this.redis.sadd(`user:${project.userId}:projects`, project.projectId);

    return projectData;
  }

  async getProject(projectId: string): Promise<Project | null> {
    const project = await this.redis.hgetall(`project:${projectId}`);
    if (!project || Object.keys(project).length === 0) return null;

    return {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    } as Project;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    const projectIds = await this.redis.smembers(`user:${userId}:projects`);
    const projects: Project[] = [];

    for (const projectId of projectIds) {
      const project = await this.getProject(projectId);
      if (project) projects.push(project);
    }

    return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    const project = await this.getProject(projectId);
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };

    await this.redis.hset(`project:${projectId}`, updatedProject);
    return updatedProject;
  }

  // Template operations
  async createTemplate(template: Omit<Template, 'createdAt'>): Promise<Template> {
    const templateData: Template = {
      ...template,
      createdAt: new Date(),
      usageCount: 0,
    };

    await this.redis.hset(`template:${template.templateId}`, templateData);
    await this.redis.sadd('templates', template.templateId);
    await this.redis.sadd(`templates:${template.category}`, template.templateId);

    return templateData;
  }

  async getTemplate(templateId: string): Promise<Template | null> {
    const template = await this.redis.hgetall(`template:${templateId}`);
    if (!template || Object.keys(template).length === 0) return null;

    return {
      ...template,
      createdAt: new Date(template.createdAt),
    } as Template;
  }

  async getTemplates(category?: string): Promise<Template[]> {
    const templateIds = category
      ? await this.redis.smembers(`templates:${category}`)
      : await this.redis.smembers('templates');

    const templates: Template[] = [];

    for (const templateId of templateIds) {
      const template = await this.getTemplate(templateId);
      if (template) templates.push(template);
    }

    return templates;
  }

  async incrementTemplateUsage(templateId: string): Promise<void> {
    await this.redis.hincrby(`template:${templateId}`, 'usageCount', 1);
  }

  // NFT operations
  async createNFT(nft: Omit<NFT, 'nftId'>): Promise<NFT> {
    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const nftData: NFT = {
      ...nft,
      nftId,
    };

    await this.redis.hset(`nft:${nftId}`, nftData);
    await this.redis.sadd(`project:${nft.projectId}:nfts`, nftId);
    await this.redis.sadd(`user:${nft.ownerWalletAddress}:nfts`, nftId);

    return nftData;
  }

  async getNFT(nftId: string): Promise<NFT | null> {
    const nft = await this.redis.hgetall(`nft:${nftId}`);
    if (!nft || Object.keys(nft).length === 0) return null;

    return {
      ...nft,
      mintedAt: new Date(nft.mintedAt),
    } as NFT;
  }

  async getProjectNFTs(projectId: string): Promise<NFT[]> {
    const nftIds = await this.redis.smembers(`project:${projectId}:nfts`);
    const nfts: NFT[] = [];

    for (const nftId of nftIds) {
      const nft = await this.getNFT(nftId);
      if (nft) nfts.push(nft);
    }

    return nfts.sort((a, b) => b.mintedAt.getTime() - a.mintedAt.getTime());
  }

  async getUserNFTs(walletAddress: string): Promise<NFT[]> {
    const nftIds = await this.redis.smembers(`user:${walletAddress}:nfts`);
    const nfts: NFT[] = [];

    for (const nftId of nftIds) {
      const nft = await this.getNFT(nftId);
      if (nft) nfts.push(nft);
    }

    return nfts.sort((a, b) => b.mintedAt.getTime() - a.mintedAt.getTime());
  }

  // Media asset operations
  async createMediaAsset(asset: Omit<MediaAsset, 'createdAt'>): Promise<MediaAsset> {
    const assetData: MediaAsset = {
      ...asset,
      createdAt: new Date(),
      usageCount: 0,
    };

    await this.redis.hset(`media:${asset.mediaAssetId}`, assetData);
    await this.redis.sadd('media_assets', asset.mediaAssetId);

    for (const tag of asset.tags) {
      await this.redis.sadd(`media_tags:${tag}`, asset.mediaAssetId);
    }

    return assetData;
  }

  async getMediaAsset(mediaAssetId: string): Promise<MediaAsset | null> {
    const asset = await this.redis.hgetall(`media:${mediaAssetId}`);
    if (!asset || Object.keys(asset).length === 0) return null;

    return {
      ...asset,
      createdAt: new Date(asset.createdAt),
    } as MediaAsset;
  }

  async getMediaAssets(type?: string, tags?: string[]): Promise<MediaAsset[]> {
    let assetIds: string[];

    if (tags && tags.length > 0) {
      // Get intersection of all tag sets
      const tagSets = tags.map(tag => `media_tags:${tag}`);
      assetIds = await this.redis.sinter(...tagSets);
    } else {
      assetIds = await this.redis.smembers('media_assets');
    }

    const assets: MediaAsset[] = [];

    for (const assetId of assetIds) {
      const asset = await this.getMediaAsset(assetId);
      if (asset && (!type || asset.type === type)) {
        assets.push(asset);
      }
    }

    return assets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async incrementMediaUsage(mediaAssetId: string): Promise<void> {
    await this.redis.hincrby(`media:${mediaAssetId}`, 'usageCount', 1);
  }

  // Utility methods
  async searchMediaAssets(query: string, type?: string): Promise<MediaAsset[]> {
    const allAssets = await this.getMediaAssets(type);
    const lowerQuery = query.toLowerCase();

    return allAssets.filter(asset =>
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getPopularTemplates(limit: number = 10): Promise<Template[]> {
    const templates = await this.getTemplates();
    return templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  async getPopularMediaAssets(limit: number = 20): Promise<MediaAsset[]> {
    const assets = await this.getMediaAssets();
    return assets
      .filter(asset => !asset.isPremium)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }
}

// Export singleton instance
export const db = Database.getInstance();

