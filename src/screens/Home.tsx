// src/screens/Home.tsx
import React from "react";
import { Button } from "../shared/components/Button/Button";
import { SafeAreaView } from "react-native";

import styled, { DefaultTheme } from "styled-components/native";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    spacing: (factor: number) => number;
  }
}

type Props = {
  onBookCourt: () => void;
  onLogout: () => void;
};


export const Home: React.FC<Props> = ({ onBookCourt, onLogout }) => {
  return (
    <>
          <Button title="Book a court" onPress={onBookCourt} variant="primary" size="lg" fullWidth />
          <Button title="Logout" onPress={onLogout} variant="outline" size="md" fullWidth />
    </>
  );
};

export default Home;
