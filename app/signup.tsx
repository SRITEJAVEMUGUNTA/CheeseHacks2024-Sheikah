import { useRouter } from "expo-router";
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Image } from "react-native";
import { attemptSignIn, createUser } from "./server/firebase";
import { addUser } from "./server/supabase";

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
      autoComplete="email"
      autoCapitalize="none"
    />
  );
}

export default function CombinedForm() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [userDetails, setUserDetails] = React.useState("");
  const scrollRef = React.useRef<ScrollView>(null);
  const navigation = useRouter();

  let sampleJSON: any = {
    prompt: userDetails,
  };

  const handleNext = (index: number) => {
    scrollRef.current?.scrollTo({ y: index * 800, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Fixed Image as background */}
      <Image
        style={styles.avatar}
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
          <Text style={styles.title}>PILO</Text>
          <FormInput
            placeholder="Username"
            value={username}
            setValue={setUsername}
          />
          <FormInput
            placeholder="Password"
            value={password}
            setValue={setPassword}
          />
          <FormInput
            placeholder="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleNext(1)}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.description}>
            Enter any and all details regarding your character's background,
            identity, and the world this character inhabits.
          </Text>
          <FormInput
            placeholder="Character Details"
            value={userDetails}
            setValue={setUserDetails}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              createUser(username, password).then((result) => {
                if (result.user) {
                  addUser({
                    username: username,
                    displayedCollectibleID: "1245",
                    LLMPrompts: sampleJSON,
                    collectibleIDs: ["1245"],
                    waypointIds: ["58237"],
                  }).then((response) => {
                    console.log(response);
                  });
                  //generate collectable
                  navigation.push("/(tabs)");
                }
              });
            }}
          >
            <Text style={styles.buttonText}>Let's Go!</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background for minimalistic theme
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent", // Make scroll view background transparent
    zIndex: 1, // Ensure scrollable content is above the image
  },
  section: {
    flex: 1,
    height: 800,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative", // Important for positioning content above image
  },
  avatar: {
    position: "absolute", // Fix the image to the background
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
    color: "#FFF", // White text for contrast
    marginBottom: 20,
    zIndex: 2, // Ensure title appears above the image
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFF",
    marginBottom: 20,
    lineHeight: 24,
    zIndex: 2, // Ensure description appears above the image
  },
  input: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 5,
    color: "#FFF",
    backgroundColor: "#222", // Dark background for inputs
    zIndex: 2, // Ensure input fields appear above the image
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FFF", // White button
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    zIndex: 2, // Ensure button appears above the image
  },
  buttonText: {
    color: "#000", // Black text on the button
    fontWeight: "bold",
    fontSize: 16,
  },
});
