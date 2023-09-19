import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainPage} from './components/pages/MainPage'
import {CategoriesPage} from "./components/pages/CategoriesPage";
import {ProfilePage} from "./components/pages/ProfilePage";
import {ProductsPage} from "./components/pages/ProductsPage";
import {ToastProvider} from 'react-native-toast-notifications'
import React from "react";
import ProductPage from "./components/pages/ProductPage";
import {CartPage} from "./components/pages/CartPage";
import {LikedPage} from "./components/pages/LikedPage";

const Stack = createNativeStackNavigator();

export default function App() {
    const MyContext = React.createContext();

    return (
        <ToastProvider offsetBottom={100}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen
                        name="Главная страница"
                        component={MainPage}
                        independent
                    />
                    <Stack.Screen
                        name="Товары"
                        component={ProductsPage}
                    />
                    <Stack.Screen
                        name="Каталог"
                        component={CategoriesPage}
                    />
                    <Stack.Screen
                        name="Профиль"
                        component={ProfilePage}
                    />
                    <Stack.Screen
                        name="Товар"
                        component={ProductPage}
                    />
                    <Stack.Screen
                        name="Корзина"
                        component={CartPage}
                    />
                    <Stack.Screen
                        name="Избранное"
                        component={LikedPage}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </ToastProvider>
    );
}