import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  VirtualizedList,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { deleteProduct, ProductsI } from "../api/products";
import { Button, Image } from "native-base";

const Products = () => {
  const [products, setProducts] = useState<ProductsI[]>([]);
  useEffect(() => {
    const db = getFirestore();
    const unsub = onSnapshot(collection(db, "products"), (doc) => {
      const products: any = [];
      doc.forEach((child) => {
        products.push(child.data());
      });
      setProducts(products);
    });
    return () => {
      unsub();
    };
  }, []);

  const _deleteProduct = (productId: string) => {
    deleteProduct(productId).then((response) => {
      if (response.statusCode === 200) {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    });
  };

  return (
    <View style={styles.container}>
      {products.map((product) => (
        <View
          style={{ flexDirection: "row", paddingTop: 12, paddingBottom: 12 }}
        >
          <Image
            source={{ uri: product.image }}
            style={{ borderRadius: 12 }}
            size={"xl"}
          />
          <View style={{ paddingLeft: 12 }}>
            <Text style={{ fontSize: 20 }}>{product.name}</Text>
            <Text>Price - Rs. {product.price}</Text>
            <Text style={{ marginBottom: 12 }}>
              Offer Price - {product.offerprice}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Button colorScheme={"red"}onPress={()=> _deleteProduct(product.id)}>Delete</Button>
              <Button colorScheme={"indigo"} style={{ marginLeft: 12 }}>
                Edit Product
              </Button>
            </View>
          </View>
        </View>
      ))}
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

export default Products;
