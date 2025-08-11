import React from "react";
import styled from "styled-components/native";
import { useMyBookings } from "../hooks/useMyBookings";
import { FlatList } from "react-native";
import { theme } from "../../../shared/styles/theme";
import { View } from "react-native";


const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const RefreshButton = styled.Pressable`
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
`;

const Line = styled.Text`
  color: #374151;
`;

export const BookingList: React.FC = () => {
  const { loading, error, data, refetch } = useMyBookings({ fetchPolicy: "no-cache" });

  if (loading) return <Line>Loading…</Line>;
  if (error)   return <Line style={{ color: "crimson" }}>Error: {error.message}</Line>;

  const bookings = data?.myBookings ?? [];

  return (
    <View>
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
    </View>
  );
};

export default BookingList;
