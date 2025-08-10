import React, { useState } from "react";
import { View, TextInput, Button, Text, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { gql, useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_AUTH = gql`
  mutation TokenAuth($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`;

export default function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tokenAuth, { loading, error }] = useMutation(TOKEN_AUTH);

  const handleLogin = async () => {
    const { data } = await tokenAuth({ variables: { email, password } });
    const token = data?.tokenAuth?.token;
    if (token) {
      await AsyncStorage.setItem("token", token);
      onLoggedIn();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={{ flex: 1, padding: 20, marginTop: 30 }}>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{
            marginBottom: 12,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 4,
            padding: 10,
          }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            marginBottom: 12,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 4,
            padding: 10,
          }}
        />
        <Button
          title={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
        />
        {error && <Text style={{ color: "red" }}>{error.message}</Text>}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
