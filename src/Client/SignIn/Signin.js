import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Link,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../Global/Color";
import { FontAwesome } from "@expo/vector-icons";
import { firebase, firestore } from "../../config";

const Signin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      if (email.trim() === "" || password.trim() === "") {
        alert("Please fill in all fields before signing in.");
        return;
      }
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);

      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        console.log("User signed up:", userCredential.user);

        // Create a user document with the UID in the Users collection
        await firestore.collection("Users").doc(userCredential.user.uid).set({
          email: email,
        });

        // Navigate to "/TellUsAboutYourself" after successful sign-up
        navigation.navigate("TellUsAboutYourself");
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert("Error signing up. Please try again.");
    }
  };

  const handleShop = () => {
    navigate("/Landing");
  };

  const handleBusinessSignup = () => {
    console.log("Signing up as a business");
  };

  return (
    <ImageBackground
      source={require("../../Global/images/Reed.jpg")}
      style={styles.background}>
      <View style={styles.container}>
        {/* Logo image container */}
        <View style={{}}>
          <Image
            source={require("../../Global/images/logo.png")}
            style={styles.logo}
          />
        </View>
        {/* SignUp text container */}
        <View
          style={{
            width: "120%",
            flexDirection: "row",
            justifyContent: "space-around",
          }}>
          <Text style={styles.title}>SIGN IN </Text>
          {/*Insert arrow logo */}
          <Text style={{ fontSize: "70%", marginBottom: "-20%" }}>
            SHOP{" "}
            <FontAwesome
              style={styles.arrow}
              name="angle-right"
              size={20}
              color="#072840"
            />{" "}
          </Text>
        </View>
        {/* TextInput fields container */}
        <View style={{ width: "75%" }}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View>
          <Text
            style={{
              position: "relative",
              left: "5vw",
              marginVertical: "1vh",
              cursor: "pointer",
            }}>
            {" "}
            FORGOT PASSWORD?
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.linkText}> ALREADY HAVE AN ACCOUNT?</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.linkText1}>
            {" "}
            <AntDesign name="google" size={15} color="red" />
            SIGN UP WITH GOOGLE
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "30%",
    marginLeft: "69%",
    height: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
  },
  input: {
    height: 40,
    // marginBottom: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#072840",
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 10,
    width: "75%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  linkText: {
    color: COLORS.darkBlue,
    textAlign: "center",
    marginTop: 20,
  },
  linkText1: {
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  businessButton: {
    borderColor: COLORS.darkBlue,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: "10%",
    width: "75%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonText1: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#072840",
  },
  arrow: {
    marginLeft: "10px",
  },
});
export default Signin;
