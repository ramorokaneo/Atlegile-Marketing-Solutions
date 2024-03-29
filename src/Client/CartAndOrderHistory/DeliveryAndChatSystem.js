import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  ImageList,
  ImageListItem,
} from "@mui/material";

import { useNavigation } from "@react-navigation/native";
import FollowUs from "../../Global/Header";
import Navbar from "../../Global/Navbar";
import { Footer } from "../../Global/Footer";
import { firestore } from "../../config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const MAP_LIBRARIES = ["places"];

const DeliveryAndChatSystem = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;
  const [chatmodelVisble, setChatmodelVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBMth0dboixZRgwUPycpuqH9Gibyy-iAjs",
    libraries: MAP_LIBRARIES,
  });
  if (loadError) {
    return (
      <View>
        <Text>Error loading Google Maps API</Text>
      </View>
    );
  }
  const [chats, setChats] = useState([
    // Initial chat data
    { messages: "Hello!", dateAntTime: "12:30 PM", status: "sent" },
    { messages: "Hi there!", dateAntTime: "12:35 PM", status: "recieved" },
  ]);

  // Effect for handling user authentication state changes
  useEffect(() => {
    // Get authentication instance
    const auth = getAuth();

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Set the user state based on the authentication state
      setUser(user);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, []); // Dependency array is empty, so this effect runs once during component mount

  // Effect for fetching order data based on orderId and user state
  useEffect(() => {
    // Function to fetch order data from Firestore
    const fetchOrderData = async () => {
      try {
        // Reference to the specific order document in Firestore
        const orderDocRef = doc(firestore, "Orders", orderId);

        // Get a snapshot of the order document
        const orderDocSnapshot = await getDoc(orderDocRef);

        if (orderDocSnapshot.exists()) {
          // Extract order data from the snapshot and set it in the state
          const orderData = orderDocSnapshot.data();
          setOrder(orderData);
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        // Log an error if there's an issue fetching order data
        console.error("Error fetching order data:", error);
      } finally {
        // Set loading to false after data fetching is complete
        setLoading(false);
      }
    };

    // Call the fetchOrderData function when dependencies change
    fetchOrderData();
  }, [firestore, orderId, user]); // Dependencies for the effect to re-run when these values change

  const CourierAPIKey = "20100d3a439b4d1399f527d08a303f7a";

  const handleSend = () => {
    // Check if the message is not empty
    if (message.trim() !== "") {
      // Create a new message object
      const newMessage = {
        messages: message,
        dateAntTime: new Date().toLocaleTimeString(),
        status: "sent",
      };
      setChats([...chats, newMessage]);
      setMessage("");
    }
  };

  // Function to toggle the visibility of the chat modal
  const handleMessageButtonClick = () => {
    setChatmodelVisible(!chatmodelVisble);
  };

  // Function to navigate to the Landing screen
  const navigateToLanding = () => {
    navigation.navigate("Landing");
  };

  // Function to navigate to the DeliveryOngoing screen with orderId as a parameter
  const navigateToDeliveryOngoing = () => {
    navigation.navigate("DeliveryOngoing", { orderId });
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      {chatmodelVisble && (
        // Modal overlay for the chat window
        <View
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "40vw",
            }}
          >
            <View
              style={{
                height: "65%",
                width: "80%",
                backgroundColor: "white",
              }}
            >
              {/* Close button for the chat window */}
              <TouchableOpacity
                onPress={() => setChatmodelVisible(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                {/* X icon button */}
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>

              {/* Chat message area */}
              <ScrollView
                style={{
                  flex: 1,
                  padding: 10,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  CHAT TO DRIVER
                </Text>

                {/* Map through chats to display messages */}
                {chats.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      alignSelf:
                        item.status === "sent" ? "flex-start" : "flex-end",
                      maxWidth: "60%",
                      flexDirection: "row",
                    }}
                  >
                    {/* Message bubble */}
                    <View
                      style={{
                        backgroundColor:
                          item.status === "sent"
                            ? "#E6E6E6"
                            : item.status === "recieved"
                            ? "#072840"
                            : "#FFFFFF",
                        padding: 10,
                        maxWidth: "100%",
                        wordWrap: "break-word",
                        borderTopRightRadius:
                          item.status === "sent"
                            ? 20
                            : item.status === "recieved"
                            ? 20
                            : 0,
                        borderBottomRightRadius:
                          item.status === "sent"
                            ? 20
                            : item.status === "recieved"
                            ? 0
                            : 0,
                        borderBottomLeftRadius: 20,
                        borderTopLeftRadius:
                          item.status === "sent"
                            ? 0
                            : item.status === "recieved"
                            ? 20
                            : 0,
                      }}
                    >
                      {/* Display the message text */}
                      <Text
                        style={{
                          color:
                            item.status === "sent"
                              ? "black"
                              : item.status === "recieved"
                              ? "#FFFFFF"
                              : "black",
                        }}
                      >
                        {item.messages}
                      </Text>
                    </View>

                    {/* Display the message timestamp */}
                    <View
                      style={{
                        fontSize: 14,
                        width: "100%",
                        height: "auto",
                        justifyContent:
                          item.status === "sent"
                            ? "flex-start"
                            : item.status === "recieved"
                            ? "flex-end"
                            : "inherit",
                      }}
                    >
                      <Text>{item.dateAntTime}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Input area for sending a message */}
              <View
                style={{
                  height: "12%",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                {/* Input field for typing a message */}
                <TextInput
                  style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    color: "black",
                  }}
                  placeholder="Type your message here"
                  placeholderTextColor="grey"
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />

                {/* Button to send the message */}
                <TouchableOpacity
                  onPress={handleSend}
                  style={{
                    backgroundColor: "#072840",
                    borderRadius: 40,
                    padding: 10,
                    marginLeft: 10,
                  }}
                >
                  {/* "SEND" text on the button */}
                  <Text style={{ color: "white" }}>SEND</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      <FollowUs />
      <Navbar />
      <ScrollView style={{ flexDirection: "column", backgroundColor: "white" }}>
        <Container fixed sx={{ minHeight: "90vh" }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Grid container spacing={2} mx="auto">
              <Grid item xs={12} md={8}>
                {/* Left Side Content */}
                <Box mt={2} pr={4}>
                  {/* Heading displaying the order number */}
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    ORDER #ABC246
                  </Typography>

                  {/* Container for navigation links */}
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    {/* Account link */}
                    <Typography>
                      <TouchableOpacity
                        onPress={navigateToLanding}
                        style={{ color: "grey" }}
                      >
                        <Text>Acount /</Text>
                      </TouchableOpacity>
                    </Typography>

                    {/* Cart link */}
                    <Typography>
                      <TouchableOpacity
                        onPress={navigateToDeliveryOngoing}
                        style={{ color: "grey" }}
                      >
                        Cart
                      </TouchableOpacity>
                    </Typography>
                  </View>

                  {/* Heading for the cart section */}
                  <Typography variant="h4" style={{ fontWeight: "bold" }}>
                    CART
                  </Typography>
                  {/* ScrollView container with specific styles */}
                  <ScrollView
                    style={{ flex: 1, height: "50vh", alignSelf: "center" }}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Grid container for displaying items in the cart */}

                    <Grid container spacing={2}>
                      {order.items &&
                        order.items.map((item, index) => (
                          // Grid item for each item in the cart
                          <Grid item xs={12} key={index}>
                            {/* Card component representing each item */}
                            <Card
                              sx={{
                                height: "auto",
                                borderBottomColor: "black",
                              }}
                            >
                              {/* Box component for organizing content */}
                              <Box
                                display="flex"
                                flexDirection={{ xs: "column", md: "row" }}
                                alignItems="center"
                                borderBottomWidth={2}
                                padding={2}
                              >
                                {/* Box for displaying product image */}
                                <Box
                                  width={{ xs: "100%", md: "30%" }}
                                  marginBottom={{ xs: 2, md: 0 }}
                                >
                                  {/* ImageList for rendering product image */}
                                  <ImageList cols={1} rowHeight="100%">
                                    <ImageListItem style={{ width: "100%" }}>
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </ImageListItem>
                                  </ImageList>
                                </Box>
                                {/* Box for displaying product name */}
                                <Box
                                  width={{ xs: "100%", md: "30%" }}
                                  paddingLeft={{ xs: 0, md: 2 }}
                                  marginBottom={{ xs: 2, md: 0 }}
                                >
                                  {/* Typography for the "Product" label */}
                                  <Typography
                                    fontSize={16}
                                    fontWeight="bold"
                                    color="gray"
                                  >
                                    Product
                                  </Typography>
                                  {/* Typography for displaying the product name */}
                                  <Typography fontSize={18} fontWeight="bold">
                                    {item.name}
                                  </Typography>
                                </Box>
                                {/* Box for displaying quantity */}
                                <Box
                                  width={{ xs: "100%", md: "30%" }}
                                  paddingLeft={{ xs: 0, md: 2 }}
                                  marginBottom={{ xs: 2, md: 0 }}
                                >
                                  {/* Typography for the "Quantity" label */}
                                  <Typography
                                    fontSize={16}
                                    fontWeight="bold"
                                    color="gray"
                                  >
                                    Quantity
                                  </Typography>
                                  {/* Typography for displaying the quantity */}
                                  <Typography fontSize={18} fontWeight="bold">
                                    {item.quantity}
                                  </Typography>
                                </Box>
                                {/* Box for displaying amount */}
                                <Box
                                  width={{ xs: "100%", md: "30%" }}
                                  paddingLeft={{ xs: 0, md: 2 }}
                                >
                                  {/* Typography for the "Amount" label */}
                                  <Typography
                                    fontSize={16}
                                    fontWeight="bold"
                                    color="gray"
                                  >
                                    Amount
                                  </Typography>
                                  {/* Typography for displaying the amount */}
                                  <Typography fontSize={18} fontWeight="bold">
                                    {item.amount}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                  </ScrollView>

                  {order.items && (
                    <>
                      {/* Order Summary Section */}
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography style={{ fontWeight: "bold" }}>
                          Order Summary
                        </Typography>
                      </View>

                      {/* Delivery Fee Section */}
                      <View
                        style={{
                          display: "flex",
                          marginTop: "8px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography style={{ fontWeight: "bold" }}>
                          Delivery
                        </Typography>
                        <Typography style={{ fontWeight: "bold" }}>
                          R {order.deliveryFee}
                        </Typography>
                      </View>

                      {/* Agent Referral Section */}
                      <View
                        style={{
                          display: "flex",
                          marginTop: "8px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography style={{ fontWeight: "bold" }}>
                          Agent Referral
                        </Typography>
                        <Typography style={{ fontWeight: "bold" }}>
                          R {order.agentReferralAmount}
                        </Typography>
                      </View>

                      {/* Tax Section */}
                      <View
                        style={{
                          display: "flex",
                          marginTop: "8px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography style={{ fontWeight: "bold" }}>
                          Tax
                        </Typography>
                        <Typography style={{ fontWeight: "bold" }}>
                          R {order.Tax}
                        </Typography>
                      </View>

                      {/* Total Amount Section */}
                      <View
                        style={{
                          display: "flex",
                          marginTop: "8px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h5" style={{ fontWeight: "bold" }}>
                          Total
                        </Typography>
                        <Typography variant="h5" style={{ fontWeight: "bold" }}>
                          R {order.totalAmount}
                        </Typography>
                      </View>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                {/* Right Side Content */}
                <Box
                  backgroundColor="#062338"
                  mt={2}
                  p={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  mp={4}
                >
                  <Box mb={4}>
                    <View>
                      {/* Delivery Details Section */}
                      <Typography
                        variant="h5"
                        style={{
                          color: "#FFFFFF",
                          marginBottom: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        DELIVERY DETAILS
                      </Typography>

                      {/* Delivery Address Section */}
                      <View
                        style={{
                          borderBottom: "1px white solid",
                          marginBottom: 15,
                        }}
                      >
                        <Typography style={{ color: "grey" }}>
                          Delivery Address
                        </Typography>
                        <Typography variant="h6" style={{ color: "lightgrey" }}>
                          {order.deliveryAddress}
                        </Typography>
                      </View>

                      {/* Map Section */}
                      {order.coordinates && isLoaded ? (
                        <GoogleMap
                          center={{
                            lat: order.coordinates.lat,
                            lng: order.coordinates.lng,
                          }}
                          mapContainerStyle={{
                            height: "20vh",
                            width: "100%",
                            borderRadius: "25px", // Adjust the height as needed
                          }}
                          zoom={15}
                        >
                          <Marker
                            position={{
                              lat: order.coordinates.lat,
                              lng: order.coordinates.lng,
                            }}
                          />
                        </GoogleMap>
                      ) : (
                        <View>
                          <Text>Loading...</Text>
                        </View>
                      )}

                      {/* Delivery Notes Section */}
                      <Typography style={{ color: "grey", marginTop: "14px" }}>
                        Delivery Notes
                      </Typography>
                      <Typography style={{ color: "white" }}>
                        In essence, AMS aims to not only help businesses grow
                        but also make a positive image on society by nurturing
                        local talent and fostering sustainable business growth.
                      </Typography>
                      <View
                        style={{
                          marginTop: "10px",
                          borderBottomWidth: 1,
                          borderBottomColor: "lightgrey",
                        }}
                      ></View>

                      {/* Message Button Section */}
                    
                    </View>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </View>
        </Container>
        <Footer />
      </ScrollView>
    </View>
  );
};

export default DeliveryAndChatSystem;
