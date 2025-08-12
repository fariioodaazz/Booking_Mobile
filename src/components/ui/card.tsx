import React from "react";
import styled from "styled-components/native";

type CardProps = {
  children: React.ReactNode;
  style?: any;
};

type CardHeaderProps = {
  children: React.ReactNode;
  style?: any;
};

type CardContentProps = {
  children: React.ReactNode;
  style?: any;
};

type CardFooterProps = {
  children: React.ReactNode;
  style?: any;
};

type CardTitleProps = {
  children: React.ReactNode;
  style?: any;
};

type CardDescriptionProps = {
  children: React.ReactNode;
  style?: any;
};

const CardContainer = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const CardHeaderContainer = styled.View`
  padding: 16px;
  padding-bottom: 8px;
`;

const CardContentContainer = styled.View`
  padding-horizontal: 16px;
  padding-bottom: 16px;
`;

const CardFooterContainer = styled.View`
  padding: 16px;
  padding-top: 8px;
`;

const CardTitleText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 24px;
`;

const CardDescriptionText = styled.Text`
  font-size: 14px;
  color: #6b7280;
  line-height: 20px;
  margin-top: 4px;
`;

export function Card({ children, style }: CardProps) {
  return (
    <CardContainer style={style}>
      {children}
    </CardContainer>
  );
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <CardHeaderContainer style={style}>
      {children}
    </CardHeaderContainer>
  );
}

export function CardContent({ children, style }: CardContentProps) {
  return (
    <CardContentContainer style={style}>
      {children}
    </CardContentContainer>
  );
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <CardFooterContainer style={style}>
      {children}
    </CardFooterContainer>
  );
}

export function CardTitle({ children, style }: CardTitleProps) {
  return (
    <CardTitleText style={style}>
      {children}
    </CardTitleText>
  );
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  return (
    <CardDescriptionText style={style}>
      {children}
    </CardDescriptionText>
  );
}
