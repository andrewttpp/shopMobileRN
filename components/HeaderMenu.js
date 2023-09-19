import {Pressable, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {goBack} from "@react-navigation/routers/src/CommonActions";
import {useNavigation} from "@react-navigation/native";

export const HeaderMenu = (props) => {
    const navigation = useNavigation();

    return (
        <View style={{
            position: 'absolute',
            borderBottomWidth: 1,
            borderColor: '#d8d8d8',
            width: '100%',
            padding: 10,
            paddingTop: 60,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            zIndex: '1'
        }}>
            {props.back ? <Pressable onPress={() => navigation.goBack()} style={{
                width: 24,
                height: 24,
                paddingLeft: 8
            }}>
                <AntDesign name="left" size={24} color="black" />
            </Pressable> : null}

            <Text style={{
                fontSize: 16,
                width: '100%',
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: props.back ? 0 : 3,
                paddingRight: props.back ? 24 : 0
            }}>{ props.title }</Text>
        </View>
    )
}