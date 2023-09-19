from django.conf import settings

from shop.models import Products


# creating a shopping cart
class Likes(object):
    def __init__(self, request):
        self.session = request.session
        self.likes = self.session.get(settings.LIKES_SESSION_ID)
        if not self.likes:
            # save an empty cart in the session
            self.likes = self.session[settings.LIKES_SESSION_ID] = []

    def __len__(self):
        return self.likes.__len__()

    def add(self, product):
        product_id = str(product)

        if product_id not in self.likes:
            self.likes.append(product_id)
        self.save()

    def save(self):
        # update cart session
        self.session[settings.LIKES_SESSION_ID] = self.likes
        # mark the session as "modified" to make sure it is saved
        self.session.modified = True

    def remove(self, product):
        product_id = str(product)
        if product_id in self.likes:
            self.likes.remove(product_id)
        self.save()

    def is_liked(self, product):
        product_id = str(product)
        if product_id in self.likes:
            return True
        return False

    # deleting a cart from a session
    def clear(self):
        del self.session[settings.LIKES_SESSION_ID]
        self.session.modified = True
