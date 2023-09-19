import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import imageMainFooter from "../../static/images/context/house.png";
import imageCategoriesFooter from "../../static/images/context/blocks.png";
import imageProfileFooter from "../../static/images/context/user.png";
import {StatusBar} from "expo-status-bar";
import {FooterMenu} from "../FooterMenu";
import {HeaderMenu} from "../HeaderMenu";

export const ProfilePage = (props) => {
    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
        }}>
            <HeaderMenu back={true} title='Профиль'/>
            <View style={{
                rowGap: 16,
                paddingTop: 80,
                paddingBottom: 70,
                alignItems: 'center',
                height: '100%',
                width: "100%",
                display: 'flex',
                justifyContent: 'center',
            }}>
                <View style={[ProfilePageStyle.button, ProfilePageStyle.buttonSignIn]}>
                    <Text style={ProfilePageStyle.textSignIn}>Войти</Text>
                </View>
                <View style={[ProfilePageStyle.button, ProfilePageStyle.buttonRegistration]}>
                    <Text style={ProfilePageStyle.textRegistration}>Зарегестрироваться</Text>
                </View>
            </View>
            <FooterMenu page='profile'/>
            <StatusBar style="auto"/>
        </View>
    )
}

const ProfilePageStyle = StyleSheet.create({
    button: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 12
    },

    buttonSignIn: {
        backgroundColor: '#ffffff',
    },

    textSignIn: {
        color: '#000000',
        fontSize: 14,
        fontWeight: 700
    },

    buttonRegistration: {
        backgroundColor: '#000000',
    },

    textRegistration: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 700
    },

});