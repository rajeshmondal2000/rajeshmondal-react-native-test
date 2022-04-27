import {
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  StatusBar,
  VirtualizedList,
} from "react-native";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { deleteProduct, ProductsI } from "../api/products";
import { Button, Image } from "native-base";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductList: React.FC<{ navigation: any }> = ({ navigation }) => {
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

  const editProduct = (productId: string) => {
    navigation.navigate("edit", {
      productId,
    });
  };
  const getItem = (data: ProductsI[], index: number) => data[index];

  const getItemCount = (data: ProductsI) => products.length;

  const Item = ({ product }: { product: ProductsI }) => (
    <View style={{ flexDirection: "row", marginBottom: 12 }}>
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
          <Button
            colorScheme={"red"}
            onPress={() => _deleteProduct(product.id)}
          >
            Delete
          </Button>
          <Button
            onPress={() => editProduct(product.id)}
            colorScheme={"indigo"}
            style={{ marginLeft: 12 }}
          >
            Edit Product
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 12,
        }}
      >
        Add Product
      </Text>
      <SafeAreaView>
        <VirtualizedList
          data={products}
          initialNumToRender={10}
          renderItem={({ item }: { item: ProductsI }) => (
            <Item product={item} />
          )}
          getItem={getItem}
          keyExtractor={(item) => item.id}
          getItemCount={getItemCount}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
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

export default ProductList;
