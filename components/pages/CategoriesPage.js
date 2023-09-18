import {Image, Text, SafeAreaView, View, ScrollView, TouchableOpacity} from "react-native";
import {StatusBar} from "expo-status-bar";
import {FooterMenu} from "../FooterMenu";
import {HeaderMenu} from "../HeaderMenu";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";
import {API_CATEGORIES} from "../http/api";


export const CategoriesPage = (props) => {
    const [categories, setCategories] = useState([])
    const navigation = useNavigation();

    const getCategories = () => {
        axios({
            method: 'get',
            url: API_CATEGORIES,
        }).then((response) => {
            setCategories(response.data)
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
        }}>
            <HeaderMenu title='Категории'/>
            <ScrollView contentContainerStyle={{
                rowGap: 16,
                paddingTop: 120,
                paddingBottom: 70,
                alignItems: 'center',
            }} style={{
                height: '100%',
                width: "100%",
                display: 'flex',
            }}>

                {categories.map((category) => {
                    return (
                        <TouchableOpacity key={category.id}  style={{
                            position: 'relative',
                        }} onPress={() => navigation.navigate('Товары', {
                            category_id: category.id,
                            title: category.name,
                        })} >
                            <Image source={{uri: `${category.image}`}} style={{
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
                                <Text style={{
                                    fontWeight: 600
                                }}>{category.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            <FooterMenu page='categories'/>
            <StatusBar style="auto"/>
        </View>
    )
}