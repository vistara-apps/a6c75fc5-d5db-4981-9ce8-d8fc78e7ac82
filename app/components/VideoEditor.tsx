'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Type,
  Image as ImageIcon,
  Palette,
  Music,
  Save,
  Download,
  Eye,
  Settings,
  X,
  Plus,
  Trash2,
  Move,
  RotateCcw
} from 'lucide-react';
import { VideoService, VideoCustomization, TextOverlay, MediaReplacement } from '@/lib/video';
import { Template } from '@/lib/database';

interface VideoEditorProps {
  template: Template;
  onSave?: (customizations: VideoCustomization) => void;
  onGenerate?: (customizations: VideoCustomization) => void;
  initialCustomizations?: Partial<VideoCustomization>;
}

export function VideoEditor({
  template,
  onSave,
  onGenerate,
  initialCustomizations
}: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [customizations, setCustomizations] = useState<VideoCustomization>(
    initialCustomizations ? { ...VideoService.getDefaultCustomizations(), ...initialCustomizations }
    : VideoService.getDefaultCustomizations()
  );
  const [activeTab, setActiveTab] = useState<'text' | 'media' | 'colors' | 'audio'>('text');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: `text_${Date.now()}`,
      text: 'Your Text Here',
      font: 'Arial',
      size: 48,
      color: '#ffffff',
      position: { x: 50, y: 50 },
      animation: 'none',
    };

    setCustomizations(prev => ({
      ...prev,
      textOverlays: [...prev.textOverlays, newOverlay],
    }));
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setCustomizations(prev => ({
      ...prev,
      textOverlays: prev.textOverlays.map(overlay =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      ),
    }));
  };

  const removeTextOverlay = (id: string) => {
    setCustomizations(prev => ({
      ...prev,
      textOverlays: prev.textOverlays.filter(overlay => overlay.id !== id),
    }));
  };

  const addMediaReplacement = () => {
    const newReplacement: MediaReplacement = {
      id: `media_${Date.now()}`,
      originalAssetId: '',
      newAssetUrl: '',
      type: 'image',
    };

    setCustomizations(prev => ({
      ...prev,
      mediaReplacements: [...prev.mediaReplacements, newReplacement],
    }));
  };

  const updateMediaReplacement = (id: string, updates: Partial<MediaReplacement>) => {
    setCustomizations(prev => ({
      ...prev,
      mediaReplacements: prev.mediaReplacements.map(replacement =>
        replacement.id === id ? { ...replacement, ...updates } : replacement
      ),
    }));
  };

  const removeMediaReplacement = (id: string) => {
    setCustomizations(prev => ({
      ...prev,
      mediaReplacements: prev.mediaReplacements.filter(replacement => replacement.id !== id),
    }));
  };

  const updateColorAdjustment = (property: keyof VideoCustomization['colorAdjustments'], value: number) => {
    setCustomizations(prev => ({
      ...prev,
      colorAdjustments: {
        ...prev.colorAdjustments,
        [property]: value,
      },
    }));
  };

  const updateAudioSettings = (updates: Partial<VideoCustomization['audioSettings']>) => {
    setCustomizations(prev => ({
      ...prev,
      audioSettings: {
        ...prev.audioSettings,
        ...updates,
      },
    }));
  };

  const handlePreview = async () => {
    try {
      const preview = await VideoService.getVideoPreview(template.templateId, customizations);
      setPreviewUrl(preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      if (onGenerate) {
        onGenerate(customizations);
      }
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(customizations);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fg">Video Editor</h2>
          <p className="text-text-secondary">Customize your {template.name}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg text-fg hover:border-accent transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg text-fg hover:border-accent transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="cyber-button flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{generating ? 'Generating...' : 'Generate Video'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-4">
            <div className="aspect-video bg-surface rounded-lg overflow-hidden relative">
              <video
                ref={videoRef}
                src={template.previewUrl}
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Text Overlays */}
              {customizations.textOverlays.map((overlay) => (
                <div
                  key={overlay.id}
                  className="absolute text-overlay"
                  style={{
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    fontSize: `${overlay.size}px`,
                    color: overlay.color,
                    fontFamily: overlay.font,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  }}
                >
                  {overlay.text}
                </div>
              ))}
            </div>

            {/* Video Controls */}
            <div className="mt-4 space-y-3">
              {/* Progress Bar */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-text-secondary mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                  className="p-2 text-text-secondary hover:text-fg transition-colors"
                >
                  <SkipBack className="h-5 w-5" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-accent text-bg rounded-full hover:bg-accent-secondary transition-colors"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                <button
                  onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                  className="p-2 text-text-secondary hover:text-fg transition-colors"
                >
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex space-x-1 bg-surface border border-border rounded-lg p-1">
            {[
              { id: 'text', label: 'Text', icon: Type },
              { id: 'media', label: 'Media', icon: ImageIcon },
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'audio', label: 'Audio', icon: Music },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-bg'
                    : 'text-text-secondary hover:text-fg'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass-card p-4 max-h-96 overflow-y-auto">
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-fg">Text Overlays</h3>
                  <button
                    onClick={addTextOverlay}
                    className="p-2 bg-accent text-bg rounded-lg hover:bg-accent-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {customizations.textOverlays.length === 0 ? (
                  <p className="text-text-secondary text-sm">No text overlays added yet</p>
                ) : (
                  <div className="space-y-3">
                    {customizations.textOverlays.map((overlay) => (
                      <div key={overlay.id} className="border border-border rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-fg">Text Overlay</span>
                          <button
                            onClick={() => removeTextOverlay(overlay.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Text
                            </label>
                            <input
                              type="text"
                              value={overlay.text}
                              onChange={(e) => updateTextOverlay(overlay.id, { text: e.target.value })}
                              className="w-full bg-surface border border-border rounded px-2 py-1 text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Font Size
                            </label>
                            <input
                              type="number"
                              value={overlay.size}
                              onChange={(e) => updateTextOverlay(overlay.id, { size: parseInt(e.target.value) })}
                              min="12"
                              max="200"
                              className="w-full bg-surface border border-border rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">
                            Color
                          </label>
                          <input
                            type="color"
                            value={overlay.color}
                            onChange={(e) => updateTextOverlay(overlay.id, { color: e.target.value })}
                            className="w-full h-8 bg-surface border border-border rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-fg">Media Replacements</h3>
                  <button
                    onClick={addMediaReplacement}
                    className="p-2 bg-accent text-bg rounded-lg hover:bg-accent-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {customizations.mediaReplacements.length === 0 ? (
                  <p className="text-text-secondary text-sm">No media replacements added yet</p>
                ) : (
                  <div className="space-y-3">
                    {customizations.mediaReplacements.map((replacement) => (
                      <div key={replacement.id} className="border border-border rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-fg">Media Replacement</span>
                          <button
                            onClick={() => removeMediaReplacement(replacement.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-text-secondary mb-1">
                            Asset URL
                          </label>
                          <input
                            type="url"
                            value={replacement.newAssetUrl}
                            onChange={(e) => updateMediaReplacement(replacement.id, { newAssetUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-surface border border-border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-fg">Color Adjustments</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Brightness: {customizations.colorAdjustments.brightness}
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={customizations.colorAdjustments.brightness}
                      onChange={(e) => updateColorAdjustment('brightness', parseInt(e.target.value))}
                      className="w-full slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Contrast: {customizations.colorAdjustments.contrast.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={customizations.colorAdjustments.contrast}
                      onChange={(e) => updateColorAdjustment('contrast', parseFloat(e.target.value))}
                      className="w-full slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Saturation: {customizations.colorAdjustments.saturation.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={customizations.colorAdjustments.saturation}
                      onChange={(e) => updateColorAdjustment('saturation', parseFloat(e.target.value))}
                      className="w-full slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Hue: {customizations.colorAdjustments.hue}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={customizations.colorAdjustments.hue}
                      onChange={(e) => updateColorAdjustment('hue', parseInt(e.target.value))}
                      className="w-full slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-fg">Audio Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Volume: {Math.round(customizations.audioSettings.volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={customizations.audioSettings.volume}
                      onChange={(e) => updateAudioSettings({ volume: parseFloat(e.target.value) })}
                      className="w-full slider"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Background Music URL
                    </label>
                    <input
                      type="url"
                      value={customizations.audioSettings.backgroundMusic || ''}
                      onChange={(e) => updateAudioSettings({ backgroundMusic: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Voiceover URL
                    </label>
                    <input
                      type="url"
                      value={customizations.audioSettings.voiceover || ''}
                      onChange={(e) => updateAudioSettings({ voiceover: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-surface border border-border rounded px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="max-w-4xl w-full glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-fg">Video Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-text-secondary hover:text-fg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video bg-surface rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

