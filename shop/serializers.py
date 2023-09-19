from rest_framework.serializers import ModelSerializer, SerializerMethodField

from shop.models import ItemNumber, ProductPhotos, Category, Promotions, Products, ProductColors

from .likes import Likes


class ProductPhotosSerializer(ModelSerializer):
    class Meta:
        model = ProductPhotos
        fields = ('image', )


class ProductPromotionsSerializer(ModelSerializer):
    class Meta:
        model = Promotions
        fields = ('new_price', )


class ProductColorsSerializer(ModelSerializer):
    class Meta:
        model = ProductColors
        fields = ('id', 'name', 'hex_code_color')


class ArticleItemNumberSerializer(ModelSerializer):
    class Meta:
        model = ItemNumber
        fields = ('item_number', )


class ProductSerializer(ModelSerializer):
    item_number = SerializerMethodField()
    images = SerializerMethodField()
    promotions = SerializerMethodField()
    category = SerializerMethodField()
    manufacturer = SerializerMethodField()
    color = SerializerMethodField()


    class Meta:
        model = Products
        fields = ('id', 'item_number', 'name', 'description', 'category', 'manufacturer', 'size', 'price', 'color',
                  'images', 'promotions', 'on_sale')

    def get_item_number(self, obj):
        if obj.item_number:
            article = ItemNumber.objects.get(id=obj.item_number.id)
            return ArticleItemNumberSerializer(article).data
        return None

    def get_images(self, obj):
        if obj:
            images = ProductPhotosSerializer(obj.get_photos(), many=True).data
            return images

        return None

    def get_promotions(self, obj):
        promotions = Promotions.objects.filter(product=obj)
        if promotions:
            return ProductPromotionsSerializer(promotions[0]).data

        return None

    def get_category(self, obj):
        if obj.item_number.category:
            return CategorySerializer(obj.item_number.category).data
        return None

    def get_manufacturer(self, obj):
        if obj.item_number.manufacturer:
            return ManufacturerSerializer(obj.item_number.manufacturer).data
        return None

    def get_color(self, obj):
        if obj.color_modification:
            color = ProductColors.objects.get(id=obj.color_modification.id)
            return ProductColorsSerializer(color).data
        return None


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image')


class ManufacturerSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')
