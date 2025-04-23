# Template Page Conversion Guide

This document outlines the complete step-by-step process for converting existing pages to use the MainPageTemplate component structure in the redefine_admin project. Follow these steps exactly for each page you want to convert.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create the Template-Based Page](#step-1-create-the-template-based-page)
3. [Step 2: Update AppRoutes.tsx](#step-2-update-approutes-tsx)
4. [Step 3: Update LeftMenu Navigation](#step-3-update-leftmenu-navigation)
5. [Step 4: Configure SubMenu](#step-4-configure-submenu)
6. [Step 5: Update MainPageTemplate](#step-5-update-mainpagetemplate)
7. [Step 6: Test Navigation](#step-6-test-navigation)
8. [Step 7: Delete Original Page](#step-7-delete-original-page)
9. [Troubleshooting](#troubleshooting)
10. [Example: File Manager Conversion](#example-file-manager-conversion)
11. [Alternative Patterns](#alternative-patterns)

## Prerequisites

- The MainPageTemplate component must be properly set up in `src/components/MainPageTemplate/MainPageTemplate.tsx`
- Ensure LeftMenu and SubMenu components are properly implemented
- Understand the routing structure and navigation scheme of the application

## Step 1: Create the Template-Based Page

1. Create a new file for your page in the same directory as the original page
2. Name the new file with "NEW" appended (e.g., `FileManagerPageNEW.tsx`)
3. Use this exact structure:

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
6. If you need to include the original widget, add the import and include it in the widget container:

```tsx
import [WidgetName] from '../../widgets/[Directory]/[WidgetName]';

// ...

<div className="widget-container" style={{ padding: '20px' }}>
  <[WidgetName] />
</div>
```

## Step 2: Update AppRoutes.tsx

1. Open `src/routes/AppRoutes.tsx`
2. Import the new page component at the top of the file:

```tsx
import [PageName]PageNEW from '../pages/[Directory]/[PageName]PageNEW';
```

3. Add a new route for the page with "-new" appended to the original path:

```tsx
<Route 
    path="/[original-path]-new" 
    element={<ProtectedRoute component={[PageName]PageNEW} />} 
/>
```

4. For sub-pages, follow the same pattern for nested routes:

```tsx
<Route 
    path="/[original-path]-new/[subpath]" 
    element={<ProtectedRoute component={[SubPage]PageNEW} />} 
/>
```

## Step 3: Update LeftMenu Navigation

1. Open `src/components/LeftMenu/LeftMenu.tsx`
2. Find the menu item in the `menuItems` array that corresponds to your page
3. Update the `link` property to point to the new path:

```tsx
{ id: '[section-id]', label: '[Label]', icon: '[icon]', iconComponent: [IconComponent], link: '/[original-path]-new' },
```

## Step 4: Configure SubMenu

1. Open `src/components/SubMenu/SubMenu.tsx`
2. Locate or add a case for your section in the switch statement:

```tsx
case '[section-id]':
  menuItems = [
    { id: '[item1-id]', label: '', icon: [Icon1], path: '/[section-path]-new' },
    { id: '[item2-id]', label: '', icon: [Icon2], path: '/[section-path]-new/[subpath]' },
  ];
  break;
```

3. Make sure all items have the correct icons and empty label values (prevents text display)
4. If needed, update the `isActive` function to properly detect the active state:

```tsx
const isActive = (item: SubMenuItem) => {
  const currentPath = location.pathname.toLowerCase();
  const itemPath = item.path.toLowerCase();
  
  // Exact match
  if (currentPath === itemPath) return true;
  
  // Specific checks for section pages
  if (item.id === '[item1-id]' && currentPath === '/[section-path]-new') return true;
  if (item.id === '[item2-id]' && currentPath === '/[section-path]-new/[subpath]') return true;
  
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

## Step 5: Update MainPageTemplate

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

## Step 6: Test Navigation

1. Start the development server with `npm start`
2. Verify that:
   - The new page loads correctly with the MainPageTemplate structure
   - The left menu highlights the correct section when on the page
   - Any submenu items appear correctly with proper icons
   - The active submenu item has the blue glow effect
   - All navigation between pages works as expected

## Step 7: Delete Original Page

1. Once you've thoroughly tested the new template-based page, delete the original page:

```bash
rm 'src/pages/[Directory]/[OriginalPage].tsx'
```

2. Remove any routes pointing to the deleted page from AppRoutes.tsx

## Troubleshooting

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

- Apply these styles to the elements in the component:

```tsx
<li 
  style={liStyle}
  className={isActive(item) ? 'active' : ''}
>
  <span className="menu-icon" style={iconStyle}>
    <item.icon size={20} />
  </span>
</li>
```

## Example: File Manager Conversion

Here's a complete example of converting the File Manager pages:

### 1. Create the New Page

```tsx
// src/pages/File Manager/FileManagerPageNEW.tsx
import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';

const FileManagerPageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="File Manager NEW">
      <div className="widget-container" style={{ padding: '20px' }}>
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default FileManagerPageNEW;
```

### 2. Create the Groups Subpage

```tsx
// src/pages/File Manager/GroupsPageNEW.tsx
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

### 3. Update AppRoutes.tsx

```tsx
// Add imports
import FileManagerPageNEW from '../pages/File Manager/FileManagerPageNEW';
import GroupsPageNEW from '../pages/File Manager/GroupsPageNEW';

// Add routes
<Route 
    path="/file-manager-new" 
    element={<ProtectedRoute component={FileManagerPageNEW} />} 
/>
<Route 
    path="/file-manager-new/groups" 
    element={<ProtectedRoute component={GroupsPageNEW} />} 
/>
```

### 4. Update LeftMenu.tsx

```tsx
// Update the file-manager link
{ id: 'file-manager', label: 'File Manager', icon: 'file', iconComponent: FileEdit, link: '/file-manager-new' },
```

### 5. Update SubMenu.tsx

```tsx
// Add file-manager case
case 'file-manager':
  menuItems = [
    { id: 'files', label: '', icon: Folder, path: '/file-manager-new' },
    { id: 'groups', label: '', icon: Users, path: '/file-manager-new/groups' },
  ];
  break;

// Update isActive function
const isActive = (item: SubMenuItem) => {
  const currentPath = location.pathname.toLowerCase();
  const itemPath = item.path.toLowerCase();
  
  // Exact match
  if (currentPath === itemPath) return true;
  
  // For the 'files' item, it should be active when exactly on file-manager-new path
  if (item.id === 'files' && currentPath === '/file-manager-new') return true;
  
  // For the 'groups' item, it should be active when on file-manager-new/groups path
  if (item.id === 'groups' && currentPath === '/file-manager-new/groups') return true;
  
  return false;
};
```

### 6. Update MainPageTemplate.tsx

```tsx
// Update getCurrentSection to recognize file-manager-new
const getCurrentSection = (): string => {
  const path = location.pathname.split('/')[1] || 'dashboard';
  
  // Map file-manager-new to file-manager section
  if (path === 'file-manager-new') {
    return 'file-manager';
  }
  
  return path;
};
```

### 7. Delete Original Files

```bash
rm 'src/pages/File Manager/FileManagerPage.tsx'
rm 'src/pages/File Manager/GroupsPage.tsx'

```

## Alternative Patterns

### Single Component for Multiple Routes

In some cases, you might have a single page component that handles multiple routes/sub-pages. For example, the Finance section uses a single `FinancePageNEW.tsx` component for all finance routes (`/finance-new`, `/finance-new/transactions`, etc.).

This pattern works when:

1. The original page already follows this pattern (one component for multiple routes)
2. The widget rendered by the page has internal routing logic to display different content based on the URL

To implement this pattern:

1. Create just one new template-based page component
2. Add all routes in AppRoutes.tsx pointing to the same component
3. Update the SubMenu to include icons for all sub-routes
4. Update the isActive function to handle all the routes:

```tsx
// Finance section active states
if (item.id === 'overview' && currentPath === '/finance-new') return true;
if (item.id === 'transactions' && currentPath === '/finance-new/transactions') return true;
if (item.id === 'accounts' && currentPath === '/finance-new/accounts') return true;
// etc...
```

### Example: Finance Page Conversion

```tsx
// src/pages/finance/FinancePageNEW.tsx
import React from 'react';
import MainPageTemplate from '../../components/MainPageTemplate/MainPageTemplate';
import FinanceWidget from '../../widgets/financewidget';

const FinancePageNEW: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Finance">
      <div className="widget-container" style={{ padding: '20px' }}>
        <FinanceWidget />
      </div>
    </MainPageTemplate>
  );
};

export default FinancePageNEW;
```

In AppRoutes.tsx, all finance routes point to the same component:

```tsx
<Route 
    path="/finance-new" 
    element={<ProtectedRoute component={FinancePageNEW} />} 
/>
<Route 
    path="/finance-new/transactions" 
    element={<ProtectedRoute component={FinancePageNEW} />} 
/>
<Route 
    path="/finance-new/accounts" 
    element={<ProtectedRoute component={FinancePageNEW} />} 
/>
// etc...
```

The FinanceWidget itself would then determine what content to show based on the current route.
