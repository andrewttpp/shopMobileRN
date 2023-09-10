from rest_framework.serializers import ModelSerializer, SerializerMethodField

from shop.models import ItemNumber, ProductPhotos, Category


class ProductPhotosSerializer(ModelSerializer):
    class Meta:
        model = ProductPhotos
        fields = ('image', )


class ItemNumberSerializer(ModelSerializer):
    image = SerializerMethodField()

    class Meta:
        model = ItemNumber
        fields = ('id', 'name', 'category', 'manufacturer', 'price', 'image', 'slug', 'on_sale')

    def get_image(self, obj):
        product = ItemNumber.get_products(obj)[0]
        if product:
            image = ProductPhotosSerializer(product.get_photos()[0]).data
            return image
        else:
            return None


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image')
