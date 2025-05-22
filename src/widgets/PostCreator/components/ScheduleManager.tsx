import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useScheduleManager from '../hooks/useScheduleManager';
import { SocialPlatform } from '../types';

interface StyledProps {
  selected?: boolean;
  platform?: SocialPlatform;
}

interface TabProps {
  active?: boolean;
}

interface PlatformCardProps {
  selected?: boolean;
}

interface DatePresetProps {
  selected?: boolean;
}

interface ToggleProps {
  checked?: boolean;
}

interface PreviewItemProps {
  platform: SocialPlatform;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 100%;
  overflow: auto;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
    color: #424242;
  }
  
  p {
    margin: 8px 0 0;
    font-size: 14px;
    color: #757575;
  }
`;

const CalendarSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const DateTimeSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  
  input {
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    flex: 1;
    
    &:focus {
      outline: none;
      border-color: #bbdefb;
    }
  }
`;

const TimezoneSelector = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #616161;
  }
  
  select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    
    &:focus {
      outline: none;
      border-color: #bbdefb;
    }
  }
`;

const PlatformsSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #424242;
  }
`;

const PlatformList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
`;

const PlatformButton = styled.button<StyledProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid ${(props: StyledProps) => props.selected ? getPlatformColor(props.platform) : '#e0e0e0'};
  border-radius: 8px;
  background-color: ${(props: StyledProps) => props.selected ? `${getPlatformColor(props.platform)}10` : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 90px;
  
  &:hover {
    background-color: ${(props: StyledProps) => props.selected ? `${getPlatformColor(props.platform)}20` : '#f5f5f5'};
  }
  
  .platform-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: ${(props: StyledProps) => getPlatformColor(props.platform)};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    font-size: 18px;
  }
  
  .platform-name {
    font-size: 14px;
    color: #424242;
    font-weight: ${(props: StyledProps) => props.selected ? '500' : 'normal'};
  }
`;

const PlatformSettings = styled.div`
  margin-top: 20px;
  
  h5 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 500;
    color: #424242;
  }
`;

const PlatformSettingsTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
`;

const Tab = styled.button<TabProps>`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props: TabProps) => props.active ? '#1976d2' : 'transparent'};
  color: ${(props: TabProps) => props.active ? '#1976d2' : '#757575'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #1976d2;
  }
`;

const SettingsPanel = styled.div`
  .setting-group {
    margin-bottom: 16px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #616161;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #bbdefb;
      }
    }
    
    .tag-input {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
      
      .tag {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: #e3f2fd;
        color: #1976d2;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        
        button {
          background: none;
          border: none;
          color: #1976d2;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          font-size: 14px;
          
          &:hover {
            color: #d32f2f;
          }
        }
      }
      
      input {
        border: none;
        flex: 1;
        min-width: 120px;
        padding: 4px;
        
        &:focus {
          outline: none;
        }
      }
    }
  }
`;

const ScheduleActions = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
`;

const ScheduleButton = styled.button<{ primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${(props: { primary?: boolean }) => props.primary ? '#1976d2' : '#f5f5f5'};
  color: ${(props: { primary?: boolean }) => props.primary ? 'white' : '#424242'};
  box-shadow: ${(props: { primary?: boolean }) => props.primary ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    background-color: ${(props: { primary?: boolean }) => props.primary ? '#1565c0' : '#e0e0e0'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptimizationTip = styled.div`
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  padding: 12px;
  margin: 12px 0;
  font-size: 13px;
  color: #424242;
  
  strong {
    color: #2e7d32;
  }
`;

const PreviewSection = styled.div<StyledProps>`
  padding: 16px;
  
  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #424242;
  }
  
  .preview-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    
    .preview-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
      
      .platform-icon {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        background-color: ${(props: StyledProps) => getPlatformColor(props.platform)};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }
    
    .preview-content {
      padding: 12px;
      
      .profile {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #e0e0e0;
        }
        
        .name {
          font-weight: 500;
          font-size: 14px;
        }
      }
      
      .post-text {
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .post-media {
        background-color: #f5f5f5;
        height: 200px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9e9e9e;
      }
    }
  }
`;

// Helper function to get platform color
function getPlatformColor(platform?: SocialPlatform): string {
  if (!platform) return '#757575';
  
  switch (platform) {
    case 'instagram': return '#e1306c';
    case 'facebook': return '#1877f2';
    case 'twitter': return '#1da1f2';
    case 'linkedin': return '#0a66c2';
    case 'pinterest': return '#e60023';
    case 'youtube': return '#ff0000';
    case 'timeline': return '#757575';
    default: return '#757575';
  }
}

// Helper function to get platform icon
function getPlatformIcon(platform: SocialPlatform): string {
  switch (platform) {
    case 'instagram': return 'IG';
    case 'facebook': return 'FB';
    case 'twitter': return 'TW';
    case 'linkedin': return 'LI';
    case 'pinterest': return 'PT';
    case 'youtube': return 'YT';
    case 'timeline': return 'TL';
    default: return '';
  }
}

interface ScheduleManagerProps {
  postId?: string;
  schedulePost?: (data: any) => Promise<void>;
  getOptimalTimes?: (platforms: SocialPlatform[]) => Promise<Record<SocialPlatform, string>>;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ postId, schedulePost, getOptimalTimes }) => {
  const { schedulePost: schedulePostHook, getOptimalTimes: getOptimalTimesHook } = useScheduleManager();
  
  // State for scheduling
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [activePlatform, setActivePlatform] = useState<SocialPlatform | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');
  const [platformSettings, setPlatformSettings] = useState<Record<SocialPlatform, any>>({
    facebook: {
      customText: '',
      hashtags: [],
      audiences: []
    },
    instagram: {
      customText: '',
      hashtags: [],
      filter: 'normal'
    },
    twitter: {
      customText: '',
      hashtags: []
    },
    linkedin: {
      customText: '',
      hashtags: [],
      visibility: 'public'
    },
    pinterest: {
      customText: '',
      hashtags: [],
      board: 'default'
    },
    youtube: {
      customText: '',
      hashtags: [],
      privacy: 'public'
    },
    timeline: {
      customText: '',
      hashtags: []
    }
  });
  
  // Available platforms
  const platforms: SocialPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'youtube', 'timeline'];
  
  // Mock data for available timezones
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];
  
  // Handle platform toggle
  const togglePlatform = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      if (activePlatform === platform) {
        setActivePlatform(selectedPlatforms.length > 1 ? 
          selectedPlatforms.filter(p => p !== platform)[0] : null);
      }
    } else {
      const newSelected = [...selectedPlatforms, platform];
      setSelectedPlatforms(newSelected);
      if (!activePlatform) {
        setActivePlatform(platform);
      }
    }
  };
  
  // Handle platform settings change
  const updatePlatformSetting = (platform: SocialPlatform, key: string, value: any) => {
    setPlatformSettings({
      ...platformSettings,
      [platform]: {
        ...platformSettings[platform],
        [key]: value
      }
    });
  };
  
  // Handle scheduling
  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime || selectedPlatforms.length === 0) {
      return;
    }
    
    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    schedulePostHook(postId || '', dateTime, selectedPlatforms, platformSettings);
  };
  
  // Get optimal posting times
  const handleGetOptimalTimes = async () => {
    if (!activePlatform) return;
    
    const optimalTime = await getOptimalTimesHook(activePlatform);
    if (optimalTime) {
      const date = new Date(optimalTime);
      setScheduledDate(date.toISOString().split('T')[0]);
      setScheduledTime(date.toISOString().split('T')[1].substring(0, 5));
    }
  };
  
  // Platform-specific optimization tips
  const getPlatformTip = (platform: SocialPlatform): string => {
    switch (platform) {
      case 'facebook':
        return 'Posts with images get 2.3x more engagement. Optimal post length is 40-80 characters.';
      case 'instagram':
        return 'Posts with at least 11 hashtags perform best. Square images (1:1) typically get more engagement.';
      case 'twitter':
        return 'Tweets with GIFs get 55% more engagement. Keep hashtags to 1-2 for best results.';
      case 'youtube':
        return 'Videos around 7-15 minutes perform best. Include keywords in your title and description.';
      case 'linkedin':
        return 'Posts with images get 2x more engagement. Optimal post length is 40-80 characters.';
      case 'pinterest':
        return 'Posts with images get 2x more engagement. Optimal post length is 40-80 characters.';
      case 'timeline':
        return 'Customize your content for each platform for best engagement.';
      default:
        return 'Customize your content for each platform for best engagement.';
    }
  };
  
  return (
    <Container>
      <Header>
        <h3>Schedule Post</h3>
        <p>Choose when and where to publish your content</p>
      </Header>
      
      <CalendarSection>
        <h4>Select Date & Time</h4>
        <DateTimeSelector>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </DateTimeSelector>
        
        <TimezoneSelector>
          <label>Timezone</label>
          <select 
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace('_', ' ')}
              </option>
            ))}
          </select>
        </TimezoneSelector>
      </CalendarSection>
      
      <PlatformsSection>
        <h4>Select Platforms</h4>
        <PlatformList>
          {platforms.map((platform) => (
            <PlatformButton
              key={platform}
              platform={platform}
              selected={selectedPlatforms.includes(platform)}
              onClick={() => togglePlatform(platform)}
            >
              <div className="platform-icon">
                {getPlatformIcon(platform)}
              </div>
              <div className="platform-name">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </div>
            </PlatformButton>
          ))}
        </PlatformList>
        
        {selectedPlatforms.length > 0 && activePlatform && (
          <PlatformSettings>
            <h5>Platform-Specific Settings</h5>
            <PlatformSettingsTabs>
              {selectedPlatforms.map((platform) => (
                <Tab
                  key={platform}
                  active={activePlatform === platform}
                  onClick={() => setActivePlatform(platform)}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Tab>
              ))}
            </PlatformSettingsTabs>
            
            {activePlatform && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <button 
                    onClick={() => setActiveTab('content')}
                    style={{ fontWeight: activeTab === 'content' ? 'bold' : 'normal', marginRight: '12px' }}
                  >
                    Content
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    style={{ fontWeight: activeTab === 'settings' ? 'bold' : 'normal' }}
                  >
                    Settings
                  </button>
                </div>
                
                <SettingsPanel>
                  {activeTab === 'content' && (
                    <>
                      <OptimizationTip>
                        <strong>Tip:</strong> {getPlatformTip(activePlatform)}
                      </OptimizationTip>
                      
                      <div className="setting-group">
                        <label>Platform-Specific Text</label>
                        <textarea
                          value={platformSettings[activePlatform].customText}
                          onChange={(e) => updatePlatformSetting(activePlatform, 'customText', e.target.value)}
                          placeholder={`Customize your post text for ${activePlatform}...`}
                        />
                      </div>
                      
                      <div className="setting-group">
                        <label>Hashtags</label>
                        <div className="tag-input">
                          {platformSettings[activePlatform].hashtags.map((tag: string, index: number) => (
                            <div className="tag" key={index}>
                              {tag}
                              <button 
                                onClick={() => {
                                  const newTags = [...platformSettings[activePlatform].hashtags];
                                  newTags.splice(index, 1);
                                  updatePlatformSetting(activePlatform, 'hashtags', newTags);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <input
                            value={platformSettings[activePlatform].newHashtag || ''}
                            onChange={(e) => updatePlatformSetting(activePlatform, 'newHashtag', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && platformSettings[activePlatform].newHashtag.trim()) {
                                e.preventDefault();
                                const newTag = platformSettings[activePlatform].newHashtag.trim().startsWith('#') ? platformSettings[activePlatform].newHashtag.trim() : `#${platformSettings[activePlatform].newHashtag.trim()}`;
                                updatePlatformSetting(
                                  activePlatform, 
                                  'hashtags', 
                                  [...platformSettings[activePlatform].hashtags, newTag]
                                );
                                updatePlatformSetting(activePlatform, 'newHashtag', '');
                              }
                            }}
                            placeholder="Add hashtag (press Enter)"
                          />
                        </div>
                      </div>
                      
                      {activePlatform === 'instagram' && (
                        <div className="setting-group">
                          <label>Filter</label>
                          <select
                            value={platformSettings.instagram.filter}
                            onChange={(e) => updatePlatformSetting('instagram', 'filter', e.target.value)}
                          >
                            <option value="normal">Normal</option>
                            <option value="clarendon">Clarendon</option>
                            <option value="gingham">Gingham</option>
                            <option value="moon">Moon</option>
                            <option value="lark">Lark</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}
                  
                  {activeTab === 'settings' && (
                    <>
                      {activePlatform === 'facebook' && (
                        <div className="setting-group">
                          <label>Target Audience</label>
                          <select
                            value={platformSettings.facebook.audience || ''}
                            onChange={(e) => updatePlatformSetting('facebook', 'audience', e.target.value)}
                          >
                            <option value="">All Followers</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="18-24">Ages 18-24</option>
                            <option value="25-34">Ages 25-34</option>
                            <option value="35-44">Ages 35-44</option>
                            <option value="45+">Ages 45+</option>
                          </select>
                        </div>
                      )}
                      
                      {activePlatform === 'youtube' && (
                        <div className="setting-group">
                          <label>Privacy</label>
                          <select
                            value={platformSettings.youtube.privacy}
                            onChange={(e) => updatePlatformSetting('youtube', 'privacy', e.target.value)}
                          >
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="setting-group">
                        <button onClick={handleGetOptimalTimes}>
                          Find Optimal Posting Time
                        </button>
                        <p style={{ fontSize: '13px', color: '#757575', marginTop: '8px' }}>
                          Uses AI to analyze engagement patterns and suggest the best time to post.
                        </p>
                      </div>
                    </>
                  )}
                </SettingsPanel>
              </>
            )}
          </PlatformSettings>
        )}
      </PlatformsSection>
      
      {activePlatform && (
        <PreviewSection platform={activePlatform}>
          <h4>Preview</h4>
          <div className="preview-container">
            <div className="preview-header">
              <div className="platform-icon">
                {getPlatformIcon(activePlatform)}
              </div>
              <div>{activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} Preview</div>
            </div>
            <div className="preview-content">
              <div className="profile">
                <div className="avatar"></div>
                <div className="name">Your Page Name</div>
              </div>
              <div className="post-text">
                {platformSettings[activePlatform].customText || 'Your post content will appear here...'}
                {platformSettings[activePlatform].hashtags.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    {platformSettings[activePlatform].hashtags.join(' ')}
                  </div>
                )}
              </div>
              <div className="post-media">
                Post media preview
              </div>
            </div>
          </div>
        </PreviewSection>
      )}
      
      <ScheduleActions>
        <ScheduleButton>
          Save as Draft
        </ScheduleButton>
        <ScheduleButton 
          primary 
          onClick={handleSchedule}
          disabled={!scheduledDate || !scheduledTime || selectedPlatforms.length === 0}
        >
          Schedule Post
        </ScheduleButton>
      </ScheduleActions>
    </Container>
  );
};

export default ScheduleManager;
