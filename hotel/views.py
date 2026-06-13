from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from django.utils import timezone
from .models import Room, Booking, Service, Coupon, Invoice,HotelGallery,MenuItem
from .serializers import RoomSerializer, BookingSerializer, InvoiceSerializer,HotelGallerySerializer,MenuItemSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        check_in = serializer.validated_data['check_in_date']
        check_out = serializer.validated_data['check_out_date']

        if check_in >= check_out:
            raise ValidationError({"message": "تاریخ ورود باید قبل از تاریخ خروج باشد!"})

        overlapping_bookings = Booking.objects.filter(
            room=room,
            status__in=['pending', 'confirmed']
        ).filter(
            Q(check_in_date__lt=check_out) & Q(check_out_date__gt=check_in)
        )

        if overlapping_bookings.exists():
            raise ValidationError({"message": "متاسفانه این اتاق در تاریخ‌های انتخابی شما قبلاً رزرو شده است."})

        delta_days = (check_out - check_in).days
        total_price = delta_days * room.price_per_night

        booking = serializer.save(user=self.request.user, total_price=total_price, status='pending')
        
        Invoice.objects.create(booking=booking)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(booking__user=self.request.user)

    @action(detail=True, methods=['post'])
    def pay_deposit(self, request, pk=None):
        invoice = self.get_object()
        booking = invoice.booking

        if booking.status != 'pending':
            return Response({"message": "این رزرو قبلاً پرداخت شده یا لغو شده است!"}, status=status.HTTP_400_BAD_REQUEST)

        invoice.deposit_paid = booking.total_price
        invoice.save()

        booking.status = 'confirmed'
        booking.save()

        return Response({"message": "پرداخت با موفقیت انجام شد و اتاق به نام شما رزرو قطعی گردید!"})

    @action(detail=True, methods=['post'])
    def add_service(self, request, pk=None):
        invoice = self.get_object()
        service_id = request.data.get('service_id')
        try:
            service = Service.objects.get(id=service_id, is_active=True)
        except Service.DoesNotExist:
            return Response({"message": "سرویس مورد نظر یافت نشد یا غیرفعال است!"}, status=status.HTTP_404_NOT_FOUND)
        invoice.services.add(service)
        invoice.save()
        return Response({"message": f"سرویس {service.name} به فاکتور شما اضافه شد."})

    @action(detail=True, methods=['post'])
    def apply_coupon(self, request, pk=None):
        invoice = self.get_object()
        coupon_code = request.data.get('code')
        try:
            coupon = Coupon.objects.get(code=coupon_code, is_active=True, valid_until__gt=timezone.now())
        except Coupon.DoesNotExist:
            return Response({"message": "کد تخفیف نامعتبر است یا منقضی شده است!"}, status=status.HTTP_400_BAD_REQUEST)
        invoice.coupon = coupon
        invoice.save()
        return Response({"message": f"کد تخفیف {coupon.discount_percent} درصدی با موفقیت اعمال شد."})

    @action(detail=True, methods=['get'])
    def calculate_total(self, request, pk=None):
        invoice = self.get_object()
        
        room_subtotal = invoice.booking.total_price
        services_subtotal = sum(service.price for service in invoice.services.all())
        gross_total = room_subtotal + services_subtotal
        
        discount_amount = 0
        if invoice.coupon:
            discount_amount = (gross_total * invoice.coupon.discount_percent) / 100
        
        amount_after_discount = gross_total - discount_amount
        tax_amount = (amount_after_discount * invoice.tax_rate) / 100
        
        total_invoice_amount = amount_after_discount + tax_amount
        
        final_payable_amount = total_invoice_amount - invoice.deposit_paid
        
        if final_payable_amount < 0:
            final_payable_amount = 0

        return Response({
            "room_cost": room_subtotal,
            "services_cost": services_subtotal,
            "gross_total": gross_total,
            "discount_applied": discount_amount,
            "tax_amount": tax_amount,
            "total_invoice_amount": total_invoice_amount,
            "deposit_paid": invoice.deposit_paid,
            "final_payable_amount": round(final_payable_amount, 2),
            "is_paid": invoice.is_paid,
            "booking_status": invoice.booking.get_status_display()
        })

    @action(detail=True, methods=['post'])
    def final_checkout(self, request, pk=None):
        invoice = self.get_object()
        booking = invoice.booking
        
        if booking.status != 'confirmed':
            return Response({"message": "فقط رزروهای قطعی قابلیت تسویه حساب دارند!"}, status=status.HTTP_400_BAD_REQUEST)
            
        invoice.is_paid = True
        invoice.save()
        
        booking.status = 'checked_out'
        booking.save()
        
        return Response({"message": "تسویه حساب نهایی با موفقیت انجام شد. به امید دیدار مجدد!"})


from .models import HotelGallery
from .serializers import HotelGallerySerializer

class HotelGalleryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HotelGallery.objects.filter(is_active=True)
    serializer_class = HotelGallerySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.filter(is_active=True)
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]