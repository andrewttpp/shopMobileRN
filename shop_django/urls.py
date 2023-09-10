from django.contrib import admin
from django.urls import path
from django.urls import include

import shop.urls

urlpatterns = [
    path('', include(shop.urls)),
    path('admin/', admin.site.urls),
]
