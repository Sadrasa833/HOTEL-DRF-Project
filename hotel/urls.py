from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, BookingViewSet, InvoiceViewSet,HotelGalleryViewSet,MenuItemViewSet

router = DefaultRouter()

router.register(r'rooms', RoomViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'gallery', HotelGalleryViewSet, basename='gallery')
router.register(r'menu', MenuItemViewSet, basename='menu')

urlpatterns = [
    path('', include(router.urls)),
]

