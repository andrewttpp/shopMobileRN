from django.conf import settings

from shop.models import Products


# creating a shopping cart
class Cart(object):
    def __init__(self, request):
        self.session = request.session
        self.cart = self.session.get(settings.CART_SESSION_ID)
        if not self.cart:
            # save an empty cart in the session
            self.cart = self.session[settings.CART_SESSION_ID] = {}

    def __iter__(self):
        products = Products.objects.filter(id__in=self.cart.keys())
        for product in products:
            self.cart[str(product.id)]['product'] = product

        for item in self.cart.values():
            item['price'] = int(item['price'])
            item['total_price'] = item['price'] * item['quantity']
            if 'product' in item.keys():
                yield item

    def __len__(self):
        return self.cart.keys().__len__()

    def check_product_in_cart(self, product):
        if str(product.id) in self.cart:
            return True
        else:
            return False

    def get_total_price_with_discount(self):
        return sum(int(item['price']) * item['quantity'] for item in self.cart.values())

    def get_total_price_without_discount(self):
        return sum(int(Products.objects.get(id=item).price) * self.cart[f'{item}']['quantity'] for item in self.cart.keys())

    def total_quantity_products(self):
        return sum(item['quantity'] for item in self.cart.values())

    def add(self, product,  quantity=1, price=0):
        current_product = Products.objects.get(id=product)
        product_id = str(current_product.id)

        if product_id not in self.cart:
            self.cart[product_id] = {'quantity': 0, 'price': str(price)}
        self.cart[product_id]['quantity'] = int(quantity)
        self.save()

    def save(self):
        # update cart session
        self.session[settings.CART_SESSION_ID] = self.cart
        # mark the session as "modified" to make sure it is saved
        self.session.modified = True

    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    # deleting a cart from a session
    def clear(self):
        del self.session[settings.CART_SESSION_ID]
        self.session.modified = True
