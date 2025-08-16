// BookingFlowDemo.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react-native';
import { Button } from '../components/ui/button';
import { ProgressIndicator } from '../components/ui/ProgressBar';

/** ---------- Shared ---------- */
const stepsCourt = [
  { number: 1, active: true },
  { number: 2 },
  { number: 3 },
  { number: 4 },
];

const stepsSport = [
  { number: 1, completed: true },
  { number: 2, active: true },
  { number: 3 },
  { number: 4 },
];

interface Court {
  id: number;
  name: string;
  type: string;
  sportsAvailable?: string;
}

interface Sport {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const ScreenContainer = styled(ScrollView)`
  flex: 1;
  background-color: #ffffff;
  padding: 8px;
  padding-bottom: 15px;
`;

const MaxWidthContainer = styled.View`
  max-width: 384px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
  padding-top: 15px;
`;

const Title = styled.Text`
  color: #007aff;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: 16px;
  text-align: center;
  padding-horizontal: 20px; /* OK to leave; but prefer paddingHorizontal below */
`;

const SubtitleFixed = styled(Subtitle)`
  /* Use RN camelCase for cross-platform correctness */
  padding-horizontal: 0px;
  padding-vertical: 0px;
  padding: 0px;
  /* Correct version: */
  /* @ts-ignore - styled-components/native allows RN style keys */
  paddingHorizontal: 20px;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  padding-top: 16px;
  padding-bottom: 20px;
  margin-top: 8px;
`;

/** ---------- Select Court Screen ---------- */
const CourtsContainer = styled.View`
  flex: 1;
  margin-bottom: 16px;
`;

const SpacedContainer = styled.View`
  gap: 8px;
`;

type CourtItemProps = { selected: boolean };

const CourtItem = styled.TouchableOpacity<CourtItemProps>`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 2px;
  border-color: ${(p:CourtItemProps) => (p.selected ? '#007AFF' : '#e5e7eb')};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const CourtContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CourtInfo = styled.View`
  flex: 1;
`;

const CourtName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SportsAvailable = styled.Text`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const TypeContainer = styled.View`
  background-color: #007aff10;
  border-radius: 16px;
  /* React Native camelCase padding keys */
  /* @ts-ignore */
  paddingHorizontal: 12px;
  /* @ts-ignore */
  paddingVertical: 6px;
  align-self: flex-start;
`;

const TypeText = styled.Text`
  color: #007aff;
  font-size: 12px;
  font-weight: 500;
`;

type SelectCourtProps = {
  onNext: (court: Court) => void;
  onBack?: () => void;
};

function SelectCourtScreen({ onNext, onBack }: SelectCourtProps) {
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);

  const courts: Court[] = [
    { id: 1, name: 'Padel Court', type: 'Padel' },
    { id: 2, name: 'Football Field', type: 'Football' },
    {
      id: 3,
      name: 'Multi-Purpose Court 1',
      type: 'Basketball & Volleyball',
      sportsAvailable: '2 sports available',
    },
    {
      id: 4,
      name: 'Multi-Purpose Court 2',
      type: 'Basketball, Volleyball & Handball',
      sportsAvailable: '3 sports available',
    },
  ];

  const handleContinue = () => {
    if (selectedCourt) {
      const courtData = courts.find((c) => c.id === selectedCourt);
      if (courtData) onNext(courtData);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={{ paddingBottom: 40 }}>
      <MaxWidthContainer>
        <HeaderContainer>
          <ProgressIndicator steps={stepsCourt} />
          <Title>Select a Court</Title>
          <SubtitleFixed>Choose from our available sports facilities</SubtitleFixed>
        </HeaderContainer>

        <CourtsContainer>
          <SpacedContainer>
            {courts.map((court) => (
              <CourtItem
                key={court.id}
                selected={selectedCourt === court.id}
                onPress={() => setSelectedCourt(court.id)}
              >
                <CourtContent>
                  <CourtInfo>
                    <CourtName>{court.name}</CourtName>
                    {!!court.sportsAvailable && (
                      <SportsAvailable>{court.sportsAvailable}</SportsAvailable>
                    )}
                    <TypeContainer>
                      <TypeText>{court.type}</TypeText>
                    </TypeContainer>
                  </CourtInfo>
                </CourtContent>
              </CourtItem>
            ))}
          </SpacedContainer>
        </CourtsContainer>

        <NavigationContainer>
          <Button
            variant="outline"
            onPress={onBack}
            style={{ flex: 1, paddingVertical: 14, minHeight: 48 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#007AFF' }}>Back</Text>
            </View>
          </Button>

          <Button
            onPress={handleContinue}
            disabled={!selectedCourt}
            style={{
              flex: 1,
              paddingVertical: 14,
              minHeight: 48,
              backgroundColor: selectedCourt ? '#007AFF' : '#f3f4f6',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={{
                  color: selectedCourt ? '#ffffff' : '#9ca3af',
                  marginRight: 8,
                }}
              >
                Continue
              </Text>
              {selectedCourt && <ArrowRight size={16} color="#ffffff" />}
            </View>
          </Button>
        </NavigationContainer>
      </MaxWidthContainer>
    </ScreenContainer>
  );
}

/** ---------- Select Sport Screen ---------- */
const ContentContainer = styled.View`
  flex: 1;
  margin-bottom: 16px;
`;

const CourtSummary = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #007aff10;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const IconContainer = styled.View`
  margin-right: 12px;
`;

const CourtTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #007aff;
  margin-bottom: 2px;
`;

const SportsContainer = styled.View`
  gap: 12px;
`;

type SportItemProps = { selected: boolean };

const SportItem = styled.TouchableOpacity<SportItemProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border-width: 2px;
  border-color: ${(p: SportItemProps) => (p.selected ? '#007AFF' : '#e5e7eb')};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const SportContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const SportIcon = styled.Text`
  font-size: 24px;
  margin-right: 15px;
`;

const SportInfo = styled.View`
  flex: 1;
`;

const SportName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SportDescription = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const RadioButton = styled.View<SportItemProps>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(p : SportItemProps) => (p.selected ? '#007AFF' : '#e5e7eb')};
  justify-content: center;
  align-items: center;
`;

const RadioButtonInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #007aff;
`;

type SelectSportProps = {
  selectedCourt: Court;
  onBack: () => void;
  onNext: (sport: Sport) => void;
  headerTitle?: string;
  headerSubtitle?: string;
  sports?: Sport[];
};

function SelectSportScreen({
  selectedCourt,
  onBack,
  onNext,
  headerTitle = 'Choose Your Sport',
  headerSubtitle,
  sports: customSports,
}: SelectSportProps) {
  const [selectedSport, setSelectedSport] = useState<number | null>(null);

  const defaultSports: Sport[] = [
    { id: 1, name: 'Basketball', description: 'Full court basketball game', icon: '🏀' },
    { id: 2, name: 'Volleyball', description: 'Indoor volleyball match', icon: '🏐' },
    { id: 3, name: 'Handball', description: 'Team handball game', icon: '🤾' },
  ];

  const sports = customSports || defaultSports;
  const subtitle = headerSubtitle || `Select which sport you want to play on ${selectedCourt.name}`;

  const handleContinue = () => {
    if (selectedSport) {
      const sportData = sports.find((s) => s.id === selectedSport);
      if (sportData) onNext(sportData);
    }
  };

  return (
    <ScreenContainer contentContainerStyle={{ paddingBottom: 40 }}>
      <MaxWidthContainer>
        <HeaderContainer>
          <ProgressIndicator steps={stepsSport} />
          <Title>{headerTitle}</Title>
          <SubtitleFixed>{subtitle}</SubtitleFixed>
        </HeaderContainer>

        <ContentContainer>
          <CourtSummary>
            <IconContainer>
              <Activity size={22} color="#007aff" />
            </IconContainer>
            <View style={{ flex: 1 }}>
              <CourtTitle>{selectedCourt.name}</CourtTitle>
              {!!selectedCourt.sportsAvailable && (
                <SportsAvailable>{selectedCourt.sportsAvailable}</SportsAvailable>
              )}
            </View>
          </CourtSummary>

          <SportsContainer>
            {sports.map((sport) => (
              <SportItem
                key={sport.id}
                selected={selectedSport === sport.id}
                onPress={() => setSelectedSport(sport.id)}
              >
                <SportContent>
                  <SportIcon>{sport.icon}</SportIcon>
                  <SportInfo>
                    <SportName>{sport.name}</SportName>
                    <SportDescription>{sport.description}</SportDescription>
                  </SportInfo>
                </SportContent>
                <RadioButton selected={selectedSport === sport.id}>
                  {selectedSport === sport.id && <RadioButtonInner />}
                </RadioButton>
              </SportItem>
            ))}
          </SportsContainer>
        </ContentContainer>

        <NavigationContainer>
          <Button
            variant="outline"
            onPress={onBack}
            style={{ flex: 1, paddingVertical: 14, minHeight: 48 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={16} color="#007aff" />
              <Text style={{ marginLeft: 8, color: '#007aff' }}>Back</Text>
            </View>
          </Button>

          <Button
            onPress={handleContinue}
            disabled={!selectedSport}
            style={{
              flex: 1,
              paddingVertical: 14,
              minHeight: 48,
              backgroundColor: selectedSport ? '#007AFF' : '#f3f4f6',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={{
                  color: selectedSport ? '#ffffff' : '#9ca3af',
                  marginRight: 8,
                }}
              >
                Continue
              </Text>
              {selectedSport && <ArrowRight size={16} color="#ffffff" />}
            </View>
          </Button>
        </NavigationContainer>
      </MaxWidthContainer>
    </ScreenContainer>
  );
}

/** ---------- Minimal “joined” flow with mock data ---------- */
type Step = 'court' | 'sport';

export default function BookingFlowDemo() {
  const [step, setStep] = useState<Step>('court');
  const [court, setCourt] = useState<Court | null>(null);
  const [sport, setSport] = useState<Sport | null>(null);

  const handleCourtNext = (selected: Court) => {
    setCourt(selected);
    setStep('sport');
  };

  const handleSportBack = () => setStep('court');

  const handleSportNext = (selected: Sport) => {
    setSport(selected);
    // For now, just log—later you can navigate to date/time
    console.log('Selected court:', court);
    console.log('Selected sport:', selected);
  };

  if (step === 'court') {
    return <SelectCourtScreen onNext={handleCourtNext} onBack={() => console.log('Back pressed')} />;
  }

  // step === 'sport' and court is guaranteed after court step
  return (
    <SelectSportScreen
      selectedCourt={court as Court}
      onBack={handleSportBack}
      onNext={handleSportNext}
    />
  );
}
