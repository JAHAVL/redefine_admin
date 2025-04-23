import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { Button, Input } from '../../FinanceWidgetStyled';
import ActionIcons from '../../components/ActionIcons';

interface CategoryRowProps {
  category: {
    id: string;
    name: string;
    budgeted: number;
    actual: number;
    expanded?: boolean;
    subcategories?: {
      id: string;
      name: string;
      budgeted: number;
      actual: number;
    }[];
  };
  displayMode: 'dollars' | 'percent';
  totalIncome: number;
  editMode: boolean;
  parentId?: string;
  toggleExpansion?: () => void;
  updateBudgetValue: (categoryId: string, subcategoryId: string | null, field: 'budgeted' | 'actual', value: number) => void;
  isMainCategory: boolean;
  onDelete?: (categoryId: string) => void;
}

/**
 * BudgetCategoryRow component for displaying and editing budget categories
 */
const BudgetCategoryRow: React.FC<CategoryRowProps> = ({
  category,
  displayMode,
  totalIncome,
  editMode,
  parentId,
  toggleExpansion,
  updateBudgetValue,
  isMainCategory,
  onDelete
}) => {
  const theme = useFinanceTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetedValue, setBudgetedValue] = useState(category.budgeted.toString());
  const [actualValue, setActualValue] = useState(category.actual.toString());

  // Calculate percentage of income
  const budgetedPercent = totalIncome > 0 
    ? Math.round((category.budgeted / totalIncome) * 1000) / 10 
    : 0;
  
  const actualPercent = totalIncome > 0 
    ? Math.round((category.actual / totalIncome) * 1000) / 10 
    : 0;

  // Handle save of edited values
  const handleSave = () => {
    const categoryId = parentId ? parentId : category.id;
    const subcategoryId = parentId ? category.id : null;
    
    updateBudgetValue(
      categoryId,
      subcategoryId,
      'budgeted',
      parseFloat(budgetedValue) || 0
    );
    
    updateBudgetValue(
      categoryId,
      subcategoryId,
      'actual',
      parseFloat(actualValue) || 0
    );
    
    setIsEditing(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <tr style={{ 
      backgroundColor: isMainCategory ? theme.colors.background.highlight : 'transparent',
      borderBottom: `1px solid ${theme.colors.border.light}`
    }}>
      {/* Category Name */}
      <td style={{ 
        padding: theme.spacing.sm,
        fontWeight: isMainCategory ? 'bold' : 'normal',
        paddingLeft: isMainCategory ? theme.spacing.sm : theme.spacing.lg
      }}>
        {isMainCategory && category.subcategories && category.subcategories.length > 0 && (
          <span 
            onClick={toggleExpansion}
            style={{ 
              cursor: 'pointer',
              marginRight: theme.spacing.sm,
              display: 'inline-block',
              width: '16px',
              height: '16px',
              textAlign: 'center',
              lineHeight: '14px',
              border: `1px solid ${theme.colors.border.medium}`,
              borderRadius: '2px'
            }}
          >
            {category.expanded ? '−' : '+'}
          </span>
        )}
        {category.name}
      </td>
      
      {/* Budgeted Amount */}
      <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>
        {isEditing ? (
          <Input
            type="number"
            value={budgetedValue}
            onChange={e => setBudgetedValue(e.target.value)}
            style={{ width: '100px' }}
          />
        ) : (
          displayMode === 'dollars' 
            ? formatCurrency(category.budgeted)
            : `${budgetedPercent}%`
        )}
      </td>
      
      {/* Actual Amount */}
      <td style={{ padding: theme.spacing.sm, textAlign: 'right' }}>
        {isEditing ? (
          <Input
            type="number"
            value={actualValue}
            onChange={e => setActualValue(e.target.value)}
            style={{ width: '100px' }}
          />
        ) : (
          displayMode === 'dollars' 
            ? formatCurrency(category.actual)
            : `${actualPercent}%`
        )}
      </td>
      
      {/* Actions */}
      <td style={{ padding: theme.spacing.sm, textAlign: 'right', width: '100px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm }}>
            <Button 
              onClick={handleSave}
              style={{ padding: '4px 8px', fontSize: '0.875rem' }}
            >
              Save
            </Button>
            <Button 
              onClick={() => setIsEditing(false)}
              style={{ 
                padding: '4px 8px', 
                fontSize: '0.875rem',
                backgroundColor: 'transparent',
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <ActionIcons
            onEdit={() => setIsEditing(true)}
            onDelete={onDelete ? () => onDelete(category.id) : undefined}
          />
        )}
      </td>
    </tr>
  );
};

export default BudgetCategoryRow;
