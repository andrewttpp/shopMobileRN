import {View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {FooterMenu} from "../FooterMenu";
import {HeaderMenu} from "../HeaderMenu";
import {useNavigation} from "@react-navigation/native";

export const MainPage = (props) => {
    const navigation = useNavigation();

    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
        }}>
            <HeaderMenu back={false} title='Главная'/>
            <FooterMenu page='main'/>
            <StatusBar style="auto"/>
        </View>
    )
}