import {StyleSheet, Text, View} from "react-native";

export const PaginationPointsProducts = (item, pagination, index) => {
    return (<View style={{
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
    </View>)
}

export const PaginationPoints = (item, pagination) => {
    return (<View style={{
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5
    }}>
        {
            item.images.map((i, k) =>
                (
                    <Text key={k}
                          style={pagination === k ? ProductsPageStyle.paginatorActive : ProductsPageStyle.paginator}>●</Text>
                )
            )}
    </View>)
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