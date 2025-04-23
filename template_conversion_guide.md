# Template Page Conversion Guide

This document outlines the complete step-by-step process for converting existing pages to use the MainPageTemplate component structure in the redefine_admin project. Follow these steps exactly for each page you want to convert.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Analyze Original Page Structure](#step-1-analyze-original-page-structure)
3. [Step 2: Create Template-Based Page(s)](#step-2-create-template-based-pages)
4. [Step 3: Update AppRoutes.tsx](#step-3-update-approutestsx)
5. [Step 4: Update LeftMenu Navigation](#step-4-update-leftmenu-navigation)
6. [Step 5: Configure SubMenu](#step-5-configure-submenu)
7. [Step 6: Update MainPageTemplate](#step-6-update-mainpagetemplate)
8. [Step 7: Test Navigation](#step-7-test-navigation)
9. [Step 8: Delete Original Page](#step-8-delete-original-page)
10. [Troubleshooting](#troubleshooting)
11. [Example: File Manager Conversion](#example-file-manager-conversion)
12. [Example: Finance Pages Conversion](#example-finance-pages-conversion)

## Prerequisites

- The MainPageTemplate component must be properly set up in `src/components/MainPageTemplate/MainPageTemplate.tsx`
- Ensure LeftMenu and SubMenu components are properly implemented
- Understand the routing structure and navigation scheme of the application

## Step 1: Analyze Original Page Structure

Before converting any page, carefully analyze its structure:

1. Examine the original page component to identify:
   - The main content or widget it renders
   - Any context providers or wrappers around that content
   - How routes and sub-routes are handled

2. Determine if the page has multiple sub-pages or routes:
   - If it's a simple page with one view, use a single template page
   - If it manages multiple views/routes, create separate template pages for each

3. Identify any style containers, theme providers, or other essential wrappers that must be preserved

This analysis is crucial for determining the correct conversion approach.

## Step 2: Create Template-Based Page(s)

1. Create a new file for your page in the same directory as the original page
2. Name the new file with "NEW" appended (e.g., `FileManagerPageNEW.tsx`)
3. Start with this basic structure:

```tsx
import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

/**
 * [Page Name] Page component
 * Uses the master template and provides a container for widget content
 */
const [PageName]PageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="[Page Title]">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default [PageName]PageNEW;
```

4. Replace `[PageName]` with your component name (e.g., `FileManager`)
5. Replace `[Page Title]` with the display title (e.g., `File Manager`)

6. Import and include the original widget/content with any necessary wrappers:

```tsx
// Import the widget component
import [WidgetName] from '../../widgets/[Directory]/[WidgetName]';

// If the widget needs context providers or styling containers, import those too
import { ThemeProvider } from '../../widgets/[Directory]/theme/ThemeProvider';
import { WidgetContainer, ContentArea } from '../../widgets/[Directory]/Styled';

// ...

// Include the widget with all necessary wrappers to preserve styling and functionality
<div className="widget-container" style={{ padding: '20px' }}>
  <ThemeProvider>
    <WidgetContainer>
      <ContentArea>
        <[WidgetName] />
      </ContentArea>
    </WidgetContainer>
  </ThemeProvider>
</div>
```

7. If creating multiple pages for sub-routes, repeat this process for each sub-route

## Step 3: Update AppRoutes.tsx

1. Open `src/routes/AppRoutes.tsx`
2. Import the new page component(s) at the top of the file:

```tsx
import [PageName]PageNEW from '../pages/[Directory]/[PageName]PageNEW';
// Import any sub-page components
import [SubPage1]PageNEW from '../pages/[Directory]/[SubPage1]PageNEW';
import [SubPage2]PageNEW from '../pages/[Directory]/[SubPage2]PageNEW';
```

3. Add new routes with "-new" appended to the original path:

```tsx
{/* New Template-Based Routes */}
<Route 
    path="/[original-path]-new" 
    element={<ProtectedRoute component={[PageName]PageNEW} />} 
/>
```

4. For sub-pages, add separate routes pointing to their respective components:

```tsx
<Route 
    path="/[original-path]-new/[subpath1]" 
    element={<ProtectedRoute component={[SubPage1]PageNEW} />} 
/>
<Route 
    path="/[original-path]-new/[subpath2]" 
    element={<ProtectedRoute component={[SubPage2]PageNEW} />} 
/>
```

## Step 4: Update LeftMenu Navigation

1. Open `src/components/LeftMenu/LeftMenu.tsx`
2. Find the menu item in the `menuItems` array that corresponds to your page
3. Update the `link` property to point to the new path:

```tsx
{ id: '[section-id]', label: '[Label]', icon: '[icon]', iconComponent: [IconComponent], link: '/[original-path]-new' },
```

## Step 5: Configure SubMenu

1. Open `src/components/SubMenu/SubMenu.tsx`
2. Locate or add a case for your section in the switch statement:

```tsx
case '[section-id]':
  menuItems = [
    { id: '[item1-id]', label: '', icon: [Icon1], path: '/[section-path]-new' },
    { id: '[item2-id]', label: '', icon: [Icon2], path: '/[section-path]-new/[subpath1]' },
    { id: '[item3-id]', label: '', icon: [Icon3], path: '/[section-path]-new/[subpath2]' },
  ];
  break;
```

3. Make sure all items have the correct icons and empty label values (prevents text display)

4. Update the `isActive` function to handle all the new routes:

```tsx
const isActive = (item: SubMenuItem) => {
  const currentPath = location.pathname.toLowerCase();
  const itemPath = item.path.toLowerCase();
  
  // Exact match
  if (currentPath === itemPath) return true;
  
  // Section-specific checks
  if (item.id === '[item1-id]' && currentPath === '/[section-path]-new') return true;
  if (item.id === '[item2-id]' && currentPath === '/[section-path]-new/[subpath1]') return true;
  if (item.id === '[item3-id]' && currentPath === '/[section-path]-new/[subpath2]') return true;
  
  return false;
};
```

5. Ensure the CSS in `SubMenu.css` properly highlights active items with a blue glow:

```css
.centered-icons li.active {
  background-color: rgba(66, 153, 225, 0.15); /* Blue glow similar to LeftMenu */
  box-shadow: 0 0 8px rgba(66, 153, 225, 0.3); /* Subtle glow effect */
  color: var(--accent-color); /* Accent color for active icon */
}

.centered-icons li.active .menu-icon svg {
  stroke: var(--accent-color); /* Blue accent color for the active icon */
}
```

## Step 6: Update MainPageTemplate

1. Open `src/components/MainPageTemplate/MainPageTemplate.tsx`
2. If the new page uses a different URL pattern, update the `getCurrentSection` function:

```tsx
const getCurrentSection = (): string => {
  const path = location.pathname.split('/')[1] || 'dashboard';
  
  // Map the new URL pattern to the correct section
  if (path === '[original-path]-new') {
    return '[section-id]';
  }
  
  return path;
};
```

## Step 7: Test Navigation

1. Start the development server with `npm start`
2. Verify that:
   - All new pages load correctly with proper styling and content
   - The left menu highlights the correct section when on any page
   - Submenu items appear correctly with proper icons
   - The active submenu item has the blue glow effect
   - All navigation between pages works as expected

3. Check specifically for styling issues:
   - Make sure widgets have their original styling and themes
   - Verify all context providers are working correctly
   - Check that layout containers are properly applied

## Step 8: Delete Original Page

1. Once you've thoroughly tested the new template-based pages, delete the original page:

```bash
rm 'src/pages/[Directory]/[OriginalPage].tsx'
```

2. Remove any routes pointing to the deleted page from AppRoutes.tsx

## Troubleshooting

### Blank Pages or Missing Styling

- If pages appear blank or have missing styling, check if you've included all necessary context providers and styling containers from the original widget
- Look at the original widget's component structure to see what wrappers are needed

### Navigation Issues

- If the left menu or submenu doesn't highlight correctly, check the `getCurrentSection` function in MainPageTemplate
- Ensure the path in AppRoutes.tsx exactly matches the path in the menu items

### Component Not Found Errors

- Verify all import paths are correct, especially if moving between directory structures
- Check for capitalization issues in component and file names

### Styling Problems

- If submenu icons aren't centered, add these styles to the list items:

```tsx
const liStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  padding: '8px',
  margin: '4px'
};

const iconStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
  padding: 0
};
```

## Example: File Manager Conversion

### Multiple Components Approach

The File Manager section was converted by creating separate components for each page:

1. `FileManagerPageNEW.tsx` - For the main file manager view
2. `GroupsPageNEW.tsx` - For the groups sub-page

This approach works well when each page has distinct content that's not deeply integrated with other pages.

```tsx
// FileManagerPageNEW.tsx
import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

const FileManagerPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Manager">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default FileManagerPageNEW;
```

```tsx
// GroupsPageNEW.tsx
import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

const GroupsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Groups">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default GroupsPageNEW;
```

## Example: Finance Pages Conversion

### Preserving Widget Container Structure

The Finance section required preserving the original widget's container structure. Each page needed to maintain the same theme providers and styled containers for proper styling:

```tsx
import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import { FinanceThemeProvider } from '../../widgets/financewidget/theme/FinanceThemeProvider';
import { 
  FinanceWidgetContainer,
  FinanceContent
} from '../../widgets/financewidget/FinanceWidgetStyled/index';
import TransactionsModule from '../../widgets/financewidget/modules/transactions';

const TransactionsPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance Transactions">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceThemeProvider>
          <FinanceWidgetContainer>
            <FinanceContent>
              <TransactionsModule />
            </FinanceContent>
          </FinanceWidgetContainer>
        </FinanceThemeProvider>
      </div>
    </MainPageTemplate>
  );
};

export default TransactionsPageNEW;
```

Key points:
1. We imported the `FinanceThemeProvider` for theming
2. We imported the styled containers (`FinanceWidgetContainer`, `FinanceContent`) from the original widget
3. We wrapped each module in these containers to maintain consistent styling
4. We created separate components for each sub-page/module

This approach ensures that when breaking up a widget with shared styles into separate components, each component maintains the same visual appearance and behavior as the original widget.
