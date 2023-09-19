import {View} from "react-native";
import {FooterMenu} from "../FooterMenu";
import {StatusBar} from "expo-status-bar";
import {HeaderMenu} from "../HeaderMenu";

export const CartPage = (props) => {
    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
        }}>
            <HeaderMenu back={true} title='Корзина'/>
            <FooterMenu page='cart'/>
            <StatusBar style="auto"/>
        </View>
    )
}