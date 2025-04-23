import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../givingwidget/theme';

// Types
type Account = { id: string; name: string };
type LineItem = { id: string; name: string; amount: number };
type Category = {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  lineItems: LineItem[];
};

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
  background: ${theme.colors.backgroundGradient};
  border-radius: ${theme.borderRadius.form};
  box-shadow: ${theme.shadow.form};
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  color: ${theme.colors.title};
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const AccountSelector = styled.select`
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.input};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.inputBg};
  color: ${theme.colors.inputText};
  outline: none;
  margin-left: 16px;
`;

const CategoriesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CategoryCard = styled.div`
  background: ${theme.colors.widgetBg};
  border-radius: ${theme.borderRadius.widget};
  box-shadow: ${theme.shadow.widget};
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  background: ${theme.colors.inputBg};
  border-radius: 8px;
  height: 18px;
  margin: 8px 0;
`;

// Demo/mock data
const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'General Fund' },
  { id: '2', name: 'Missions' },
  { id: '3', name: 'Benevolence' },
];

const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat1',
    name: 'Groceries',
    budgeted: 500,
    spent: 320,
    lineItems: [
      { id: 'li1', name: 'Whole Foods', amount: 120 },
      { id: 'li2', name: 'Trader Joe’s', amount: 200 },
    ],
  },
  {
    id: 'cat2',
    name: 'Utilities',
    budgeted: 250,
    spent: 110,
    lineItems: [
      { id: 'li3', name: 'Electric', amount: 70 },
      { id: 'li4', name: 'Water', amount: 40 },
    ],
  },
];

const LineItemsList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LineItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`;

const AddButton = styled.button`
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.button};
  background: ${theme.colors.buttonGradient};
  color: ${theme.colors.inputText};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-size: ${theme.font.button};
  box-shadow: ${theme.shadow.button};
  &:hover { background: ${theme.colors.buttonGradientHover}; }
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  background: ${theme.colors.buttonGradient};
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s;
`;

export const BudgetWidget: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState(MOCK_ACCOUNTS[0].id);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [showDollar, setShowDollar] = useState(true);

  return (
    <Container>
      <Header>
        <Title>Budget Overview</Title>
        <div>
          <label htmlFor="account-select" style={{ color: '#d32f2f', fontWeight: 600, marginRight: 8 }}>Account:</label>
          <AccountSelector
            id="account-select"
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
          >
            {MOCK_ACCOUNTS.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </AccountSelector>
        </div>
      </Header>
      <CategoriesSection>
        {categories.map(cat => {
          const percent = cat.budgeted ? Math.round((cat.spent / cat.budgeted) * 100) : 0;
          return (
            <CategoryCard key={cat.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>{cat.name}</div>
                <div style={{ color: theme.colors.inputText, fontWeight: 600 }}>
                  {showDollar ? `$${cat.spent} / $${cat.budgeted}` : `${percent}%`}
                </div>
              </div>
              <ProgressBarWrapper>
                <ProgressBar percent={percent} />
              </ProgressBarWrapper>
              <LineItemsList>
                {cat.lineItems.map(li => (
                  <LineItemRow key={li.id}>
                    <span>{li.name}</span>
                    <span style={{ color: theme.colors.inputText, fontWeight: 600 }}>
                      {showDollar ? `$${li.amount}` : `${((li.amount / cat.budgeted) * 100).toFixed(1)}%`}
                    </span>
                  </LineItemRow>
                ))}
              </LineItemsList>
            </CategoryCard>
          );
        })}
      </CategoriesSection>
      <AddButton onClick={() => alert('Add Category (not implemented)')}>+ Add Category</AddButton>
    </Container>
  );

  // If you need to add more hooks or logic, do so above this return.
}

export default BudgetWidget;
