import { NFTContractService } from './contracts/nft';
import { db } from './database';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties?: {
    video_url?: string;
    creator_address?: string;
    unlockable_content?: string;
  };
}

export class NFTService {
  static async uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
    try {
      // In a real implementation, this would upload to IPFS
      // For now, we'll simulate it
      const metadataString = JSON.stringify(metadata);
      const mockIPFSHash = `ipfs://${btoa(metadataString).slice(0, 46)}`;

      return mockIPFSHash;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw new Error('IPFS upload failed');
    }
  }

  static async createNFT(
    projectId: string,
    metadata: NFTMetadata,
    recipientAddress: `0x${string}`,
    price?: string
  ): Promise<{
    nftId: string;
    tokenId: string;
    transactionHash: string;
    metadataUrl: string;
  }> {
    try {
      // Upload metadata to IPFS
      const metadataUrl = await this.uploadMetadataToIPFS(metadata);

      // Mint NFT on blockchain
      const { tokenId, transactionHash } = await NFTContractService.prototype.mintNFT(
        recipientAddress,
        metadataUrl,
        price
      );

      // Create NFT record in database
      const nft = await db.createNFT({
        projectId,
        tokenId,
        contractAddress: '0x1234567890123456789012345678901234567890', // Replace with actual contract
        ownerWalletAddress: recipientAddress,
        metadataUrl,
        type: metadata.animation_url ? 'video' : 'collectible',
        price,
        transactionHash,
      });

      return {
        nftId: nft.nftId,
        tokenId: nft.tokenId,
        transactionHash: nft.transactionHash,
        metadataUrl: nft.metadataUrl,
      };
    } catch (error) {
      console.error('Error creating NFT:', error);
      throw new Error('NFT creation failed');
    }
  }

  static async getNFTDetails(nftId: string): Promise<any> {
    try {
      const nft = await db.getNFT(nftId);
      if (!nft) {
        throw new Error('NFT not found');
      }

      // Get additional blockchain data
      const contractService = new NFTContractService();
      const owner = await contractService.getOwner(nft.tokenId);
      const tokenURI = await contractService.getTokenURI(nft.tokenId);

      return {
        ...nft,
        currentOwner: owner,
        tokenURI,
      };
    } catch (error) {
      console.error('Error getting NFT details:', error);
      throw new Error('Failed to get NFT details');
    }
  }

  static async transferNFT(
    nftId: string,
    fromAddress: `0x${string}`,
    toAddress: `0x${string}`
  ): Promise<string> {
    try {
      // In a real implementation, this would execute a transfer transaction
      // For now, we'll simulate it
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update database record
      await db.updateNFT(nftId, {
        ownerWalletAddress: toAddress,
      });

      return transactionHash;
    } catch (error) {
      console.error('Error transferring NFT:', error);
      throw new Error('NFT transfer failed');
    }
  }

  static generateMetadata(
    name: string,
    description: string,
    imageUrl: string,
    videoUrl?: string,
    attributes: Array<{ trait_type: string; value: string }> = [],
    unlockableContent?: string,
    creatorAddress?: string
  ): NFTMetadata {
    const metadata: NFTMetadata = {
      name,
      description,
      image: imageUrl,
      attributes,
    };

    if (videoUrl) {
      metadata.animation_url = videoUrl;
    }

    if (unlockableContent || creatorAddress) {
      metadata.properties = {};
      if (unlockableContent) {
        metadata.properties.unlockable_content = unlockableContent;
      }
      if (creatorAddress) {
        metadata.properties.creator_address = creatorAddress;
      }
    }

    return metadata;
  }

  static async estimateMintingCost(): Promise<{
    gasCost: string;
    platformFee: string;
    total: string;
  }> {
    try {
      const contractService = new NFTContractService();
      const gasCost = await contractService.estimateMintingCost();

      // Platform fee (2% of gas cost as example)
      const platformFee = (parseFloat(gasCost) * 0.02).toString();
      const total = (parseFloat(gasCost) + parseFloat(platformFee)).toString();

      return {
        gasCost,
        platformFee,
        total,
      };
    } catch (error) {
      console.error('Error estimating minting cost:', error);
      return {
        gasCost: '0.001',
        platformFee: '0.00002',
        total: '0.00102',
      };
    }
  }

  static validateNFTData(data: {
    name: string;
    description: string;
    imageUrl?: string;
    videoUrl?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!data.imageUrl && !data.videoUrl) {
      errors.push('Either image URL or video URL is required');
    }

    if (data.attributes) {
      data.attributes.forEach((attr, index) => {
        if (!attr.trait_type || !attr.value) {
          errors.push(`Attribute ${index + 1}: trait_type and value are required`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

