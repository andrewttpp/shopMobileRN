import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {AntDesign, Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

export const FooterMenu = (props) => {
    const navigation = useNavigation();

    return (
        <View style={stylesFooterMenu.container}>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Главная страница')}>
                <AntDesign name="home" size={24} color={props.page === 'main' ? '#1C1C1C' : '#CCCCCC'} style={{width:24, height:24}}/>
                <Text style={{
                    color: props.page === 'main' ? '#1C1C1C' : '#CCCCCC',
                    fontSize: 9,
                    fontWeight: '700'
                }}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Каталог')}>
                <MaterialIcons name="category" size={24} color={props.page === 'categories' ? '#1C1C1C' : '#CCCCCC'} style={{width:24, height:24}}/>
                <Text style={{
                    color: props.page === 'categories' ? '#1C1C1C' : '#CCCCCC',
                    fontSize: 9,
                    fontWeight: '700'
                }}>Каталог</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Корзина')}>
                <Feather name="shopping-cart" size={24} color={props.page === 'cart' ? '#1C1C1C' : '#CCCCCC'} style={{width:24, height:24}}/>
                <Text style={{
                    color: props.page === 'cart' ? '#1C1C1C' : '#CCCCCC',
                    fontSize: 9,
                    fontWeight: '700'
                }}>Корзина</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Избранное')}>
                <MaterialCommunityIcons name="heart-outline" size={24} color={props.page === 'liked' ? '#1C1C1C' : '#CCCCCC'} style={{width:24, height:24}}/>
                <Text style={{
                    color: props.page === 'liked' ? '#1C1C1C' : '#CCCCCC',
                    fontSize: 9,
                    fontWeight: '700'
                }}>Избранное</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Профиль')}>
                <Feather name="user" size={24} color={props.page === 'profile' ? '#1C1C1C' : '#CCCCCC'} style={{width:24, height:24}}/>
                <Text style={{
                    color: props.page === 'profile' ? '#1C1C1C' : '#CCCCCC',
                    fontSize: 9,
                    fontWeight: '700'
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
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#d8d8d8',
        bottom: 0,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 34,
        backgroundColor: 'white',
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
    },
});