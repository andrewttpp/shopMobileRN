import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import imageMainFooter from "../../static/images/context/house.png";
import imageCategoriesFooter from "../../static/images/context/blocks.png";
import imageProfileFooter from "../../static/images/context/user.png";
import {StatusBar} from "expo-status-bar";
import {FooterMenu} from "../FooterMenu";

export const MainPage = (props) => {
    return (
        <SafeAreaView style={{
            padding: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            position: 'relative'
        }}>
            <FooterMenu page='main'/>
            <StatusBar style="auto"/>
        </SafeAreaView>
    )
}