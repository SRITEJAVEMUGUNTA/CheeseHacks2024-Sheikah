import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { attemptSignIn } from "./server/firebase";
import { ScrollView } from "react-native";

function FormInput({
  placeholder,
  value,
  setValue,
}: {
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#888"
      value={value}
      onChangeText={(newValue) => setValue(newValue)}
      style={styles.input}
      autoCapitalize="none"
    />
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Fixed background image */}
      <Image
        style={styles.backgroundImage}
        source={{
          uri: "https://media.istockphoto.com/id/1182467056/vector/cute-meadow-area-with-clouds-stars-and-mountains.jpg?s=612x612&w=0&k=20&c=SwM7C0pbLBDmJRKXJLwGfFVPB2Tl5boff8kYmQOs3mg=",
        }}
      />

      {/* Scrollable content */}
      <Animated.ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        pagingEnabled
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.title}>Welcome Back</Text>
          <FormInput
            placeholder="Username"
            value={username}
            setValue={setUsername}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword} // Use onChangeText instead of onChange for controlled input
            secureTextEntry={true} // This makes the text appear as dots
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              attemptSignIn(username, password).then((response) => {
                if (response.user.email) {
                  router.push("/(tabs)");
                }
              });
            }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2 */}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  section: {
    flex: 1,
    height: 800,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFF",
    marginBottom: 20,
    lineHeight: 24,
  },
  input: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 5,
    color: "#FFF",
    backgroundColor: "#222",
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
