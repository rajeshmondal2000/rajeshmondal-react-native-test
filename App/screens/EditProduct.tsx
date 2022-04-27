import { View, Text, StyleSheet, StatusBar, ToastAndroid } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Button, Image, Input } from "native-base";
import React, { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { getProducts, ProductsI, updateProduct } from "../api/products";
import { ImageI } from "./AddProduct";

const EditProduct: React.FC = (props: any) => {
  const { control, setValue, handleSubmit } = useForm<ProductsI>();
  const [isSubmited, setSubmitted] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<ImageI | null>();
  const { productId } = props.route.params;

  useEffect(() => {
    _getProduct();
  }, []);

  const _getProduct = () => {
    console.log(props)
    getProducts(productId).then((response) => {
      setValue("name", response.name);
      setValue("price", response.price);
      setValue("offerprice", response.offerprice);
      setValue("image", response.image);
      setValue("id", response.id)
      setImageUri({ name: "", changed: false, uri: response.image });
    });
  };

  const pickPicture = () => {
    DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      type: "image/*",
    }).then((response) => {
      if (response.type == "success") {
        setImageUri({ name: response.name, uri: response.uri, changed: true });
      }
    });
  };

  const onSubmit = (data: ProductsI) => {
    if (imageUri) {
      setSubmitted(true);
      updateProduct({ ...data, imageBlob: imageUri }).then((response) => {
        setSubmitted(false);
        _getProduct();
        props.navigation.goBack();
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        Edit Product
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
        <Button style={{ marginTop: 12 }} onPress={pickPicture}>
          Change Image
        </Button>
      </View>

      <Button
        disabled={isSubmited}
        onPress={handleSubmit(onSubmit)}
        colorScheme={"info"}
      >
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    padding: 12,
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

export default EditProduct;
