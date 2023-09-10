import {Image, Text, SafeAreaView, View, ScrollView} from "react-native";
import {StatusBar} from "expo-status-bar";
import {FooterMenu} from "../FooterMenu";
import {HeaderMenu} from "../HeaderMenu";
import {useEffect, useState} from "react";
import axios from "axios";
import {API_MAIN_URL} from '../../App.js'


export const CategoriesPage = (props) => {
    const [categories, setCategories] = useState([])

    const getCategories = () => {
        axios({
            method: 'get',
            headers: {
                'ngrok-skip-browser-warning': '69420'
            },

            url: `${API_MAIN_URL}/categories/`,
        }).then((response) => {
            setCategories(response.data)
        });
    }

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <SafeAreaView style={{
            padding: 32,
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
            backgroundColor: "white",
        }}>
            <HeaderMenu title='Категории'/>
            <ScrollView contentContainerStyle={{
                rowGap: 16,
                paddingTop: 80,
                paddingBottom: 70,
                alignItems: 'center',
            }} style={{
                height: '100%',
                width: "100%",
                display: 'flex',
            }}>

                {categories.map((category) => {
                    return (
                        <View key={category.id} style={{
                            position: 'relative',
                        }}>
                            <Image source={category.image} style={{
                                width: 288,
                                height: 162,
                                borderRadius: 12,
                            }}/>
                            <View style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                borderRadius: 12,
                                fontSize: 5,
                                padding: 5,
                                top: 5,
                                left: 5
                            }}>
                                <Text>{category.name}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
            <FooterMenu page='categories'/>
            <StatusBar style="auto"/>
        </SafeAreaView>
    )
}