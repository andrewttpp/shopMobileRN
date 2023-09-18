import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import {HeaderMenu} from "../HeaderMenu";
import {FooterMenu} from "../FooterMenu";
import {StatusBar} from "expo-status-bar";
import {MaterialCommunityIcons, Fontisto, Ionicons} from "@expo/vector-icons";
import {useToast} from "react-native-toast-notifications";
import {API_CATEGORIES} from "../http/api";
import {useNavigation} from "@react-navigation/native";

export const ProductsPage = (props) => {
    const [data, setData] = useState([])
    const [pagination, setPaginator] = useState([])
    const [liked, setLiked] = useState([]);
    const [inCart, setInCart] = useState([]);
    const toast = useToast()
    const navigation = useNavigation();

    const LikeButton = (props) => {
        return (
            <TouchableOpacity style={{
                width: 16,
                height: 16,
            }} onPress={() => {
                const newLiked = [...liked];
                newLiked[props.index] = !liked[props.index];
                setLiked(newLiked)

                if (liked[props.index]) {
                    toast.show("Товар успешно удален из избранного", {
                        type: "normal",
                        placement: "bottom",
                        duration: 4000,
                        animationType: "zoom-in",
                    });
                } else {
                    toast.show("Товар успешно добавлен в избранное", {
                        type: "normal",
                        placement: "bottom",
                        duration: 4000,
                        animationType: "zoom-in",
                    });
                }
            }}>
                <MaterialCommunityIcons
                    name={liked[props.index] ? "heart" : "heart-outline"}
                    size={16}
                    color={liked[props.index] ? "red" : "black"}
                />
            </TouchableOpacity>
        );
    };

    const ToggleCartButton = (props) => {
        return (
            <TouchableOpacity style={{
                width: 22,
                height: 16,
            }} onPress={() => {
                const newInCart = [...inCart];
                newInCart[props.index] = !inCart[props.index];
                setInCart(newInCart)

                if (inCart[props.index]) {
                    toast.show("Товар успешно удален из корзины", {
                        type: "normal",
                        placement: "bottom",
                        duration: 4000,
                        animationType: "zoom-in",
                    })
                } else {
                    toast.show("Товар успешно добавлен в корзину", {
                        type: "normal",
                        placement: "bottom",
                        duration: 4000,
                        animationType: "zoom-in",
                    })
                }
            }}>
                <Fontisto
                    name={inCart[props.index] ? "shopping-basket-remove" : "shopping-basket-add"}
                    size={16}
                />
            </TouchableOpacity>
        )
    }

    const getProductsInCategory = (category_id) => {
        axios({
            method: 'get',

            url: `${API_CATEGORIES}${category_id}/`,
        }).then((response) => {
            setData(response.data)
            if (response.data.length) {
                setInitial(response.data.length, setPaginator)
                setInitial(response.data.length, setInCart)
                setInitialLiked(response.data.length)
            }
        }).catch(error => console.log(error));
    }

    const ImageSlider = (images, productId) => {
        return (
            <View>
                <ScrollView style={{
                    maxWidth: 150,
                }} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                            scrollEventThrottle={16} snapToInterval={150}
                            onScroll={(event) => changePaginate(event, productId)}>
                    {images.map((image, keyId) =>
                        (
                            <Image key={keyId} source={{uri: `http://localhost:8000${image.image}`}}
                                   style={{ height: 100, width: 150, borderRadius: 4, zIndex: -1 }}
                            />
                        ))}
                </ScrollView>
            </View>
        );
    };

    const changePaginate = (event, productIndex) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width)
        if (slide !== pagination[productIndex] && data[productIndex].images[slide]) {
            const newPagination = [...pagination];
            newPagination[productIndex] = slide;
            setPaginator(newPagination);
        }
    }

    const setInitial = (countProducts, setPaginator) => {
        let array = []
        for (let i = 0; i < countProducts; i++) {
            array.push(0)
        }

        setPaginator(array)
    }

    const setInitialLiked = (countProducts) => {
        let liked = []
        for (let i = 0; i < countProducts; i++) {
            liked.push(false)
        }

        setLiked(liked)
    }

    useEffect(() => {
        const categoryId = props.route.params.category_id
        if (categoryId) {
            getProductsInCategory(categoryId)
        }
    }, []);

    return (
        <View style={ProductsPageStyle.container}>
            <HeaderMenu title={props.route.params.title}/>
            <ScrollView contentContainerStyle={{
                rowGap: 16,
                paddingTop: 110,
                paddingBottom: 70,
                alignItems: 'center',
                flexWrap: 'wrap',
                flexDirection: 'row',
                paddingLeft: '6%',
                paddingRight: '6%',
                justifyContent: 'space-between'
            }} style={{
                height: '100%',
                width: "100%",
                display: 'flex',
            }}>
                {data.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} style={{
                            paddingBottom: 10,
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: '#cdc9c9',
                            borderRadius: 5,
                            width: '46%',
                            zIndex: 1,
                            backgroundColor: 'white',
                        }} onPress={() => navigation.navigate('Товар', {
                            product_id: item.id,
                            title: item.name,
                        })}>
                            {ImageSlider(item.images, index)}
                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                {
                                    item.images.map((i, k) =>
                                        (
                                            <Text key={k}
                                                  style={pagination[index] === k ? ProductsPageStyle.paginatorActive : ProductsPageStyle.paginator}>∙</Text>
                                        )
                                    )}
                            </View>
                            <View style={{
                                display: 'flex',
                                paddingLeft: 10,
                                paddingRight: 10
                            }}>
                                {item.promotions ?

                                    <View>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <View style={{
                                                backgroundColor: '#000000',
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
                                                }}>-{(((item.price - item.promotions.new_price) / item.price) * 100).toFixed(0)}%</Text>
                                            </View>
                                            <LikeButton index={index}/>
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
                                            }}>{item.promotions.new_price} ₽</Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: 800,
                                                marginTop: 10,
                                                color: '#bdb2b2',
                                                textDecorationLine: 'line-through',
                                            }}>{item.price} ₽</Text>
                                        </View>
                                    </View> :
                                    <View>
                                        <View style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'flex-end'
                                        }}>
                                            <LikeButton index={index}/>
                                        </View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: 800,
                                            marginTop: 10,
                                        }}>{item.price} ₽</Text>
                                    </View>
                                }

                                <Text style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    marginTop: 10,
                                    height: 40
                                }}>{item.name}</Text>

                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1
                                    }}>
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"orange"}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"orange"}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"orange"}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"orange"}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"orange"}
                                        />
                                        <Text style={{
                                            fontSize: 12
                                        }}>(0)</Text>
                                    </View>
                                    <ToggleCartButton index={index}/>
                                </View>

                            </View>

                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
            <FooterMenu page="categories"/>
            <StatusBar style="auto"/>
        </View>
    )
}

export const ProductsPageStyle = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    paginatorActive: {
        color: 'black',
    },
    paginator: {
        color: '#cbc7c7',
    },

});

