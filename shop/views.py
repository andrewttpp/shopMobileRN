import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic import ListView, DetailView
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .cart import Cart
from .likes import Likes
from .models import *
from .utils import DataMixin
from .serializers import ProductSerializer, CategorySerializer


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


"Creating API"


class SearchItemNumbersAPIList(ListCreateAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Products.objects.filter(name__icontains=self.request.GET.get('search_content'))
        return queryset


class CategoriesApiView(ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()
        return queryset


class CategoryApiView(ListCreateAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Products.objects.filter(item_number__category__id=self.kwargs['category_id'])
        return queryset


class ProductApiView(APIView):
    serializer_class = ProductSerializer

    def get(self, request, product_id):
        queryset = get_object_or_404(Products, pk=product_id)

        return Response(data=self.serializer_class(queryset).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def like_add(request, product_id):
    likes = Likes(request)
    likes.add(product_id)
    return Response(data={'message': 'OK'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def like_remove(request, product_id):
    likes = Likes(request)
    likes.remove(product_id)
    return Response(data={'message': 'OK'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def is_liked(request, product_id):
    likes = Likes(request)
    result_is_liked = likes.is_liked(product_id)
    return Response(data={'message': 'OK', 'is_liked': result_is_liked}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_liked(request):
    likes = Likes(request)
    products = Products.objects.filter(pk__in=likes.likes)

    return Response(data={'message': 'OK', 'liked': ProductSerializer(products, many=True).data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def cart_add(request, product_id):
    cart = Cart(request)
    data = json.loads(request.body)
    cart.add(product=product_id,
             quantity=data['quantity'],
             price=data['price'])
    return JsonResponse(
        {
            "total_price_without_discount": cart.get_total_price_without_discount(),
            "total_price_with_discount": cart.get_total_price_with_discount(),
            "total_quantity_products": cart.total_quantity_products()
        },
        status=200)


@api_view(['GET'])
def cart_len(request):
    cart = Cart(request)
    return JsonResponse({"count_products": cart.__len__()})


@api_view(['POST'])
def cart_remove(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Products, id=product_id)
    cart.remove(product)
    return JsonResponse({
        "total_price_without_discount": cart.get_total_price_without_discount(),
        "total_price_with_discount": cart.get_total_price_with_discount(),
        "total_quantity_products": cart.total_quantity_products()
    }, status=200)


@api_view(['GET'])
def check_in_cart(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Products, id=product_id)
    return JsonResponse({'in_cart': cart.check_product_in_cart(product)})


"Page View"


class HomePage(DataMixin, ListView):
    model = Products
    template_name = 'shop/list_products.html'
    context_object_name = 'products'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context_add = self.get_user_context(title="Главная страница")
        context |= context_add
        return context


class CategoriesView(DataMixin, ListView):
    model = Category
    template_name = 'shop/list_categories.html'
    context_object_name = 'categories'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context_add = self.get_user_context(title="Категории")
        context |= context_add
        return context


class CategoryView(DataMixin, ListView):
    model = ItemNumber
    template_name = 'shop/list_products.html'
    context_object_name = 'item_numbers'

    def get_context_data(self, *, object_list=None, **kwargs):
        name_category = Category.objects.get(slug=self.kwargs['cat_slug']).name
        context = super().get_context_data(**kwargs)

        current_queryset = self.get_queryset()
        number_of_products_found = current_queryset.__len__()
        remains_one = number_of_products_found % 10
        remains_two = number_of_products_found % 100
        verbose_name_plural_title = 'Найдено'
        if remains_one == 1 and remains_two != 11:
            verbose_name_plural_products = 'товар'
            verbose_name_plural_title = 'Найден'
        elif (remains_one == 2 or remains_one == 3 or remains_one == 4) and \
                remains_two != 12 and remains_two != 13 and remains_two != 14:
            verbose_name_plural_products = 'товара'
        else:
            verbose_name_plural_products = 'товаров'

        context_add = self.get_user_context(title=name_category, number_of_products_found=number_of_products_found,
                                            verbose_name_plural_products=verbose_name_plural_products,
                                            verbose_name_plural_title=verbose_name_plural_title)
        context |= context_add
        return context

    def get_queryset(self):
        query = ItemNumber.objects.filter(category__slug=self.kwargs['cat_slug'], on_sale=True)
        if self.request.method == 'GET' and self.request.GET.get('sorting'):
            for i in query:
                if not int(self.request.GET.get('initial_price')) <= i.get_min_price() <= \
                       int(self.request.GET.get('final_price')) or \
                        not int(self.request.GET.get('initial_price')) <= i.price <= int(
                            self.request.GET.get('final_price')):
                    query = query.exclude(item_number=i.item_number)
            if self.request.GET.get('sorting') == 'cheaper':
                query = query.order_by('price')
            elif self.request.GET.get('sorting') == 'final_price':
                query = query.order_by('-price')
        return query


class ModuleView(DataMixin, ListView):
    model = Products
    template_name = 'shop/list_products_module.html'
    context_object_name = 'products'

    def get_context_data(self, *, object_list=None, **kwargs):
        name_module = Modules.objects.get(slug=self.kwargs['modules_slug']).name
        context = super().get_context_data(**kwargs)
        context_add = self.get_user_context(title=name_module)
        context |= context_add
        return context

    def get_queryset(self):
        return Products.objects.filter(module__slug=self.kwargs['modules_slug'])


class ItemNumberView(DataMixin, DetailView):
    model = ItemNumber
    template_name = 'shop/product.html'
    context_object_name = 'item_number'
    pk_url_kwarg = 'item_number_id'

    def get_context_data(self, *, object_list=None, **kwargs):
        name_product = self.get_object().name
        context = super().get_context_data(**kwargs)
        context_add = self.get_user_context(title=name_product)
        context |= context_add
        return context

    def get_object(self, queryset=None):
        return ItemNumber.objects.get(id=self.kwargs['item_number_id'])


class ManufacturerView(DataMixin, ListView):
    model = ItemNumber
    template_name = 'shop/list_products.html'
    context_object_name = 'item_numbers'

    def get_context_data(self, *, object_list=None, **kwargs):
        name_manufacturer = Manufacturer.objects.get(slug=self.kwargs['manufacturer_slug']).name
        context = super().get_context_data(**kwargs)
        context_add = self.get_user_context(title=name_manufacturer)
        context['module_products'] = Modules.objects.all()
        context |= context_add
        return context

    def get_queryset(self):
        return ItemNumber.objects.filter(manufacturer__slug=self.kwargs['manufacturer_slug'])


class SearchView(DataMixin, ListView):
    model = ItemNumber
    context_object_name = 'item_numbers'
    template_name = 'shop/list_products.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context_add = self.get_user_context(title='Результат запроса')
        context |= context_add
        return context

    def get_queryset(self):
        if self.request.method == 'GET':
            queryset = ItemNumber.objects.filter(name__icontains=self.request.GET.get('search_content'))
            return queryset
