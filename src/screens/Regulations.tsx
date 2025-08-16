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
import ArrowLeft from '../../assets/ArrowLeftIcon';
import ArrowRight from '../../assets/ArrowRightIcon';

const { width, height } = Dimensions.get('window');

// Comprehensive responsive helper
const getResponsiveDimensions = () => {
  const isSmallScreen = width < 360;
  const isVerySmallScreen = width < 320;
  const isTablet = width > 768;
  const isTallScreen = height > 800;
  const aspectRatio = height / width;
  const isModernPhone = aspectRatio > 2.0;
  
  // Calculate safe paddings and sizes
  const basePadding = isVerySmallScreen ? 12 : isSmallScreen ? 16 : 20;
  const containerTopPadding = Math.max(40, height * 0.05);
  const containerBottomPadding = Math.max(80, height * 0.12);
  const buttonAreaHeight = Math.max(200, height * 0.25); // Increased from 0.18 to 0.25
  
  return {
    // Screen type flags
    isSmallScreen,
    isVerySmallScreen,
    isTablet,
    isTallScreen,
    isModernPhone,
    
    // Responsive dimensions
    basePadding,
    containerTopPadding,
    containerBottomPadding,
    buttonAreaHeight,
    
    // Header dimensions
    iconSize: Math.min(width * 0.14, isVerySmallScreen ? 45 : 55),
    titleSize: Math.min(width * 0.06, isVerySmallScreen ? 18 : 24),
    subtitleSize: Math.min(width * 0.035, isVerySmallScreen ? 12 : 16),
    headerMarginBottom: isVerySmallScreen ? 15 : 20,
    
    // Content dimensions
    cardMinHeight: Math.max(300, height * 0.4),
    sectionPadding: basePadding,
    sectionMinHeight: isVerySmallScreen ? 45 : 55,
    
    // Button dimensions
    buttonMinHeight: isVerySmallScreen ? 44 : 48,
    buttonFontSize: isVerySmallScreen ? 14 : 16,
  };
};

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

// Responsive Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-top: ${() => getResponsiveDimensions().containerTopPadding}px;
`;

const MaxWidthContainer = styled.View`
  width: 92%;
  margin: 0 auto;
  flex: 1;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${() => getResponsiveDimensions().headerMarginBottom}px;
  padding-top: ${() => getResponsiveDimensions().basePadding}px;
`;

const IconContainer = styled.View`
  width: ${() => getResponsiveDimensions().iconSize}px;
  height: ${() => getResponsiveDimensions().iconSize}px;
  border-radius: ${() => getResponsiveDimensions().iconSize / 2}px;
  background-color: #007AFF;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  color: #007AFF;
  font-size: ${() => getResponsiveDimensions().titleSize}px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  color: #6b7280;
  font-size: ${() => getResponsiveDimensions().subtitleSize}px;
  text-align: center;
  padding-horizontal: ${() => getResponsiveDimensions().basePadding}px;
  line-height: ${() => getResponsiveDimensions().subtitleSize * 1.4}px;
`;

const CategoryChip = styled.View`
  background-color: #007AFF10;
  border-radius: 16px;
  padding-horizontal: ${() => getResponsiveDimensions().basePadding}px;
  padding-vertical: ${() => getResponsiveDimensions().isVerySmallScreen ? 6 : 8}px;
  margin-top: 12px;
`;

const CategoryText = styled.Text`
  color: #007AFF;
  font-size: ${() => getResponsiveDimensions().isVerySmallScreen ? 12 : 14}px;
  font-weight: 500;
`;

const ContentContainer = styled.View`
  flex: 1;
  margin-bottom: ${() => getResponsiveDimensions().buttonAreaHeight}px;
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
  min-height: ${() => getResponsiveDimensions().cardMinHeight}px;
  flex: 1;
`;

const RegulationsScrollView = styled(ScrollView)`
  flex: 1;
`;

const SectionHeaderCollapsed = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${() => getResponsiveDimensions().sectionPadding}px;
  border-bottom-width: 1px;
  border-bottom-color: #f3f4f6;
  min-height: ${() => getResponsiveDimensions().sectionMinHeight}px;
`;

const SectionHeaderExpanded = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${() => getResponsiveDimensions().sectionPadding}px;
  min-height: ${() => getResponsiveDimensions().sectionMinHeight}px;
`;

const SectionIconContainer = styled.View`
  width: 24px;
  height: 24px;
  margin-right: ${() => getResponsiveDimensions().isVerySmallScreen ? 8 : 12}px;
  align-items: center;
  justify-content: center;
`;

const SectionTitleText = styled.Text`
  color: #007AFF;
  font-size: ${() => getResponsiveDimensions().isVerySmallScreen ? 14 : 16}px;
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
  padding: 0 ${() => getResponsiveDimensions().sectionPadding}px ${() => getResponsiveDimensions().sectionPadding}px ${() => getResponsiveDimensions().sectionPadding}px;
`;

const BulletPoint = styled.Text`
  color: #374151;
  font-size: ${() => getResponsiveDimensions().isVerySmallScreen ? 12 : 14}px;
  line-height: ${() => getResponsiveDimensions().isVerySmallScreen ? 18 : 20}px;
  margin-bottom: 8px;
  margin-left: 8px;
`;

const SectionDivider = styled.View`
  height: 1px;
  background-color: #f3f4f6;
`;

const ButtonsContainer = styled.View`
  gap: ${() => getResponsiveDimensions().isVerySmallScreen ? 8 : 12}px;
  width: 100%;
`;

const FixedButtonsWrapper = styled.View`
  position: absolute;
  bottom: ${() => Math.max(20, getResponsiveDimensions().containerBottomPadding * 0.2)}px;
  left: 4%;
  right: 4%;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 20px;
  margin-top: 8px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${() => getResponsiveDimensions().basePadding}px;
`;

const ErrorText = styled.Text`
  color: #dc2626;
  font-size: ${() => getResponsiveDimensions().buttonFontSize}px;
  margin-bottom: 16px;
  text-align: center;
`;

const NavigationContainer = styled.View`
  flex-direction: row;
  gap: ${() => getResponsiveDimensions().isVerySmallScreen ? 8 : 12}px;
  padding-top: ${() => getResponsiveDimensions().isVerySmallScreen ? 8 : 16}px;
  padding-bottom: ${() => getResponsiveDimensions().isVerySmallScreen ? 4 : 8}px;
  margin-top: ${() => getResponsiveDimensions().isVerySmallScreen ? 4 : 8}px;
`;

// Icon Components
const CalendarIconMain = () => (
  <CalendarIcon size={Math.min(width * 0.06, 24)} color="#ffffff" />
);

const CalendarDaysIconButton = () => (
  <CalendarDaysIcon size={16} color="#007AFF" />
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
        </HeaderContainer>

        {/* Content Area */}
        <ContentContainer>
          {/* Scrollable Regulations Card */}
          <RegulationsCard>
            <RegulationsScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                flexGrow: 1,
                paddingBottom: 60 // Increased from 20 to 60
              }}
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

      {/* Fixed Action Buttons at Bottom - Responsive */}
      <FixedButtonsWrapper>
        <ButtonsContainer>
          {/* Main Navigation Buttons */}
          <NavigationContainer>
            <Button
              variant="outline"
              onPress={onBackHome}
              style={{ 
                flex: 1, 
                paddingVertical: 14, 
                minHeight: 48
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={16} color="#007AFF" />
                <Text style={{ marginLeft: 8, color: '#007AFF' }}>Back</Text>
              </View>
            </Button>
            
            <Button
              onPress={isEligible ? onReserve : undefined}
              disabled={!isEligible}
              style={{ 
                flex: 1, 
                paddingVertical: 14, 
                minHeight: 48
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#ffffff' }}>{isEligible ? 'Book Court' : EligReason || 'Not Available'}</Text>
                {isEligible && <ArrowRight size={16} color="#ffffff" style={{ marginLeft: 8 }} />}
              </View>
            </Button>
          </NavigationContainer>

          {/* Secondary Action Button */}
          <Button 
            onPress={onShowReservations} 
            variant="outline" 
            style={{ 
              width: '100%', 
              paddingVertical: 14, 
              minHeight: 48
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDaysIconButton />
              <Text style={{ 
                color: '#007AFF', 
                fontSize: 16, 
                fontWeight: '500', 
                marginLeft: 8 
              }}>
                Show All Reservations
              </Text>
            </View>
          </Button>
        </ButtonsContainer>
      </FixedButtonsWrapper>
    </Container>
  );
};