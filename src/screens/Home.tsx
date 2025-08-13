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

const { width, height } = Dimensions.get('window');

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #007AFF;
`;

const ScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 30px;
  margin-top: 20px;
`;

const WelcomeText = styled(Text)`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SubtitleText = styled(Text)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 22px;
`;

const QuickActionsContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
`;

const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 20px;
  text-align: center;
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: #007AFF;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  shadow-color: #667eea;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
  flex-direction: row;
`;

const ActionButtonText = styled(Text)`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
`;

const ActionIcon = styled.View`
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;


const LogOutIconButton = () => (
  <LogOutIcon size={18} color="#fff" />
);

const VolleyballIconButton = () => (
  <VolleyBallIcon size={18} color="#fff" />
);

type Props = {
  onBookCourt: () => void;
  onLogout: () => void;
};

export const Home: React.FC<Props> = ({ onBookCourt, onLogout }) => {
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

  return (
    <Container>

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
            <ActionButton onPress={onLogout} activeOpacity={0.8}>
              <ActionIcon>
                <LogOutIconButton />
              </ActionIcon>
              <ActionButtonText>Sign Out</ActionButtonText>
            </ActionButton>

          </QuickActionsContainer>

        </Animated.View>
      </ScrollContainer>
    </Container>
  );
};

export default Home;