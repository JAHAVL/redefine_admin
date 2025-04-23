import React from 'react';
import styled from 'styled-components';
import { theme } from './theme';

interface AccountSelectorWidgetProps {
  selectedAccount?: string;
  onAccountChange?: (account: string) => void;
}

const MOCK_ACCOUNTS = [
  'General Fund',
  'Missions',
  'Benevolence',
  'Building Fund',
];

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${theme.colors.backgroundGradient};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.borderRadius.form};
  box-shadow: ${theme.shadow.form};
  padding: 24px 16px 18px 16px;
  box-sizing: border-box;
  font-family: ${theme.font.base};
`;



const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 18px 0;
  color: ${theme.colors.title};
  font-weight: 700;
  text-align: center;
`;


const StyledSelect = styled.select`
  font-size: 1.2rem;
  padding: 10px 16px;
  border-radius: ${theme.borderRadius.input};
  border: 1px solid ${theme.colors.border};
  margin-top: 12px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  background: ${theme.colors.inputBg};
  color: ${theme.colors.inputText};
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  &:focus {
    border: 1.5px solid ${theme.colors.outline};
    background: ${theme.colors.inputBgFocus};
    box-shadow: ${theme.shadow.button};
  }
`;


const StyledOption = styled.option`
  color: ${theme.colors.inputText};
  background: ${theme.colors.inputBg};
`;

const AccountSelectorWidget: React.FC<AccountSelectorWidgetProps> = ({ selectedAccount, onAccountChange }) => {
  const [selected, setSelected] = React.useState(selectedAccount || MOCK_ACCOUNTS[0]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (onAccountChange) onAccountChange(e.target.value);
  };

  return (
    <Container>
      <Title>Choose Your Account</Title>
      <StyledSelect value={selected} onChange={handleChange}>
        {MOCK_ACCOUNTS.map((acc) => (
          <StyledOption value={acc} key={acc}>{acc}</StyledOption>
        ))}
      </StyledSelect>
    </Container>
  );
};

export default AccountSelectorWidget;
