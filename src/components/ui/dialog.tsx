import React from "react";
import styled from "styled-components/native";
import Modal from "react-native-modal";
import { TouchableOpacity } from "react-native";
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

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const Content = styled.View`
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
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

export function Dialog({ visible, onClose, children, style }: DialogProps) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropTransitionOutTiming={0}
      style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
    >
      <Overlay>
        <Content style={style}>
          <CloseButtonContainer>
            <CloseButton onPress={onClose}>
              <X size={20} color="#6b7280" />
            </CloseButton>
          </CloseButtonContainer>
          {children}
        </Content>
      </Overlay>
    </Modal>
  );
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogClose({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

export function DialogOverlay({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DialogContent({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Content style={style}>{children}</Content>;
}

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
