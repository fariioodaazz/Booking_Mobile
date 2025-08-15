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
  ScrollView,
  Keyboard
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import {TOKEN_AUTH} from "src/api/auth/queries"; 

const { width, height } = Dimensions.get('window');

// Styled Components with percentage-based sizing
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const KeyboardAvoidingContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: '5%',
    paddingTop: '10%',
  },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

const FormContainer = styled.View`
  background-color: #007AFF;
  border-radius: 25px;
  padding: 8%;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.25;
  shadow-radius: 20px;
  elevation: 15;
  margin-horizontal: 2%;
  width: 96%;
  max-width: 90%;
  align-self: center;
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: 8%;
`;

const Title = styled(Text)`
  font-size: ${Math.min(width * 0.07, 28)}px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2%;
  text-align: center;
`;

const Subtitle = styled(Text)`
  font-size: ${Math.min(width * 0.04, 16)}px;
  color: #fff;
  text-align: center;
  line-height: ${Math.min(width * 0.055, 22)}px;
  padding-horizontal: 2%;
`;

const InputContainer = styled.View`
  margin-bottom: 5%;
`;

const InputLabel = styled(Text)`
  font-size: ${Math.min(width * 0.035, 14)}px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2%;
  margin-left: 1%;
`;

const StyledTextInput = styled(TextInput)`
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 4%;
  font-size: ${Math.min(width * 0.04, 16)}px;
  color: #333333;
  min-height: ${height * 0.065}px;
`;

const FocusedInput = styled(StyledTextInput)`
  border-color: #6b7280;
  background-color: #ffffff;
`;

interface ButtonProps {
  disabled: boolean;
}

const LoginButton = styled(TouchableOpacity)<ButtonProps>`
  background-color: ${(props: ButtonProps) => props.disabled ? '#d1d5db' : '#fff'};
  border-radius: 12px;
  padding: 4.5%;
  align-items: center;
  justify-content: center;
  margin-top: 3%;
  shadow-color: #007AFF;
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props: ButtonProps) => props.disabled ? 0.1 : 0.3};
  shadow-radius: 8px;
  elevation: ${(props: ButtonProps) => props.disabled ? 2 : 6};
  min-height: ${height * 0.07}px;
`;

const ButtonText = styled(Text)<ButtonProps>`
  color: #007AFF;
  font-size: ${Math.min(width * 0.045, 18)}px;
  font-weight: 600;
`;

const ErrorContainer = styled.View`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 3%;
  margin-top: 4%;
`;

const ErrorText = styled.Text`
  color: #cc0000;
  font-size: ${Math.min(width * 0.035, 14)}px;
  text-align: center;
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


  return (
    <Container>

      <KeyboardAvoidingContainer
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollContainer
          extraScrollHeight={height * 0.05}
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
                    outputRange: [0, -height * 0.08],
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