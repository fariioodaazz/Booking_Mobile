// src/screens/Home.tsx
import React from "react";
import { Button } from "../components/ui/button";
import { SafeAreaView, Text } from "react-native";
import styled from "styled-components/native";

const Container = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  padding: 20px;
  gap: 16px;
`;

type Props = {
  onBookCourt: () => void;
  onLogout: () => void;
};

export const Home: React.FC<Props> = ({ onBookCourt, onLogout }) => {
  return (
    <Container>
      <Button onPress={onBookCourt} variant="default" size="lg">
        Book a court
      </Button>
      <Button onPress={onLogout} variant="outline" size="default">
        Logout
      </Button>
    </Container>
  );
};

export default Home;
