import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Image,

} from "react-native";
import { firebase, firestore } from "../../config";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";


const TellUsAboutYourself = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const user = firebase.auth().currentUser;

  const handleContinue =  async (e) => {
    e.preventDefault();

    if (!name || !surname || !phone || !gender || !email || !location) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    localStorage.setItem("user", user.uid);

    try {
      const userRef = firestore.collection("Users").doc(user.uid);

      await userRef.set({
        name,
        surname,
        phone,
        gender,
        email,
        location,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid,
      });

      console.log("User information successfully submitted to Firestore.");

      navigation.navigate("AlternativeContact");
    } catch (error) {
      console.error("Error submitting user information:", error.message);
      alert("Error submitting user information. Please try again.");
    }
  };
  const emptyOption = [""];
  const genderOptions = ["Male", "Female", "Other"];

  return (
    <ImageBackground
      source={require("../../Global/images/Reed.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../../Global/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>MAIN ACCOUNT HOLDER</Text>
        <Text style={styles.subtitle}>TELL US ABOUT YOURSELF</Text>

        <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "75%",
                    }}>
        <TextField
           id="outlined-number"
           label="Name"
           type="text"
           variant="standard"
           InputLabelProps={{
             shrink: true,
           }}
          
           value={name}
           onChange={(e) => setName(e.target.value)}
           style={{
            width: "48%",

            marginRight: "5px",
           
          }}
          />
        
              <TextField
              id="outlined-number"
              label="Surname"
              type="text"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
             
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
               style={{
            width: "48%",
            // marginTop: "5px",
            // marginRight: "10px",
            // textAlign: "left",
          }}
             />
        </View>

        <TextField
           id="outlined-number"
           label="Phone"
           type="text"
           variant="standard"
           InputLabelProps={{
             shrink: true,
           }}
          
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
           style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
          />
            <br />
     <TextField
                    id="outlined"
                    select
                    label="Gender"
                    variant="standard"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: "75%",
                      textAlign: "left",
                      marginTop: "10px",
                    }}>
                    {genderOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <br />
        <TextField
           id="outlined-number"
           label="Email"
           type="text"
           variant="standard"
           InputLabelProps={{
             shrink: true,
           }}
          
           value={email}
           onChange={(e) => setEmail(e.target.value)}
            style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
          />

       
           <TextField
           id="outlined-number"
           label="Location"
           type="text"
           variant="standard"
           InputLabelProps={{
             shrink: true,
           }}
          
           value={location}
           onChange={(e) => setLocation(e.target.value)}
           style={{
            width: "75%",
            marginTop: "5px",
            textAlign: "left",
          }}
          />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>CONTINUE</Text>
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
  
    // alignItems: "center",
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 150,
    resizeMode: "contain",
    // marginLeft: "29%",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    // marginBottom: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 15,
  },
  pickerItem: {
    color: "#072840",

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
  row: {
    flexDirection: "row",
  },
});

export default TellUsAboutYourself;
