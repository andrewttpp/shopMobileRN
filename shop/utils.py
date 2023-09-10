import datetime
from datetime import datetime

from .models import *
from shop_django.settings import CURRENCY

header_menu = [
    {'title': 'Категории', 'url_name': 'categories'},
    {'title': 'Акции', 'url_name': 'main'},
    {'title': 'Новинки', 'url_name': 'main'}
]

footer_menu_for_users = [
    {'title': 'Доставка и оплата', 'url_name': 'main'},
    {'title': 'Сборка и подъём', 'url_name': 'main'},
    {'title': 'Возврат товаров', 'url_name': 'main'},
    {'title': 'Часто задаваемые вопросы', 'url_name': 'main'},
]

footer_menu_about_company = [
    {'title': 'О нас', 'url_name': 'main'},
    {'title': 'Отзывы', 'url_name': 'main'},
    {'title': 'Сотрудничество', 'url_name': 'main'},
    {'title': 'Политика конфиденциальности', 'url_name': 'main'}
]


class DataMixin:

    def get_user_context(self, **kwargs):
        context = kwargs
        cats = Category.objects.all()
        context['categories'] = cats
        context['header_menu'] = header_menu
        context['currency'] = CURRENCY
        context['footer_menu_for_users'] = footer_menu_for_users
        context['footer_menu_about_company'] = footer_menu_about_company
        context['current_year'] = datetime.now().year
        if 'cat_selected' not in context:
            context['cat_selected'] = 0
        return context
