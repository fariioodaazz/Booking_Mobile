import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { ArrowLeft, ArrowRight, Activity } from 'lucide-react-native';
import { Button } from '../components/ui/button';
import { ProgressIndicator } from '../components/ui/ProgressBar';

const steps = [
  { number: 1, completed: true },
  { number: 2, active: true },
  { number: 3 },
  { number: 4 },
];

interface Sport {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface Court {
  id: number;
  name: string;
  type: string;
  sportsAvailable?: string;
}

interface SelectSportScreenProps {
  selectedCourt: Court;
  onBack: () => void;
  onNext: (sport: Sport) => void;
  
  /** Reusability props */
  headerTitle?: string;
  headerSubtitle?: string;
  sports?: Sport[];
}

const Container = styled(ScrollView)`
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
  color: #007AFF;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: 16px;
  text-align: center;
  padding-horizontal: 20px;
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-bottom: 16px;
`;

const CourtSummary = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #007AFF10;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const IconContainer = styled.View`
  margin-right: 12px;
`;

const CourtInfo = styled.View`
  flex: 1;
`;

const CourtName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #007AFF;
  margin-bottom: 2px;
`;

const SportsAvailable = styled.Text`
  font-size: 14px;
  color: #6b7280;
`;

const SportsContainer = styled.View`
  gap: 12px;
`;

interface SportItemProps {
  selected: boolean;
}

const SportItem = styled.TouchableOpacity<SportItemProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border-width: 2px;
  border-color: ${(props: SportItemProps) => props.selected ? '#007AFF' : '#e5e7eb'};
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
  border-color: ${(props: SportItemProps) => props.selected ? '#007AFF' : '#e5e7eb'};
  justify-content: center;
  align-items: center;
`;

const RadioButtonInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #007AFF;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  padding-top: 16px;
  padding-bottom: 20px;
  margin-top: 8px;
`;

export function SelectSportScreen({
  selectedCourt,
  onBack,
  onNext,
  headerTitle = "Choose Your Sport",
  headerSubtitle,
  sports: customSports
}: SelectSportScreenProps) {
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  
  const defaultSports: Sport[] = [
    {
      id: 1,
      name: 'Basketball',
      description: 'Full court basketball game',
      icon: '🏀',
    },
    {
      id: 2,
      name: 'Volleyball',
      description: 'Indoor volleyball match',
      icon: '🏐',
    },
    {
      id: 3,
      name: 'Handball',
      description: 'Team handball game',
      icon: '🤾',
    },
  ];

  const sports = customSports || defaultSports;
  const subtitle = headerSubtitle || `Select which sport you want to play on ${selectedCourt.name}`;

  const handleContinue = () => {
    if (selectedSport) {
      const sportData = sports.find(sport => sport.id === selectedSport);
      if (sportData) {
        onNext(sportData);
      }
    }
  };

  return (
    <Container contentContainerStyle={{ paddingBottom: 40 }}>
      <MaxWidthContainer>
        {/* Header */}
        <HeaderContainer>
          <ProgressIndicator steps={steps} />
          <Title>{headerTitle}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </HeaderContainer>

        {/* Content */}
        <ContentContainer>
          {/* Court Summary */}
          <CourtSummary>
            <IconContainer>
              <Activity size={22} color="#007AFF" />
            </IconContainer>
            <CourtInfo>
              <CourtName>{selectedCourt.name}</CourtName>
              {selectedCourt.sportsAvailable && (
                <SportsAvailable>{selectedCourt.sportsAvailable}</SportsAvailable>
              )}
            </CourtInfo>
          </CourtSummary>

          {/* Sports List */}
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
                  {selectedSport === sport.id && (
                    <RadioButtonInner />
                  )}
                </RadioButton>
              </SportItem>
            ))}
          </SportsContainer>
        </ContentContainer>

        {/* Navigation */}
        <NavigationContainer>
          <Button
            variant="outline"
            onPress={onBack}
            style={{ flex: 1, paddingVertical: 14, minHeight: 48 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={16} color="#007AFF" />
              <Text style={{ marginLeft: 8, color: '#007AFF' }}>Back</Text>
            </View>
          </Button>
          
          <Button
            onPress={handleContinue}
            disabled={!selectedSport}
            style={{ 
              flex: 1, 
              paddingVertical: 14, 
              minHeight: 48,
              backgroundColor: selectedSport ? '#007AFF' : '#f3f4f6'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ 
                color: selectedSport ? '#ffffff' : '#9ca3af',
                marginRight: 8 
              }}>
                Continue
              </Text>
              {selectedSport && <ArrowRight size={16} color="#ffffff" />}
            </View>
          </Button>
        </NavigationContainer>
      </MaxWidthContainer>
    </Container>
  );
}

// Demo component that shows how to use it with function props
export function SelectSportScreenDemo() {
  const selectedCourt: Court = {
    id: 4,
    name: 'Multi-Purpose Court 2',
    type: 'Multi-Purpose',
    sportsAvailable: '3 sports available'
  };

  const handleBack = () => {
    console.log('Back to court selection');
  };

  const handleNext = (sport: Sport) => {
    console.log('Selected sport:', sport);
    // Navigate to date/time selection
  };

  return (
    <SelectSportScreen
      selectedCourt={selectedCourt}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}