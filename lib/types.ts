export interface User {
  userId: string;
  walletAddress: string;
  email?: string;
  subscriptionTier: 'free' | 'creator' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  projectId: string;
  userId: string;
  templateId: string;
  title: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  mediaAssets: string[];
  customizations: Record<string, any>;
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
}

export interface MediaAsset {
  mediaAssetId: string;
  name: string;
  url: string;
  type: 'video' | 'audio' | 'image' | 'graphic';
  licensingInfo: string;
  tags: string[];
  isPremium: boolean;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    videosPerMonth: number;
    templatesAccess: 'basic' | 'premium' | 'all';
    nftMinting: boolean;
    prioritySupport: boolean;
  };
}
