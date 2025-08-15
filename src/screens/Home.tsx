import React, { useEffect, useRef } from "react";
import { 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  ScrollView,
  Image
} from "react-native";
import styled from "styled-components/native";
import LogOutIcon from "assets/LogOutIcon";
import VolleyBallIcon from "assets/VolleyballIcon";
import MailboxIcon from "assets/MailboxIcon";
import BellIcon from "assets/BellIcon";

const { width, height } = Dimensions.get('window');

// Styled Components with percentage-based sizing
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const ScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    padding: '5%',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 90%;
  align-self: center;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 8%;
  margin-top: 5%;
`;

const WelcomeText = styled(Text)`
  font-size: ${Math.min(width * 0.07, 28)}px;
  font-weight: 700;
  color: #007AFF;
  text-align: center;
  margin-bottom: 2%;
  text-shadow: 0px 2px 4px rgba(255, 255, 255, 0.);
`;

const SubtitleText = styled(Text)`
  font-size: ${Math.min(width * 0.04, 16)}px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: ${Math.min(width * 0.055, 22)}px;
  padding-horizontal: 5%;
`;

const QuickActionsContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 6%;
  margin-bottom: 5%;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
  width: 100%;
`;

const SectionTitle = styled(Text)`
  font-size: ${Math.min(width * 0.05, 20)}px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 5%;
  text-align: center;
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: #007AFF;
  border-radius: 15px;
  padding: 5%;
  margin-bottom: 4%;
  align-items: center;
  justify-content: center;
  shadow-color: #667eea;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
  flex-direction: row;
  min-height: ${height * 0.075}px;
`;

const ActionButtonText = styled(Text)`
  color: #ffffff;
  font-size: ${Math.min(width * 0.045, 18)}px;
  font-weight: 600;
  margin-left: 3%;
`;

const ActionIcon = styled.View`
  width: ${width * 0.06}px;
  height: ${width * 0.06}px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${width * 0.03}px;
  align-items: center;
  justify-content: center;
`;

// Decorative elements with percentage positioning
interface DecorativeCircleProps {
  size: number;
  top: string;
  left: string;
  opacity: number;
}

const DecorativeCircle = styled.View<DecorativeCircleProps>`
  position: absolute;
  width: ${(props: DecorativeCircleProps) => props.size}px;
  height: ${(props: DecorativeCircleProps) => props.size}px;
  border-radius: ${(props: DecorativeCircleProps) => props.size / 2}px;
  background-color: rgba(255, 255, 255, ${(props: DecorativeCircleProps) => props.opacity});
  top: ${(props: DecorativeCircleProps) => props.top};
  left: ${(props: DecorativeCircleProps) => props.left};
`;

const LogOutIconButton = () => (
  <LogOutIcon size={Math.min(width * 0.045, 18)} color="#fff" />
);

const VolleyballIconButton = () => (
  <VolleyBallIcon size={Math.min(width * 0.045, 18)} color="#fff" />
);

const MailboxIconButton = () => (
  <MailboxIcon size={Math.min(width * 0.045, 18)} color="#fff" />
);

const BellIconButton = () => (
  <BellIcon size={Math.min(width * 0.045, 18)} color="#fff" />
);

type Props = {
  onBookCourt: () => void;
  onLogout: () => void;
  onTestNotification: () => void;
  onViewNotifications: () => void;
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

  // Percentage-based decorative circles
  const circles = [
    { size: width * 0.3, top: '10%', left: '-8%', opacity: 0.1 },
    { size: width * 0.23, top: '25%', left: '85%', opacity: 0.15 },
    { size: width * 0.28, top: '70%', left: '-10%', opacity: 0.08 },
    { size: width * 0.21, top: '75%', left: '85%', opacity: 0.12 },
  ];

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
                  <MailboxIconButton />
                </ActionIcon>
                <ActionButtonText>Test Notification</ActionButtonText>
              </ActionButton>
              
              {onViewNotifications && (
                <ActionButton onPress={onViewNotifications} activeOpacity={0.8}>
                  <ActionIcon>
                    <BellIconButton />
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