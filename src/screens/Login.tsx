import React, { useState, useRef, useEffect } from "react";
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
  ScrollView
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import {TOKEN_AUTH} from "src/api/auth/queries"; 

const { width, height } = Dimensions.get('window');


// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #007AFF;
`;

const ScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
`;

const FormContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 40px 30px;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.25;
  shadow-radius: 20px;
  elevation: 15;
  margin-horizontal: 10px;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled(Text)`
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-size: 16px;
  color: #666666;
  text-align: center;
  line-height: 22px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const InputLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
  margin-left: 4px;
`;

const StyledTextInput = styled(TextInput)`
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #333333;
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
  padding: 18px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  shadow-color: #007AFF;
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: ButtonProps) => props.disabled ? 0.1 : 0.3};
  shadow-radius: 8px;
  elevation: ${(props: ButtonProps) => props.disabled ? 2 : 6};
`;

const ButtonText = styled(Text)<ButtonProps>`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
`;

const ErrorContainer = styled.View`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
`;

const ErrorText = styled(Text)`
  color: #cc0000;
  font-size: 14px;
  text-align: center;
`;


// Decorative elements
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
  
  const [tokenAuth, { loading, error }] = useMutation(TOKEN_AUTH);
  
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
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
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

  return (
    <Container>
      {/* Decorative background elements */}
      <DecorativeCircle size={100} top={60} left={-30} opacity={0.1} />
      <DecorativeCircle size={80} top={150} left={width - 50} opacity={0.15} />
      <DecorativeCircle size={120} top={height - 200} left={-40} opacity={0.08} />
      <DecorativeCircle size={90} top={height - 150} left={width - 60} opacity={0.12} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
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
                  />
                ) : (
                  <StyledTextInput
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
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
      </KeyboardAvoidingView>
    </Container>
  );
}