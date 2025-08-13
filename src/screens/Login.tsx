import { useState, useRef, useEffect } from "react";
import { 
  TextInput, 
  Text, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Keyboard,
  StatusBar
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import {TOKEN_AUTH} from "src/api/auth/queries"; 

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
    formPadding: isVerySmallScreen ? 20 : isSmallScreen ? 30 : 40,
    formInnerPadding: isVerySmallScreen ? 20 : 30,
    titleSize: isVerySmallScreen ? 24 : isSmallScreen ? 26 : 28,
    subtitleSize: isVerySmallScreen ? 14 : 16,
    inputPadding: isSmallScreen ? 14 : 16,
    inputFontSize: isSmallScreen ? 14 : 16,
    buttonPadding: isSmallScreen ? 16 : 18,
    buttonFontSize: isSmallScreen ? 16 : 18,
    circleScale: isSmallScreen ? 0.8 : isTablet ? 1.2 : 1,
  };
};

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #007AFF;
`;

const KeyboardAvoidingContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ScrollContainer = styled(ScrollView).attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: getResponsiveDimensions().sidePadding,
    paddingTop: Math.max(getResponsiveDimensions().sidePadding, (StatusBar.currentHeight || 0) + 20),
  },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`;

const FormContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: ${() => getResponsiveDimensions().formInnerPadding}px;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.25;
  shadow-radius: 20px;
  elevation: 15;
  margin-horizontal: ${() => getResponsiveDimensions().isVerySmallScreen ? 5 : 10}px;
  width: 100%;
  max-width: ${() => getResponsiveDimensions().isTablet ? 450 : 400}px;
  align-self: center;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${() => getResponsiveDimensions().isVerySmallScreen ? 30 : 40}px;
`;

const Title = styled(Text)`
  font-size: ${() => getResponsiveDimensions().titleSize}px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-size: ${() => getResponsiveDimensions().subtitleSize}px;
  color: #666666;
  text-align: center;
  line-height: ${() => getResponsiveDimensions().subtitleSize + 6}px;
  padding-horizontal: 5px;
`;

const InputContainer = styled.View`
  margin-bottom: ${() => getResponsiveDimensions().isVerySmallScreen ? 16 : 20}px;
`;

const InputLabel = styled(Text)`
  font-size: ${() => getResponsiveDimensions().isVerySmallScreen ? 12 : 14}px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
  margin-left: 4px;
`;

const StyledTextInput = styled(TextInput)`
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: ${() => getResponsiveDimensions().inputPadding}px;
  font-size: ${() => getResponsiveDimensions().inputFontSize}px;
  color: #333333;
  min-height: ${() => getResponsiveDimensions().isVerySmallScreen ? 44 : 52}px;
`;

const FocusedInput = styled(StyledTextInput)`
  border-color: #007AFF;
  background-color: #ffffff;
`;

interface ButtonProps {
  disabled: boolean;
}

const LoginButton = styled(TouchableOpacity)<ButtonProps>`
  background-color: ${(props: ButtonProps) => props.disabled ? '#cccccc' : '#007AFF'};
  border-radius: 12px;
  padding: ${() => getResponsiveDimensions().buttonPadding}px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  shadow-color: #007AFF;
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: ButtonProps) => props.disabled ? 0.1 : 0.3};
  shadow-radius: 8px;
  elevation: ${(props: ButtonProps) => props.disabled ? 2 : 6};
  min-height: ${() => getResponsiveDimensions().isVerySmallScreen ? 48 : 56}px;
`;

const ButtonText = styled(Text)<ButtonProps>`
  color: #ffffff;
  font-size: ${() => getResponsiveDimensions().buttonFontSize}px;
  font-weight: 600;
`;

const ErrorContainer = styled.View`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: ${() => getResponsiveDimensions().isVerySmallScreen ? 10 : 12}px;
  margin-top: 16px;
`;

const ErrorText = styled(Text)`
  color: #cc0000;
  font-size: ${() => getResponsiveDimensions().isVerySmallScreen ? 12 : 14}px;
  text-align: center;
`;

// Decorative elements
const getCircleProps = () => {
  const { circleScale, isVerySmallScreen } = getResponsiveDimensions();
  
  return {
    circles: [
      { 
        size: 100 * circleScale, 
        top: isVerySmallScreen ? 40 : 60, 
        left: -30 * circleScale, 
        opacity: 0.1 
      },
      { 
        size: 80 * circleScale, 
        top: isVerySmallScreen ? 120 : 150, 
        left: width - (50 * circleScale), 
        opacity: 0.15 
      },
      { 
        size: 120 * circleScale, 
        top: height - (isVerySmallScreen ? 150 : 200), 
        left: -40 * circleScale, 
        opacity: 0.08 
      },
      { 
        size: 90 * circleScale, 
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

interface LoginProps {
  onLoggedIn: () => void;
}

export default function Login({ onLoggedIn }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const [tokenAuth, { loading, error }] = useMutation(TOKEN_AUTH);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

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
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(keyboardAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await tokenAuth({ variables: { email, password } });
      const token = data?.tokenAuth?.token;
      if (token) {
        await AsyncStorage.setItem("token", token);
        onLoggedIn();
      }
    } catch (err) {
      // Error is handled by Apollo's error state
      console.error("Login error:", err);
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";
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

      <KeyboardAvoidingContainer
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollContainer
          extraScrollHeight={20}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
                {
                  translateY: keyboardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50],
                  }),
                },
              ],
            }}
          >
            <FormContainer>
              <HeaderContainer>
                <Title>Welcome Back</Title>
                <Subtitle>Sign in to access your NU Sports account</Subtitle>
              </HeaderContainer>

              <InputContainer>
                <InputLabel>Email Address</InputLabel>
                {emailFocused ? (
                  <FocusedInput
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                ) : (
                  <StyledTextInput
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                )}
              </InputContainer>

              <InputContainer>
                <InputLabel>Password</InputLabel>
                {passwordFocused ? (
                  <FocusedInput
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    returnKeyType="done"
                    onSubmitEditing={isFormValid ? handleLogin : undefined}
                  />
                ) : (
                  <StyledTextInput
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    returnKeyType="done"
                    onSubmitEditing={isFormValid ? handleLogin : undefined}
                  />
                )}
              </InputContainer>

              <LoginButton
                onPress={handleLogin}
                disabled={loading || !isFormValid}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <ButtonText disabled={loading || !isFormValid}>
                    Sign In
                  </ButtonText>
                )}
              </LoginButton>

              {error && (
                <ErrorContainer>
                  <ErrorText>
                    {error.message.includes('credentials') 
                      ? 'Invalid email or password. Please try again.' 
                      : error.message}
                  </ErrorText>
                </ErrorContainer>
              )}

            </FormContainer>
          </Animated.View>
        </ScrollContainer>
      </KeyboardAvoidingContainer>
    </Container>
  );
}