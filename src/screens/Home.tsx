import React from "react";
import styled from "styled-components/native";
import { BookingList } from "@features/booking/components/BookingList";

const Wrap = styled.View`
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

export const Home: React.FC = () => (
  <Wrap>
    <Title>Home</Title>
    <BookingList />
  </Wrap>
);
