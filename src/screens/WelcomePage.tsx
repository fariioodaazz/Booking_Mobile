import React, { useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { SafeAreaView, Text, Image, Animated, Dimensions } from "react-native";
import styled from "styled-components/native";
import CalendarDaysIcon from "assets/CalendarDaysIcon";

const { width, height } = Dimensions.get('window');

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #007AFF;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const LogoContainer = styled.View`
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 25px;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const Logo = styled(Image)`
  width: 120px;
  height: 120px;
  resize-mode: contain;
`;

const WelcomeTextContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const WelcomeTitle = styled(Text)`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const WelcomeSubtitle = styled(Text)`
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 24px;
  margin-top: 12px;
`;

const AppName = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.View`
  width: 100%;
  gap: 16px;
`;

const StyledButton = styled(Button)`
  background-color: #ffffff;
  border-radius: 25px;
  padding: 16px 40px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const ButtonText = styled(Text)`
  color: #667eea;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;


// Animated decorative elements
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

type Props = {
  onLogIn: () => void;
};

export const WelcomePage: React.FC<Props> = ({ onLogIn }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Container>
      {/* Decorative background elements */}
      <DecorativeCircle size={120} top={80} left={-30} opacity={0.1} />
      <DecorativeCircle size={80} top={200} left={width - 50} opacity={0.15} />
      <DecorativeCircle size={60} top={height - 200} left={30} opacity={0.1} />
      <DecorativeCircle size={100} top={height - 150} left={width - 80} opacity={0.12} />

      <Animated.View
        style={{
          flex: 1,
          width: '100%',
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }}
      >
        <ContentWrapper>
          <LogoContainer>
            <Logo source={require("assets/NU.png")} />
          </LogoContainer>

          <WelcomeTextContainer>
            <WelcomeTitle>Welcome to</WelcomeTitle>
            <AppName>NU Sports Booking App</AppName>
            <WelcomeSubtitle>
              Book your favorite sports facilities{'\n'}
              at Nile University with ease
            </WelcomeSubtitle>
          </WelcomeTextContainer>

          <ButtonContainer>
            <StyledButton onPress={onLogIn}>
              <ButtonText>Get Started</ButtonText>
            </StyledButton>
          </ButtonContainer>
        </ContentWrapper>

      </Animated.View>
    </Container>
  );
};