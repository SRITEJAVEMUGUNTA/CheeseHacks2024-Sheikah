import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import SignUpPage from "./signup";
import LoginPage from "./login";
import { useRouter } from "expo-router";
import { Image } from "react-native";

function CustomButton({ text }: { text: string }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        if (text.includes("Sign")) {
          router.push("/signup");
        }
        if (text.includes("Log")) {
          router.push("/login");
        }
      }}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

function HomePage() {
  return (
    <View style={styles.default}>
      <Image
        style={styles.avatar}
        source={{
          uri: "https://media.istockphoto.com/id/1182467056/vector/cute-meadow-area-with-clouds-stars-and-mountains.jpg?s=612x612&w=0&k=20&c=SwM7C0pbLBDmJRKXJLwGfFVPB2Tl5boff8kYmQOs3mg=",
        }}
      />
      <Text style={styles.title}>SHEIKAH</Text>
      <View style={styles.buttonContainer}>
        <CustomButton text="Sign Up" />
        <CustomButton text="Login" />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return <HomePage />;
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
    letterSpacing: 1,
  },
  buttonContainer: {
    width: "80%",
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    position: "absolute", // Fix the image to the background
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    flex: 1,
    height: "100%",
  },
  buttonText: {
    color: "#4e13d6",
    fontSize: 16,
    fontWeight: "600",
  },
});
