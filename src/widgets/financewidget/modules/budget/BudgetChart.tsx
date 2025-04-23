import React from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';

interface Category {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  expanded?: boolean;
  subcategories?: any[];
}

interface BudgetChartProps {
  categories: Category[];
  displayMode: 'dollars' | 'percent';
  totalIncome: number;
}

/**
 * BudgetChart component for visualizing budget allocation and spending
 */
const BudgetChart: React.FC<BudgetChartProps> = ({ categories, displayMode, totalIncome }) => {
  const theme = useFinanceTheme();
  
  // Calculate totals
  const totalBudgeted = categories.reduce((sum, category) => sum + category.budgeted, 0);
  const totalActual = categories.reduce((sum, category) => sum + category.actual, 0);
  
  // Chart colors - create a palette for the categories
  const chartColors = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#FBBC05', // Yellow
    '#34A853', // Green
    '#8F44AD', // Purple
    '#16A085', // Teal
    '#F39C12', // Orange
    '#2C3E50'  // Dark Blue
  ];
  
  // Get percentage for display
  const getPercentage = (value: number) => {
    if (displayMode === 'dollars') {
      return (value / totalBudgeted) * 100;
    } else {
      return (value / totalIncome) * 100;
    }
  };
  
  // Format currency or percentage
  const formatValue = (value: number) => {
    if (displayMode === 'dollars') {
      return `$${value.toLocaleString()}`;
    } else {
      return `${((value / totalIncome) * 100).toFixed(1)}%`;
    }
  };

  return (
    <div style={{ 
      backgroundColor: theme.colors.background.card,
      padding: theme.spacing.lg,
      borderRadius: '6px'
    }}>
      <h2 style={{ 
        fontSize: theme.typography.fontSize.large, 
        margin: 0,
        marginBottom: theme.spacing.md,
        textAlign: 'center'
      }}>
        Budget Allocation
      </h2>
      
      {/* Chart Legend */}
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: theme.spacing.lg
      }}>
        {categories.map((category, index) => (
          <div 
            key={category.id}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              marginRight: theme.spacing.md
            }}
          >
            <div style={{ 
              width: '16px',
              height: '16px',
              backgroundColor: chartColors[index % chartColors.length],
              marginRight: theme.spacing.sm,
              borderRadius: '3px'
            }} />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
      
      {/* Budgeted Bar Chart */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing.sm
        }}>
          <div style={{ width: '80px' }}>Budgeted:</div>
          <div style={{ 
            flex: 1,
            height: '30px',
            backgroundColor: theme.colors.background.highlight,
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'flex'
          }}>
            {categories.map((category, index) => (
              <div 
                key={category.id}
                style={{ 
                  width: `${getPercentage(category.budgeted)}%`,
                  height: '100%',
                  backgroundColor: chartColors[index % chartColors.length],
                  position: 'relative'
                }}
                title={`${category.name}: ${formatValue(category.budgeted)}`}
              >
                {getPercentage(category.budgeted) > 5 && (
                  <span style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getPercentage(category.budgeted).toFixed(0)}%
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ 
            width: '100px',
            textAlign: 'right',
            marginLeft: theme.spacing.md
          }}>
            {formatValue(totalBudgeted)}
          </div>
        </div>
        
        {/* Actual Bar Chart */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ width: '80px' }}>Actual:</div>
          <div style={{ 
            flex: 1,
            height: '30px',
            backgroundColor: theme.colors.background.highlight,
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'flex'
          }}>
            {categories.map((category, index) => (
              <div 
                key={category.id}
                style={{ 
                  width: `${getPercentage(category.actual)}%`,
                  height: '100%',
                  backgroundColor: chartColors[index % chartColors.length],
                  position: 'relative'
                }}
                title={`${category.name}: ${formatValue(category.actual)}`}
              >
                {getPercentage(category.actual) > 5 && (
                  <span style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getPercentage(category.actual).toFixed(0)}%
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ 
            width: '100px',
            textAlign: 'right',
            marginLeft: theme.spacing.md
          }}>
            {formatValue(totalActual)}
          </div>
        </div>
      </div>
      
      {/* Category Comparison */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px',
        marginTop: theme.spacing.xl
      }}>
        {categories.map((category, index) => (
          <div 
            key={category.id}
            style={{ 
              backgroundColor: theme.colors.background.highlight,
              padding: theme.spacing.md,
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border.light}`
            }}
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: theme.spacing.sm
            }}>
              <div style={{ 
                width: '12px',
                height: '12px',
                backgroundColor: chartColors[index % chartColors.length],
                marginRight: theme.spacing.sm,
                borderRadius: '2px'
              }} />
              <h3 style={{ 
                margin: 0,
                fontSize: theme.typography.fontSize.medium
              }}>
                {category.name}
              </h3>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.sm
            }}>
              <span>Budgeted:</span>
              <span>{formatValue(category.budgeted)}</span>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.sm
            }}>
              <span>Actual:</span>
              <span>{formatValue(category.actual)}</span>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              color: category.budgeted >= category.actual 
                ? theme.colors.state.success 
                : theme.colors.state.error
            }}>
              <span>Variance:</span>
              <span>
                {formatValue(Math.abs(category.budgeted - category.actual))}
                {category.budgeted >= category.actual ? ' under' : ' over'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;
