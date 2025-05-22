import { useCallback, useState } from 'react';
import { usePostCreator } from '../context/PostCreatorContext';
import { SocialPlatform, PostSchedule } from '../types';

/**
 * Custom hook for managing post scheduling
 */
export const useScheduleManager = () => {
  const postCreator = usePostCreator();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['timeline']);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [platformSettings, setPlatformSettings] = useState<Record<SocialPlatform, { 
    audiences: string[],
    customText: string,
    hashtags: string[]
  }>>({
    timeline: { audiences: [], customText: '', hashtags: [] },
    facebook: { audiences: [], customText: '', hashtags: [] },
    instagram: { audiences: [], customText: '', hashtags: [] },
    twitter: { audiences: [], customText: '', hashtags: [] },
    youtube: { audiences: [], customText: '', hashtags: [] },
    linkedin: { audiences: [], customText: '', hashtags: [] },
    pinterest: { audiences: [], customText: '', hashtags: [] }
  });

  /**
   * Toggle a platform selection
   */
  const togglePlatform = useCallback((platform: SocialPlatform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  }, []);

  /**
   * Update platform-specific settings
   */
  const updatePlatformSettings = useCallback((platform: SocialPlatform, settings: any) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        ...settings
      }
    }));
  }, []);

  /**
   * Create a schedule for the current post
   */
  const scheduleCurrentPost = useCallback(async () => {
    if (!postCreator.currentPost) return null;
    
    try {
      // Filter to only include settings for selected platforms
      const filteredSettings: Record<string, any> = {};
      selectedPlatforms.forEach(platform => {
        filteredSettings[platform] = platformSettings[platform];
      });
      
      // Create schedule data
      const scheduleData: Omit<PostSchedule, 'id'> = {
        scheduledFor: scheduledDate.toISOString(),
        timezone,
        platforms: selectedPlatforms,
        platformSpecificSettings: filteredSettings
      };
      
      // Schedule the post
      const schedule = await postCreator.actions.schedulePost(postCreator.currentPost.id, scheduleData);
      return schedule;
    } catch (error) {
      console.error('Failed to schedule post:', error);
      return null;
    }
  }, [
    postCreator.currentPost, 
    postCreator.actions, 
    selectedPlatforms, 
    scheduledDate, 
    timezone, 
    platformSettings
  ]);

  /**
   * Calculate the next available scheduling slot
   */
  const suggestNextAvailableSlot = useCallback(() => {
    // This would typically involve checking the database for existing scheduled posts
    // and finding the next available slot. For now, we'll suggest a time 24 hours from now.
    const suggestedDate = new Date();
    suggestedDate.setDate(suggestedDate.getDate() + 1);
    suggestedDate.setMinutes(0);
    suggestedDate.setSeconds(0);
    suggestedDate.setMilliseconds(0);
    
    return suggestedDate;
  }, []);

  /**
   * Set a scheduled date from a suggestion
   */
  const useScheduleSuggestion = useCallback(() => {
    const suggestedDate = suggestNextAvailableSlot();
    setScheduledDate(suggestedDate);
  }, [suggestNextAvailableSlot]);

  /**
   * Get platform icon
   */
  const getPlatformIcon = useCallback((platform: SocialPlatform): string => {
    const icons: Record<SocialPlatform, string> = {
      timeline: '🕒',
      facebook: 'facebook',
      instagram: 'instagram',
      twitter: 'twitter',
      youtube: 'youtube',
      linkedin: 'linkedin',
      pinterest: 'pinterest'
    };
    return icons[platform] || '📱';
  }, []);

  /**
   * Get platform name
   */
  const getPlatformName = useCallback((platform: SocialPlatform): string => {
    const names: Record<SocialPlatform, string> = {
      timeline: 'Timeline',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'X (Twitter)',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      pinterest: 'Pinterest'
    };
    return names[platform] || platform;
  }, []);

  /**
   * Format schedule time for display
   */
  const formatScheduleTime = useCallback((date: Date, userTimezone?: string): string => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: userTimezone || timezone
    });
  }, [timezone]);

  /**
   * Get common timezones for selection
   */
  const getCommonTimezones = useCallback(() => {
    return [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Australia/Sydney'
    ];
  }, []);

  /**
   * Initialize from existing schedule
   */
  const initFromExistingSchedule = useCallback(() => {
    if (!postCreator.currentPost?.schedule) return;
    
    const schedule = postCreator.currentPost.schedule;
    setSelectedPlatforms(schedule.platforms);
    setScheduledDate(new Date(schedule.scheduledFor));
    setTimezone(schedule.timezone);
    
    // Initialize platform settings from existing schedule
    const newSettings = { ...platformSettings };
    Object.entries(schedule.platformSpecificSettings).forEach(([platform, settings]) => {
      if (isPlatform(platform)) {
        newSettings[platform] = settings as any;
      }
    });
    setPlatformSettings(newSettings);
  }, [state.currentPost?.schedule, platformSettings]);

  // Type guard for platform
  const isPlatform = (platform: string): platform is SocialPlatform => {
    return ['timeline', 'facebook', 'instagram', 'twitter', 'youtube'].includes(platform);
  };

  return {
    selectedPlatforms,
    scheduledDate,
    timezone,
    platformSettings,
    togglePlatform,
    setScheduledDate,
    setTimezone,
    updatePlatformSettings,
    scheduleCurrentPost,
    suggestNextAvailableSlot,
    useScheduleSuggestion,
    getPlatformIcon,
    getPlatformName,
    formatScheduleTime,
    getCommonTimezones,
    initFromExistingSchedule,
    canSchedule: state.currentPost && state.isScheduleMode,
    hasExistingSchedule: !!state.currentPost?.schedule
  };
};

export default useScheduleManager;
