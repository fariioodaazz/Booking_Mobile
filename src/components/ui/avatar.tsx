import React, { useState } from "react";
import styled from "styled-components/native";

type AvatarProps = {
  source?: any;
  fallback?: string;
  defaultImage?: any;
  style?: any;
  size?: number;
};

type AvatarImageProps = {
  source: any;
  style?: any;
};

type AvatarFallbackProps = {
  children: React.ReactNode;
  style?: any;
};

const AvatarContainer = styled.View<{ size: number }>`
  width: ${(props: { size: number }) => props.size}px;
  height: ${(props: { size: number }) => props.size}px;
  border-radius: ${(props: { size: number }) => props.size / 2}px;
  overflow: hidden;
  background-color: #f3f4f6;
  align-items: center;
  justify-content: center;
`;

const AvatarImageStyled = styled.Image<{ size: number }>`
  width: ${(props: { size: number }) => props.size}px;
  height: ${(props: { size: number }) => props.size}px;
  border-radius: ${(props: { size: number }) => props.size / 2}px;
`;

const AvatarFallbackContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
`;

const AvatarFallbackText = styled.Text`
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
`;

export function Avatar({ source, fallback, defaultImage, style, size = 40 }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Use defaultImage if provided, otherwise fall back to text
  const fallbackSource = defaultImage || require('../../../assets/default_pic.jpg');
  
  return (
    <AvatarContainer style={style} size={size}>
      {source && !imageError ? (
        <AvatarImageStyled 
          source={source} 
          size={size}
          onError={() => setImageError(true)}
        />
      ) : (defaultImage && !fallback) || (!source && defaultImage) ? (
        <AvatarImageStyled source={fallbackSource} size={size} />
      ) : (
        <AvatarFallbackContainer>
          <AvatarFallbackText>{fallback}</AvatarFallbackText>
        </AvatarFallbackContainer>
      )}
    </AvatarContainer>
  );
}

export function AvatarImage({ source, style }: AvatarImageProps) {
  return <AvatarImageStyled source={source} style={style} size={40} />;
}

export function AvatarFallback({ children, style }: AvatarFallbackProps) {
  return (
    <AvatarFallbackContainer style={style}>
      <AvatarFallbackText>{children}</AvatarFallbackText>
    </AvatarFallbackContainer>
  );
}

