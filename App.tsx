import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NativeBaseProvider } from "native-base";
import { StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { Ionicons } from "@expo/vector-icons";

import Products from "./App/screens/Products";
import AddProduct from "./App/screens/AddProduct";

import reducer from "./App/redux/reducer";
import { Provider } from "react-redux";
import { createStore } from "redux";

const Tab = createMaterialBottomTabNavigator();
const store = createStore(reducer);

const firebaseConfig = {
  apiKey: "AIzaSyABolQk58ARHPgsSAwZ7A-aLkHsKwYUYRk",
  authDomain: "webskitters-rajesh.firebaseapp.com",
  projectId: "webskitters-rajesh",
  storageBucket: "webskitters-rajesh.appspot.com",
  messagingSenderId: "509315313625",
  appId: "1:509315313625:web:ff7e4d62d9e83497a933c8",
  measurementId: "G-2FP8G59WZF",
};
initializeApp(firebaseConfig);

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Provider store={store}>
          <Tab.Navigator>
            <Tab.Screen
              options={{
                title: "Products",
                tabBarIcon: ({ color }) => (
                  <Ionicons name="albums" size={24} color={color} />
                ),
              }}
              name="products"
              component={Products}
            />
            <Tab.Screen
              options={{
                title: "Add Product",
                tabBarIcon: ({ color }) => (
                  <Ionicons name="add-circle" size={24} color={color} />
                ),
              }}
              name="addProduct"
              component={AddProduct}
            />
          </Tab.Navigator>
        </Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
