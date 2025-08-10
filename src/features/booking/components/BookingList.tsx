import React from "react";
import styled from "styled-components/native";
import { useMyBookings } from "../hooks/useMyBookings";
import { FlatList } from "react-native";
import { theme } from "../../../shared/styles/theme";

const Wrap = styled.View`
  padding: ${theme.spacing(6)}px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3)}px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const RefreshButton = styled.Pressable`
  padding: ${theme.spacing(2)}px ${theme.spacing(3)}px;
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: ${theme.radii.md}px;
`;

const RefreshText = styled.Text`
  font-weight: 500;
`;

const Item = styled.View`
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: ${theme.radii.md}px;
  padding: ${theme.spacing(3)}px;
  margin-bottom: ${theme.spacing(3)}px;
`;

const Line = styled.Text`
  color: #374151;
`;

export const BookingList: React.FC = () => {
  const { loading, error, data, refetch } = useMyBookings({ fetchPolicy: "no-cache" });

  if (loading) return <Wrap><Line>Loading…</Line></Wrap>;
  if (error)   return <Wrap><Line style={{ color: "crimson" }}>Error: {error.message}</Line></Wrap>;

  const bookings = data?.myBookings ?? [];

  return (
    <Wrap>
      <HeaderRow>
        <Title>My Bookings</Title>
        <RefreshButton onPress={() => refetch()}>
          <RefreshText>Refresh</RefreshText>
        </RefreshButton>
      </HeaderRow>

      {bookings.length === 0 ? (
        <Line>You have no bookings yet.</Line>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b: any) => String(b.id)}
          renderItem={({ item: b }: any) => (
            <Item>
              <Line><Line style={{ fontWeight: "600" }}>Booking ID:</Line> {b.id}</Line>
              <Line>Facility ID: {b?.facility?.id ?? "—"}</Line>
              <Line>Slot ID: {b?.slot?.id ?? "—"}</Line>
            </Item>
          )}
        />
      )}
    </Wrap>
  );
};

export default BookingList;
