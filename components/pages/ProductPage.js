import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from "react-native";
import {HeaderMenu} from "../HeaderMenu";
import {FooterMenu} from "../FooterMenu";
import {StatusBar} from "expo-status-bar";
import {ProductsPageStyle} from "../AdditionalComponents/PaginationPoints";
import axios from "axios";
import {API_PRODUCT} from "../http/api";
import {ImageSlider} from "../AdditionalComponents/ImageSlider";
import {PaginationPoints} from "../AdditionalComponents/PaginationPoints";

const ProductPage = (props) => {

    const [data, setData] = useState()
    const [pagination, setPaginator] = useState(0)

    const getProduct = (product_id) => {
        axios({
            method: 'get',
            url: `${API_PRODUCT}${product_id}/`,
        }).then((response) => {
            setData(response.data)
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        const productId = props.route.params.product_id
        if (productId) {
            getProduct(productId)
        }
    }, []);

    if (data) {
        return (
            <View style={ProductsPageStyle.container}>
                <HeaderMenu back={true} title={props.route.params.title}/>
                <ScrollView style={{
                    width: '100%',
                    paddingTop: 95,
                    paddingBottom: 90,
                    backgroundColor: 'white'
                }}>
                    <View style={{
                        borderBottomWidth: 1,
                        borderColor: 'rgba(216,216,216,0.4)',
                        paddingBottom: 8,
                    }}>
                        {ImageSlider(data.images, pagination, setPaginator)}
                        {PaginationPoints(data, pagination)}
                    </View>
                    <View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            marginTop: 10,
                            paddingLeft: 24,
                            paddingRight: 24,
                            borderBottomWidth: data.description ? 1:0,
                            borderColor: 'rgba(216,216,216,0.4)',
                            paddingBottom: data.description ? 10:0
                        }}>
                            <Text style={{fontSize: 11, color: '#413f3f', fontWeight: "500"}}>Артикул: {data.item_number.item_number}</Text>
                            <Text style={{fontSize: 14, fontWeight: "700"}}>Цвет: {data.color.name}</Text>
                            <View style={{width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'black', backgroundColor: data.color.hex_code_color}}>\
                            </View>
                            <Text style={{fontSize: 14, fontWeight: "700"}}>Вариант: {data.size}</Text>
                            <View style={{ borderWidth: 1, borderColor: 'black', padding: 5, alignSelf: 'flex-start', borderRadius: 4}}>
                                <Text style={{fontSize: 12, fontWeight: "700"}}>{data.size}</Text>
                            </View>
                            {data.promotions ?

                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10}}>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start',
                                        gap: 5
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            marginTop: 10,
                                            color: '#575151',
                                            textDecorationLine: 'line-through',
                                        }}>{data.price} ₽</Text>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: 800,
                                        }}>{data.promotions.new_price} ₽</Text>
                                    </View>
                                    <View style={{
                                        display: 'flex',
                                        alignSelf: 'flex-end'
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
                                                fontSize: 12,
                                                fontWeight: 600
                                            }}>-{(((data.price - data.promotions.new_price) / data.price) * 100).toFixed(0)}%</Text>
                                        </View>
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
                                        fontSize: 18,
                                        fontWeight: 800,
                                        marginTop: 10,
                                    }}>{data.price} ₽</Text>
                                </View>
                            }
                        </View>

                        {data.description ?
                            <View style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                                marginTop: 10,
                                paddingLeft: 24,
                                paddingRight: 24,
                            }}>
                                <View style={{display: 'flex', gap: 10, paddingBottom: 10}}>
                                    <Text style={{fontSize: 14, fontWeight: "700"}}>Описание:</Text>
                                    <Text style={{fontSize: 13, fontWeight: "600"}}>{data.description}</Text>
                                </View>
                            </View>
                            : null}
                    </View>
                </ScrollView>
                <FooterMenu page="categories"/>
                <StatusBar style="auto"/>
            </View>
        );
    }

};

export default ProductPage;