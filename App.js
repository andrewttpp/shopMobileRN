import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainPage} from './components/pages/MainPage'
import {CategoriesPage} from "./components/pages/CategoriesPage";
import {ProfilePage} from "./components/pages/ProfilePage";
import {ProductsPage} from "./components/pages/ProductsPage";
import {ToastProvider} from 'react-native-toast-notifications'
import React from "react";
import ProductPage from "./components/pages/ProductPage";

const Stack = createNativeStackNavigator();

export default function App() {
    const MyContext = React.createContext();

    return (
        <ToastProvider offsetBottom={80}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    <Stack.Screen
                        name="Главная страница"
                        component={MainPage}
                    />
                    <Stack.Screen
                        name="Товары"
                        component={ProductsPage}
                    />
                    <Stack.Screen
                        name="Категории"
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
                </Stack.Navigator>
            </NavigationContainer>
        </ToastProvider>
    );
}