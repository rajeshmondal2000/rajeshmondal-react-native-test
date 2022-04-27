import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "./ProductList";
import EditProduct from "./EditProduct";

const Stack = createStackNavigator();

const Products = () => {
  return (
    <Stack.Navigator screenOptions={{ headerMode: false }}>
      <Stack.Screen name="products" component={ProductList} />
      <Stack.Screen name="edit" component={EditProduct} />
    </Stack.Navigator>
  );
};

export default Products;
