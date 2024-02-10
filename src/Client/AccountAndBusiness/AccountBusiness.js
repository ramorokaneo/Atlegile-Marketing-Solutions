import React, { useState, useRef, useEffect } from "react";
import BlackSilk from "../../Global/images/blackSilk.jpg";
// import { IoMdStopwatch } from "react-icons/io";
//import { GoCheckCircleFill } from "react-icons/go";
// import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import BusinessAccountPlus from "../../Global/images/BusinessPlus+.jpg";
// import Card from "../../Components/Card/Card";
// import FollowUs from "../../Global/Navbar/FollowUs/FollowUs";
import NavBar from "../../Global/Navbar";
// import "./businessAccount.css";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
// import { Modal, Title } from "react-native-paper";
import { Footer } from "../../Global/Footer";
import ProductCard from "../../Global/Card";
const logo = require("../../Global/images/cropped-AMS-Shadow-Queen-Logo_BNY-1320x772 1.png");
const bg = require("../../Global/images/blackSilk.jpg");
import {
  Container,
  // Typography,
  Grid,
  TextField,
  Card,
  MenuItem,
  Box,
  Button,
  useTheme,
  CardMedia,
} from "@mui/material";
import Typography from "@mui/joy/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Icon2 from "react-native-vector-icons/Feather";
//import Button from '@mui/joy/Button';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Switch from "@mui/joy/Switch";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import Stack from "@mui/joy/Stack";
import Paper from "@mui/material/Paper";
import { AntDesign } from "@expo/vector-icons";
//import logo from "../../Global/images/logo.png";
import { COLORS } from "../../Global/Color";
import Header from "../../Global/Header";
import { Ionicons } from "@expo/vector-icons";
import { height } from "@mui/system";
import SideNav from "../../Global/SideNav";
import { Dimensions } from "react-native";
import Card2 from "../../Global/Card2";

import background from "../../Global/images/Reed.jpg";

import Banner from "../../Global/images/media bg-cover.png";
import placeholder from "../../Global/images/login.jpg";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

import { auth, firestore, storage } from "../../config";
import firebase from "firebase/compat/app";

import { PaperTextInput } from "react-native-paper";
import { Flag } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import Icon from "react-native-vector-icons/Feather";
import Icon1 from "react-native-vector-icons/FontAwesome";
import Navbar from "../../Global/Navbar";
import FollowUs from "../../Global/Header";

import hdtv from "../../Global/images/hdtv.jpg";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import mapImage from "../../Global/images/mapImage.png";
import axios from "axios";
import sara from "../../Global/images/Sara.png";
import Swal from "sweetalert2";
import BusinessProductCard from "../../Global/businessCard";
export default function BusinessAccount({ productsData }) {
  const [editModal, setEditModal] = useState(false);
  const [bannerModal, setBannerModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [businessAuthorization, setBusinessAuthorization] = useState(false);
  const [subscreibed, setSubscreibed] = useState(false);
  const [businessRegistered, setBusinessRegistered] = useState(true);
  const [landing, setLanding] = useState(true);
  const [productName, setProductName] = useState("");
  const [otherBanner, setOtherBanner] = useState("");
  const [priceOriginal, setPriceOriginal] = useState(0);
  const [priceDiscount, setPriceDiscount] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [bannerListLength, setBannerListLength] = useState(0);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [other, setOther] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProduct, setAddProduct] = useState("");
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState();
  const [expiery, setExpiery] = useState();
  const [cvv, setCvv] = useState();
  const emptyOption = [""];
  const [businessName, setBusinessName] = useState("");
  const [selectedProductCategory, setProductCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [showWebView, setShowWebView] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [user, setUser] = useState(null);
  const [checkOrder, setCheckOrder] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banner, setBanner] = useState([]);
  const [userData, setUserData] = useState(null);
  const [length, setLength] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
   // console.log("Product Data:", productData);
    setLoading(false);  // Add this line to set loading to false
  }, [products]);
  if (loading) {
    // Render a loading state using Skeleton
    return (
      <Card className="card-container">
        <Skeleton
          variant="rectangular"
          width={270}
          height={270}
          animation="wave"
        />
        <CardContent>
          <Skeleton variant="text" width={100} height={20} animation="wave" />
          <Skeleton variant="text" width={200} height={16} animation="wave" />
          <Skeleton variant="text" width={200} height={16} animation="wave" />
          <Skeleton variant="text" width={80} height={14} animation="wave" />
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    const fetchProductData = async () => {
      if (!user) {
        console.error("User not authenticated.");
        return;
      }

      const cartCollectionRef = collection(firestore, "Products");
      const q = query(
        cartCollectionRef,
        where("businessName", "==", userData.businessName)
      );

      try {
        const querySnapshot = await getDocs(q);

        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push(doc.data());
        });

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [userData]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when component unmounts
    };
  }, []);
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = firestore.collection("Users").doc(user.uid);

        // Fetch user details from Firestore
        try {
          const userDoc = await userDocRef.get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.error("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannerCollection = firestore.collection("Banner");
        const snapshot = await bannerCollection.get();

        const bannerData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            bannerImage: data.bannerImage,
            discountPrice: data.discountPrice,
            originalPrice: data.originalPrice,
            other: data.other,
            productName: data.productName,
            quantity: data.quantity,
          };
        });
        console.log("bannerData is ", bannerData);
        setBanner(bannerData);
      } catch (error) {
        console.error("Error fetching banner images:", error);
      }
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (banner[0].bannerImage.length > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === banner[0].bannerImage.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [banner]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banner[0].bannerImage.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banner[0].bannerImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePaymentButtonPress = () => {
    const paymentUrl =
      "https://sandbox.payfast.co.za/eng/process?merchant_id=10000100&merchant_key=46f0cd694581a&return_url=https://atlegilemarketing.firebaseapp.com/&cancel_url=https://atlegilemarketing.firebaseapp.com/&notify_url=https://atlegilemarketing.firebaseapp.com/&amount=3170.00&item_name=TestProduct";

    // Open the payment URL in the device's default browser
    Linking.openURL(paymentUrl);
  };
  const handlePress = () => {
    Swal.fire({
      icon: "info",
      title: "Contact Information",
      html: "<b>Name:</b> Julian James<br/><b>Phone Number:</b> 0123456789",
      confirmButtonText: "Close",
    });
  };

  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/landing-page");
      }
    });
  };

  const handleorders = () => {
    setCheckOrder(true);
  };

  const handlefavorites = () => {
    navigate("/termsandconditions");
  };

  const handleterms = () => {
    navigate("/termsandconditions");
  };

  const handlepolicy = () => {
    navigate("/privacypolicy");
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when component unmounts
    };
  }, []);

  const fetchCartData = async () => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const cartCollectionRef = collection(firestore, "Cart");
    const q = query(cartCollectionRef, where("uid", "==", user.uid));

    try {
      const querySnapshot = await getDocs(q);

      const cartItems = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cartItems.push({
          id: doc.id,
          product: data.product,
          quantity: data.quantity,
          amount: data.price * data.quantity,
          image: data.image,
          name: data.name,
          orderId: data.productId,
          timestamp: data.timestamp.toDate(),
          // Add other relevant fields from your Cart collection
        });
      });

      setCartData(cartItems);
      console.log("Cart Data : ", cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    // Fetch cart data when the user is authenticated
    if (user) {
      fetchCartData();
    }
  }, [user]); // Fetch cart data whenever the user changes

  const productCategory = [
    ...emptyOption,
    "Electronics",
    "Clothing and Apparel",
    "Home and Furniture",
    "Beauty and Personal Care",
    "Sports and Outdoors",
    "Toys and Games",
    "Books and Stationery",
    "Health and Wellness",
    "Automotive",
    "Grocery and Gourmet",
    "Jewelry and Watches",
    "Home Improvement",
    "Pet Supplies",
    "Office Supplies",
    "Music and Instruments",
    "Garden and Outdoor Living",
    "Art and Craft Supplies",
    "Travel and Luggage",
    "Baby and Maternity",
    "Electrical and Lighting",
  ];

  const increment = () => {
    if (bannerListIndex === bannerList.length - 1) {
      bannerListIndex = 0;
    }
    if (bannerListIndex < bannerList.length - 1) {
      bannerListIndex += 1;
    }
  };

  const decrement = () => {
    if (bannerListIndex === 0) {
      bannerListIndex = bannerList.length - 1;
    }
    if (bannerListIndex > 0) {
      bannerListIndex -= 1;
    }
  };

  const handleFileChange = (e) => {
    const selectedImage = e.target.files[0];
    //console.log("selectedImage: ", selectedImage);
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name ||
      !price ||
      !quantity ||
      !description ||
      !productType ||
      !other
    ) {
      alert("Please fill in all fields before continuing.");
      return;
    }

    console.log("Form submitted:", {
      name,
      price,
      quantity,
      description,
      productType,
      other,
    });
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveEditProduct = () => {
    setEditModal(false);
  };

  const handleSaveAddBanner = async (e) => {
    e.preventDefault();

    const bannerCollection = firestore.collection("Banner");
    const bannerId = bannerCollection.id;
    // Create a document with the specified fields
    const bannerData = {
      bannerImage: [], // Initialize an empty array to store image URLs
      discountPrice: parseFloat(priceDiscount), // Convert to number
      originalPrice: parseFloat(priceOriginal), // Convert to number
      other: otherBanner,
      productName: productName,
      quantity: parseInt(quantity), // Convert to number
    };

    try {
      // Upload images to Firebase Storage
      const uploadTasks = images.map((image, index) => {
        const imageRef = storage.ref(`banner_images/${bannerId}/image${index}`);
        return imageRef.put(image.file);
      });

      await Promise.all(uploadTasks); // Wait for all images to be uploaded

      // Get download URLs of the images
      const downloadURLs = await Promise.all(
        uploadTasks.map((task) => task.snapshot.ref.getDownloadURL())
      );

      // Update the bannerData with image URLs
      bannerData.bannerImage = downloadURLs;

      // Add the document to the 'Banner' collection
      await bannerCollection.add(bannerData);

      console.log("Banner data added successfully!");
      setBannerModal(false);
    } catch (error) {
      console.error("Error adding banner data: ", error);
    }
  };

  const handleSavePaymentInfo = (e) => {
    e.preventDefault();
    setPaymentModal(false);
    setBusinessAuthorization(true);
  };

  const handlePopUp = () => {
    setLanding(false);
  };
  useEffect(() => {
    // Simulate a button click when the component mounts
    const businessPlusModalButton =
      document.getElementById("businessPlusModal");

    if (businessPlusModalButton) {
      businessPlusModalButton.click();
    }
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    // Check if at least one image is selected
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    // Set loading to true when the form is submitted
    setLoading(true);

    // Reset previous error messages

    try {
      // Create a new document reference
      const productRef = firestore.collection("Products").doc();

      // Get the autogenerated product ID
      const productId = productRef.id;

      // Store the data in Firestore with autogenerated product ID
      await productRef.set({
        name,
        businessName,
        price: parseFloat(price),
        quantity,
        description,
        selectedProductCategory,
        brand,
        height: parseFloat(height), // Parse input as a float
        length: parseFloat(length), // Parse input as a float
        width: parseFloat(width), // Parse input as a float
        weight: parseFloat(weight), // Parse input as a float
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        // ... (other fields)
      });

      // Upload images to Firebase Storage
      const uploadTasks = images.map((image, index) => {
        const imageRef = storage.ref(
          `product_images/${productId}/image${index}`
        );
        return imageRef.put(image.file);
      });

      await Promise.all(uploadTasks); // Wait for all images to be uploaded

      // Get download URLs of the images
      const downloadURLs = await Promise.all(
        uploadTasks.map((task) => task.snapshot.ref.getDownloadURL())
      );

      // Update the product document with image URLs
      await productRef.update({ images: downloadURLs });

      // Set loading back to false after successful upload
      setLoading(false);

      // You can navigate to the next screen or perform other actions here
      alert("Product added successfully!");
      const paymentUrl = "..."; // (your payment URL)

      // Open the payment URL in the device's default browser
      Linking.openURL(paymentUrl);
    } catch (error) {
      console.error("Error storing data in Firestore:", error);
      // Set loading back to false in case of an error
      setLoading(false);
    }
  };
  const [layout, setLayout] = React.useState("fullscreen");
  const [scroll, setScroll] = React.useState(true);
  const theme = useTheme();

  return (
    <>
      <React.Fragment>
        <Modal
          open={!!layout}
          onClose={() => {
            setLayout(undefined);
          }}
        >
          <ModalOverflow>
            <ModalDialog
              aria-labelledby="modal-dialog-overflow"
              layout={layout}
              sx={{ backgroundColor: "transparent" }}
            >
              <ModalClose />
              {/* <Typography id="modal-dialog-overflow" level="h2">
              Overflow content
            </Typography>
            <FormControl
              orientation="horizontal"
              sx={{ bgcolor: 'background.level2', p: 1, borderRadius: 'sm' }}
            >
              <FormLabel>Long content</FormLabel>
              <Switch
                checked={scroll}
                onChange={(event) => setScroll(event.target.checked)}
                sx={{ ml: 'auto' }}
              />
            </FormControl> */}
              {scroll && (
                <Grid
                  container
                  justifyContent="center" // Center the contents horizontally
                  alignItems="center"
                  style={{
                    position: "absolute",
                    //  top: 50,
                    // backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                  }}
                >
                  <Grid item xs={10} md={8} lg={8}>
                    <Box bgcolor="white" p={2}>
                      <Box textAlign="center" mb={2}>
                        <img
                          src={logo}
                          alt="cropped AMS Shadow Queen Logo BNY-1320x772"
                          style={{ width: "60%", maxWidth: 200 }}
                        />
                      </Box>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        textAlign="center"
                      >
                        BUSINESS REGISTRATION AUTHORIZATION
                      </Typography>
                      <Typography textAlign="center" paragraph marginBottom={5}>
                        Welcome to AMS, where we strive to ensure a secure and
                        trustworthy environment for
                        <br /> businesses and customers alike. As part of our
                        commitment to maintaining the integrity of
                        <br /> our platform, we have implemented an
                        authorization process for new business
                        <br />
                        registrations. This process is designed to verify the
                        legitimacy and authenticity of the <br />
                        businesses that join our community.
                      </Typography>
                      <Box maxWidth="80%" mx="auto" marginBottom={5}>
                        <Grid container spacing={2} textAlign="center">
                          {[
                            {
                              title: "Enhance Trust",
                              content:
                                "By confirming the legitimacy of businesses, we build trust among our users, making it a safer place to conduct business.",
                            },
                            {
                              title: "Review",
                              content:
                                "Our dedicated team will review the provided details, ensuring they align with our platform's policies and standards.",
                            },
                            {
                              title: "Verification",
                              content:
                                "In some cases, we may request additional documents or information to verify the authenticity of your business.",
                            },
                            {
                              title: "Approval",
                              content:
                                "Once your registration is approved, your business profile will be live on our platform, and you can start receiving orders for your products and services.",
                            },
                          ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
                              <Card>
                                <Box p={2}>
                                  <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    mb={1}
                                  >
                                    {item.title}
                                  </Typography>
                                  <Typography>{item.content}</Typography>
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={6} lg={5}>
                          <Box mb={2}>
                            <Typography variant="h6" fontWeight="bold">
                              TIMEFRAME
                            </Typography>
                            <Typography>
                              The authorization process typically takes [X]
                              business days, depending on the complexity of your
                              business and the accuracy of the information
                              provided.
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={5}>
                          <Box mb={2}>
                            <Typography variant="h6" fontWeight="bold">
                              CONTACT US
                            </Typography>
                            <Typography>
                              If you have any questions or require assistance
                              during the authorization process, please don't
                              hesitate to contact our support team at [Contact
                              Information].
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <View style={{ marginBottom: 10, paddingBottom: "50px" }}>
                        <Card
                          sx={{
                            width: "80%",
                            p: 0,
                            alignSelf: "flex-end",
                            mx: "auto", // Center the Card horizontally
                            height: "auto",
                          }}
                          //  style={{ marginBottom: 10 ,paddingBottom:10}}
                          mb={10} // Add marginBottom directly in inline style
                        >
                          <Box p={theme.spacing(2)}>
                            <Image
                              source={BusinessAccountPlus}
                              alt="business plus logo"
                              p={theme.spacing(2)}
                              style={{
                                width: "17vw", // Make the width 100% of the container
                                height: "12vh", // Maintain the aspect ratio
                                // maxWidth: "17vw", // Limit the maximum width if needed
                                // maxHeight: "12vh", // Limit the maximum height if needed
                              }}
                            />
                          </Box>

                          <Box p={theme.spacing(2)}>
                            <Box
                              display="flex"
                              flexDirection={{ xs: "column", md: "row" }}
                              justifyContent="space-between"
                              alignItems="center"
                              mb={theme.spacing(2)}
                            >
                              <Typography
                                style={{
                                  color: "#252b42",
                                  fontWeight: 500,
                                  fontSize: theme.typography.h4.fontSize,
                                  width: { xs: "100%", md: "50%" },
                                }}
                              >
                                BUSINESS PLUS <br />
                                SUBSCRIPTION
                              </Typography>

                              <Box
                                textAlign="center"
                                mb={{ xs: theme.spacing(2), md: 0 }}
                              >
                                <Typography
                                  style={{
                                    color: "#23a6f0",
                                    fontWeight: "700",
                                    fontSize: theme.typography.h3.fontSize,
                                  }}
                                >
                                  R150
                                </Typography>
                                <Typography
                                  style={{
                                    color: "#b8d9f7",
                                    fontWeight: "700",
                                    fontSize: theme.typography.h6.fontSize,
                                  }}
                                >
                                  Per Month
                                </Typography>
                              </Box>
                            </Box>

                            <Typography paragraph mb={theme.spacing(4)}>
                              Unlock More Opportunities with Business Plus
                              Subscription
                            </Typography>

                            <Box mb={theme.spacing(2)}>
                              {[
                                "List Unlimited Products",
                                "Priority Support",
                                "Exclusive Promotions",
                              ].map((item, index) => (
                                <Box
                                  key={index}
                                  display="flex"
                                  alignItems="center"
                                  mb={theme.spacing(2)}
                                >
                                  <CheckCircleIcon
                                    style={{ color: "#2dc071" }}
                                  />
                                  <Typography
                                    ml={theme.spacing(1)}
                                    fontWeight="bold"
                                  >
                                    {item}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Card>
                      </View>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </ModalDialog>
          </ModalOverflow>
        </Modal>
      </React.Fragment>

      {editModal ? (
        <View
          // visible={true}
          // onDismiss={() => setPaymentModal(false)}
          style={{
            top: 65,
            position: "absolute",
            // width: "100%",
            // height: "100%",
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            zIndex: 9999,
            alignSelf: "flex-end",
          }}
        >
          {/* <View
                  style={{
                    width: "33%",
                  }}
                  onTouchEnd={() => setEditModal(false)}
                ></View>
                <View
                  style={{
                    width: "33%",
                  }}
                  onTouchEnd={() => setEditModal(false)}
                ></View> */}
          <View
            style={{
              height: "100vh",
              backgroundColor: "white",
              //   backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40%",
              }}
            >
              <Image
                source={require("../../Global/images/logo.svg")} // Make sure to provide the correct path to your logo
                style={{
                  width: "50%",
                  height: "30%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ height: "60%", paddingRight: 40, paddingLeft: 40 }}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 30,
                  marginBottom: 5,
                }}
              >
                EDIT PRODUCT
              </Text>
              <View>
                <div
                  className="uploadContainer"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        style={{
                          padding: "10px",
                          marginRight: "10px",
                          width: "16%",
                          height: "8vh",
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={placeholder}
                      alt="Placeholder"
                      style={{
                        padding: "5px",
                        marginRight: "10px",
                        width: "16%",
                        height: "8vh",
                      }}
                    />
                  )}

                  <label
                    htmlFor="imageInput"
                    className="add"
                    style={{
                      backgroundColor: "whitesmoke",
                      color: "#000",
                      padding: "25px",
                      // paddingBottom:'20px',
                      width: "5%",
                      cursor: "pointer",
                      alignSelf: "center",
                    }}
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    multiple // Allow selecting multiple files
                  />
                </div>

                <form onSubmit={(e) => setEditModal(false)}>
                  <TextField
                    fullWidth
                    required
                    type="text"
                    variant="standard"
                    id="outlined-number"
                    label="Name"
                    value={productName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setProductName(e.target.value)}
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <TextField
                        fullWidth
                        required
                        type="text"
                        variant="standard"
                        id="outlined-number"
                        label="Price"
                        value={price}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                      <Text style={{ fontSize: 12, paddingRight: 10 }}>
                        There will be VAT, Service Fee and
                        <br /> Delivery Fees added to this amount.
                      </Text>
                    </View>
                    <View>
                      <TextField
                        fullWidth
                        required
                        type="text"
                        variant="standard"
                        id="outlined-number"
                        label="Quantity"
                        value={quantity}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{ width: "100%", marginTop: "10px" }}
                      />
                      <Text></Text>
                    </View>
                  </View>
                  <br />
                  <TextField
                    fullWidth
                    required
                    type="text"
                    variant="standard"
                    id="outlined-number"
                    label="Description"
                    value={description}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <TextField
                    fullWidth
                    required
                    type="text"
                    variant="standard"
                    id="outlined-number"
                    label="Type of Product"
                    value={productType}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setProductType(e.target.value)}
                    style={{ width: "100%", marginTop: "10px" }}
                  />

                  <TextField
                    fullWidth
                    required
                    type="text"
                    variant="standard"
                    id="outlined-number"
                    label="Other"
                    value={other}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setOther(e.target.value)}
                    style={{ width: "100%", marginTop: "10px" }}
                  />

                  <Button
                    onPress={handleSaveEditProduct}
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 14,
                      backgroundColor: "#072840",
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: 10,
                      marginTop: 20,
                    }}
                    type="submit"
                  >
                    <Text style={{ color: "white" }}>SAVE</Text>
                  </Button>
                </form>
              </View>
            </View>
          </View>
        </View>
      ) : null}
      {addProduct ? (
        <View
          // visible={true}
          // onDismiss={() => setPaymentModal(false)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
            display: "flex",
            alignItems: "center",
            zIndex: 1000, // Adjust as needed
          }}
        >
          <View
            style={{
              flex: 1,
              // justifyContent: "felx-end",
              alignSelf: "flex-end",
              width: 50,
            }}
          >
            <View
              style={{
                position: "fixed",
                // top: 0,
                // left: 0,
                width: "40vw",
                height: "100vh",
                backgroundColor: "white",
                display: "flex",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
                zIndex: 999,
              }}
            >
              <Grid style={{ alignSelf: "center" }}>
                <img
                  src={logo}
                  style={{ height: "9vh", width: "90%", paddingTop: "15vh" }}
                />
              </Grid>

              <View
                //className="form-container"
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  width: "75%",
                  // backgroundColor: "red",
                  marginLeft: "80px",
                  marginBottom: "30px",
                }}
              >
                <h2
                  style={{
                    color: "#000",
                    textAlign: "left",
                    fontSize: "25px",
                    textAlign: "center",
                  }}
                >
                  ADD PRODUCTS + SERVICES
                </h2>
                {/* <h6>inputs will be stored here</h6> */}
                <View
                  className="uploadContainer"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "8vh",
                  }}
                >
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        style={{
                          padding: "15px",
                          marginRight: "10px",
                          width: "16%",
                          height: "8vh",
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={placeholder}
                      alt="Placeholder"
                      style={{
                        padding: "5px",
                        marginRight: "10px",
                        width: "16%",
                        height: "8vh",
                      }}
                    />
                  )}

                  <label
                    htmlFor="imageInput"
                    className="add"
                    style={{
                      backgroundColor: "whitesmoke",
                      color: "#000",
                      padding: "25px",
                      // paddingBottom:'20px',
                      width: "5%",
                      cursor: "pointer",
                      alignSelf: "center",
                    }}
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    multiple // Allow selecting multiple files
                  />
                </View>
                {/* <form onSubmit={handleContinue}> */}

                <View style={{ alignSelf: "center" }}>
                  <form onSubmit={handleContinue}>
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Name"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "100%" }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Business Name"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "100%", marginTop: "10px" }}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="Price"
                        type="text"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginRight: "10px",
                          marginTop: "10px",
                        }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="Quantity"
                        type="text"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ width: "45%", marginTop: "10px" }}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </View>
                    <bd />
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="length_cm"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginRight: "10px",
                          marginTop: "10px",
                        }}
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="width_cm"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginTop: "10px",
                          marginRight: "10px",
                        }}
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="height_cm"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{
                          width: "45%",
                          marginTop: "10px",
                          marginRight: "10px",
                        }}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        id="outlined-number"
                        label="weight_kg"
                        type="number"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ width: "45%", marginTop: "10px" }}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                      />
                    </View>
                    <br />
                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Description"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{
                        //   backgroundColor: "dodgerblue",
                        width: "100%",
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      id="outlined-select-currency"
                      select
                      label="product Category"
                      variant="standard"
                      value={selectedProductCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      style={{
                        width: "100%",
                        // marginTop: "5px",
                        marginRight: "10px",
                        textAlign: "left",
                      }}
                      required
                    >
                      {productCategory.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      id="outlined-number"
                      label="Brand"
                      type="text"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{
                        width: "100%",
                        marginLeft: "5px",
                        marginTop: "10px",
                      }}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />

                    {/* <Typography variant="caption" color="error" style={{ marginBottom: "10px" }}>
              {nameError || businessNameError || priceError || quantityError || brandError || categoryError}
             </Typography> */}

                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "1vh",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        style={{
                          width: "80%",
                          height: "10%",
                          margin: "20px 0px",
                          background: "#072840",
                          borderRadius: "30px",
                        }}
                        type="submit"
                      >
                        continue
                      </Button>
                    )}
                    {/* </View> */}
                  </form>
                </View>
              </View>
              {/* </Box> */}
            </View>
          </View>
        </View>
      ) : null}
      {paymentModal ? (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
            display: "flex",
            alignItems: "center",
            zIndex: 1000, // Adjust as needed
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "felx-end",
              alignItems: "center",
              width: 50,
            }}
          >
            <Card
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                //alignItems: "center",
                justifyContent: "flex-end",
                zIndex: 999,
              }}
            >
              <View
                style={{
                  width: "34%",
                  height: "100%",
                  backgroundColor: "white",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: "50vh",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: logo }}
                    style={{
                      height: "9%",
                      width: "80%",
                      paddingTop: "30%",
                      scale: "0.5",
                    }}
                  />
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "75%",
                    marginLeft: 80,
                    marginBottom: 30,
                  }}
                >
                  <Text
                    style={{
                      color: "#000",
                      textAlign: "left",
                      fontSize: 30,
                      fontWeight: "bold",
                    }}
                  >
                    PAYMENT INFO
                  </Text>

                  <form onSubmit={handleSavePaymentInfo}>
                    <TextField
                      id="standard-basic"
                      label="Card Holder"
                      variant="standard"
                      fullWidth
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <TextField
                      id="standard-basic"
                      label="Card Number"
                      variant="standard"
                      fullWidth
                      required
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="standard-basic"
                        label="Expiary"
                        variant="standard"
                        fullWidth
                        value={expiery}
                        type="text"
                        required
                        onChange={(e) => setExpiery(e.target.value)}
                        style={{ width: "45%", marginRight: "15px" }}
                      />
                      <TextField
                        id="standard-basic"
                        label="CVV"
                        variant="standard"
                        fullWidth
                        value={cvv}
                        type="text"
                        required
                        onChange={(e) => setCvv(e.target.value)}
                        style={{ width: "45%", marginRight: "15px" }}
                      />
                    </View>
                    <Button
                      mode="contained"
                      type="submit"
                      // onPress={handlePaymentButtonPress}
                      style={{
                        width: "80%",
                        height: "15%",
                        margin: 20,
                        borderRadius: 30,
                        backgroundColor: "#072840",
                      }}
                    >
                      Continue
                    </Button>
                  </form>
                </View>
              </View>
            </Card>
          </View>
        </View>
      ) : null}
      {bannerModal ? (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
            display: "flex",
            alignItems: "center",
            zIndex: 1000, // Adjust as needed
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "felx-end",
              alignItems: "center",
              width: 50,
            }}
          >
            <Card
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
                  height: "100%",
                  width: "33%",
                }}
                onTouchEnd={() => setBannerModal(false)}
              ></View>
              <View
                style={{
                  height: "100%",
                  width: "33%",
                }}
                onTouchEnd={() => setBannerModal(false)}
              ></View>
              <View
                style={{
                  width: "34%",
                  height: "100%",
                  backgroundColor: "white",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "40%",
                  }}
                >
                  <Image
                    source={require("../../Global/images/logo.svg")} // Make sure to provide the correct path to your logo
                    style={{
                      width: "20%",
                      height: "20%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View
                  style={{ height: "60%", paddingRight: 40, paddingLeft: 40 }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 30,
                      marginBottom: 5,
                    }}
                  >
                    ADD BANNER
                  </Text>
                  <View>
                    <div
                      className="uploadContainer"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      {images.length > 0 ? (
                        images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Product Image ${index + 1}`}
                            style={{
                              padding: "5px",
                              marginRight: "10px",
                              width: "16%",
                              height: "8vh",
                            }}
                          />
                        ))
                      ) : (
                        <img
                          src={placeholder}
                          alt="Placeholder"
                          style={{
                            padding: "5px",
                            marginRight: "10px",
                            width: "16%",
                            height: "8vh",
                          }}
                        />
                      )}

                      <label
                        htmlFor="imageInput"
                        className="add"
                        style={{
                          backgroundColor: "whitesmoke",
                          color: "#000",
                          padding: "25px",
                          // paddingBottom:'20px',
                          width: "5%",
                          cursor: "pointer",
                          alignSelf: "center",
                        }}
                      >
                        +
                      </label>
                      <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        multiple // Allow selecting multiple files
                      />
                    </div>
                    <View style={{ display: "flex", justifyContent: "center" }}>
                      <form onSubmit={handleSaveAddBanner}>
                        <TextField
                          fullWidth
                          required
                          type="text"
                          variant="standard"
                          id="outlined-number"
                          value={productName}
                          label="Product Name"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => setProductName(e.target.value)}
                          style={{ width: "100%", marginTop: "10px" }}
                        />
                        <br />
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <TextField
                              fullWidth
                              required
                              type="text"
                              variant="standard"
                              value={priceDiscount}
                              label="Discount Price"
                              onChange={(e) => setPriceDiscount(e.target.value)}
                              style={{ width: "100%", marginTop: "10px" }}
                            />
                          </View>
                          <View>
                            <TextField
                              fullWidth
                              required
                              type="text"
                              variant="standard"
                              value={quantity}
                              label="Quantity"
                              onChange={(e) => setQuantity(e.target.value)}
                              style={{ width: "100%", marginTop: "10px" }}
                            />
                          </View>
                        </View>
                        <TextField
                          fullWidth
                          required
                          variant="standard"
                          type="text"
                          value={priceOriginal}
                          label="Original Price"
                          onChange={(e) => setPriceOriginal(e.target.value)}
                          style={{ width: "100%", marginTop: "10px" }}
                        />

                        <TextField
                          fullWidth
                          required
                          variant="standard"
                          label="Other"
                          type="text"
                          value={otherBanner}
                          onChange={(e) => setOtherBanner(e.target.value)}
                          style={{ width: "100%", marginTop: "10px" }}
                        />
                        <Button
                          variant="contained"
                          style={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: 14,
                            backgroundColor: "#072840",
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: 10,
                            marginTop: 20,
                            alignSelf: "center",
                            width: "100%",
                          }}
                          type="submit"
                        >
                          continue
                        </Button>
                      </form>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        </View>
      ) : null}
      {businessAuthorization ? null : (
        <View
          // visible={true}
          // onDismiss={() => setPaymentModal(false)}
          style={{
            top: 400,
            position: "absolute",
            
            flex: 1,
            backgroundColor: "white",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            zIndex: 100,
            alignSelf: "flex-end",
          }}
        >
          <View
            style={{
              width: "25vw",
              flexDirection: "column",
              border: "1px lightgray solid",
              padding: 40,
              alignItems: "center",
              height: 500,
              zIndex: 500,
            }}
          >
            {/* <TouchableOpacity
                 // onPress={setBusinessAuthorization(true)}
                  > */}
            <Image
              source={require("../../Global/images/BusinessPlus+.jpg")}
              alt="business plus logo"
              style={{
                width: "10vw",
                height: "7vh",
                marginBottom: 5,
              }}
            />
            {/* </TouchableOpacity> */}

            <Text
              style={{
                color: "#252b42",
                fontWeight: "700",
                fontSize: 32,
                textAlign: "center",
              }}
            >
              <TouchableOpacity onPress={() => setPaymentModal(true)}>
                <Text>BUSINESS PLUS SUBSCRIPTION</Text>
              </TouchableOpacity>
            </Text>
            <Text
              style={{
                color: "#9e9e9e",
                fontWeight: "700",
                fontSize: 16,
                textAlign: "center",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              Unlock More Opportunities with Business Plus Subscription
            </Text>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#23a6f0",
                  fontWeight: "700",
                  fontSize: 40,
                  marginBottom: -10,
                }}
              >
                R150
              </Text>
              <Text
                style={{
                  color: "#b8d9f7",
                  fontWeight: "700",
                  fontSize: 20,
                }}
              >
                Per Month
              </Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  marginTop: 15,
                  fontWeight: "700",
                  fontSize: 18,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {" "}
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color="#2dc071"
                />{" "}
                List Unlimited Products
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  marginTop: 15,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {" "}
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color="#2dc071"
                />{" "}
                Priority Support
              </Text>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  marginTop: 15,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {" "}
                <Ionicons
                  name="checkmark-circle"
                  size={30}
                  color="#2dc071"
                />{" "}
                Exclusive Promotions
              </Text>
            </View>
          </View>
        </View>
      )}
      <Header />
      <NavBar />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#FFFFFF",
        }}
      >
        <View
          style={{
            paddingLeft: 30,
            backgroundColor: "whitesmoke",
            alignItems: "flex-start",
          }}
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            paddingRight={2}
          >
            <View
              elevation={3}
              style={{
                padding: "20px",
                height: "100%",
                width: "300px",
                margin: "auto",
                backgroundColor: "whitesmoke",
              }}
            >
              <Box textAlign="center">
                <img
                  src={sara}
                  alt="User Image"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginTop: "80%",
                  }}
                />
                <Box sx={{ marginTop: "10%" }}>
                  <Typography variant="h6">
                    {userData?.name} {userData?.surname}
                  </Typography>
                  <Typography variant="subtitle1">{userData?.phone}</Typography>
                  <Typography variant="subtitle2">{userData?.email}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ textAlign: "center" }}>
                  {userData?.location}
                </Typography>
              </Box>

              <Box style={{ marginTop: "50%" }}>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  onClick={handleorders}
                >
                  Orders
                </Button>
              </Box>

              <Box>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  onClick={handlefavorites}
                >
                  Favorites
                </Button>
              </Box>

              <Box>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  onClick={handleterms}
                >
                  Terms and Conditions
                </Button>
              </Box>

              <Box sx={{}}>
                <Ionicons name="ios-timer-outline" size={15} color="gray" />
                <Button
                  style={{ marginLeft: 5, color: "gray" }}
                  onClick={handlepolicy}
                >
                  Privacy Policy
                </Button>
              </Box>

              <Box
                sx={{
                  marginTop: "40px",
                  backgroundColor: "rgba(266, 255, 255, 0.9)",
                  textAlign: "center",
                  padding: {
                    xs: "10px",
                    sm: "20px",
                  },
                }}
              >
                <Button
                  sx={{
                    fontWeight: "bolder",
                    color: "black",
                    marginTop: "10%",
                  }}
                  onClick={handlePress}
                >
                  Julian James
                </Button>

                <Button sx={{ color: "gray", mt: 1, marginTop: "10%" }}>
                  Alternative Contact
                </Button>
              </Box>

              <Box textAlign="center" marginTop="10%">
                <Button onClick={handleSignOut} style={{ color: "red" }}>
                  SIGN OUT
                </Button>
              </Box>
            </View>
          </Box>
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              height: "150px",
              // backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={BlackSilk}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </View>
          <View
            style={{
              height: "110px",
              backgroundColor: "#072840",
              paddingTop: 20,
              paddingLeft: 30,
            }}
          >
            <Text
              style={{
                display: "flex",
                color: "white",
                flexDirection: "column",
              }}
            >
              <Text
                style={{ fontWeight: "600", fontSize: 18, marginBottom: -5 }}
              >
                BUSINESS
              </Text>
              <Text
                style={{ fontWeight: "600", fontSize: 30, marginBottom: 5 }}
              >
                SECURETECH SOLUTIONS
              </Text>
              <Text style={{ fontWeight: "600", fontSize: 14 }}>
                secure.tech.co.za
              </Text>
            </Text>
          </View>
          {checkOrder ? (
            <View>
              <Container fixed sx={{ height: "85vh" }}>
                <View
                  style={{
                    marginTop: 50,
                    padding: 10,
                    height: 100,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{
                      height: 80,
                      width: 200,
                      marginRight: 12,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ORDERS
                  </Typography>
                  <Typography
                    style={{
                      height: 80,
                      width: 200,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      style={{
                        borderBottomWidth: 2,
                        borderBottomColor: "lightgray",
                        color: "gray",
                      }}
                      placeholder="Search"
                      placeholderTextColor="gray"
                    />
                  </Typography>
                  <Typography
                    style={{
                      height: 80,
                      width: 200,
                      marginRight: "10px",
                    }}
                  >
                    <View
                      style={{
                        color: "gray",
                        borderBottomWidth: 2,
                        borderBottomColor: "lightgray",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: "gray", marginTop: 25 }}>
                        Please Select
                      </Text>
                      <Icon1
                        name="angle-down"
                        size={20}
                        style={{ marginTop: "28px" }}
                      />
                    </View>
                  </Typography>
                  <Typography
                    style={{
                      height: 50,
                      width: 50,
                      marginTop: 15,
                    }}
                  >
                    <TouchableOpacity>
                      <Icon name="search" size={20} />
                    </TouchableOpacity>
                  </Typography>
                </View>

                <View>
                  {cartData.map((item, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigateToDeliveryAndChatSystem(item.status)
                      }
                      key={index}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: 80,
                          borderBottomWidth: 2,
                          borderBottomColor: "#1D1D1D",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingTop: 2,
                        }}
                      >
                        <Image
                          source={{ uri: item?.image }}
                          alt="product-image"
                          style={{
                            width: "20%",
                            height: "100%",
                            // backgroundColor: "#000026",
                            // backgroundImage: `url(${hdtv})`,
                          }}
                        />
                        <View style={{ width: "30%", paddingLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "gray",
                            }}
                          >
                            #
                            {item?.orderId.slice(0, 4) +
                              Math.floor(Math.random() * 10000)}
                          </Text>
                          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            {item?.timestamp.toDateString()}
                          </Text>
                        </View>
                        <View style={{ width: "30%", paddingLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "gray",
                            }}
                          >
                            Delivered by
                          </Text>
                          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                            Dilivery Guy
                          </Text>
                        </View>
                        <View style={{ width: "30%", paddingLeft: 10 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "gray",
                            }}
                          >
                            Status
                          </Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color:
                                item.status === "DELIVERED"
                                  ? "green"
                                  : item.status === "ONGOING"
                                  ? "orange"
                                  : "black",
                            }}
                          >
                            {/* {item?.status} */}
                            Delivered
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Container>
            </View>
          ) : (
            <View
            // style={{backgroundColor:"white"}}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",

                  paddingRight: 30,
                  paddingBottom: 30,
                  paddingTop: 30,
                  paddingLeft: 30,
                  // height: "100px",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700", fontSize: 30 }}>
                      PRODUCTS & SERVICES
                    </Text>
                    <Text
                      style={{
                        display: businessAuthorization ? "none" : "",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Please add a minimum of 3 products
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: 14,
                      backgroundColor: "#072840",
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 25,
                      paddingRight: 25,
                      borderRadius: 20,
                    }}
                  >
                    BUSINESS PLUS R150/PM
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: 14,
                      backgroundColor: "#fe951c",
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderRadius: 20,
                      display: businessAuthorization ? "none" : "flex",
                      marginTop: 5,
                      justifyContent: "center",
                      paddingLeft: 25,
                      paddingRight: 25,
                    }}
                  >
                    AUTHORIZATION PENDING
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => setAddProduct(true)}>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: 600,
                          fontSize: 14,
                          backgroundColor: "#072840",
                          paddingTop: 10,
                          paddingBottom: 10,
                          paddingLeft: 25,
                          paddingRight: 25,
                          borderRadius: 20,
                          display: !businessAuthorization ? "none" : "flex",
                          marginRight: 20,
                        }}
                      >
                        ADD PRODUCT
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {businessAuthorization ? (
                <Card
                  style={{
                    width: "100%",
                    // height: "80px",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // paddingLeft: 10,
                    // paddingBottom: 30,
                    // paddingTop: 30,
                    display: "flex",
                  }}
                >
                  {banner.length > 0 ? (
                    <View
                      style={{
                        backgroundImage: `url(${banner[0].bannerImage[currentIndex]})`,
                        backgroundColor: "gray",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 15,
                        flex: 1,
                        transition: "0.5s ease-in-out",
                      }}
                    >
                      <TouchableOpacity
                        onPress={handlePrevClick}
                        style={{ marginRight: 20 }}
                      >
                        <AntDesign name="left" size={24} color="white" />
                      </TouchableOpacity>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "white",
                          }}
                        >
                          {banner[0].other}
                        </Text>
                        <Text
                          style={{
                            fontSize: 25,
                            fontWeight: 700,
                            color: "white",
                          }}
                        >
                          {banner[0].productName}
                        </Text>
                        <Text>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: "#c29920",
                            }}
                          >
                            R{banner[0].discountPrice}
                          </Text>{" "}
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: 400,
                              color: "white",
                            }}
                          >
                            R{banner[0].originalPrice}
                          </Text>
                        </Text>
                      </View>

                      <TouchableOpacity onPress={handleNextClick}>
                        <AntDesign name="right" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      display: "flex",
                      cursor: "pointer",
                      width: "15%",
                      borderRadius: 20,
                      border: "1px gray dashed",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      marginLeft: 10,
                    }}
                    onPress={() => setBannerModal(true)}
                  >
                    <Text>ADD BANNER</Text>
                  </TouchableOpacity>
                </Card>
              ) : null}

              <ScrollView style={{ width: "100%" }}>
                <View
                  style={{
                    // flexDirection: "row",
                    paddingRight: 10,
                    marginBottom: 20,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        //margin: 50,
                        flexDirection: "row",
                        flexWrap: "wrap",
                       // backgroundColor: "red",
                      }}
                    >
                      {products.map((product, index) => (
                        
                       
                       
                        <Card
                        key={index}
                        sx={{
                          width: {
                            xs: "100%",
                            sm: "45%",
                            md: "35%",
                            lg: "35%",
                          },
                          margin: 2,
                         
                        }}
                      >
                        <View
                          style={{
                            // backgroundColor: "purple",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 16,
                            height: "70vh",
                          }}
                        >
                          <Box
                            style={{
                              borderRadius: "16px",
                              objectFit: "cover",
                              position: "relative",
                              backgroundColor: "whitesmoke",
                              width: "250px",
                              height: "250px",
                              borderRadius: "50%",
                              alignself: "center",
                              justifyContent: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignSelf: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="140"
                              image={
                                product.images && product.images.length > 0
                                  ? product.images[0]
                                  : "../../assets/image/headsets.png"
                              }
                              alt={product.name}
                              style={{
                                position: "relative",
                                borderRadius: "100px",
                                objectFit: "cover",
                                width: 220,
                                height: 220,
                                alignSelf: "center",
                              }}
                            />
                
                            <Box
                              style={{
                                paddingHorizontal: 10,
                                position: "absolute",
                                bottom: 30,
                                left: 80,
                                width: "6vw",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignSelf: "center",
                              }}
                            ></Box>
                            {/* </Container> */}
                          </Box>
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                              marginTop: 16,
                              //  backgroundColor:'red',
                              height: "25vh",
                            }}
                          >
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  //     backgroundColor:'green',
                                  flexWrap: "wrap",
                                }}
                              >
                                <Text
                                  style={{
                                    flex: 1,
                                    fontSize: "15px",
                                    color: "#4FC3F7",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {product.selectedProductCategory}
                                </Text>
                                <View
                                  style={{
                                    backgroundColor: "#072840",
                                    paddingHorizontal: 5,
                                    paddingVertical: 3,
                                    borderRadius: 15,
                                  }}
                                >
                                  <Text style={{}}>
                                    ⭐ <Text style={{ color: "white" }}> 4.9</Text>
                                  </Text>
                                </View>
                              </View>
                
                              <Typography variant="h5" component="h5">
                                {product.name && product.name.slice(0, 20)}
                                {product.name && product.name.length < 50 ? "" : "..."}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                component="p"
                                style={{ color: "gray" }}
                              >
                                {product.description &&
                                  product.description.slice(0, 50)}
                                {product.description && product.description.length < 50
                                  ? ""
                                  : "..."}
                              </Typography>
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                justifyContent="space-between"
                              >
                                <Typography
                                  variant="body2"
                                  component="p"
                                  style={{ color: "gray" }}
                                >
                                  <Icon2 name="download" size={20} /> 15 Sales
                                </Typography>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    style={{
                                      color: "#BDBDBD",
                                      fontSize: "18px",
                                      fontWeight: "700",
                                      marginRight: "10px",
                                    }}
                                  >
                                    R{product.price}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    component="p"
                                    style={{
                                      color: "rgb(97, 151, 97)",
                                      fontSize: "18px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    R{product.price}
                                  </Typography>
                                </View>
                              </Box>
                            </View>
                          </View>
                        </View>
                      </Card>
                      ))}
                    </View>
                  </View>
                  {/* <weight></weight>nvjmv mhv vkhb bv jb jvjhvjhvjvjhvjvjvjvjvvjvvjvjvvjhvjvjvjvjvjhvhv */}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
      <Footer />
      {/* <div style={{ marginTop: "40vh" }}></div> */}
    </>
  );
}
