import {Text, View} from "react-native";

export const HeaderMenu = (props) => {
    return (
        <View style={{
            paddingTop: 40,
            position: 'absolute',
            borderBottomWidth: 1,
            borderColor: '#d8d8d8',
            width: '100%',
            padding: 10,
            display: 'flex',
            backgroundColor: 'white',
            zIndex: '1'
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 20,
            }}>{ props.title }</Text>
        </View>
    )
}