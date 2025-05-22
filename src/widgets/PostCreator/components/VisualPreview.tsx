import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInstagram, faFacebook, faTwitter, faLinkedin, faPinterest, faTiktok 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faHeart, faComment, faBookmark, faShare, faEllipsisH,
  faCheckCircle, faAngleRight, faAngleLeft
} from '@fortawesome/free-solid-svg-icons';

// Types
interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'carousel';
  url: string;
  thumbnailUrl?: string;
}

interface PostPreviewProps {
  title: string;
  content: string;
  mediaItems: MediaItem[];
  platforms: string[];
  onBack?: () => void;
  onNext?: () => void;
}

// Styled components for platform previews
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5, #ffffff);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const PlatformTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
`;

const PlatformTab = styled(motion.button)<{ active: boolean, platform: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 30px;
  border: none;
  background: ${(props: { active: boolean, platform: string }) => props.active ? getPlatformColor(props.platform) : 'white'};
  color: ${(props: { active: boolean, platform: string }) => props.active ? 'white' : getPlatformColor(props.platform)};
  box-shadow: ${(props: { active: boolean, platform: string }) => props.active 
    ? `0 4px 12px ${getPlatformColor(props.platform)}66` 
    : '0 2px 5px rgba(0,0,0,0.05)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props: { active: boolean, platform: string }) => props.active 
      ? `0 6px 14px ${getPlatformColor(props.platform)}66` 
      : '0 4px 8px rgba(0,0,0,0.1)'};
  }
`;

const PreviewDeviceContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  perspective: 1000px;
`;

const MobileDevice = styled(motion.div)`
  width: 280px;
  height: 560px;
  border-radius: 36px;
  background: #111;
  padding: 12px;
  box-shadow: 
    0 50px 100px rgba(0, 0, 0, 0.25),
    0 10px 30px rgba(0, 0, 0, 0.22),
    inset 0 0 0 2px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
`;

const DeviceScreen = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: white;
  position: relative;
`;

const PreviewContent = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

// Instagram specific components
const InstagramHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 14px;
  }
  
  .username {
    font-weight: 600;
    font-size: 14px;
  }
  
  .verified {
    color: #3897f0;
    margin-left: 4px;
  }
  
  .more {
    margin-left: auto;
    color: #262626;
  }
`;

const MediaCarousel = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #eee;
  overflow: hidden;
`;

const MediaContent = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const CarouselNavigation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  pointer-events: none;
  
  button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;
    pointer-events: auto;
    
    &:hover {
      background: white;
    }
  }
`;

const CarouselIndicators = styled.div`
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 4px;
  
  .indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    
    &.active {
      background: white;
    }
  }
`;

const InstagramActions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  
  .primary-actions {
    display: flex;
    gap: 16px;
    
    .icon {
      font-size: 24px;
      color: #262626;
    }
  }
  
  .secondary-actions {
    display: flex;
    gap: 16px;
    
    .icon {
      font-size: 24px;
      color: #262626;
    }
  }
`;

const InstagramLikes = styled.div`
  padding: 0 12px;
  font-weight: 600;
  font-size: 14px;
`;

const InstagramCaption = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  
  .username {
    font-weight: 600;
    margin-right: 4px;
  }
  
  .caption {
    font-weight: 400;
  }
`;

// Facebook specific components
const FacebookHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #4267B2;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
  }
  
  .details {
    display: flex;
    flex-direction: column;
    
    .name {
      font-weight: 600;
      font-size: 14px;
    }
    
    .time {
      font-size: 12px;
      color: #65676B;
    }
  }
  
  .more {
    margin-left: auto;
    color: #65676B;
  }
`;

const FacebookContent = styled.div`
  padding: 8px 12px 16px 12px;
  font-size: 15px;
  line-height: 1.35;
`;

const FacebookActions = styled.div`
  display: flex;
  border-top: 1px solid #CCD0D5;
  border-bottom: 1px solid #CCD0D5;
  padding: 0;
  
  .action {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    color: #65676B;
    font-size: 13px;
    font-weight: 600;
    gap: 8px;
    
    &:hover {
      background: #F2F3F5;
    }
  }
`;

// Twitter specific components
const TwitterHeader = styled.div`
  display: flex;
  padding: 12px;
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1DA1F2;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 18px;
  }
  
  .details {
    display: flex;
    flex-direction: column;
    
    .name-container {
      display: flex;
      align-items: center;
      
      .name {
        font-weight: 700;
        font-size: 14px;
      }
      
      .verified {
        color: #1DA1F2;
        margin-left: 4px;
      }
    }
    
    .username {
      font-size: 13px;
      color: #536471;
    }
  }
  
  .more {
    margin-left: auto;
    color: #536471;
  }
`;

const TwitterContent = styled.div`
  padding: 0 12px 12px 72px;
  font-size: 15px;
  line-height: 1.4;
  margin-top: -12px;
`;

const TwitterActions = styled.div`
  display: flex;
  padding: 0 12px 12px 72px;
  justify-content: space-between;
  
  .action {
    color: #536471;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

// Function to get platform color
function getPlatformColor(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '#E1306C';
    case 'facebook':
      return '#4267B2';
    case 'twitter':
      return '#1DA1F2';
    case 'linkedin':
      return '#0077B5';
    case 'pinterest':
      return '#E60023';
    case 'tiktok':
      return '#000000';
    default:
      return '#777777';
  }
}

// Function to get platform icon
function getPlatformIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return faInstagram;
    case 'facebook':
      return faFacebook;
    case 'twitter':
      return faTwitter;
    case 'linkedin':
      return faLinkedin;
    case 'pinterest':
      return faPinterest;
    case 'tiktok':
      return faTiktok;
    default:
      return faInstagram;
  }
}

// Main component
const VisualPreview: React.FC<PostPreviewProps> = ({ 
  title, 
  content, 
  mediaItems, 
  platforms,
  onBack,
  onNext
}) => {
  const [activePlatform, setActivePlatform] = useState<string>(platforms[0] || 'instagram');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  // Animation variants
  const deviceVariants = {
    initial: { rotateY: 90, opacity: 0 },
    animate: { 
      rotateY: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        delay: 0.2
      } 
    },
    exit: { 
      rotateY: -90, 
      opacity: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20 
      } 
    }
  };
  
  const mediaVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };
  
  const [swipeDirection, setSwipeDirection] = useState(0);
  
  // Navigate through media items
  const nextMedia = () => {
    if (currentMediaIndex < mediaItems.length - 1) {
      setSwipeDirection(1);
      setCurrentMediaIndex(prev => prev + 1);
    }
  };
  
  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setSwipeDirection(-1);
      setCurrentMediaIndex(prev => prev - 1);
    }
  };
  
  // Render Instagram preview
  const renderInstagramPreview = () => (
    <PreviewContent>
      <InstagramHeader>
        <div className="avatar">U</div>
        <span className="username">username</span>
        <FontAwesomeIcon icon={faCheckCircle} className="verified" />
        <FontAwesomeIcon icon={faEllipsisH} className="more" />
      </InstagramHeader>
      
      <MediaCarousel>
        <AnimatePresence mode='wait' custom={swipeDirection}>
          {mediaItems.length > 0 && (
            <MediaContent
              key={currentMediaIndex}
              custom={swipeDirection}
              variants={mediaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ 
                backgroundImage: `url(${mediaItems[currentMediaIndex]?.url || ''})` 
              }}
            />
          )}
        </AnimatePresence>
        
        {mediaItems.length > 1 && (
          <>
            <CarouselNavigation>
              <button onClick={prevMedia} disabled={currentMediaIndex === 0}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
              <button onClick={nextMedia} disabled={currentMediaIndex === mediaItems.length - 1}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </CarouselNavigation>
            
            <CarouselIndicators>
              {mediaItems.map((_, index) => (
                <div 
                  key={index} 
                  className={`indicator ${index === currentMediaIndex ? 'active' : ''}`} 
                />
              ))}
            </CarouselIndicators>
          </>
        )}
      </MediaCarousel>
      
      <InstagramActions>
        <div className="primary-actions">
          <FontAwesomeIcon icon={faHeart} className="icon" />
          <FontAwesomeIcon icon={faComment} className="icon" />
          <FontAwesomeIcon icon={faShare} className="icon" />
        </div>
        <div className="secondary-actions">
          <FontAwesomeIcon icon={faBookmark} className="icon" />
        </div>
      </InstagramActions>
      
      <InstagramLikes>
        1,234 likes
      </InstagramLikes>
      
      <InstagramCaption>
        <span className="username">username</span>
        <span className="caption">
          {title || content || 'Your caption will appear here'}
        </span>
      </InstagramCaption>
    </PreviewContent>
  );
  
  // Render Facebook preview
  const renderFacebookPreview = () => (
    <PreviewContent>
      <FacebookHeader>
        <div className="avatar">U</div>
        <div className="details">
          <span className="name">Your Page Name</span>
          <span className="time">Just now · 👥</span>
        </div>
        <FontAwesomeIcon icon={faEllipsisH} className="more" />
      </FacebookHeader>
      
      <FacebookContent>
        {title || content || 'Your Facebook post text will appear here'}
      </FacebookContent>
      
      {mediaItems.length > 0 && (
        <MediaCarousel>
          <AnimatePresence mode='wait' custom={swipeDirection}>
            <MediaContent
              key={currentMediaIndex}
              custom={swipeDirection}
              variants={mediaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ 
                backgroundImage: `url(${mediaItems[currentMediaIndex]?.url || ''})` 
              }}
            />
          </AnimatePresence>
          
          {mediaItems.length > 1 && (
            <>
              <CarouselNavigation>
                <button onClick={prevMedia} disabled={currentMediaIndex === 0}>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button onClick={nextMedia} disabled={currentMediaIndex === mediaItems.length - 1}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </CarouselNavigation>
            </>
          )}
        </MediaCarousel>
      )}
      
      <FacebookActions>
        <div className="action">
          <FontAwesomeIcon icon={faHeart} />
          <span>Like</span>
        </div>
        <div className="action">
          <FontAwesomeIcon icon={faComment} />
          <span>Comment</span>
        </div>
        <div className="action">
          <FontAwesomeIcon icon={faShare} />
          <span>Share</span>
        </div>
      </FacebookActions>
    </PreviewContent>
  );
  
  // Render Twitter preview
  const renderTwitterPreview = () => (
    <PreviewContent>
      <TwitterHeader>
        <div className="avatar">U</div>
        <div className="details">
          <div className="name-container">
            <span className="name">Your Name</span>
            <FontAwesomeIcon icon={faCheckCircle} className="verified" />
          </div>
          <span className="username">@username</span>
        </div>
        <FontAwesomeIcon icon={faEllipsisH} className="more" />
      </TwitterHeader>
      
      <TwitterContent>
        {title || content || 'Your tweet will appear here'}
      </TwitterContent>
      
      {mediaItems.length > 0 && (
        <MediaCarousel style={{ borderRadius: '16px', margin: '0 12px 0 72px', width: 'calc(100% - 84px)' }}>
          <AnimatePresence mode='wait' custom={swipeDirection}>
            <MediaContent
              key={currentMediaIndex}
              custom={swipeDirection}
              variants={mediaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ 
                backgroundImage: `url(${mediaItems[currentMediaIndex]?.url || ''})` 
              }}
            />
          </AnimatePresence>
          
          {mediaItems.length > 1 && (
            <>
              <CarouselNavigation>
                <button onClick={prevMedia} disabled={currentMediaIndex === 0}>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button onClick={nextMedia} disabled={currentMediaIndex === mediaItems.length - 1}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </CarouselNavigation>
            </>
          )}
        </MediaCarousel>
      )}
      
      <TwitterActions>
        <div className="action">
          <FontAwesomeIcon icon={faComment} />
          <span>34</span>
        </div>
        <div className="action">
          <FontAwesomeIcon icon={faShare} />
          <span>124</span>
        </div>
        <div className="action">
          <FontAwesomeIcon icon={faHeart} />
          <span>1.2K</span>
        </div>
        <div className="action">
          <FontAwesomeIcon icon={faBookmark} />
        </div>
      </TwitterActions>
    </PreviewContent>
  );
  
  // Render the active platform preview
  const renderActivePlatformPreview = () => {
    switch (activePlatform.toLowerCase()) {
      case 'instagram':
        return renderInstagramPreview();
      case 'facebook':
        return renderFacebookPreview();
      case 'twitter':
        return renderTwitterPreview();
      default:
        return renderInstagramPreview();
    }
  };
  
  return (
    <PreviewContainer>
      <PlatformTabs>
        {platforms.map(platform => (
          <PlatformTab
            key={platform}
            active={activePlatform === platform}
            platform={platform}
            onClick={() => setActivePlatform(platform)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1, scale: 0.98 }}
          >
            <FontAwesomeIcon icon={getPlatformIcon(platform)} />
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </PlatformTab>
        ))}
      </PlatformTabs>
      
      <PreviewDeviceContainer>
        <AnimatePresence mode='wait'>
          <MobileDevice
            key={activePlatform}
            variants={deviceVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DeviceScreen>
              {renderActivePlatformPreview()}
            </DeviceScreen>
          </MobileDevice>
        </AnimatePresence>
      </PreviewDeviceContainer>
    </PreviewContainer>
  );
};

export default VisualPreview;
