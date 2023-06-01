from rest_framework import generics, permissions
from .serializers import ListingSerializer, TransactionSerializer, ReviewSerializer
from listings.models import Listing, Transaction, Review
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from users.models import User, Customer, Owner

class ListingList(generics.ListAPIView):
    queryset = Listing.objects.all().order_by('-date_posted')
    serializer_class = ListingSerializer

class ListingUserList(generics.ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        owner_id = self.kwargs['owner']
        try:
            owner = Owner.objects.get(id=owner_id)
            queryset = Listing.objects.filter(owner=owner).order_by('-date_posted')
        except Owner.DoesNotExist:
            queryset = Listing.objects.none()  # Mengembalikan queryset kosong jika Owner tidak ditemukan
        return queryset

class ListingCreate(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class ListingDetail(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class ListingDelete(generics.DestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class ListingUpdate(generics.UpdateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

class TransactionList(generics.ListAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        listing_id = self.kwargs['listing']
        listing = Listing.objects.get(id=listing_id)
        queryset = Transaction.objects.filter(listing=listing, barang_dibeli=False).order_by('-date')
        return queryset

class TransactionUpdate(generics.UpdateAPIView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

class TransactionListUser(generics.ListAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        listing_id = self.kwargs['listing']
        listing = Listing.objects.get(id=listing_id)
        queryset = Transaction.objects.filter(listing=listing, barang_dibeli=True).order_by('-date')
        return queryset

class TransactionUser(generics.ListAPIView):
    serializer_class = TransactionSerializer
    def get_queryset(self):
        customer_id = self.kwargs['customer']
        customer = Customer.objects.get(id=customer_id)
        queryset = Transaction.objects.filter(customer=customer, barang_dibeli=True).order_by('-date')
        return queryset
    
class TransactionCreate(generics.CreateAPIView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

class TransactionDetail(generics.RetrieveAPIView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

class TransactionDelete(generics.DestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class ReviewCreate(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

class ReviewList(generics.ListAPIView):
    serializer_class = ReviewSerializer
    def get_queryset(self):
        listing_id = self.kwargs['listing']
        listing = Listing.objects.get(id=listing_id)
        queryset = Review.objects.filter(listing=listing).order_by('-create_at')
        return queryset
