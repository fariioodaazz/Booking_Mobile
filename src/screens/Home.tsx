// src/screens/Home.tsx
import React from "react";
import { Button } from "../shared/components/Button/Button";
import { SafeAreaView } from "react-native";

import styled from "styled-components/native";
import {theme} from "../shared/styles/theme";
import { ThemeProvider } from 'styled-components/native';


type Props = {
  onBookCourt: () => void;
  onLogout: () => void;
};


export const Home: React.FC<Props> = ({ onBookCourt, onLogout }) => {
  return (
    <ThemeProvider theme={theme}>
          <Button title="Book a court" onPress={onBookCourt} variant="primary" size="lg" fullWidth />
          <Button title="Logout" onPress={onLogout} variant="outline" size="md" fullWidth />
    </ThemeProvider>
  );
};

export default Home;
