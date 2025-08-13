// app/screens/BookingsList.tsx
import React, { useMemo } from "react";
import { ActivityIndicator, View, Text, FlatList, Alert, Dimensions, StatusBar } from "react-native";
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
import { Booking } from "../api/booking/types";

const { width, height } = Dimensions.get('window');

// Responsive helper
const getResponsiveDimensions = () => {
  const isSmallScreen = height < 700;
  const isTablet = width > 768;
  const isVerySmallScreen = height < 600;
  
  return {
    isSmallScreen,
    isTablet,
    isVerySmallScreen,
    sidePadding: isSmallScreen ? 16 : 20,
    maxWidth: isTablet ? 500 : 400,
    containerPaddingTop: (StatusBar.currentHeight || 0) + (isVerySmallScreen ? 8 : 10),
    containerPaddingBottom: isVerySmallScreen ? 20 : 32,
    headerPaddingTop: isVerySmallScreen ? 10 : 20,
    headerMarginBottom: isVerySmallScreen ? 12 : 16,
    iconSize: isSmallScreen ? 48 : 56,
    titleSize: isSmallScreen ? 22 : 24,
    subtitleSize: isSmallScreen ? 14 : 16,
    cardPadding: isSmallScreen ? 10 : 12,
    cardMarginBottom: isSmallScreen ? 10 : 12,
    titleTextSize: isSmallScreen ? 14 : 16,
    subTextSize: isSmallScreen ? 11 : 12,
    badgeTextSize: isSmallScreen ? 11 : 12,
    buttonPadding: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
    buttonTextSize: isSmallScreen ? 14 : 16,
    bottomPadding: isVerySmallScreen ? 16 : 20,
  };
};

// ───────────────────────────────────────── Types ─────────────────────────────────────────
type Tone = "default" | "green" | "yellow" | "red" | "blue";
type Variant = "green" | "yellow" | "gray" | "red" | "blue";

interface CardProps { $tone: Tone }
interface BadgeProps { $variant: Variant }

type Props = {
  onBackToRegulations: () => void;
};



// ───────────────────────────────────── Styled Components ──────────────────────────────────────
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-top: ${() => getResponsiveDimensions().containerPaddingTop}px;
  padding-bottom: ${() => getResponsiveDimensions().containerPaddingBottom}px;
`;

const MaxWidthContainer = styled.View`
  max-width: ${() => getResponsiveDimensions().maxWidth}px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  padding-horizontal: ${() => getResponsiveDimensions().sidePadding}px;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${() => getResponsiveDimensions().headerMarginBottom}px;
  padding-top: ${() => getResponsiveDimensions().headerPaddingTop}px;
`;

const IconContainer = styled.View`
  width: ${() => getResponsiveDimensions().iconSize}px;
  height: ${() => getResponsiveDimensions().iconSize}px;
  border-radius: ${() => getResponsiveDimensions().iconSize / 2}px;
  background-color: #007aff;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

const Title = styled.Text`
  color: #007aff;
  font-size: ${() => getResponsiveDimensions().titleSize}px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: ${() => getResponsiveDimensions().subtitleSize}px;
  text-align: center;
  padding-horizontal: 10px;
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
  font-size: ${() => getResponsiveDimensions().titleTextSize}px;
  color: #111827;
  font-weight: 600;
  flex: 1;
`;

const SubText = styled.Text`
  font-size: ${() => getResponsiveDimensions().subTextSize}px;
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
  margin: ${() => getResponsiveDimensions().isVerySmallScreen ? '8px' : '10px'} 0;
`;

// Card
const Card = styled.View<CardProps>`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  padding: ${() => getResponsiveDimensions().cardPadding}px;
  margin-bottom: ${() => getResponsiveDimensions().cardMarginBottom}px;

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
  padding: ${() => getResponsiveDimensions().isVerySmallScreen ? '3px 6px' : '4px 8px'};
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
  font-size: ${() => getResponsiveDimensions().badgeTextSize}px;

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
  padding: ${() => getResponsiveDimensions().bottomPadding}px;
`;

const EmptyContainer = styled.View`
  align-items: center;
  padding-vertical: ${() => getResponsiveDimensions().isVerySmallScreen ? '30px' : '40px'};
  flex: 1;
  justify-content: center;
`;

const EmptyText = styled.Text`
  color: #6b7280;
  font-size: ${() => getResponsiveDimensions().subtitleSize}px;
  text-align: center;
  padding-horizontal: 20px;
`;

const ErrorContainer = styled.View`
  padding: 16px;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const ErrorText = styled.Text`
  color: #dc2626;
  margin-bottom: 12px;
  text-align: center;
  font-size: ${() => getResponsiveDimensions().subtitleSize}px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: ${() => getResponsiveDimensions().isVerySmallScreen ? '30px' : '40px'};
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
          <LoadingContainer>
            <ActivityIndicator size="large" color="#007aff" />
          </LoadingContainer>
        </MaxWidthContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <MaxWidthContainer>
          <ErrorContainer>
            <ErrorText>Error: {error.message}</ErrorText>
            <Button variant="outline" onPress={() => refetch()} style={{ width: "100%", marginBottom: 8 }}>
              Try again
            </Button>
            <Button variant="ghost" onPress={onBackToRegulations} style={{ width: "100%" }}>
              Back
            </Button>
          </ErrorContainer>
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
            <CalendarDaysIcon size={getResponsiveDimensions().isSmallScreen ? 20 : 24} color="#ffffff" />
          </IconContainer>
          <Title>My Reservations</Title>
          <Subtitle>View, track, and manage all your bookings</Subtitle>
        </HeaderContainer>

        {/* List */}
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingBottom: 16, 
            flexGrow: 1,
            paddingHorizontal: 0
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyContainer>
              <EmptyText>You don't have any reservations yet.</EmptyText>
            </EmptyContainer>
          }
          renderItem={({ item: b }) => {
            const badge = statusBadge(b);
            const tone = getTone(b);
            const totalFriends = b.participants?.length ?? 0;
            const confirmedFriends = b.participants?.filter((p) => p.isConfirmed).length ?? 0;
            const showCancel = typeof b.isCancellable === "boolean" ? b.isCancellable : isCancellableFallback(b);
            const dims = getResponsiveDimensions();

            return (
              <Card $tone={tone}>
                <SpaceBetween>
                  <TitleText>{b.facility?.info ?? "Facility"}</TitleText>
                  <Badge $variant={badge.variant}>
                    <Row>
                      {badge.variant === "green" ? (
                        <CheckIcon size={dims.isVerySmallScreen ? 12 : 14} color="#166534" />
                      ) : badge.variant === "yellow" ? (
                        <ClockIcon size={dims.isVerySmallScreen ? 12 : 14} color="#854d0e" />
                      ) : badge.variant === "red" ? (
                        <CircleXIcon size={dims.isVerySmallScreen ? 12 : 14} color="#991b1b" />
                      ) : (
                        <CalendarIcon size={dims.isVerySmallScreen ? 12 : 14} color="#374151" />
                      )}
                      <BadgeText $variant={badge.variant}>{badge.text}</BadgeText>
                    </Row>
                  </Badge>
                </SpaceBetween>

                <Line />

                <Row>
                  <CalendarIcon size={dims.isVerySmallScreen ? 14 : 16} color="#6b7280" />
                  <SubText>{toHumanDate(b.bookingDate)}</SubText>
                  <Dot />
                  <ClockIcon size={dims.isVerySmallScreen ? 14 : 16} color="#6b7280" />
                  <SubText>{toHumanTime(b.slot.theHour)}</SubText>
                </Row>

                {totalFriends > 0 && (
                  <View style={{ marginTop: dims.isVerySmallScreen ? 6 : 8 }}>
                    <Row>
                      <UsersIcon size={dims.isVerySmallScreen ? 14 : 16} color="#6b7280" />
                      <SubText>
                        {confirmedFriends}/{totalFriends} friends confirmed
                      </SubText>
                    </Row>
                  </View>
                )}

                {showCancel && (
                  <View style={{ 
                    flexDirection: "row", 
                    gap: 8, 
                    marginTop: dims.isVerySmallScreen ? 10 : 12 
                  }}>
                    <Button
                      variant="outline"
                      onPress={() => cancelBooking({ variables: { bookingId: b.id } })}
                      disabled={cancelling}
                      style={{ 
                        flex: 1, 
                        paddingVertical: dims.buttonPadding 
                      }}
                    >
                      <Row style={{ justifyContent: "center" }}>
                        <CircleXIcon size={dims.isVerySmallScreen ? 14 : 16} color="#991b1b" />
                        <Text style={{ 
                          marginLeft: 8, 
                          color: "#991b1b", 
                          fontWeight: "500",
                          fontSize: dims.buttonTextSize
                        }}>
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
          <Button 
            variant="outline" 
            onPress={onBackToRegulations} 
            style={{ 
              width: "100%", 
              paddingVertical: getResponsiveDimensions().buttonPadding 
            }}
          >
            <Row style={{ justifyContent: "center" }}>
              <MoveLeftIcon size={16} color="#6b7280" />
              <Text style={{ 
                marginLeft: 8, 
                color: "#6b7280", 
                fontWeight: "500",
                fontSize: getResponsiveDimensions().buttonTextSize
              }}>
                Back to Regulations
              </Text>
            </Row>
          </Button>
        </FixedButtonsWrapper>
      </MaxWidthContainer>
    </Container>
  );
};