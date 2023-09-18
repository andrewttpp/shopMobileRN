import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons";

export const FooterMenu = (props) => {
    const navigation = useNavigation();

    return (
        <View style={stylesFooterMenu.container}>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Главная страница')}>
                <AntDesign name="home" size={24} color={props.page === 'main' ? '#1C1C1C':'#CCCCCC'} />
                <Text style={{
                    color: props.page === 'main' ? '#1C1C1C':'#CCCCCC'
                }}>Главная</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Категории')}>
                <MaterialIcons name="category" size={24} color={props.page === 'categories' ? '#1C1C1C':'#CCCCCC'} />
                <Text style={{
                    color: props.page === 'categories' ? '#1C1C1C':'#CCCCCC'
                }}>Категории</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesFooterMenu.button} onPress={() => navigation.navigate('Профиль')}>
                <Feather name="user" size={24} color={props.page === 'profile' ? '#1C1C1C':'#CCCCCC'} />
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
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#d8d8d8',
        bottom: 0,
        paddingLeft: 24,
        paddingRight: 24,
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