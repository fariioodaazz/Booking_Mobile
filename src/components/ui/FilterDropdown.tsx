import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

type Props<T extends string> = {
  label?: string;                // small caption above the button
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (v: T) => void;
  open: boolean;
  setOpen: (x: boolean) => void;
};

const Wrapper = styled.View`
  flex: 1;
`;

const Label = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const Button = styled(TouchableOpacity)`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const IconBox = styled.View`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const ButtonText = styled.Text`
  color: #374151;
  font-size: 16px;
  font-weight: 500;
  flex: 1;
`;

const Chevron = styled.View`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
  z-index: 1000;
  margin-top: 6px;
`;

const Item = styled(TouchableOpacity)`
  padding: 12px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
`;

const ItemText = styled.Text`
  color: #374151;
  font-size: 16px;
  margin-left: 8px;
  flex: 1;
`;

const ItemTextActive = styled(ItemText)`
  color: #007aff;
  font-weight: 600;
`;

export default function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  open,
  setOpen,
}: Props<T>) {
  const current = options.find(o => o.value === value);

  return (
    <Wrapper>
      {label ? <Label>{label}</Label> : null}

      <View style={{ position: "relative" }}>
        <Button
          onPress={() => setOpen(!open)}
          activeOpacity={0.8}
        >
          <ButtonContent>
            <IconBox>{current?.icon}</IconBox>
            <ButtonText>{current?.label ?? "Select"}</ButtonText>
          </ButtonContent>
          <Chevron style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
            {/* simple chevron */}
            <Text style={{ color: "#6b7280" }}>⌄</Text>
          </Chevron>
        </Button>

        {open && (
          <Dropdown>
            {options.map((opt, idx) => {
              const last = idx === options.length - 1;
              const isActive = opt.value === value;
              const ItemComp = Item;
              const TextComp = isActive ? ItemTextActive : ItemText;

              return (
                <ItemComp
                  key={opt.value}
                  style={last ? { borderBottomWidth: 0 } : undefined}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.icon}
                  <TextComp>{opt.label}</TextComp>
                  {isActive ? <Text style={{ color: "#007aff" }}>✓</Text> : null}
                </ItemComp>
              );
            })}
          </Dropdown>
        )}
      </View>
    </Wrapper>
  );
}
