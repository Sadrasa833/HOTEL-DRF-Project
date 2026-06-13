from rest_framework import serializers
from .models import Room, Booking, Service, Coupon, Invoice, RoomImage, HotelGallery,MenuItem

class HotelGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelGallery
        fields = ['id', 'title', 'image']

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'is_main']

class RoomSerializer(serializers.ModelSerializer):
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    images = RoomImageSerializer(many=True, read_only=True) 
    
    class Meta:
        model = Room
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'room', 'check_in_date', 'check_out_date', 'status', 'total_price', 'created_at']
        read_only_fields = ['status', 'total_price']

class InvoiceSerializer(serializers.ModelSerializer):
    room_info = serializers.CharField(source='booking.room.room_number', read_only=True)
    booking_status_display = serializers.CharField(source='booking.get_status_display', read_only=True)
    raw_booking_status = serializers.CharField(source='booking.status', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'booking', 'services', 'coupon', 
            'deposit_paid', 'is_paid', 'issued_at', 
            'room_info', 'booking_status_display', 'raw_booking_status'
        ]
        read_only_fields = ['deposit_paid', 'is_paid']




class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'