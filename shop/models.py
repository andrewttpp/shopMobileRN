from os.path import splitext

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.urls import reverse
from django.db import models
from django.db.models import Q
from django.core.files.storage import FileSystemStorage

import unidecode
from uuid import uuid4


class UUIDFileStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        _, ext = splitext(name)
        return uuid4().hex + ext


class ItemNumber(models.Model):
    item_number = models.CharField(max_length=128, verbose_name='Артикул товара', unique=True)
    name = models.CharField(max_length=128, verbose_name='Имя товара')
    slug = models.SlugField(max_length=128)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, verbose_name='Категория артикула')
    manufacturer = models.ForeignKey('Manufacturer', on_delete=models.CASCADE, verbose_name='Производитель')
    description = models.TextField(max_length=2000, verbose_name='Общее описание артикула', blank=True, null=True)
    size = models.CharField(max_length=128, verbose_name='Размер товара данного артикула')
    price = models.IntegerField(verbose_name='Цена товара данного артикула')
    assembly_price = models.IntegerField(default=500, verbose_name='Цена сборки')
    the_price_of_lifting_to_each_floor = models.IntegerField(default=200, verbose_name='Цена подъёма за каждый этаж')
    the_price_of_lifting_by_elevator = models.IntegerField(default=500, verbose_name='Цена подъёма на лифте')
    on_sale = models.BooleanField(default=False, verbose_name='В продаже')

    class Meta:
        verbose_name = 'Артикул'
        verbose_name_plural = 'Артикулы'
        ordering = ['item_number']

    def __str__(self):
        return self.item_number

    def save(self, *args, **kwargs):
        products_this_item_number = Products.objects.filter(item_number_id=self.pk)
        if not self.on_sale:
            for product in products_this_item_number:
                product.on_sale = False
                Products.save(product, *args, **kwargs)
        if not self.slug and self.name:
            self.slug = self.get_slug()

        if not self.get_products_only_sale():
            self.on_sale = False

        super().save(*args, **kwargs)

    def get_slug(self):
        slug = unidecode.unidecode(self.name).replace(' ', '-').lower().replace("'", '').replace("(", '').replace(
            ")", '')
        return slug

    def get_absolute_url(self):
        return reverse('item_number', kwargs={'item_number_slug': self.slug, 'item_number_id': self.pk})

    def get_count_products(self):
        return Products.objects.filter(item_number_id=self.pk).__len__()

    def get_count_modules(self):
        return Modules.objects.filter(item_number_id=self.pk).__len__()

    def get_products_only_sale(self):
        products = Products.objects.filter(item_number_id=self.pk, on_sale=True).order_by('color_modification__name')
        return products

    def get_products(self):
        products = Products.objects.filter(item_number_id=self.pk).order_by('color_modification__name')
        return products

    def get_min_price(self):
        minimal_price = self.price
        for i in self.get_products():
            promotion = i.get_promotion()
            if promotion:
                minimal_price = promotion.new_price if promotion.new_price < minimal_price else minimal_price
        item_number_promotion = Promotions.objects.filter(item_number=self.item_number)
        if item_number_promotion:
            minimal_price = item_number_promotion.new_price if item_number_promotion.new_price < minimal_price else minimal_price

        return minimal_price


class Products(models.Model):
    item_number = models.ForeignKey('ItemNumber', models.CASCADE, verbose_name='Артикул товара')
    name = models.CharField(max_length=128, verbose_name='Имя товара', blank=True, null=True)
    color_modification = models.ForeignKey('ProductColors', on_delete=models.CASCADE, verbose_name='Цвет продукта')
    module = models.ForeignKey('Modules', on_delete=models.CASCADE, blank=True, null=True, verbose_name='Модуль товара')
    description = models.TextField(max_length=2000, verbose_name='Описание данного товара', blank=True, null=True)
    size = models.CharField(max_length=128, verbose_name='Размер товара', blank=True, null=True)
    price = models.IntegerField(verbose_name='Цена товара', blank=True, null=True)
    quantity_in_stock = models.IntegerField(default=1, verbose_name='Количество в наличии')
    assembly_price = models.IntegerField(verbose_name='Цена сборки', blank=True, null=True)
    the_price_of_lifting_to_each_floor = models.IntegerField(verbose_name='Цена подъёма за каждый этаж', blank=True,
                                                             null=True)
    the_price_of_lifting_by_elevator = models.IntegerField(verbose_name='Цена подъёма на лифте', blank=True, null=True)
    on_sale = models.BooleanField(default=True, verbose_name='В продаже')

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        if not self.name:
            return self.item_number.name + ', ' + self.color_modification.name

        else:
            return self.name + ', ' + self.color_modification.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.item_number.name

        if not self.description:
            self.description = self.item_number.description

        if not self.size:
            self.size = self.item_number.size

        if not self.price:
            self.price = self.item_number.price

        if not self.assembly_price:
            self.assembly_price = self.item_number.assembly_price

        if not self.the_price_of_lifting_to_each_floor:
            self.the_price_of_lifting_to_each_floor = self.item_number.the_price_of_lifting_to_each_floor

        if not self.the_price_of_lifting_by_elevator:
            self.the_price_of_lifting_by_elevator = self.item_number.the_price_of_lifting_by_elevator

        if not self.get_photos():
            self.on_sale = False

        if not self.quantity_in_stock:
            self.on_sale = False

        super().save(*args, **kwargs)

    def is_available(self):
        query = Products.objects.filter(item_number=self.item_number.pk,
                                        color_modification_id=self.color_modification.pk).filter(~Q(id=self.id))

        return query

    def clean(self):
        if not self.item_number:
            raise ValidationError('Выберите артикул')
        if self.is_available():
            raise ValidationError('Продукт с таким же цветом уже существует в этом артикуле')

    def get_photos(self):
        queryset = ProductPhotos.objects.filter(product_id=self.pk)

        return queryset

    def get_promotion(self):
        queryset = Promotions.objects.filter(product_id=self.pk, is_active=True)
        return queryset


class ProductPhotos(models.Model):
    product = models.ForeignKey('Products', on_delete=models.CASCADE, verbose_name='Товар', unique=False)
    image = models.ImageField(blank=True, null=True, upload_to='images/', verbose_name='Фото товара',
                              storage=UUIDFileStorage())

    class Meta:
        verbose_name = 'Фото товара'
        verbose_name_plural = 'Фото товаров'

    def __str__(self):
        if not self.product.name:
            return self.product.item_number.name
        else:
            return self.product.name


class ProductColors(models.Model):
    name = models.CharField(max_length=128, verbose_name='Название цвета', unique=True)
    slug = models.SlugField(max_length=128, unique=True, allow_unicode=True)
    hex_code_color = models.CharField(max_length=7, verbose_name='Код цвета в кодировке HEX')

    class Meta:
        verbose_name = 'Цвет товара'
        verbose_name_plural = 'Цвета товаров'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('color', kwargs={'color_slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = unidecode.unidecode(self.name).replace(' ', '-').lower().replace("'", '').replace("(", '').replace(
            ")", '')
        super().save(*args, **kwargs)


class Category(models.Model):
    name = models.CharField(max_length=128, verbose_name='Название категории', unique=True)
    slug = models.SlugField(max_length=128)
    image = models.ImageField(blank=True, null=True, upload_to='images/', verbose_name='Фото товара',
                              storage=UUIDFileStorage())

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_modules(self):
        queryset = Modules.objects.filter(category_id=self.pk)

        return queryset

    def get_absolute_url(self):
        return reverse('category', kwargs={'cat_slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = unidecode.unidecode(self.name).replace(' ', '-').lower().replace("'", '').replace("(", '').replace(
            ")", '')
        super().save(*args, **kwargs)

    def is_available(self):
        query = Category.objects.filter(name=self.name).filter(~Q(id=self.id))
        return query

    def clean(self):
        if not self.name:
            raise ValidationError('Название категории не может быть пустым')
        if self.is_available():
            raise ValidationError('Категория с таким именем уже существует')


class Manufacturer(models.Model):
    name = models.CharField(max_length=128, verbose_name='Название производителя', unique=True)
    slug = models.SlugField(max_length=128)

    class Meta:
        verbose_name = 'Производитель'
        verbose_name_plural = 'Производители'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('manufacturer', kwargs={'manufacturer_slug': self.slug})

    def is_available(self):
        query = Manufacturer.objects.filter(name=self.name).filter(~Q(id=self.id))
        return query

    def clean(self):
        if not self.name:
            raise ValidationError('Название производителя не может быть пустым')
        if self.is_available():
            raise ValidationError('Производитель с таким именем уже существует')

    def save(self, *args, **kwargs):
        self.slug = unidecode.unidecode(self.name).replace(' ', '-').lower().replace("'", '').replace("(", '').replace(
            ")", '')
        super().save(*args, **kwargs)


class Modules(models.Model):
    item_number = models.ForeignKey('ItemNumber', models.CASCADE)
    name = models.CharField(max_length=128, verbose_name='Название модуля', unique=True)
    slug = models.SlugField(max_length=128)
    main_product = models.ForeignKey('Products', on_delete=models.PROTECT, null=True, blank=True,
                                     verbose_name='Товар с полной комплектацией данного модуля')

    class Meta:
        verbose_name = 'Модульная мебель'
        verbose_name_plural = 'Модули'

    def __str__(self):
        return self.name

    def is_available(self):
        query = Modules.objects.filter(name=self.name).filter(~Q(id=self.id))
        return query

    def clean(self):
        if not self.name:
            raise ValidationError('Название модуля не может быть пустым')
        if self.is_available():
            raise ValidationError('Модуль с таким именем уже существует')

    def get_products(self):
        return Products.objects.filter(module=self.pk)

    def get_absolute_url(self):
        return reverse('modules', kwargs={'modules_slug': self.slug})

    def save(self, *args, **kwargs):
        self.slug = unidecode.unidecode(self.name).replace(' ', '-').lower().replace("'", '').replace("(", '').replace(
            ")", '')
        super().save(*args, **kwargs)


class Promotions(models.Model):
    item_number = models.ForeignKey('ItemNumber', models.CASCADE, blank=True, null=True, verbose_name='Артикул')
    product = models.ForeignKey('Products', models.CASCADE, blank=True, null=True, verbose_name='Товар')
    new_price = models.IntegerField(verbose_name='Новая цена')
    is_active = models.BooleanField(default=True, verbose_name='Активация акции')

    def __str__(self):
        if self.item_number:
            return 'Акция для артикула ' + self.item_number.name
        elif self.product:
            return 'Акция для товара ' + self.product.__str__()

    class Meta:
        verbose_name = 'Акция'
        verbose_name_plural = 'Акции'

    def clean(self, *args, **kwargs):
        if not self.item_number and not self.product:
            raise ValidationError('Выберите товар или артикул для которого хотите сделать скидку')
        if not self.new_price:
            raise ValidationError('Введите новую цену')
        if self.item_number and self.product:
            raise ValidationError('Выбрать скидку можно либо на товар, либо на артикул')
        if self.new_price and self.item_number and self.new_price >= self.item_number.price:
            raise ValidationError('Акционная цена артикула должна быть меньше его текущей цены\n'
                                  f'Текущая цена выбранного артикула {self.item_number.price}')
        if self.new_price and self.product and self.new_price >= self.product.price:
            raise ValidationError('Акционная цена товара должна быть меньше его текущей цены\n'
                                  f'Текущая цена выбранного товара {self.product.price} ₽')


class User(AbstractUser):
    email = models.EmailField(max_length=255, null=False, unique=True, verbose_name='E-mail')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
