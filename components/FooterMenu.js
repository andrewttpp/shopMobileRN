import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import imageMainFooter from "../static/images/context/house.png";
import imageMainClickFooter from "../static/images/context/house_click.png";
import imageCategoriesFooter from "../static/images/context/blocks.png";
import imageCategoriesClickFooter from "../static/images/context/blocks_click.png";
import imageProfileFooter from "../static/images/context/user.png";
import imageProfileClickFooter from "../static/images/context/user_click.png";
import {useNavigation} from "@react-navigation/native";

export const FooterMenu = (props) => {
    const navigation = useNavigation();

    return (
        <View style={stylesFooterMenu.container}>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Главная страница')}>
                <Image source={props.page === 'main' ? imageMainClickFooter:imageMainFooter} style={{
                    width: 25,
                    height: 25,
                }}/>
                <Text style={{
                    color: props.page === 'main' ? '#1C1C1C':'#CCCCCC'
                }}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Категории')}>
                <Image source={props.page === 'categories' ? imageCategoriesClickFooter:imageCategoriesFooter} style={{
                    width: 25,
                    height: 25,
                }}/>
                <Text style={{
                    color: props.page === 'categories' ? '#1C1C1C':'#CCCCCC'
                }}>Категории</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Профиль')}>
                <Image source={props.page === 'profile' ? imageProfileClickFooter:imageProfileFooter} style={{
                    width: 25,
                    height: 25,
                }}/>
                <Text style={{
                    color: props.page === 'profile' ? '#1C1C1C':'#CCCCCC'
                }}>Профиль</Text>
            </TouchableOpacity>
        </View>)
}

const stylesFooterMenu = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#d8d8d8',
        bottom: 0,
        paddingBottom: 24,
        backgroundColor: 'white',
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
    },
});