import {ScrollView,  Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import axios from "axios";
import {HeaderMenu} from "../HeaderMenu";
import {FooterMenu} from "../FooterMenu";
import {StatusBar} from "expo-status-bar";
import {MaterialCommunityIcons, Fontisto, Ionicons} from "@expo/vector-icons";
import {useToast} from "react-native-toast-notifications";
import {API_CATEGORIES, API_MAIN_URL} from "../http/api";
import {useNavigation} from "@react-navigation/native";
import {ImageSliderProducts} from "../AdditionalComponents/ImageSlider";
import {PaginationPointsProducts, ProductsPageStyle} from "../AdditionalComponents/PaginationPoints";

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
                    axios({
                        method: 'post',
                        url: `${API_MAIN_URL}/likes/remove/${props.item.id}/`,
                        withCredentials:true,
                    }).then((response) => {
                        toast.show("Товар успешно удален из избранного", {
                            type: "normal",
                            placement: "bottom",
                            duration: 4000,
                            animationType: "zoom-in",
                        });
                    }).catch(error => console.log(error));

                } else {
                    axios({
                        method: 'post',
                        url: `${API_MAIN_URL}/likes/add/${props.item.id}/`,
                        withCredentials:true,
                    }).then((response) => {
                        toast.show("Товар успешно добавлен в избранное", {
                            type: "normal",
                            placement: "bottom",
                            duration: 4000,
                            animationType: "zoom-in",
                        });
                    }).catch(error => console.log(error));
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
                    axios({
                        method: 'post',
                        url: `${API_MAIN_URL}/cart/remove/${props.item.id}/`,
                        withCredentials:true,
                    }).then((response) => {
                        toast.show("Товар успешно удален из корзины", {
                            type: "normal",
                            placement: "bottom",
                            duration: 4000,
                            animationType: "zoom-in",
                        })
                    }).catch(error => console.log(error));
                } else {
                    axios({
                        method: 'post',
                        data: {
                            quantity: 1,
                            price: props.item.price
                        },
                        withCredentials:true,
                        url: `${API_MAIN_URL}/cart/add/${props.item.id}/`,
                    }).then((response) => {
                        toast.show("Товар успешно добавлен в корзину", {
                            type: "normal",
                            placement: "bottom",
                            duration: 4000,
                            animationType: "zoom-in",
                        })
                    }).catch(error => console.log(error));
                }
            }}>
                <Fontisto
                    name={inCart[props.index]? "shopping-basket-remove" : "shopping-basket-add"}
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
                setInitialCart(response.data)
                setInitialLiked(response.data)
            }
        }).catch(error => console.log(error));
    }

    const setInitial = (countProducts, setPaginator) => {
        let array = []
        for (let i = 0; i < countProducts; i++) {
            array.push(0)
        }

        setPaginator(array)
    }

    const setInitialCart = (data) => {
        let promises = []
        for (let i = 0; i < data.length; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: `${API_MAIN_URL}/cart/in_cart/${data[i].id}/`,
                    withCredentials:true,
                }).then((response) => {
                    return response.data.in_cart
                }).catch(error => console.log(error))
            )
        }

        Promise.all(promises).then((inCart) => {
            setInCart(inCart)
        })
    }

    const setInitialLiked = (data) => {
        let promises = []
        for (let i = 0; i < data.length; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: `${API_MAIN_URL}/likes/is_liked/${data[i].id}/`,
                    withCredentials:true,
        }).then((response) => {
                return response.data.is_liked
            }).catch(error => console.log(error))
        )
        }

        Promise.all(promises).then((liked) => {
            setLiked(liked)
        })
    }

    useEffect(() => {
        const categoryId = props.route.params.category_id
        if (categoryId) {
            getProductsInCategory(categoryId)
        }
    }, []);

    return (
        <View style={ProductsPageStyle.container}>
            <HeaderMenu back={true} title={props.route.params.title}/>
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
                            {ImageSliderProducts(item.images, index, data, pagination, setPaginator)}
                            {PaginationPointsProducts(item, pagination, index)}
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
                                                }}>-{(((item.price - item.promotions.new_price) / item.price) * 100).toFixed(0)}%</Text>
                                            </View>
                                            <LikeButton item={item} index={index}/>
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
                                            <LikeButton item={item} index={index}/>
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
                                        gap: 2,
                                        alignItems: 'center'
                                    }}>
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"#afafaf"}
                                            style={{
                                                width: 12,
                                                height: 12
                                            }}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"#afafaf"}
                                            style={{
                                                width: 12,
                                                height: 12
                                            }}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"#afafaf"}
                                            style={{
                                                width: 12,
                                                height: 12
                                            }}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"#afafaf"}
                                            style={{
                                                width: 12,
                                                height: 12
                                            }}
                                        />
                                        <Ionicons
                                            name={"star"}
                                            size={12}
                                            color={"#afafaf"}
                                            style={{
                                                width: 12,
                                                height: 12
                                            }}
                                        />
                                        <Text style={{
                                            fontSize: 12
                                        }}>(0)</Text>
                                    </View>
                                    <ToggleCartButton item={item} index={index}/>
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

