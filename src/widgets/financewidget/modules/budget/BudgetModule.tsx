import React, { useState, useEffect } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Section, 
  Table, 
  Button, 
  Flex,
  Input,
  Select
} from '../../FinanceWidgetStyled';
import BudgetCategoryRow from './BudgetCategoryRow';
import BudgetChart from './BudgetChart';
import ActionIcons from '../../components/ActionIcons';

/**
 * BudgetModule component for budget planning and tracking
 * Allows users to create and manage budgets with dollar and percentage views
 */
const BudgetModule: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // State for budget data and UI controls
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [displayMode, setDisplayMode] = useState<'dollars' | 'percent'>('dollars');
  const [editMode, setEditMode] = useState(false);
  const [showChart, setShowChart] = useState(true);
  
  // Mock total income for percentage calculations
  const [totalIncome, setTotalIncome] = useState(85000);
  
  // Mock budget categories with subcategories
  const [budgetCategories, setBudgetCategories] = useState([
    {
      id: '1',
      name: 'Staff & Administration',
      budgeted: 42500,
      actual: 41200,
      expanded: true,
      subcategories: [
        { id: '1-1', name: 'Salaries', budgeted: 35000, actual: 35000 },
        { id: '1-2', name: 'Office Supplies', budgeted: 2500, actual: 2200 },
        { id: '1-3', name: 'Administrative Expenses', budgeted: 5000, actual: 4000 }
      ]
    },
    {
      id: '2',
      name: 'Facilities',
      budgeted: 15000,
      actual: 16500,
      expanded: true,
      subcategories: [
        { id: '2-1', name: 'Rent/Mortgage', budgeted: 8000, actual: 8000 },
        { id: '2-2', name: 'Utilities', budgeted: 3500, actual: 4200 },
        { id: '2-3', name: 'Maintenance', budgeted: 3500, actual: 4300 }
      ]
    },
    {
      id: '3',
      name: 'Ministry Programs',
      budgeted: 18500,
      actual: 14200,
      expanded: true,
      subcategories: [
        { id: '3-1', name: 'Children\'s Ministry', budgeted: 5000, actual: 4200 },
        { id: '3-2', name: 'Youth Ministry', budgeted: 5000, actual: 3800 },
        { id: '3-3', name: 'Adult Education', budgeted: 3500, actual: 2700 },
        { id: '3-4', name: 'Outreach', budgeted: 5000, actual: 3500 }
      ]
    },
    {
      id: '4',
      name: 'Missions & Benevolence',
      budgeted: 9000,
      actual: 8500,
      expanded: true,
      subcategories: [
        { id: '4-1', name: 'Local Missions', budgeted: 4500, actual: 4000 },
        { id: '4-2', name: 'Global Missions', budgeted: 4500, actual: 4500 }
      ]
    }
  ]);
  
  // Calculate totals
  const totalBudgeted = budgetCategories.reduce((sum, category) => sum + category.budgeted, 0);
  const totalActual = budgetCategories.reduce((sum, category) => sum + category.actual, 0);
  
  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setBudgetCategories(budgetCategories.map(category => 
      category.id === categoryId 
        ? { ...category, expanded: !category.expanded } 
        : category
    ));
  };
  
  // Update budget value
  const updateBudgetValue = (categoryId: string, subcategoryId: string | null, field: 'budgeted' | 'actual', value: number) => {
    if (subcategoryId === null) {
      // Update main category
      setBudgetCategories(budgetCategories.map(category => 
        category.id === categoryId 
          ? { ...category, [field]: value } 
          : category
      ));
    } else {
      // Update subcategory
      setBudgetCategories(budgetCategories.map(category => 
        category.id === categoryId 
          ? { 
              ...category, 
              subcategories: category.subcategories.map(sub => 
                sub.id === subcategoryId 
                  ? { ...sub, [field]: value } 
                  : sub
              ) 
            } 
          : category
      ));
    }
  };
  
  // Years for selection
  const years = ['2023', '2024', '2025', '2026'];
  
  // Months for selection
  const months = [
    { value: 'all', label: 'Annual Budget' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ 
        marginBottom: theme.spacing.lg,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md 
      }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Budget Planning</h1>
        <div>
          <Button 
            style={{ marginRight: theme.spacing.md }}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'View Mode' : 'Edit Budget'}
          </Button>
          <Button>Export Budget</Button>
        </div>
      </Flex>

      {/* Budget Controls */}
      <Section style={{ marginBottom: theme.spacing.xl }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: theme.spacing.lg,
          backgroundColor: theme.colors.background.card,
          padding: theme.spacing.md,
          borderRadius: '6px'
        }}>
          {/* Year Selector */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Budget Year
            </label>
            <Select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              style={{ width: '100%' }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </div>
          
          {/* Month Selector */}
          <div style={{ minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Month
            </label>
            <Select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ width: '100%' }}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Select>
          </div>
          
          {/* Display Mode Toggle */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Display Mode
            </label>
            <div style={{ 
              display: 'flex', 
              border: `1px solid ${theme.colors.border.medium}`,
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <button 
                style={{ 
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: displayMode === 'dollars' 
                    ? theme.colors.accent 
                    : theme.colors.background.card,
                  color: displayMode === 'dollars' 
                    ? theme.colors.text.light 
                    : theme.colors.text.primary,
                  cursor: 'pointer'
                }}
                onClick={() => setDisplayMode('dollars')}
              >
                $
              </button>
              <button 
                style={{ 
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: displayMode === 'percent' 
                    ? theme.colors.accent 
                    : theme.colors.background.card,
                  color: displayMode === 'percent' 
                    ? theme.colors.text.light 
                    : theme.colors.text.primary,
                  cursor: 'pointer'
                }}
                onClick={() => setDisplayMode('percent')}
              >
                %
              </button>
            </div>
          </div>
          
          {/* Chart Toggle */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Chart View
            </label>
            <div style={{ 
              display: 'flex', 
              border: `1px solid ${theme.colors.border.medium}`,
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <button 
                style={{ 
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: showChart 
                    ? theme.colors.accent 
                    : theme.colors.background.card,
                  color: showChart 
                    ? theme.colors.text.light 
                    : theme.colors.text.primary,
                  cursor: 'pointer'
                }}
                onClick={() => setShowChart(true)}
              >
                Show
              </button>
              <button 
                style={{ 
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: !showChart 
                    ? theme.colors.accent 
                    : theme.colors.background.card,
                  color: !showChart 
                    ? theme.colors.text.light 
                    : theme.colors.text.primary,
                  cursor: 'pointer'
                }}
                onClick={() => setShowChart(false)}
              >
                Hide
              </button>
            </div>
          </div>
          
          {/* Income Input (for percentage calculations) */}
          {displayMode === 'percent' && (
            <div style={{ minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
                Total Income (for %)
              </label>
              <Input
                type="number"
                value={totalIncome}
                onChange={e => setTotalIncome(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </Section>

      {/* Budget Chart */}
      {showChart && (
        <Section style={{ marginBottom: theme.spacing.xl }}>
          <BudgetChart 
            categories={budgetCategories} 
            displayMode={displayMode} 
            totalIncome={totalIncome}
          />
        </Section>
      )}

      {/* Budget Table */}
      <Section>
        <Table>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Category</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Budgeted</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Actual</th>
              <th style={{ width: '20%', textAlign: 'right' }}>Variance</th>
            </tr>
          </thead>
          <tbody>
            {budgetCategories.map(category => (
              <React.Fragment key={category.id}>
                {/* Main Category Row */}
                <BudgetCategoryRow 
                  category={category}
                  displayMode={displayMode}
                  totalIncome={totalIncome}
                  editMode={editMode}
                  toggleExpansion={() => toggleCategoryExpansion(category.id)}
                  updateBudgetValue={updateBudgetValue}
                  isMainCategory={true}
                />
                
                {/* Subcategory Rows */}
                {category.expanded && category.subcategories.map(subcategory => (
                  <BudgetCategoryRow 
                    key={subcategory.id}
                    category={subcategory}
                    parentId={category.id}
                    displayMode={displayMode}
                    totalIncome={totalIncome}
                    editMode={editMode}
                    updateBudgetValue={updateBudgetValue}
                    isMainCategory={false}
                  />
                ))}
              </React.Fragment>
            ))}
            
            {/* Total Row */}
            <tr style={{ 
              fontWeight: 'bold',
              backgroundColor: theme.colors.background.highlight
            }}>
              <td>Total</td>
              <td style={{ textAlign: 'right' }}>
                {displayMode === 'dollars' 
                  ? `$${totalBudgeted.toLocaleString()}` 
                  : `${((totalBudgeted / totalIncome) * 100).toFixed(1)}%`
                }
              </td>
              <td style={{ textAlign: 'right' }}>
                {displayMode === 'dollars' 
                  ? `$${totalActual.toLocaleString()}` 
                  : `${((totalActual / totalIncome) * 100).toFixed(1)}%`
                }
              </td>
              <td style={{ 
                textAlign: 'right',
                color: totalBudgeted >= totalActual 
                  ? theme.colors.state.success 
                  : theme.colors.state.error
              }}>
                {displayMode === 'dollars' 
                  ? `$${Math.abs(totalBudgeted - totalActual).toLocaleString()}` 
                  : `${Math.abs(((totalBudgeted / totalIncome) * 100) - ((totalActual / totalIncome) * 100)).toFixed(1)}%`
                }
                {totalBudgeted >= totalActual ? ' under' : ' over'}
              </td>
            </tr>
          </tbody>
        </Table>
        
        {/* Add Category Button */}
        {editMode && (
          <div style={{ marginTop: theme.spacing.md }}>
            <Button>+ Add Category</Button>
          </div>
        )}
      </Section>
    </div>
  );
};

export default BudgetModule;
