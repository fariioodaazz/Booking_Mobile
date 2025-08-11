import React from "react";
import styled from "styled-components";
import { BookingList } from "@features/booking/components/BookingList";

const Wrap = styled.div`
  max-width: 880px; margin: 0 auto;
`;

export const Home: React.FC = () => (
  <Wrap>
    <h2>Home</h2>
    <BookingList />
  </Wrap>
);
