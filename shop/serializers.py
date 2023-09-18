from rest_framework.serializers import ModelSerializer, SerializerMethodField

from shop.models import ItemNumber, ProductPhotos, Category, Promotions


class ProductPhotosSerializer(ModelSerializer):
    class Meta:
        model = ProductPhotos
        fields = ('image', )


class ProductPromotionsSerializer(ModelSerializer):
    class Meta:
        model = Promotions
        fields = ('new_price', )


class ItemNumberSerializer(ModelSerializer):
    images = SerializerMethodField()
    promotions = SerializerMethodField()

    class Meta:
        model = ItemNumber
        fields = ('id', 'name', 'category', 'manufacturer', 'price', 'images', 'promotions', 'slug', 'on_sale')

    def get_images(self, obj):
        product = ItemNumber.get_products(obj)[0]
        if product:
            images = ProductPhotosSerializer(product.get_photos(), many=True).data
            return images

        return None

    def get_promotions(self, obj):
        promotions = Promotions.objects.filter(item_number=obj)
        if promotions:
            return ProductPromotionsSerializer(promotions[0]).data

        return None


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image')
