import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainPage} from './components/pages/MainPage'
import {CategoriesPage} from "./components/pages/CategoriesPage";
import {ProfilePage} from "./components/pages/ProfilePage";

const Stack = createNativeStackNavigator();
export const API_MAIN_URL = "https://8fe2-46-172-35-239.ngrok-free.app/api"

export default function App() {
    return (
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
                    name="Категории"
                    component={CategoriesPage}
                />
                <Stack.Screen
                    name="Профиль"
                    component={ProfilePage}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}