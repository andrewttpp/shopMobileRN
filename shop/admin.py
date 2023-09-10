from django.contrib import admin
from django.contrib.auth.models import Group

from shop.models import Products, Category, ProductPhotos, Modules, Manufacturer, ProductColors, ItemNumber, Promotions


class ProductsInline(admin.TabularInline):
    model = Products
    extra = 0
    exclude = ('category', 'manufacturer')


class PhotosInline(admin.TabularInline):
    model = ProductPhotos
    extra = 0


class ColorsInline(admin.TabularInline):
    model = ProductColors
    extra = 0


class ItemNumberAdmin(admin.ModelAdmin):
    list_display = ('id', 'item_number', 'name', 'on_sale')
    exclude = ('slug',)


class ProductsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'color_modification', 'on_sale')
    search_fields = ('id', 'name')
    exclude = ('slug',)
    inlines = [PhotosInline]

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in ['description']:
            kwargs['strip'] = False
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def save_formset(self, request, form, formset, change):
        main_instance = form.save(commit=False)
        inline_instances = formset.save()
        print(change)
        print(inline_instances)
        if not inline_instances:
            main_instance.is_sale = False

        main_instance.save()


class ProductColorsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'hex_code_color')
    exclude = ('slug',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'image')
    exclude = ('slug',)


class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    exclude = ('slug',)


class ModulesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    inlines = [ProductsInline]

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            instance.category = form.cleaned_data['category']
            instance.manufacturer = form.cleaned_data['manufacturer']
            instance.save()
        formset.save_m2m()


class PromotionsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Promotions._meta.get_fields()]


admin.site.unregister(Group)
admin.site.register(ItemNumber, ItemNumberAdmin)
admin.site.register(Products, ProductsAdmin)
admin.site.register(ProductColors, ProductColorsAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Manufacturer, ManufacturerAdmin)
admin.site.register(Modules, ModulesAdmin)
admin.site.register(Promotions, PromotionsAdmin)
