import React, { useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { SafeAreaView, Text, Image, Animated, Dimensions } from "react-native";
import styled from "styled-components/native";
import CalendarDaysIcon from "assets/CalendarDaysIcon";

const { width, height } = Dimensions.get('window');

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff; /* White background */
  justify-content: center;
  align-items: center;
  padding: 5% 4%;
`;

const ContentWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const LogoContainer = styled.View`
  margin-bottom: 4%;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 6%;
  shadow-color: #007AFF;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const Logo = styled(Image)`
  width: ${width * 0.25}px;
  height: ${width * 0.25}px;
  resize-mode: contain;
`;

const WelcomeTextContainer = styled.View`
  align-items: center;
  margin-bottom: 5%;
  padding-horizontal: 3%;
`;

const WelcomeTitle = styled(Text)`
  font-size: ${Math.min(width * 0.08, 32)}px;
  font-weight: 700;
  color: #007AFF; 
  text-align: center;
  margin-bottom: 2%;


  text-shadow-color: rgba(0, 0, 0, 0.16);
  text-shadow-offset: 0px 1.5px;
  text-shadow-radius: 2.5px;
`;

const AppName = styled(Text)`
  font-size: ${Math.min(width * 0.06, 24)}px;
  font-weight: 700;
  color: #007AFF; 
  text-align: center;

  /* Slightly stronger than title to "anchor" the header */
  text-shadow-color: rgba(0, 0, 0, 0.2);
  text-shadow-offset: 0px 2px;
  text-shadow-radius: 3px;
`;

const WelcomeSubtitle = styled(Text)`
  font-size: ${Math.min(width * 0.045, 18)}px;
  font-weight: 400;
  color: #374151;
  text-align: center;
  line-height: ${Math.min(width * 0.055, 22)}px;
  margin-top: 3%;
  padding-horizontal: 5%;

  /* Gentle shadow so it doesn't look fuzzy */
  text-shadow-color: rgba(0, 0, 0, 0.12);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 1.5px;
`;


const ButtonContainer = styled.View`
  width: 100%;
  gap: 4%;
  margin-top: auto;
  margin-bottom: 8%;
`;

const StyledButton = styled(Button)`
  background-color: #007AFF;
  border-radius: 25px;
  padding: 4% 10%;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const ButtonText = styled(Text)`
  color: #fff;
  font-size: ${Math.min(width * 0.045, 18)}px;
  font-weight: 600;
  text-align: center;
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
      <Animated.View
        style={{
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