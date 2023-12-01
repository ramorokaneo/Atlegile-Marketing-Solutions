import { useState } from "react";
import { Grid, TextField, Box, MenuItem, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
import background from "../../Global/images/Reed.jpg";
import logo from "../../Global/images/logo.svg";
import Banner from "../../Global/images/media bg-cover.png";
import placeholder from "../../Global/images/login.jpg";
import { useNavigation } from "@react-navigation/native";
import { Linking, TouchableOpacity, View } from "react-native";
import { auth, firestore, storage } from "../../config";
import firebase from "firebase/compat/app";

const AddProductsAndServices = () => {
  const emptyOption = [""];
  const [images, setImages] = useState([]);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProductCategory, setProductCategory] = useState("");
  const [brand, setBrand] = useState("");
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

  const navigation = useNavigation();

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
        price,
        quantity,
        description,
        selectedProductCategory,
        brand,
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

  return (
    <View
      className="container"
      style={{
        width: "100vw",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        height: "100vh",
        // display: "flex",
      }}>
      <Grid
        container
        style={{
          width: "100%",
          marginBottom: "-10vh",
          //   border: "1px solid green",
        }}>
        <Grid
          item
          lg={8}
          md={8}
          sm={{ hidden: true }}
          style={{
            // border: "1px solid",
            // backgroundColor: "blue",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Grid
            Container
            lg={6}
            md={6}
            style={{
              //   backgroudColor: "blue",
              width: "100vw",
              //   border: "1px solid yellow",
            }}></Grid>
          <Grid
            Container
            lg={6}
            md={6}
            style={{
              // backgroudColor: "yellow",
              width: "100vw",
              // border: "1px solid yellow",
              marginBottom: "-8px",
            }}>
            <img
              src={Banner}
              style={{
                height: "21vh",
                width: "65vw",
                paddingTop: "30vh",
                marginLeft: "10px",
                marginRight: "2px",
              }}
            />
          </Grid>
        </Grid>

        <Grid
          item
          lg={4}
          md={4}
          style={{
            // border: "1px solid red",
            backgroundColor: "#fff",
            marginLeft: "-10px",
            width: "100%",
            height: "98vh",
            // marginLeft: "2px",
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
          <Grid style={{ alignSelf: "center" }}>
            <img
              src={logo}
              style={{ height: "9vh", width: "90%", paddingTop: "15vh" }}
            />
          </Grid>
          {/* <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleContinue}> */}
          <View
            className="form-container"
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
              width: "75%",
              // backgroundColor: "red",
              marginLeft: "80px",
              marginBottom: "30px",
            }}>
            <h2
              style={{
                color: "#000",
                textAlign: "left",
                fontSize: "25px",
                textAlign: "center",
              }}>
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
              }}>
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
                }}>
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
                  required>
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
                    }}>
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
                    type="submit">
                    continue
                  </Button>
                )}
                {/* </View> */}
              </form>
            </View>
          </View>
          {/* </Box> */}
        </Grid>
      </Grid>
    </View>
  );
};

export default AddProductsAndServices;
