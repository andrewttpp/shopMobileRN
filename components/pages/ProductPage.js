import React, {useEffect, useState} from 'react';
import {Image, ScrollView, View} from "react-native";
import {HeaderMenu} from "../HeaderMenu";
import {FooterMenu} from "../FooterMenu";
import {StatusBar} from "expo-status-bar";
import {ProductsPageStyle} from "./ProductsPage";
import axios from "axios";
import {API_CATEGORIES, API_PRODUCT} from "../http/api";

const ProductPage = (props) => {

    const [data, setData] = useState()

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
                <HeaderMenu title={props.route.params.title}/>
                <ScrollView style={{
                    width: '100%',
                    paddingTop: 60,
                    backgroundColor: 'white'
                }}>
                    <Image source={{uri: `http://localhost:8000${data.images[0].image}`}} style={{
                        width: '100%',
                        aspectRatio: 1.5
                    }}/>

                </ScrollView>
                <FooterMenu/>
                <StatusBar style="auto"/>
            </View>
        );
    }

};

export default ProductPage;