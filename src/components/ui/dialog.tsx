// app/components/ui/dialog.tsx
import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";
import { X } from "lucide-react-native";

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: any;
};

type DialogHeaderProps = {
  children: React.ReactNode;
  style?: any;
};

type DialogFooterProps = {
  children: React.ReactNode;
  style?: any;
};

type DialogTitleProps = {
  children: React.ReactNode;
  style?: any;
};

type DialogDescriptionProps = {
  children: React.ReactNode;
  style?: any;
};

const Content = styled.View`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
  elevation: 8;
`;

const CloseButtonContainer = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
`;

const CloseButton = styled(TouchableOpacity)`
  padding: 8px;
  border-radius: 6px;
  background-color: #f5f5f5;
  opacity: 0.7;
`;

const Header = styled.View`
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 20px;
`;

// Main Dialog wrapper
export function Dialog({ visible, onClose, children, style }: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.center}>
        <Content style={style}>
          <CloseButtonContainer>
            <CloseButton onPress={onClose}>
              <X size={20} color="#6b7280" />
            </CloseButton>
          </CloseButtonContainer>
          {children}
        </Content>
      </View>
    </Modal>
  );
}

// Subcomponents
export function DialogHeader({ children, style }: DialogHeaderProps) {
  return <Header style={style}>{children}</Header>;
}

export function DialogFooter({ children, style }: DialogFooterProps) {
  return <Footer style={style}>{children}</Footer>;
}

export function DialogTitle({ children, style }: DialogTitleProps) {
  return <Title style={style}>{children}</Title>;
}

export function DialogDescription({ children, style }: DialogDescriptionProps) {
  return <Description style={style}>{children}</Description>;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
