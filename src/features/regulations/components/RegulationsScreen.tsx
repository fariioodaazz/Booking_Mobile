import React from "react";
import { 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  View, 
  Text, 
  StyleSheet 
} from "react-native";
import { useQuery } from "@apollo/client";
import { Button } from "../../../components/ui/button";
import { REGULATIONS_PAGE_QUERY } from "../graphql/queries.gql";

type Props = {
  facilityId: string;
  onShowReservations: () => void;
  onReserve: () => void;
  onBackHome?: () => void;
};

export const RegulationsScreen: React.FC<Props> = ({
  facilityId,
  onShowReservations,
  onReserve,
  onBackHome,
}) => {
  const { data, loading, error, refetch } = useQuery(REGULATIONS_PAGE_QUERY, {
    variables: { facilityId },
    fetchPolicy: "no-cache",
  });

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <Button 
          variant="outline" 
          onPress={() => refetch()} 
          style={{ width: '100%', marginBottom: 12 }}
        >
          Try again
        </Button>
        <Button 
          onPress={onBackHome} 
          variant="ghost" 
        >
          Back
        </Button>
      </View>
    );
  }

  const facility = data?.facility;
  const sections = facility?.regulations?.sections ?? [];
  const elig = data?.myBookingEligibility;
  const disabled = !elig?.eligible;

  const handleReserve = () => {
    if (disabled) {
      const msg = (elig?.reasons || []).map(reasonToHuman).join("\n") || "You cannot reserve right now.";
      Alert.alert("Not eligible", msg);
      return;
    }
    onReserve();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.headerCard}>
        <Text style={styles.appTitle}>NU Sports Booking</Text>
        <Text style={styles.subtitle}>Nile University Sports Facilities</Text>

        <View style={styles.chipsRow}>
          {facility?.category?.name && (
            <Text style={styles.chip}>{facility.category.name}</Text>
          )}
          <Text style={[
            styles.chip,
            facility?.is_available ? styles.chipOk : styles.chipWarn
          ]}>
            {facility?.is_available ? "Available" : "Unavailable"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sports Facilities Policies</Text>
        {sections.length === 0 ? (
          <Text style={styles.muted}>No regulations available.</Text>
        ) : (
          sections.map((s: any, idx: number) => (
            <View key={idx} style={styles.section}>
              {s.title && <Text style={styles.sectionTitle}>{s.title}</Text>}
              {s.items?.map((txt: string, i: number) => (
                <Text key={i} style={styles.bullet}>• {txt}</Text>
              ))}
              {idx < sections.length - 1 && <View style={styles.divider} />}
            </View>
          ))
        )}
      </View>

      {!elig?.eligible && (
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Heads up</Text>
          {(elig?.reasons || []).map((r: string, i: number) => (
            <Text key={i} style={styles.bannerLine}>• {reasonToHuman(r)}</Text>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button 
          onPress={handleReserve} 
          variant="default" 
          size="lg" 
          style={{ width: '100%' }}
          disabled={disabled}
        >
          Reserve a Court
        </Button>
        <View style={styles.space} />
        <Button 
          onPress={onShowReservations} 
          variant="outline" 
          style={{ width: '100%' }}
        >
          Show My Reservations
        </Button>
        <View style={styles.space} />
        <Button 
          onPress={onBackHome} 
          variant="ghost" 
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
};

/* helpers */
const reasonToHuman = (code: string) => {
  switch (code) {
    case "AUTH_REQUIRED": return "Please log in to continue.";
    case "SUSPENDED": return "Your account is currently suspended.";
    case "QUOTA_EXHAUSTED": return "You've used all your booking quota.";
    default: return code.replace(/_/g, " ");
  }
};

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
  },
  loadingWrap: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  chip: {
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: '600',
    marginRight: 8,
  },
  chipOk: {
    color: '#065f46',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  chipWarn: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  bullet: {
    color: '#111827',
    marginLeft: 4,
    marginBottom: 4,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
  },
  banner: {
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  bannerTitle: {
    fontWeight: '800',
    color: '#92400e',
    marginBottom: 8,
  },
  bannerLine: {
    color: '#92400e',
    marginBottom: 4,
  },
  actions: {
    marginTop: 16,
  },
  space: {
    height: 12,
  },
  errorText: {
    color: 'crimson',
    marginBottom: 8,
  },
  muted: {
    color: '#6b7280',
  },
});