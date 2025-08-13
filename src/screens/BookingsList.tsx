// app/screens/BookingsList.tsx
import React, { useMemo } from "react";
import { ActivityIndicator, View, Text, FlatList, Alert } from "react-native";
import styled from "styled-components/native";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "../components/ui/button";

import CalendarDaysIcon from "../../assets/CalendarDaysIcon";
import CalendarIcon from "../../assets/CalendarIcon";
import ClockIcon from "../../assets/ClockIcon";
import UsersIcon from "../../assets/UsersIcon";
import MoveLeftIcon from "../../assets/MoveLeftIcon";
import CircleXIcon from "../../assets/CircleXIcon";
import CheckIcon from "../../assets/CheckIcon";

import { MY_BOOKINGS_QUERY } from "../api/user/queries";
import { CANCEL_BOOKING_MUTATION } from "../api/booking/mutations";

// ───────────────────────────────────────── Types ─────────────────────────────────────────
type Tone = "default" | "green" | "yellow" | "red" | "blue";
type Variant = "green" | "yellow" | "gray" | "red" | "blue";

interface CardProps { $tone: Tone }
interface BadgeProps { $variant: Variant }

type Props = {
  onBackToRegulations: () => void;
};

type Booking = {
  id: string;
  status: string;                     // API returns UPPERCASE: PENDING/CANCELLED/CONFIRMED
  bookingDate: string;
  pendingTimestamp?: string | null;
  isCancellable?: boolean | null;
  facility: { id: string; info: string };
  slot: { id: string; theHour: number };
  participants?: Array<{
    id: string;
    isConfirmed: boolean;
    user: { id: string; name: string };
  }>;
};

// ───────────────────────────────────── Styled Components ──────────────────────────────────────
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-top: 30px;
  padding-bottom: 32px;
`;

const MaxWidthContainer = styled.View`
  max-width: 384px;
  margin: 0 auto;
  width: 100%;
  flex: 1; /* important so the list gets height */
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
  padding-top: 20px;
`;

const IconContainer = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #007aff;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

const Title = styled.Text`
  color: #007aff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: 16px;
  text-align: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const SpaceBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleText = styled.Text`
  font-size: 16px;
  color: #111827;
  font-weight: 600;
`;

const SubText = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const Dot = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #9ca3af;
  margin-horizontal: 6px;
`;

const Line = styled.View`
  height: 1px;
  background-color: #e5e7eb;
  margin: 10px 0;
`;

// Card
const Card = styled.View<CardProps>`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 12px;
  margin-bottom: 12px;

  ${(props: CardProps) => {
    const t = props.$tone;
    return t === "green"
      ? "border-color:#34d39933;background-color:#ecfdf5;"
      : t === "yellow"
      ? "border-color:#fcd34d33;background-color:#fffbeb;"
      : t === "red"
      ? "border-color:#fca5a533;background-color:#fef2f2;"
      : t === "blue"
      ? "border-color:#93c5fd33;background-color:#eff6ff;"
      : "";
  }}
`;

// Badge
const Badge = styled.View<BadgeProps>`
  padding: 4px 8px;
  border-radius: 999px;
  flex-direction: row;
  align-items: center;

  ${(props: BadgeProps) => {
    const v = props.$variant;
    return v === "green"
      ? "background-color:#dcfce7;"
      : v === "yellow"
      ? "background-color:#fef9c3;"
      : v === "red"
      ? "background-color:#fee2e2;"
      : v === "blue"
      ? "background-color:#dbeafe;"
      : "background-color:#f3f4f6;";
  }}
`;

// BadgeText
const BadgeText = styled.Text<BadgeProps>`
  font-size: 12px;

  ${(props: BadgeProps) => {
    const v = props.$variant;
    return v === "green"
      ? "color:#166534;"
      : v === "yellow"
      ? "color:#854d0e;"
      : v === "red"
      ? "color:#991b1b;"
      : v === "blue"
      ? "color:#1e3a8a;"
      : "color:#374151;";
  }}
`;

const FixedButtonsWrapper = styled.View`
  padding: 16px 20px 20px 20px;
`;

// ─────────────────────────────────────── Helpers ────────────────────────────────────────
const toHumanDate = (isoDate: string) => {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};

const toHumanTime = (hour24: number) => {
  const d = new Date();
  d.setHours(hour24, 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const norm = (s: string) => s?.toLowerCase?.() ?? ""; // normalize API status to lowercase

const getTone = (b: Booking): Tone => {
  const s = norm(b.status);
  if (s === "confirmed") return "green";
  if (s === "pending") return "yellow";
  if (s === "cancelled") return "red";
  return "default";
};

const statusBadge = (b: Booking): { variant: Variant; text: string } => {
  const s = norm(b.status);
  if (s === "confirmed") return { variant: "green", text: "Confirmed" };
  if (s === "pending") return { variant: "yellow", text: "Pending" };
  if (s === "cancelled") return { variant: "red", text: "Cancelled" };
  return { variant: "gray", text: b.status };
};

const isCancellableFallback = (b: Booking) => {
  // client-side >24h check, used only if API didn't send isCancellable
  if (norm(b.status) !== "confirmed") return false;
  const d = new Date(b.bookingDate + "T00:00:00");
  d.setHours(b.slot.theHour, 0, 0, 0);
  const now = new Date();
  return d.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
};

// ─────────────────────────────────────── Screen ────────────────────────────────────────
export const BookingsList: React.FC<Props> = ({ onBackToRegulations }) => {
  const { data, loading, error, refetch } = useQuery(MY_BOOKINGS_QUERY, { fetchPolicy: "no-cache" });

  const [cancelBooking, { loading: cancelling }] = useMutation(CANCEL_BOOKING_MUTATION, {
    onCompleted: (res) => {
      const ok = res?.cancelBooking?.success;
      const msg = res?.cancelBooking?.message ?? (ok ? "Booking canceled." : "Failed to cancel");
      Alert.alert(ok ? "Cancelled" : "Oops", msg);
      refetch();
    },
    onError: (e) => Alert.alert("Error", e.message),
  });

  const bookings: Booking[] = useMemo(() => data?.myBookings ?? [], [data]);

  if (loading) {
    return (
      <Container>
        <MaxWidthContainer>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
            <ActivityIndicator size="large" color="#007aff" />
          </View>
        </MaxWidthContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MaxWidthContainer>
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: "#dc2626", marginBottom: 12, textAlign: "center" }}>
              Error: {error.message}
            </Text>
            <Button variant="outline" onPress={() => refetch()} style={{ width: "100%", marginBottom: 8 }}>
              Try again
            </Button>
            <Button variant="ghost" onPress={onBackToRegulations} style={{ width: "100%" }}>
              Back
            </Button>
          </View>
        </MaxWidthContainer>
      </Container>
    );
  }

  return (
    <Container>
      <MaxWidthContainer>
        {/* Header */}
        <HeaderContainer>
          <IconContainer>
            <CalendarDaysIcon size={24} color="#ffffff" />
          </IconContainer>
          <Title>My Reservations</Title>
          <Subtitle>View, track, and manage all your bookings</Subtitle>
        </HeaderContainer>

        {/* List */}
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Text style={{ color: "#6b7280" }}>You don’t have any reservations yet.</Text>
            </View>
          }
          renderItem={({ item: b }) => {
            const badge = statusBadge(b);
            const tone = getTone(b);
            const totalFriends = b.participants?.length ?? 0;
            const confirmedFriends = b.participants?.filter((p) => p.isConfirmed).length ?? 0;
            const showCancel = typeof b.isCancellable === "boolean" ? b.isCancellable : isCancellableFallback(b);

            return (
              <Card $tone={tone}>
                <SpaceBetween>
                  <TitleText>{b.facility?.info ?? "Facility"}</TitleText>
                  <Badge $variant={badge.variant}>
                    <Row>
                      {badge.variant === "green" ? (
                        <CheckIcon size={14} color="#166534" />
                      ) : badge.variant === "yellow" ? (
                        <ClockIcon size={14} color="#854d0e" />
                      ) : badge.variant === "red" ? (
                        <CircleXIcon size={14} color="#991b1b" />
                      ) : (
                        <CalendarIcon size={14} color="#374151" />
                      )}
                      <BadgeText $variant={badge.variant}>{badge.text}</BadgeText>
                    </Row>
                  </Badge>
                </SpaceBetween>

                <Line />

                <Row>
                  <CalendarIcon size={16} color="#6b7280" />
                  <SubText>{toHumanDate(b.bookingDate)}</SubText>
                  <Dot />
                  <ClockIcon size={16} color="#6b7280" />
                  <SubText>{toHumanTime(b.slot.theHour)}</SubText>
                </Row>

                {totalFriends > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Row>
                      <UsersIcon size={16} color="#6b7280" />
                      <SubText>
                        {confirmedFriends}/{totalFriends} friends confirmed
                      </SubText>
                    </Row>
                  </View>
                )}

                {showCancel && (
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                    <Button
                      variant="outline"
                      onPress={() => cancelBooking({ variables: { bookingId: b.id } })}
                      disabled={cancelling}
                      style={{ flex: 1, paddingVertical: 12 }}
                    >
                      <Row style={{ justifyContent: "center" }}>
                        <CircleXIcon size={16} color="#991b1b" />
                        <Text style={{ marginLeft: 8, color: "#991b1b", fontWeight: "500" }}>
                          Cancel
                        </Text>
                      </Row>
                    </Button>
                  </View>
                )}
              </Card>
            );
          }}
        />

        {/* Bottom button */}
        <FixedButtonsWrapper>
          <Button variant="outline" onPress={onBackToRegulations} style={{ width: "100%", paddingVertical: 16 }}>
            <Row style={{ justifyContent: "center" }}>
              <MoveLeftIcon size={16} color="#6b7280" />
              <Text style={{ marginLeft: 8, color: "#6b7280", fontWeight: "500" }}>
                Back to Regulations
              </Text>
            </Row>
          </Button>
        </FixedButtonsWrapper>
      </MaxWidthContainer>
    </Container>
  );
};
