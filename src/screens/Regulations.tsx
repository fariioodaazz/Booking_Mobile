import React, { useState } from "react";
import { 
  ActivityIndicator, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity,
  Dimensions
} from "react-native";
import styled from 'styled-components/native';
import { useQuery } from "@apollo/client";
import { Button } from "../components/ui/button";
import { REGULATIONS_PAGE_QUERY } from "../api/regulations/queries";

import CalendarDaysIcon from '../../assets/CalendarDaysIcon';
import CalendarIcon from '../../assets/CalendarIcon';
import ChevronDownIcon from '../../assets/ChevronDownIcon';
import ShieldCheckIcon from '../../assets/ShieldCheckIcon'
import MapPinIcon from '../../assets/MapPinIcon';
import CircleXIcon from '../../assets/CircleXIcon';
import MoveLeftIcon from '../../assets/MoveLeftIcon';

const { width, height } = Dimensions.get('window');

type Props = {
  categoryName: string;
  onShowReservations: () => void;
  onReserve: () => void;
  onBackHome?: () => void;

  /** Reusability props */
  headerTitle?: string;
  headerSubtitle?: string;
  policiesTitle?: string;
};

// Styled Components with percentage-based sizing
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
  background-color: #007AFF;
  align-items: center;
  justify-content: center;
  margin-bottom: 2%;
`;

const Title = styled.Text`
  color: #007AFF;
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

const CategoryChip = styled.View`
  background-color: #007AFF10;
  border-radius: 16px;
  padding-horizontal: 3%;
  padding-vertical: 1.5%;
  margin-top: 3%;
`;

const CategoryText = styled.Text`
  color: #007AFF;
  font-size: ${Math.min(width * 0.035, 14)}px;
  font-weight: 500;
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-bottom: 25%;
`;

const RegulationsCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e5e7eb;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
  min-height: ${height * 0.5}px;
`;

const RegulationsScrollView = styled(ScrollView)`
  flex: 1;
`;

const SectionHeaderCollapsed = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 4%;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
  min-height: ${height * 0.065}px;
`;

const SectionHeaderExpanded = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 4%;
  min-height: ${height * 0.065}px;
`;

const SectionIconContainer = styled.View`
  width: 24px;
  height: 24px;
  margin-right: 3%;
  align-items: center;
  justify-content: center;
`;

const SectionTitleText = styled.Text`
  color: #007AFF;
  font-size: ${Math.min(width * 0.04, 16)}px;
  font-weight: 500;
  flex: 1;
`;

const ChevronContainer = styled.View`
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

const SectionContent = styled.View`
  padding: 0 4% 4% 4%;
`;

const BulletPoint = styled.Text`
  color: #374151;
  font-size: ${Math.min(width * 0.035, 14)}px;
  line-height: ${Math.min(width * 0.05, 20)}px;
  margin-bottom: 2%;
  margin-left: 2%;
`;

const SectionDivider = styled.View`
  height: 1px;
  background-color: #f3f4f6;
`;

const BannerContainer = styled.View`
  background-color: #fef3c7;
  border-width: 1px;
  border-color: #fde68a;
  border-radius: 12px;
  padding: 4%;
  margin-top: 4%;
`;

const BannerTitle = styled.Text`
  color: #92400e;
  font-size: ${Math.min(width * 0.04, 16)}px;
  font-weight: 600;
  margin-bottom: 2%;
`;

const BannerText = styled.Text`
  color: #92400e;
  font-size: ${Math.min(width * 0.035, 14)}px;
  margin-bottom: 1%;
`;

const ButtonsContainer = styled.View`
  gap: 3%;
  width: 100%;
`;

const FixedButtonsWrapper = styled.View`
  position: absolute;
  bottom: 8%;
  left: 4%;
  right: 4%;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 4%;
`;

const ErrorText = styled.Text`
  color: #dc2626;
  font-size: ${Math.min(width * 0.04, 16)}px;
  margin-bottom: 4%;
  text-align: center;
`;

// Icon Components
const CalendarIconMain = () => (
  <CalendarIcon size={Math.min(width * 0.06, 24)} color="#ffffff" />
);

const CalendarIconButton = ({ color }: { color: string }) => (
  <CalendarIcon size={16} color={color} />
);

const CalendarDaysIconButton = () => (
  <CalendarDaysIcon size={16} color="#007AFF" />
);

const BackIcon = () => (
  <MoveLeftIcon size={16} color="#6b7280" />
);

const ChevronDownIconButton = ({ expanded }: { expanded: boolean }) => (
  <View style={{ 
    transform: [{ rotate: expanded ? '180deg' : '0deg' }]
  }}>
    <ChevronDownIcon size={16} color="#6b7280" />
  </View>
);

const PolicyIcon = () => (
  <ShieldCheckIcon size={20} color="#007AFF" />
);

const CancelIcon = () => (
  <CircleXIcon size={20} color="#007AFF" />
);

const CheckInIcon = () => (
  <MapPinIcon size={20} color="#007AFF" />
);

// Section Component
interface SectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  defaultExpanded?: boolean;
  isLast?: boolean;
}

const CollapsibleSection: React.FC<SectionProps> = ({ 
  title, 
  items, 
  icon, 
  defaultExpanded = false,
  isLast = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      {expanded ? (
        <SectionHeaderExpanded onPress={() => setExpanded(!expanded)}>
          <SectionIconContainer>{icon}</SectionIconContainer>
          <SectionTitleText>{title}</SectionTitleText>
          <ChevronContainer>
            <ChevronDownIconButton expanded={expanded} />
          </ChevronContainer>
        </SectionHeaderExpanded>
      ) : (
        <SectionHeaderCollapsed onPress={() => setExpanded(!expanded)}>
          <SectionIconContainer>{icon}</SectionIconContainer>
          <SectionTitleText>{title}</SectionTitleText>
          <ChevronContainer>
            <ChevronDownIconButton expanded={expanded} />
          </ChevronContainer>
        </SectionHeaderCollapsed>
      )}
      
      {expanded && (
        <SectionContent>
          {items.map((item, index) => (
            <BulletPoint key={index}>• {item}</BulletPoint>
          ))}
        </SectionContent>
      )}
      
      {!isLast && <SectionDivider />}
    </>
  );
};

export const Regulations: React.FC<Props> = ({
  categoryName,
  onShowReservations,
  onReserve,
  onBackHome,
  headerTitle,
  headerSubtitle,
  policiesTitle,
}) => {
  const { data, loading, error, refetch } = useQuery(REGULATIONS_PAGE_QUERY, {
    variables: { category: categoryName },
    fetchPolicy: "no-cache",
  });

  if (loading) {
    return (
      <Container>
        <MaxWidthContainer>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
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
              style={{ width: '100%', marginBottom: '3%' }}
            >
              Try again
            </Button>
            <Button 
              onPress={onBackHome} 
              variant="ghost" 
            >
              Back
            </Button>
          </ErrorContainer>
        </MaxWidthContainer>
      </Container>
    );
  }

  const category = data?.category;
  const sections = category?.regulations ?? [];
  const elig = data?.myGeneralEligibility;
  const isEligible = elig ? elig.eligible : false;
  const EligReason = elig ? elig.reasons : null;

  // Group sections by type or use default grouping
  const getSectionIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('cancel')) return <CancelIcon />;
    if (lowerTitle.includes('check') || lowerTitle.includes('entry')) return <CheckInIcon />;
    return <PolicyIcon />;
  };

  const sectionsToShow = sections.length > 0 ? sections : "No Available Regulations";

  return (
    <Container>
      <MaxWidthContainer>
        {/* Header */}
        <HeaderContainer>
          <IconContainer>
            <CalendarIconMain />
          </IconContainer>
          <Title>{headerTitle}</Title>
          <Subtitle>{headerSubtitle}</Subtitle>
          {category?.name && (
            <CategoryChip>
              <CategoryText>{category.name}</CategoryText>
            </CategoryChip>
          )}
        </HeaderContainer>

        {/* Content Area */}
        <ContentContainer>
          {/* Single Scrollable Regulations Card */}
          <RegulationsCard>
            <RegulationsScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {sectionsToShow.map((section: any, index: number) => (
                <CollapsibleSection
                  key={index}
                  title={section.title}
                  items={section.items || []}
                  icon={getSectionIcon(section.title)}
                  defaultExpanded={index === 0}
                  isLast={index === sectionsToShow.length - 1}
                />
              ))}
            </RegulationsScrollView>
          </RegulationsCard>
        </ContentContainer>
      </MaxWidthContainer>

      {/* Fixed Action Buttons */}
      <FixedButtonsWrapper>
        <ButtonsContainer>
          <Button 
            onPress={isEligible ? onReserve : undefined}
            variant="default" 
            size="lg" 
            style={{ 
              width: '100%', 
              paddingVertical: '4%',
              opacity: isEligible ? 1 : 0.5
            }}
            disabled={!isEligible}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {isEligible ? (
                <>
                  <CalendarIconButton color="#ffffff" />
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: Math.min(width * 0.04, 16), 
                    fontWeight: '500', 
                    marginLeft: '2%' 
                  }}>
                    Reserve a Court
                  </Text>
                </>
              ) : (
                <>
                  <CalendarIconButton color="#000" />
                  <Text style={{ 
                    color: '#000', 
                    fontSize: Math.min(width * 0.04, 16), 
                    fontWeight: '500', 
                    marginLeft: '2%' 
                  }}>
                    {EligReason}
                  </Text>
                </>
              )}
            </View>
          </Button>
          
          <Button 
            onPress={onShowReservations} 
            variant="outline" 
            style={{ width: '100%', paddingVertical: '4%' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDaysIconButton />
              <Text style={{ 
                color: '#007AFF', 
                fontSize: Math.min(width * 0.04, 16), 
                fontWeight: '500', 
                marginLeft: '2%' 
              }}>
                Show All Reservations
              </Text>
            </View>
          </Button>
          
          <Button 
            onPress={onBackHome} 
            variant="outline"
            style={{ width: '100%', paddingVertical: '4%' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <BackIcon />
              <Text style={{ 
                color: '#6b7280', 
                fontSize: Math.min(width * 0.04, 16), 
                fontWeight: '500', 
                marginLeft: '2%' 
              }}>
                Back to Home
              </Text>
            </View>
          </Button>
        </ButtonsContainer>
      </FixedButtonsWrapper>
    </Container>
  );
};