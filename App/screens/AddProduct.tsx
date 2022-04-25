import { View, Text, StyleSheet, StatusBar, ToastAndroid } from "react-native";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { addProduct, ProductsI } from "../api/products";
import { Button, Image, Input } from "native-base";

export interface ImageI {
  uri: string;
  name: string;
}

const AddProduct = () => {
  const { control, handleSubmit, reset } = useForm<ProductsI>();
  const [imageUri, setImageUri] = useState<ImageI | null>();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onSubmit = (data: ProductsI) => {
    setIsUploading(true);
    if (imageUri) {
      addProduct({ ...data, imageBlob: imageUri }).then((response) => {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        reset();
        setImageUri(null)
        setIsUploading(false);
      });
    } else {
      ToastAndroid.show("Please select image", ToastAndroid.SHORT);
    }
  };

  const pickPicture = () => {
    DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      type: "image/*",
    }).then((response) => {
      if (response.type == "success") {
        setImageUri({ name: response.name, uri: response.uri });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Add Product
      </Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <Controller
          rules={{ required: true }}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Product name"
            />
          )}
          name="name"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Price</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Product Price"
            />
          )}
          name="price"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Offer Price</Text>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter Product Offer Price"
            />
          )}
          name="offerprice"
        />
      </View>
      <View style={{ paddingTop: 12, paddingBottom: 12 }}>
        {imageUri && (
          <Image
            source={{ uri: imageUri.uri }}
            alt="Product Image"
            size={"xl"}
          />
        )}
        {!imageUri && <Button onPress={pickPicture}>Select Image</Button>}
      </View>
      <Button isDisabled={isUploading} onPress={handleSubmit(onSubmit)}>
        Add Product
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingTop: StatusBar.currentHeight,
  },
  formContainer: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  label: {
    paddingBottom: 6,
    fontWeight: "600",
  },
});

export default AddProduct;
