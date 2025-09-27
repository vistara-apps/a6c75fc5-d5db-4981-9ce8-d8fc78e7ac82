import { db } from './database';

export interface VideoCustomization {
  textOverlays: TextOverlay[];
  mediaReplacements: MediaReplacement[];
  colorAdjustments: ColorAdjustment;
  audioSettings: AudioSettings;
}

export interface TextOverlay {
  id: string;
  text: string;
  font: string;
  size: number;
  color: string;
  position: { x: number; y: number };
  animation?: 'fade' | 'slide' | 'bounce' | 'none';
  duration?: number;
}

export interface MediaReplacement {
  id: string;
  originalAssetId: string;
  newAssetUrl: string;
  type: 'image' | 'video';
}

export interface ColorAdjustment {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
}

export interface AudioSettings {
  volume: number;
  backgroundMusic?: string;
  voiceover?: string;
}

export class VideoService {
  static async customizeTemplate(
    templateId: string,
    customizations: VideoCustomization,
    userId: string
  ): Promise<string> {
    try {
      // In a real implementation, this would:
      // 1. Load the template configuration
      // 2. Apply customizations using a video processing library (FFmpeg, etc.)
      // 3. Generate the customized video
      // 4. Upload to IPFS/cloud storage
      // 5. Return the URL

      // For now, we'll simulate this process
      const customizationId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Return a mock video URL
      return `/videos/customized/${customizationId}.mp4`;
    } catch (error) {
      console.error('Error customizing template:', error);
      throw new Error('Video customization failed');
    }
  }

  static async generateVideoFromTemplate(
    templateId: string,
    customizations: VideoCustomization,
    userId: string
  ): Promise<{ videoUrl: string; thumbnailUrl: string; duration: number }> {
    try {
      const videoUrl = await this.customizeTemplate(templateId, customizations, userId);

      // Create project record
      const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db.createProject({
        projectId,
        userId,
        templateId,
        title: `Custom Video ${new Date().toLocaleDateString()}`,
        status: 'completed',
        mediaAssets: customizations.mediaReplacements.map(r => r.newAssetUrl),
        customizations,
        videoUrl,
        thumbnailUrl: videoUrl.replace('.mp4', '_thumb.jpg'),
      });

      // Update user stats
      const user = await db.getUser(userId);
      if (user) {
        await db.updateUser(userId, {
          totalVideosCreated: user.totalVideosCreated + 1,
        });
      }

      return {
        videoUrl,
        thumbnailUrl: videoUrl.replace('.mp4', '_thumb.jpg'),
        duration: 30, // Mock duration
      };
    } catch (error) {
      console.error('Error generating video:', error);
      throw new Error('Video generation failed');
    }
  }

  static async getVideoPreview(
    templateId: string,
    customizations: Partial<VideoCustomization>
  ): Promise<string> {
    try {
      // Generate a preview URL for the customized template
      const previewId = `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return `/previews/${previewId}.mp4`;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw new Error('Preview generation failed');
    }
  }

  static validateCustomizations(
    template: any,
    customizations: VideoCustomization
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate text overlays
    customizations.textOverlays.forEach((overlay, index) => {
      if (!overlay.text.trim()) {
        errors.push(`Text overlay ${index + 1}: Text cannot be empty`);
      }
      if (overlay.size < 12 || overlay.size > 200) {
        errors.push(`Text overlay ${index + 1}: Font size must be between 12 and 200`);
      }
    });

    // Validate media replacements
    customizations.mediaReplacements.forEach((replacement, index) => {
      if (!replacement.newAssetUrl) {
        errors.push(`Media replacement ${index + 1}: Asset URL is required`);
      }
    });

    // Validate color adjustments
    const { brightness, contrast, saturation, hue } = customizations.colorAdjustments;
    if (brightness < -100 || brightness > 100) {
      errors.push('Brightness must be between -100 and 100');
    }
    if (contrast < 0.5 || contrast > 2) {
      errors.push('Contrast must be between 0.5 and 2');
    }
    if (saturation < 0 || saturation > 2) {
      errors.push('Saturation must be between 0 and 2');
    }
    if (hue < -180 || hue > 180) {
      errors.push('Hue must be between -180 and 180');
    }

    // Validate audio settings
    if (customizations.audioSettings.volume < 0 || customizations.audioSettings.volume > 2) {
      errors.push('Volume must be between 0 and 2');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static getDefaultCustomizations(): VideoCustomization {
    return {
      textOverlays: [],
      mediaReplacements: [],
      colorAdjustments: {
        brightness: 0,
        contrast: 1,
        saturation: 1,
        hue: 0,
      },
      audioSettings: {
        volume: 1,
      },
    };
  }
}

