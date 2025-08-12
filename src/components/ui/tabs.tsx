import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

type TabsProps = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  style?: any;
};

type TabsListProps = {
  children: React.ReactNode;
  style?: any;
};

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  style?: any;
};

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  style?: any;
};

const TabsContainer = styled.View`
  flex-direction: column;
  gap: 8px;
`;

const TabsListContainer = styled.View`
  flex-direction: row;
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
`;

const TabsTriggerButton = styled(TouchableOpacity)<{ active: boolean }>`
  flex: 1;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  align-items: center;
  border-radius: 8px;
  background-color: ${(props: { active: boolean }) => props.active ? '#ffffff' : 'transparent'};
`;

const TabsTriggerText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props: { active: boolean }) => props.active ? '#1f2937' : '#6b7280'};
`;

const TabsContentContainer = styled.View`
  flex: 1;
`;

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: '',
  onValueChange: () => {},
});

export function Tabs({ children, defaultValue = '', value, onValueChange, style }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <TabsContainer style={style}>
        {children}
      </TabsContainer>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, style }: TabsListProps) {
  return (
    <TabsListContainer style={style}>
      {children}
    </TabsListContainer>
  );
}

export function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <TabsTriggerButton 
      active={isActive}
      onPress={() => context.onValueChange(value)}
      style={style}
    >
      <TabsTriggerText active={isActive}>
        {children}
      </TabsTriggerText>
    </TabsTriggerButton>
  );
}

export function TabsContent({ value, children, style }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  
  if (context.value !== value) {
    return null;
  }

  return (
    <TabsContentContainer style={style}>
      {children}
    </TabsContentContainer>
  );
}
