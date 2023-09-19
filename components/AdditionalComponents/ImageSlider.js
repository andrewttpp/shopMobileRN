import {Dimensions, Image, ScrollView, View} from "react-native";

export const changePaginateProducts = (event, productIndex, data, pagination, setPaginator) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width)
    if (slide !== pagination[productIndex] && data[productIndex].images[slide]) {
        const newPagination = [...pagination];
        newPagination[productIndex] = slide;
        setPaginator(newPagination);
    }
}

export const ImageSliderProducts = (images, productId, data, pagination, setPaginator) => {
    return (
        <View>
            <ScrollView style={{
                maxWidth: 150,
            }} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16} snapToInterval={150}
                        onScroll={(event) => changePaginateProducts(event, productId, data, pagination, setPaginator)}>
                {images.map((image, keyId) =>
                    (
                        <Image key={keyId} source={{uri: `http://localhost:8000${image.image}`}}
                               style={{
                                   height: 100, width: 150, borderRadius: 4, zIndex: -1, borderBottomLeftRadius: 0,
                                   borderBottomRightRadius: 0
                               }}
                        />
                    ))}
            </ScrollView>
        </View>
    );
};

export const changePaginate = (event, pagination, setPaginator) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width)
    if (slide !== pagination) {
        setPaginator(slide);
    }
}

export const ImageSlider = (images, pagination, setPaginator) => {
    const widthWindow = Dimensions.get('window').width
    return (
        <View style={{paddingBottom: 8}}>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16} snapToInterval={widthWindow}
                        onScroll={(event) => changePaginate(event, pagination, setPaginator)}>
                {images.map((image, keyId) =>
                    (
                        <Image key={keyId} source={{uri: `http://localhost:8000${image.image}`}}
                               style={{width: widthWindow, zIndex: -1, aspectRatio: 1.5}}
                        />
                    ))}
            </ScrollView>
        </View>
    );
};