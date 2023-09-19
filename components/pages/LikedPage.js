import {FlatList, View, Text, Image, TouchableOpacity} from "react-native";
import {FooterMenu} from "../FooterMenu";
import {StatusBar} from "expo-status-bar";
import {HeaderMenu} from "../HeaderMenu";
import axios from "axios";
import {API_MAIN_URL} from "../http/api";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export const LikedPage = (props) => {
    const [data, setData] = useState([false]);
    const navigation = useNavigation();

    const getLikedProducts = () => {
        axios({
            method: 'get',
            url: `${API_MAIN_URL}/likes/`,
            withCredentials:true,
        }).then((response) => {
            setData(response.data.liked)
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        getLikedProducts()
    }, []);

    const Item = (props) => (
        <TouchableOpacity style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: 'rgba(216,216,216,0.4)',
            paddingTop: 5,
            paddingBottom: 5,
            gap: 10,
        }} onPress={() => navigation.navigate('Товар', {
            product_id: props.item.id,
            title: props.item.name,
        })}>
            <View style={{
                width: '40%',
                aspectRatio: 1.5,
            }}>
                <Image style={{width: '100%', height: '100%'}} source={{ uri: `http://localhost:8000${props.item.images[0].image}`}}/>
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around'
            }}>
                {props.item.promotions ?

                    <View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{
                                backgroundColor: '#f01515',
                                paddingLeft: 3,
                                paddingRight: 3,
                                paddingTop: 3,
                                paddingBottom: 3,
                                borderRadius: 4,
                                alignSelf: 'flex-start'
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 10,
                                    fontWeight: 800
                                }}>-{(((props.item.price - props.item.promotions.new_price) / props.item.price) * 100).toFixed(0)}%</Text>
                            </View>
                        </View>

                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: 800,
                                marginTop: 10,
                            }}>{props.item.promotions.new_price} ₽</Text>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 800,
                                marginTop: 10,
                                color: '#bdb2b2',
                                textDecorationLine: 'line-through',
                            }}>{props.item.price} ₽</Text>
                        </View>
                    </View> :
                    <View>
                        <View style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}>
                        </View>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 800,
                            marginTop: 10,
                        }}>{props.item.price} ₽</Text>
                    </View>
                }
                <Text>{props.item.name}</Text>
                <Text style={{fontSize: 11, color: '#413f3f', fontWeight: "500"}}>Артикул: {props.item.item_number.item_number}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = (props) => (
        <Item item={props.item}/>
    );

    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'relative',
            backgroundColor: 'white'
        }}>
            <HeaderMenu back={true} title='Избранное'/>
            {data.length > 0  ? data.at(0) !== false ? (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    style={{
                        height: '100%',
                        width: "100%",
                        display: 'flex',
                        paddingTop: 95,
                        paddingBottom: 85,
                    }}
                />
            ) : (
                <Text>Загрузка...</Text>
            ) :
            <View style={{
                height: '100%',
                width: "100%",
                display: 'flex',
                paddingTop: 95,
                paddingBottom: 85,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16
            }}>
                <View>
                    <MaterialCommunityIcons
                        name={"heart"}
                        size={64}
                        color={"red"}
                    />
                </View>
                <View>
                    <Text style={{fontSize: 16, fontWeight: '700'}}>Здесь пока ничего нет</Text>
                </View>
                <View style={{width: '80%'}}>
                    <Text style={{textAlign: 'center', fontSize: 14, color:'#7c7c7c', fontWeight: '600'}}>Перейдите в каталог и выберите товары, которые вам нравятся</Text>
                </View>
                <TouchableOpacity style={{backgroundColor: 'black', paddingRight: 32, paddingLeft: 32, paddingTop: 8, paddingBottom: 8, borderRadius: 4}}
                                  onPress={() => navigation.navigate('Каталог')}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>В каталог</Text>
                </TouchableOpacity>
            </View>}
            <FooterMenu page='liked'/>
            <StatusBar style="auto"/>
        </View>
    )
}