/**
 * Theme definition for the PostCreator widget
 * 
 * This follows the pattern of separating structure from theme
 * as documented in the project architecture guidelines.
 */

export const PostCreatorTheme = {
  colors: {
    primary: '#1976d2',
    primaryDark: '#1565c0',
    primaryLight: '#bbdefb',
    secondary: '#ff5722',
    secondaryDark: '#e64a19',
    secondaryLight: '#ffccbc',
    background: '#ffffff',
    surface: '#f5f5f5',
    border: '#e0e0e0',
    text: {
      primary: '#212121',
      secondary: '#616161',
      muted: '#9e9e9e',
      light: '#ffffff'
    },
    status: {
      draft: '#9E9E9E',
      in_review: '#FFA000',
      approved: '#43A047',
      scheduled: '#3949AB',
      published: '#00897B',
      rejected: '#E53935'
    }
  },
  spacing: {
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', system-ui, sans-serif",
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700
    },
    sizes: {
      tiny: '10px',
      small: '12px',
      body: '14px',
      large: '16px',
      h3: '18px',
      h2: '24px',
      h1: '30px'
    },
    lineHeights: {
      compact: 1.2,
      normal: 1.5,
      loose: 1.8
    }
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    pill: '9999px'
  },
  shadows: {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    quick: '0.1s',
    default: '0.2s',
    slow: '0.3s'
  },
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in',
    slideIn: 'slideIn 0.3s ease-out'
  },
  editor: {
    toolbar: {
      background: '#f5f5f5',
      buttonHover: '#e0e0e0',
      activeButton: '#e3f2fd',
      activeButtonText: '#1976d2'
    },
    content: {
      minHeight: '250px'
    }
  },
  comments: {
    marker: {
      size: '24px',
      active: '#1976d2',
      inactive: '#ff5722'
    },
    resolved: {
      opacity: 0.7,
      background: '#f5f5f5'
    }
  },
  schedule: {
    platformItem: {
      selectedBorder: '#bbdefb',
      selectedBackground: '#e3f2fd',
      hoverBackground: '#f5f5f5'
    },
    tag: {
      background: '#e3f2fd',
      text: '#1976d2'
    }
  }
};

export default PostCreatorTheme;
