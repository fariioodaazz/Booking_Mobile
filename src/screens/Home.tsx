import React, { useEffect, useRef } from "react";
import { 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  ScrollView,
  Image,
  StatusBar
} from "react-native";
import styled from "styled-components/native";
import LogOutIcon from "assets/LogOutIcon";
import VolleyBallIcon from "assets/VolleyballIcon";

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
    containerPadding: isSmallScreen ? 16 : 20,
    headerMarginBottom: isVerySmallScreen ? 20 : isSmallScreen ? 25 : 30,
    headerMarginTop: isVerySmallScreen ? 10 : 20,
    titleSize: isVerySmallScreen ? 24 : isSmallScreen ? 26 : 28,
    subtitleSize: isVerySmallScreen ? 14 : 16,
    sectionTitleSize: isVerySmallScreen ? 18 : 20,
    buttonTextSize: isVerySmallScreen ? 16 : 18,
    cardPadding: isVerySmallScreen ? 20 : 25,
    buttonPadding: isVerySmallScreen ? 16 : 20,
    buttonMarginBottom: isVerySmallScreen ? 12 : 15,
    maxWidth: isTablet ? 500 : 400,
    circleScale: isSmallScreen ? 0.8 : isTablet ? 1.2 : 1,
  };
};

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #007AFF;
`;

const ScrollContainer = styled(ScrollView).attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    padding: getResponsiveDimensions().containerPadding,
    justifyContent: 'center',
    paddingTop: Math.max(getResponsiveDimensions().containerPadding, (StatusBar.currentHeight || 0) + 20),
  },
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: ${() => getResponsiveDimensions().maxWidth}px;
  align-self: center;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${() => getResponsiveDimensions().headerMarginBottom}px;
  margin-top: ${() => getResponsiveDimensions().headerMarginTop}px;
`;

const WelcomeText = styled(Text)`
  font-size: ${() => getResponsiveDimensions().titleSize}px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubtitleText = styled(Text)`
  font-size: ${() => getResponsiveDimensions().subtitleSize}px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: ${() => getResponsiveDimensions().subtitleSize + 6}px;
  padding-horizontal: 10px;
`;

const QuickActionsContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: ${() => getResponsiveDimensions().cardPadding}px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
  width: 100%;
`;

const SectionTitle = styled(Text)`
  font-size: ${() => getResponsiveDimensions().sectionTitleSize}px;
  font-weight: 700;
  color: #333333;
  margin-bottom: ${() => getResponsiveDimensions().isVerySmallScreen ? 16 : 20}px;
  text-align: center;
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: #007AFF;
  border-radius: 15px;
  padding: ${() => getResponsiveDimensions().buttonPadding}px;
  margin-bottom: ${() => getResponsiveDimensions().buttonMarginBottom}px;
  align-items: center;
  justify-content: center;
  shadow-color: #667eea;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
  flex-direction: row;
  min-height: ${() => getResponsiveDimensions().isVerySmallScreen ? 50 : 60}px;
`;

const ActionButtonText = styled(Text)`
  color: #ffffff;
  font-size: ${() => getResponsiveDimensions().buttonTextSize}px;
  font-weight: 600;
  margin-left: 10px;
`;

const ActionIcon = styled.View`
  width: ${() => getResponsiveDimensions().isVerySmallScreen ? 20 : 24}px;
  height: ${() => getResponsiveDimensions().isVerySmallScreen ? 20 : 24}px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${() => getResponsiveDimensions().isVerySmallScreen ? 10 : 12}px;
  align-items: center;
  justify-content: center;
`;

// Decorative elements
const getCircleProps = () => {
  const { circleScale, isVerySmallScreen } = getResponsiveDimensions();
  
  return {
    circles: [
      { 
        size: 120 * circleScale, 
        top: isVerySmallScreen ? 40 : 80, 
        left: -30 * circleScale, 
        opacity: 0.1 
      },
      { 
        size: 90 * circleScale, 
        top: isVerySmallScreen ? 120 : 200, 
        left: width - (50 * circleScale), 
        opacity: 0.15 
      },
      { 
        size: 110 * circleScale, 
        top: height - (isVerySmallScreen ? 150 : 220), 
        left: -40 * circleScale, 
        opacity: 0.08 
      },
      { 
        size: 85 * circleScale, 
        top: height - (isVerySmallScreen ? 100 : 150), 
        left: width - (60 * circleScale), 
        opacity: 0.12 
      },
    ]
  };
};

interface DecorativeCircleProps {
  size: number;
  top: number;
  left: number;
  opacity: number;
}

const DecorativeCircle = styled.View<DecorativeCircleProps>`
  position: absolute;
  width: ${(props: DecorativeCircleProps) => props.size}px;
  height: ${(props: DecorativeCircleProps) => props.size}px;
  border-radius: ${(props: DecorativeCircleProps) => props.size / 2}px;
  background-color: rgba(255, 255, 255, ${(props: DecorativeCircleProps) => props.opacity});
  top: ${(props: DecorativeCircleProps) => props.top}px;
  left: ${(props: DecorativeCircleProps) => props.left}px;
`;

const LogOutIconButton = () => (
  <LogOutIcon size={getResponsiveDimensions().isVerySmallScreen ? 16 : 18} color="#fff" />
);

const VolleyballIconButton = () => (
  <VolleyBallIcon size={getResponsiveDimensions().isVerySmallScreen ? 16 : 18} color="#fff" />
);

type Props = {
  onBookCourt: () => void;
  onLogout: () => void;
  onTestNotification: () => void;
  onViewNotifications?: () => void;
};

export const Home: React.FC<Props> = ({ onBookCourt, onLogout, onTestNotification, onViewNotifications }) => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const { circles } = getCircleProps();

  return (
    <Container>
      {/* Decorative background elements */}
      {circles.map((circle, index) => (
        <DecorativeCircle
          key={index}
          size={circle.size}
          top={circle.top}
          left={circle.left}
          opacity={circle.opacity}
        />
      ))}

      <ScrollContainer>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
          }}
        >
          <ContentContainer>
            <HeaderContainer>
              <WelcomeText>Welcome Back!</WelcomeText>
              <SubtitleText>Ready to book your next sports session?</SubtitleText>
            </HeaderContainer>

            <QuickActionsContainer>
              <SectionTitle>Quick Actions</SectionTitle>
              
              <ActionButton onPress={onBookCourt} activeOpacity={0.8}>
                <ActionIcon>
                  <VolleyballIconButton />
                </ActionIcon>
                <ActionButtonText>Book a Court</ActionButtonText>
              </ActionButton>
              
              <ActionButton onPress={onTestNotification} activeOpacity={0.8}>
                <ActionIcon>
                  <Text style={{ color: '#fff', fontSize: 18 }}>📩</Text>
                </ActionIcon>
                <ActionButtonText>Test Notification</ActionButtonText>
              </ActionButton>
              
              {onViewNotifications && (
                <ActionButton onPress={onViewNotifications} activeOpacity={0.8}>
                  <ActionIcon>
                    <Text style={{ color: '#fff', fontSize: 18 }}>🔔</Text>
                  </ActionIcon>
                  <ActionButtonText>View Notifications</ActionButtonText>
                </ActionButton>
              )}
              
              <ActionButton onPress={onLogout} activeOpacity={0.8}>
                <ActionIcon>
                  <LogOutIconButton />
                </ActionIcon>
                <ActionButtonText>Sign Out</ActionButtonText>
              </ActionButton>
            </QuickActionsContainer>
          </ContentContainer>
        </Animated.View>
      </ScrollContainer>
    </Container>
  );
};

export default Home;