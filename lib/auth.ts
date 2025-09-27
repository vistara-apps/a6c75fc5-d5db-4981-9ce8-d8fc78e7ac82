import { db } from './database';
import { NextRequest } from 'next/server';

export interface AuthenticatedUser {
  userId: string;
  walletAddress: string;
  subscriptionTier: 'free' | 'creator' | 'pro';
  totalVideosCreated: number;
  totalEarnings: number;
}

export class AuthService {
  static async authenticateWallet(walletAddress: string): Promise<AuthenticatedUser | null> {
    try {
      // Get or create user
      let user = await db.getUser(walletAddress);

      if (!user) {
        // Create new user if doesn't exist
        user = await db.createUser({
          userId: walletAddress,
          walletAddress,
          subscriptionTier: 'free',
        });
      }

      return {
        userId: user.userId,
        walletAddress: user.walletAddress,
        subscriptionTier: user.subscriptionTier,
        totalVideosCreated: user.totalVideosCreated,
        totalEarnings: user.totalEarnings,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  static async getCurrentUser(walletAddress: string): Promise<AuthenticatedUser | null> {
    try {
      const user = await db.getUser(walletAddress);
      if (!user) return null;

      return {
        userId: user.userId,
        walletAddress: user.walletAddress,
        subscriptionTier: user.subscriptionTier,
        totalVideosCreated: user.totalVideosCreated,
        totalEarnings: user.totalEarnings,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async requireAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
    try {
      // Extract wallet address from headers or query params
      const walletAddress = request.headers.get('x-wallet-address') ||
                           request.nextUrl.searchParams.get('walletAddress');

      if (!walletAddress) {
        return null;
      }

      return await this.authenticateWallet(walletAddress);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return null;
    }
  }

  static async checkSubscriptionLimits(
    user: AuthenticatedUser,
    action: 'video_creation' | 'nft_minting' | 'premium_template'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const limits = {
      free: {
        video_creation: 3, // per month
        nft_minting: false,
        premium_template: false,
      },
      creator: {
        video_creation: -1, // unlimited
        nft_minting: true,
        premium_template: true,
      },
      pro: {
        video_creation: -1, // unlimited
        nft_minting: true,
        premium_template: true,
      },
    };

    const userLimits = limits[user.subscriptionTier];

    if (action === 'nft_minting' && !userLimits.nft_minting) {
      return { allowed: false, reason: 'NFT minting requires Creator or Pro subscription' };
    }

    if (action === 'premium_template' && !userLimits.premium_template) {
      return { allowed: false, reason: 'Premium templates require Creator or Pro subscription' };
    }

    if (action === 'video_creation' && userLimits.video_creation !== -1) {
      // Check monthly video creation limit
      const projects = await db.getUserProjects(user.userId);
      const monthlyProjects = projects.filter(project => {
        const projectDate = new Date(project.createdAt);
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return projectDate >= oneMonthAgo;
      });

      if (monthlyProjects.length >= userLimits.video_creation) {
        return {
          allowed: false,
          reason: `Monthly video limit (${userLimits.video_creation}) reached. Upgrade to unlock unlimited videos.`
        };
      }
    }

    return { allowed: true };
  }

  static async updateUserStats(walletAddress: string, stats: {
    videosCreated?: number;
    earnings?: number;
  }): Promise<void> {
    try {
      const updates: any = {};

      if (stats.videosCreated) {
        updates.totalVideosCreated = stats.videosCreated;
      }

      if (stats.earnings) {
        updates.totalEarnings = stats.earnings;
      }

      await db.updateUser(walletAddress, updates);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
}

