from django.contrib import admin
from .models import Room, RoomImage, HotelGallery, Booking, Service, Coupon, Invoice,MenuItem
class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 3 

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'room_type', 'price_per_night', 'is_active')
    inlines = [RoomImageInline] 




@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name',)



admin.site.register(HotelGallery)
admin.site.register(Booking)
admin.site.register(Service)
admin.site.register(Coupon)
admin.site.register(Invoice)