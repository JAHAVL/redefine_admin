import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faExpand, faCompress, faPlus, faShareAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

// Types for our component
interface Post {
  id: string;
  title: string;
  scheduledDate: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaType?: 'image' | 'video' | 'carousel';
  thumbnail?: string;
}

interface ImmersiveCalendarProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
  onDateClick: (date: Date) => void;
  onAddPost: (date: Date) => void;
}

// Platform colors
const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#4267B2',
  twitter: '#1DA1F2',
  linkedin: '#0077B5',
  pinterest: '#E60023',
  tiktok: '#000000'
};

// Styled components with advanced visual styling
const CalendarContainer = styled.div`
  width: 100%;
  background: linear-gradient(145deg, #f9f9f9, #ffffff);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  padding: 16px;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MonthTitle = styled(motion.h2)`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
  letter-spacing: -0.5px;
`;

const CalendarButton = styled.button`
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: #1976d2;
  }
`;

const CalendarTools = styled.div`
  display: flex;
  gap: 8px;
`;

const WeekdaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
`;

const Weekday = styled.div`
  font-weight: 500;
  color: #666;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
`;

const DaysGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 8px;
  height: 540px;
`;

interface DayCellProps {
  $inMonth: boolean;
  $isToday: boolean;
  $hasContent: boolean;
}

const DayCell = styled(motion.div)<DayCellProps>`
  position: relative;
  min-height: 80px;
  background: ${(props: DayCellProps) => props.$isToday ? 'linear-gradient(135deg, #f5f9ff, #e3f2fd)' : 'white'};
  border-radius: 10px;
  border: 1px solid ${(props: DayCellProps) => props.$isToday ? '#bbdefb' : '#eaeaea'};
  padding: 4px;
  cursor: pointer;
  box-shadow: ${(props: DayCellProps) => props.$hasContent ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.04)'};
  opacity: ${(props: DayCellProps) => props.$inMonth ? 1 : 0.4};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
    z-index: 10;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

interface DateNumberProps {
  $isToday: boolean;
}

const DateNumber = styled.div<DateNumberProps>`
  font-weight: ${(props: DateNumberProps) => props.$isToday ? '600' : '400'};
  color: ${(props: DateNumberProps) => props.$isToday ? '#1976d2' : '#333'};
  font-size: 14px;
  margin-bottom: 4px;
  text-align: right;
  padding: 2px 6px;
`;

interface PostItemProps {
  $platform: string;
  $status: string;
}

const PostItem = styled(motion.div)<PostItemProps>`
  font-size: 11px;
  padding: 4px 6px;
  margin-bottom: 4px;
  border-radius: 6px;
  background-color: #f8f9fa;
  border-left: 3px solid ${(props: PostItemProps) => 
    platformColors[props.$platform] || '#9e9e9e'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
  
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${(props: PostItemProps) => 
      props.$status === 'published' ? '#4caf50' : 
      props.$status === 'scheduled' ? '#ff9800' : 
      props.$status === 'failed' ? '#f44336' : '#9e9e9e'};
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  &:hover {
    transform: translateX(2px);
  }
`;

interface MediaIndicatorProps {
  $type: string;
}

const MediaIndicator = styled.div<MediaIndicatorProps>`
  width: 14px;
  height: 14px;
  margin-right: 4px;
  border-radius: ${(props: MediaIndicatorProps) => props.$type === 'carousel' ? '2px' : '50%'};
  background-color: #ffffff88;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #333;
  margin-left: 10px;
`;

const MorePostsIndicator = styled.div`
  font-size: 10px;
  color: #666;
  text-align: center;
  background: #f0f0f0;
  padding: 2px;
  border-radius: 4px;
  margin-top: 2px;
`;

const AddPostButton = styled(motion.button)`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 4px;
  right: 4px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${DayCell}:hover & {
    opacity: 1;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 1px;
  background: #eaeaea;
  border-radius: 8px;
  padding: 2px;
  margin-right: 12px;

  button {
    border: none;
    background: transparent;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #666;
    
    &.active {
      background: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      color: #1976d2;
      font-weight: 500;
    }
    
    &:hover:not(.active) {
      background: rgba(255,255,255,0.5);
    }
  }
`;

// The Calendar Component
const ImmersiveCalendar: React.FC<ImmersiveCalendarProps> = ({ posts, onPostClick, onDateClick, onAddPost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  
  // Animation variants
  const containerVariants = {
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
  
  const dayCellVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.02,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }),
    hover: {
      y: -5,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: 0.2
      }
    }
  };
  
  const [animationDirection, setAnimationDirection] = useState(0);
  
  // Navigate through months
  const nextMonth = () => {
    setAnimationDirection(1);
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const prevMonth = () => {
    setAnimationDirection(-1);
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map((day, index) => {
      const dayPosts = posts.filter(post => {
        const postDate = parseISO(post.scheduledDate);
        return isSameDay(postDate, day);
      });
      
      const inMonth = isSameMonth(day, currentDate);
      const isCurrentDay = isToday(day);
      const hasContent = dayPosts.length > 0;
      
      // Display only first 3 posts and show "more" indicator if needed
      const displayPosts = dayPosts.slice(0, 3);
      const hasMorePosts = dayPosts.length > 3;
      
      return (
        <DayCell 
          key={day.toString()}
          $inMonth={inMonth}
          $isToday={isCurrentDay}
          $hasContent={hasContent}
          onClick={() => onDateClick(day)}
          onMouseEnter={() => setHoveredDay(day)}
          onMouseLeave={() => setHoveredDay(null)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={dayCellVariants}
          custom={index}
        >
          <DateNumber $isToday={isCurrentDay}>
            {format(day, 'd')}
          </DateNumber>
          
          {displayPosts.map((post) => (
            <PostItem 
              key={post.id}
              $platform={post.platforms[0] || 'default'}
              $status={post.status}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onPostClick(post.id);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {post.mediaType && (
                <MediaIndicator $type={post.mediaType}>
                  {post.mediaType === 'carousel' ? '◧' : post.mediaType === 'video' ? '▶' : '○'}
                </MediaIndicator>
              )}
              {post.title}
            </PostItem>
          ))}
          
          {hasMorePosts && (
            <MorePostsIndicator>
              +{dayPosts.length - 3} more
            </MorePostsIndicator>
          )}
          
          <AddPostButton
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onAddPost(day);
            }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faPlus} size="xs" />
          </AddPostButton>
        </DayCell>
      );
    });
  };
  
  return (
    <CalendarContainer style={{ height: isExpanded ? '80vh' : 'auto' }}>
      <CalendarHeader>
        <MonthNavigation>
          <CalendarButton onClick={prevMonth}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </CalendarButton>
          
          <AnimatePresence mode='wait' custom={animationDirection}>
            <MonthTitle
              key={currentDate.toString()}
              custom={animationDirection}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {format(currentDate, 'MMMM yyyy')}
            </MonthTitle>
          </AnimatePresence>
          
          <CalendarButton onClick={nextMonth}>
            <FontAwesomeIcon icon={faChevronRight} />
          </CalendarButton>
        </MonthNavigation>
        
        <CalendarTools>
          <ViewToggle>
            <button 
              className={view === 'month' ? 'active' : ''} 
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button 
              className={view === 'week' ? 'active' : ''} 
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button 
              className={view === 'day' ? 'active' : ''} 
              onClick={() => setView('day')}
            >
              Day
            </button>
          </ViewToggle>
          
          <CalendarButton onClick={() => setIsExpanded(!isExpanded)}>
            <FontAwesomeIcon icon={isExpanded ? faCompress : faExpand} />
          </CalendarButton>
          
          <CalendarButton>
            <FontAwesomeIcon icon={faShareAlt} />
          </CalendarButton>
          
          <CalendarButton>
            <FontAwesomeIcon icon={faEllipsisH} />
          </CalendarButton>
        </CalendarTools>
      </CalendarHeader>
      
      <WeekdaysHeader>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Weekday key={day}>{day}</Weekday>
        ))}
      </WeekdaysHeader>
      
      <AnimatePresence mode='wait' custom={animationDirection}>
        <DaysGrid
          key={currentDate.toString()}
          custom={animationDirection}
          variants={containerVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {renderCalendarDays()}
        </DaysGrid>
      </AnimatePresence>
    </CalendarContainer>
  );
};

export default ImmersiveCalendar;
