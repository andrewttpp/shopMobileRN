from django.urls import path

from shop.views import *
from shop_django import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', HomePage.as_view(), name='main'),
    path('market/search/', SearchView.as_view(), name='search_view'),
    path('market/categories/', CategoriesView.as_view(), name='categories'),
    path('market/<cat_slug>/', CategoryView.as_view(), name='category'),
    path('market/<int:item_number_id>/<str:item_number_slug>/', ItemNumberView.as_view(), name='item_number'),
    path('market/manufacturer/<manufacturer_slug>/', ManufacturerView.as_view(), name='manufacturer'),
    path('market/<cat_slug>/<modules_slug>/', ModuleView.as_view(), name='modules'),
    path('api/cart/add/<int:product_id>/', cart_add, name='cart_add'),
    path('api/likes/', get_liked, name='get_liked'),
    path('api/likes/add/<int:product_id>/', like_add, name='likes_add'),
    path('api/likes/remove/<int:product_id>/', like_remove, name='likes_add'),
    path('api/likes/is_liked/<int:product_id>/', is_liked, name='is_liked'),
    path('api/categories/', CategoriesApiView.as_view(), name='api_categories'),
    path('api/categories/<int:category_id>/', CategoryApiView.as_view(), name='api_categories'),
    path('api/product/<int:product_id>/', ProductApiView.as_view(), name='api_product'),
    path('api/cart/remove/<int:product_id>/', cart_remove, name='cart_remove'),
    path('api/cart/in_cart/<int:product_id>/', check_in_cart, name='check_product'),
    path('api/cart/len/', cart_len, name='cart_len'),
    path('api/search_products/', SearchItemNumbersAPIList.as_view(), name='search')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    