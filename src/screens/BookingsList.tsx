// app/screens/BookingsList.tsx
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
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

import FilterDropdown from "../components/ui/FilterDropdown";
import { useToast } from "../app/hooks/useToast";
import { MY_INVOLVED_BOOKINGS_QUERY } from "../api/user/queries";
import { CANCEL_BOOKING_MUTATION } from "../api/booking/mutations";
import type { Booking } from "../api/booking/types";

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

const { width } = Dimensions.get("window");

// ───────────────────────────────────────── Types ─────────────────────────────────────────
type Tone = "default" | "green" | "yellow" | "red" | "blue";
type Variant = "green" | "yellow" | "gray" | "red" | "blue";

type StatusFilter =
  | "all"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "rejected";

type RoleFilter = "ANY" | "MINE" | "PARTICIPANT";

type Props = { onBackToRegulations: () => void };



// ───────────────────────────────────── Styled Components ──────────────────────────────────────
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-top: 8%;
  padding-bottom: 15%;
`;

const MaxWidthContainer = styled.View`
  width: 92%;
  margin: 0 auto;
  flex: 1;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 4%;
  padding-top: 5%;
`;

const IconContainer = styled.View`
  width: ${width * 0.14}px;
  height: ${width * 0.14}px;
  border-radius: ${width * 0.07}px;
  background-color: #007aff;
  align-items: center;
  justify-content: center;
  margin-bottom: 2%;
`;

const Title = styled.Text`
  color: #007aff;
  font-size: ${Math.min(width * 0.06, 24)}px;
  font-weight: 600;
  margin-bottom: 1%;
  text-align: center;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: ${Math.min(width * 0.04, 16)}px;
  text-align: center;
  padding-horizontal: 5%;
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
  font-size: ${Math.min(width * 0.04, 16)}px;
  color: #111827;
  font-weight: 600;
  flex: 1;
`;

const SubText = styled.Text`
  font-size: ${Math.min(width * 0.035, 14)}px;
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
  margin: 2.5% 0;
`;


type CardProps = { $tone: Tone };
const Card = styled.View<CardProps>`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  padding: 4%;
  margin-bottom: 3%;

  ${(p: CardProps) =>
    p.$tone === "green"
      ? "border-color:#34d39933;background-color:#ecfdf5;"
      : p.$tone === "yellow"
      ? "border-color:#fcd34d33;background-color:#fffbeb;"
      : p.$tone === "red"
      ? "border-color:#fca5a533;background-color:#fef2f2;"
      : p.$tone === "blue"
      ? "border-color:#93c5fd33;background-color:#eff6ff;"
      : ""}
`;


type BadgeProps = { $variant: Variant };
const Badge = styled.View<BadgeProps>`
  padding: 1% 2%;
  border-radius: 999px;
  flex-direction: row;
  align-items: center;

  ${(p: BadgeProps) =>
    p.$variant === "green"
      ? "background-color:#dcfce7;"
      : p.$variant === "yellow"
      ? "background-color:#fef9c3;"
      : p.$variant === "red"
      ? "background-color:#fee2e2;"
      : p.$variant === "blue"
      ? "background-color:#dbeafe;"
      : "background-color:#f3f4f6;"}
`;

const BadgeText = styled.Text<BadgeProps>`
  font-size: ${Math.min(width * 0.032, 12)}px;
  ${(p: BadgeProps) =>
    p.$variant === "green"
      ? "color:#166534;"
      : p.$variant === "yellow"
      ? "color:#854d0e;"
      : p.$variant === "red"
      ? "color:#991b1b;"
      : p.$variant === "blue"
      ? "color:#1e3a8a;"
      : "color:#374151;"}
`;

const FixedButtonsWrapper = styled.View`
  position: absolute;
  bottom: 8%;
  left: 4%;
  right: 4%;
  align-items: center;
`;

const EmptyContainer = styled.View`
  align-items: center;
  padding-vertical: 12%;
  flex: 1;
  justify-content: center;
`;

const EmptyText = styled.Text`
  color: #6b7280;
  font-size: ${Math.min(width * 0.04, 16)}px;
  text-align: center;
  padding-horizontal: 5%;
`;

const ErrorContainer = styled.View`
  padding: 4%;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const ErrorText = styled.Text`
  color: #dc2626;
  margin-bottom: 3%;
  text-align: center;
  font-size: ${Math.min(width * 0.04, 16)}px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 12%;
`;

const FiltersRow = styled.View`
  margin-bottom: 16px;
  gap: 12px;
`;

const FiltersRowInner = styled.View`
  flex-direction: row;
  gap: 12px;
`;

// ─────────────────────────────────────── Helpers ────────────────────────────────────────
const toHumanDate = (isoDate: string) => {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const toHumanTime = (hour24: number) => {
  const d = new Date();
  d.setHours(hour24, 0, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const norm = (s: string) => s?.toLowerCase?.() ?? "";

const getTone = (b: Booking): Tone => {
  const s = norm(b.status);
  if (s === "confirmed") return "green";
  if (s === "pending") return "yellow";
  if (s === "cancelled") return "red";
  if (s === "rejected") return "red";
  if (s === "completed") return "blue";
  return "default";
};

const statusBadge = (b: Booking): { variant: Variant; text: string } => {
  const s = norm(b.status);
  if (s === "confirmed") return { variant: "green", text: "Confirmed" };
  if (s === "pending") return { variant: "yellow", text: "Pending" };
  if (s === "cancelled") return { variant: "red", text: "Cancelled" };
  if (s === "rejected") return { variant: "red", text: "Rejected" };
  if (s === "completed") return { variant: "blue", text: "Completed" };
  return { variant: "gray", text: b.status };
};

// ─────────────────────────────────────── Screen ────────────────────────────────────────
export const BookingsList: React.FC<Props> = ({ onBackToRegulations }) => {
  const { Toast, show, showError } = useToast();

  // dropdown UI state
  const [statusOpen, setStatusOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  // filter values bound to server query
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ANY");


  
  const { data: allData, loading, error, refetch } = useQuery(
    MY_INVOLVED_BOOKINGS_QUERY,
    {
      variables: { status: null, role: "ANY" }, 
      fetchPolicy: "cache-and-network",
    }
  );

  const [cancelBooking, { loading: cancelling }] = useMutation(
    CANCEL_BOOKING_MUTATION,
    {
      onCompleted: (res) => {
        const ok = res?.cancelBooking?.success;
        const msg =
          res?.cancelBooking?.message ??
          (ok ? "Booking cancelled." : "Failed to cancel.");
        if (ok) {
          show("Booking cancelled.");
          refetch();
        } else {
          showError(msg);
        }
      },
      onError: (e) => {
        showError(e.message);
      },
    }
  );

  // Get all bookings from the query
  const allBookings: Booking[] = useMemo(
    () => allData?.myInvolvedBookings ?? [],
    [allData]
  );

  // Filter bookings based on current filters 
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => norm(b.status) === statusFilter);
    }

    // Filter by role
    if (roleFilter === "MINE") {
      filtered = filtered.filter(b => b.isMine);
    } else if (roleFilter === "PARTICIPANT") {
      filtered = filtered.filter(b => b.amIParticipant && !b.isMine);
    }

    return filtered;
  }, [allBookings, statusFilter, roleFilter]);

  // Confirm Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [pendingCancelLabel, setPendingCancelLabel] = useState<string>("");

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingCancelId(null);
    setPendingCancelLabel("");
  };
  const openConfirm = (bookingId: string, label: string) => {
    setPendingCancelId(bookingId);
    setPendingCancelLabel(label);
    setConfirmOpen(true);
  };

  // Calculate counts for all filter combinations
  const counts = useMemo(() => {
    // Helper function to count bookings by status and role
    const countBookings = (statusToCount: StatusFilter, roleToCount: RoleFilter) => {
      let bookingsToCount = allBookings;

      // Filter by role first
      if (roleToCount === "MINE") {
        bookingsToCount = bookingsToCount.filter(b => b.isMine);
      } else if (roleToCount === "PARTICIPANT") {
        bookingsToCount = bookingsToCount.filter(b => b.amIParticipant && !b.isMine);
      }

      // Then filter by status
      if (statusToCount === "all") {
        return bookingsToCount.length;
      } else {
        return bookingsToCount.filter(b => norm(b.status) === statusToCount).length;
      }
    };

    // Calculate counts for current role filter
    return {
      total: countBookings("all", roleFilter),
      confirmed: countBookings("confirmed", roleFilter),
      pending: countBookings("pending", roleFilter),
      cancelled: countBookings("cancelled", roleFilter),
      completed: countBookings("completed", roleFilter),
      rejected: countBookings("rejected", roleFilter),
    };
  }, [allBookings, roleFilter]);

  // Calculate role counts for current status filter
  const roleCounts = useMemo(() => {
    const countByRole = (roleToCount: RoleFilter) => {
      let bookingsToCount = allBookings;

      // Filter by status first
      if (statusFilter !== "all") {
        bookingsToCount = bookingsToCount.filter(b => norm(b.status) === statusFilter);
      }

      // Then filter by role
      if (roleToCount === "MINE") {
        return bookingsToCount.filter(b => b.isMine).length;
      } else if (roleToCount === "PARTICIPANT") {
        return bookingsToCount.filter(b => b.amIParticipant && !b.isMine).length;
      } else {
        return bookingsToCount.length;
      }
    };

    return {
      any: countByRole("ANY"),
      mine: countByRole("MINE"),
      participant: countByRole("PARTICIPANT"),
    };
  }, [allBookings, statusFilter]);

  const statusOptions = useMemo(
    () =>
      [
        { value: "all", label: `All (${counts.total})`, icon: <CalendarIcon size={16} color="#374151" /> },
        { value: "confirmed", label: `Confirmed (${counts.confirmed})`, icon: <CheckIcon size={16} color="#166534" /> },
        { value: "pending", label: `Pending (${counts.pending})`, icon: <ClockIcon size={16} color="#854d0e" /> },
        { value: "cancelled", label: `Cancelled (${counts.cancelled})`, icon: <CircleXIcon size={16} color="#991b1b" /> },
        { value: "completed", label: `Completed (${counts.completed})`, icon: <CalendarIcon size={16} color="#1e3a8a" /> },
        { value: "rejected", label: `Rejected (${counts.rejected})`, icon: <CircleXIcon size={16} color="#991b1b" /> },
      ] as const,
    [counts]
  );

  const roleOptions = useMemo(
    () =>
      [
        { value: "ANY", label: `All roles (${roleCounts.any})`, icon: <UsersIcon size={16} color="#374151" /> },
        { value: "MINE", label: `Owner (${roleCounts.mine})`, icon: <CheckIcon size={16} color="#2563eb" /> },
        { value: "PARTICIPANT", label: `Participant (${roleCounts.participant})`, icon: <UsersIcon size={16} color="#0f766e" /> },
      ] as const,
    [roleCounts]
  );

  // Filter change handlers
  const onChangeStatus = (v: StatusFilter) => {
    setStatusFilter(v);
  };
  
  const onChangeRole = (v: RoleFilter) => {
    setRoleFilter(v);
  };

  // UI states
  if (loading && !allData) {
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
            <Button
              variant="outline"
              onPress={() => refetch()}
              style={{ width: "100%", marginBottom: "2%" }}
            >
              Try again
            </Button>
            <Button
              variant="ghost"
              onPress={onBackToRegulations}
              style={{ width: "100%" }}
            >
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
            <CalendarDaysIcon size={Math.min(width * 0.06, 24)} color="#ffffff" />
          </IconContainer>
          <Title>My Reservations</Title>
          <Subtitle>View, track , and manage all your bookings</Subtitle>
        </HeaderContainer>

        {/* Filters row */}
        <FiltersRow>
          <FiltersRowInner>
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={onChangeStatus}
              open={statusOpen}
              setOpen={(o) => {
                setStatusOpen(o);
                if (o) setRoleOpen(false);
              }}
            />
            <FilterDropdown
              label="Role"
              options={roleOptions}
              value={roleFilter}
              onChange={onChangeRole}
              open={roleOpen}
              setOpen={(o) => {
                setRoleOpen(o);
                if (o) setStatusOpen(false);
              }}
            />
          </FiltersRowInner>
        </FiltersRow>

        {/* List */}
        <FlatList
          data={filteredBookings}
          keyExtractor={(b) => b.id}
          style={{ flex: 1, marginBottom: "25%" }}
          contentContainerStyle={{
            paddingBottom: "4%",
            flexGrow: 1,
            paddingHorizontal: 0,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyContainer>
              <EmptyText>No reservations found for this filter.</EmptyText>
            </EmptyContainer>
          }
          renderItem={({ item: b }) => {
            const badge = statusBadge(b);
            const tone = getTone(b);
            const totalFriends = b.participants?.length ?? 0;
            const confirmedFriends =
              b.participants?.filter((p) => p.isConfirmed).length ?? 0;

            return (
              <Card $tone={tone}>
                <SpaceBetween>
                  <TitleText>
                    {b.facility?.info ?? "Facility"}
                    <SubText>
                        {b.isMine ? " • Owner" : b.amIParticipant ? " • Participant" : ""}
                      </SubText>
                  </TitleText>
                  <Badge $variant={badge.variant}>
                    <Row>
                      {badge.variant === "green" ? (
                        <CheckIcon size={Math.min(width * 0.035, 14)} color="#166534" />
                      ) : badge.variant === "yellow" ? (
                        <ClockIcon size={Math.min(width * 0.035, 14)} color="#854d0e" />
                      ) : badge.variant === "red" ? (
                        <CircleXIcon size={Math.min(width * 0.035, 14)} color="#991b1b" />
                      ) : (
                        <CalendarIcon size={Math.min(width * 0.035, 14)} color="#374151" />
                      )}
                      <BadgeText $variant={badge.variant}>{badge.text}</BadgeText>
                    </Row>
                  </Badge>
                </SpaceBetween>

                <Line />

                <Row>
                  <CalendarIcon size={Math.min(width * 0.04, 16)} color="#6b7280" />
                  <SubText>{toHumanDate(b.bookingDate)}</SubText>
                  <Dot />
                  <ClockIcon size={Math.min(width * 0.04, 16)} color="#6b7280" />
                  <SubText>{toHumanTime(b.slot.theHour)}</SubText>
                </Row>

                {totalFriends > 0 && (
                  <View style={{ marginTop: "2%" }}>
                    <Row>
                      <UsersIcon size={Math.min(width * 0.04, 16)} color="#6b7280" />
                      <SubText>
                        {confirmedFriends}/{totalFriends} friends confirmed
                      </SubText>
                    </Row>
                  </View>
                )}

                {b.amIParticipant && (
                  <View style={{ marginTop: "2%" }}>
                    <Row>
                      <CheckIcon size={Math.min(width * 0.04, 16)} color="#6b7280" />
                      <SubText>Owner: {b.owner.name}</SubText>
                    </Row>
                  </View>
                )}

                {b.isCancellable && (
                  <View style={{ flexDirection: "row", gap: 8, marginTop: "3%" }}>
                    <Button
                      variant="outline"
                      onPress={() =>
                        openConfirm(
                          b.id,
                          `${b.facility?.info ?? "Facility"} • ${toHumanDate(
                            b.bookingDate
                          )} ${toHumanTime(b.slot.theHour)}`
                        )
                      }
                      disabled={cancelling}
                      style={{ flex: 1, paddingVertical: "4%" }}
                    >
                      <Row style={{ justifyContent: "center" }}>
                        <CircleXIcon size={Math.min(width * 0.04, 16)} color="#991b1b" />
                        <Text
                          style={{
                            marginLeft: 8,
                            color: "#991b1b",
                            fontWeight: "500",
                            fontSize: Math.min(width * 0.04, 16),
                          }}
                        >
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
      </MaxWidthContainer>

      {/* Fixed Bottom button */}
      <FixedButtonsWrapper>
        <Button
          variant="outline"
          onPress={onBackToRegulations}
          style={{ width: "100%", paddingVertical: "4%" }}
        >
          <Row style={{ justifyContent: "center" }}>
            <MoveLeftIcon size={16} color="#6b7280" />
            <Text
              style={{
                marginLeft: 8,
                color: "#6b7280",
                fontWeight: "500",
                fontSize: Math.min(width * 0.04, 16),
              }}
            >
              Back to Regulations
            </Text>
          </Row>
        </Button>
      </FixedButtonsWrapper>

      {/* Confirm Cancel Dialog */}
      <Dialog visible={confirmOpen} onClose={closeConfirm}>
        <DialogHeader>
          <DialogTitle>Cancel this reservation?</DialogTitle>
          <DialogDescription>
            {pendingCancelLabel || "Are you sure you want to cancel this booking?"}
            {"\n"}This action can't be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onPress={closeConfirm}
            style={{ paddingVertical: "3%", paddingHorizontal: "5%" }}
          >
            <Text style={{ color: "#374151", fontWeight: "500" }}>Keep Booking</Text>
          </Button>

          <Button
            onPress={async () => {
              if (!pendingCancelId) return;
              try {
                await cancelBooking({ variables: { bookingId: pendingCancelId } });
              } finally {
                closeConfirm();
              }
            }}
            disabled={cancelling}
            style={{
              paddingVertical: "3%",
              paddingHorizontal: "5%",
              backgroundColor: "#fee2e2",
              borderColor: "#fecaca",
            }}
          >
            <Row style={{ alignItems: "center", justifyContent: "center" }}>
              <CircleXIcon size={16} color="#991b1b" />
              <Text style={{ marginLeft: 8, color: "#991b1b", fontWeight: "700" }}>
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </Text>
            </Row>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Toasts float above everything */}
      {Toast}
    </Container>
  );
};