import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import {Button } from "../shared/components/Button/Button";


export const RegulationsScreen: React.FC<{
  facilityId: string;
  onShowReservations: () => void;
  onReserve: () => void;
  onBackHome: () => void;
}> = ({ facilityId, onShowReservations, onReserve, onBackHome }) => {
  return (
    <>
      <Text>Regulations for facility {facilityId}</Text>
      <Button title="Show Reservations" onPress={onShowReservations} />
      <Button title="Reserve" onPress={onReserve} />
      <Button title="Back Home" onPress={onBackHome} variant="outline" size="md" fullWidth />
    </>
  );
};
