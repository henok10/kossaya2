from django.core.files import File
from io import BytesIO
import PIL
from random import choices
from django.contrib.gis.db import models
from django.utils import timezone
from django.contrib.gis.geos import Point
from django.contrib.auth import get_user_model
from users.models import Customer, Owner
User = get_user_model()


def compress(picture):
    if picture:
        pic = PIL.Image.open(picture)
        buf = BytesIO()
        pic.save(buf, 'JPEG', quality=35)
        new_pic = File(buf, name=picture.name)
        return new_pic
    else:
        return None


class Listing(models.Model):
    owner = models.ForeignKey(
        Owner, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    borough = models.CharField(max_length=50, blank=True, null=True)
    room_size = models.CharField(max_length=150, blank=True, null=True)
    choices_listing_type = (
        ('Rumah Kos', 'Rumah Kos'),
    )
    listing_type = models.CharField(
        max_length=20, choices=choices_listing_type)
    choices_property_status = (
        ('Rental', 'Rental'),
    )
    property_status = models.CharField(
        max_length=20, blank=True, null=True, choices=choices_property_status)
    price_per_day = models.DecimalField(max_digits=50, decimal_places=0, blank=True, null=True)
    price_per_month = models.DecimalField(max_digits=50, decimal_places=0, blank=True, null=True)
    price_per_year = models.DecimalField(max_digits=50, decimal_places=0, blank=True, null=True)
    rooms = models.IntegerField(blank=True, null=True)
    furnished = models.BooleanField(default=False)
    pool = models.BooleanField(default=False)
    elevator = models.BooleanField(default=False)
    cctv = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    date_posted = models.DateTimeField(default=timezone.now)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    picture1 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/", max_length=455)
    picture2 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/", max_length=455)
    picture3 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/", max_length=455)
    picture4 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/", max_length=455)
    picture5 = models.ImageField(
        blank=True, null=True, upload_to="pictures/%Y/%m/%d/", max_length=455)

       # tambahan atribut available_rooms
    @property
    def available_rooms(self):
        transactions = self.transactions.filter(barang_dibeli=True)
        num_items_bought = transactions.count()
        return self.rooms - num_items_bought

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        new_picture1 = compress(self.picture1)
        self.picture1 = new_picture1
        new_picture2 = compress(self.picture2)
        self.picture2 = new_picture2
        new_picture3 = compress(self.picture3)
        self.picture3 = new_picture3
        new_picture4 = compress(self.picture4)
        self.picture4 = new_picture4
        new_picture5 = compress(self.picture5)
        self.picture5 = new_picture5
        super().save(*args, **kwargs)


class Poi(models.Model):
    name = models.CharField(max_length=120, blank=True, null=True)
    choices_type = (
        ('University', 'University'),
        ('Hospital', 'Hospital'),
        ('Stadium', 'Stadium'),
    )
    type = models.CharField(max_length=50, choices=choices_type)
    location = models.PointField(srid=4326, blank=True, null=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, blank=True, null=True, related_name='transactions')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)
    buktiTransfer = models.ImageField(blank=True, null=True, upload_to="bukti/%Y/%m/%d/")
    fullName = models.CharField(max_length=20, null=True, blank=True)
    phoneNumber = models.CharField(max_length=20, null=True, blank=True)
    choices_rental_frequency = (
        ('Year', 'Year'),
        ('Month', 'Month'),
        ('Day', 'Day'),
    )
    rentalFrequency = models.CharField(
        max_length=20, blank=True, null=True, choices=choices_rental_frequency)
    date = models.DateTimeField(default=timezone.now)
    barang_dipesan = models.BooleanField(default=False)
    barang_dibeli = models.BooleanField(default=False)

    def __str__(self):
        return self.fullName

class Review(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='review')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    comment = models.TextField(max_length=500)
    rate = models.IntegerField(default=0)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.listing.title


