from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, username, tc, password=None, password2=None):
        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not email:
            raise ValueError('User must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,

        )

        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user_customer(self, email, username, tc, password=None, password2=None):
        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not email:
            raise ValueError('User must have an email address')

        user = self.create_user(
            email,
            password=password,
            username=username,
            tc=tc,
        )

        user.set_password(password)
        user.is_customer = True
        user.save(using=self._db)
        Customer.objects.create(user=user)
        return user
    
    def create_user_owner(self, email, username, tc, password=None, password2=None):
        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not email:
            raise ValueError('User must have an email address')

        user = self.create_user(
            email,
            password=password,
            username=username,
            tc=tc,
        )

        user.set_password(password)
        user.is_owner = True
        user.save(using=self._db)
        Owner.objects.create(user=user)
        return user
    def create_superuser(self, email, username, tc, password=None):
        """
        Creates and saves a superuser with the given email, name, tc and password.
        """
        user = self.create_user(
            email,
            password=password,
            username=username,
            tc=tc,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255)
    tc = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=False)
    is_owner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'tc']

    def __str__(self):
        return self.email

class Customer(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer')
    full_name = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    date_of_birth = models.DateField(max_length=200, null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/%Y/%m/%d/', null=True, blank=True)

    def __str__(self):
        return self.user.username

class Owner(models.Model):
    user = models.OneToOneField(User, related_name='owner', on_delete=models.CASCADE)
    agency_name = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=25, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/%Y/%m/%d/', null=True, blank=True)

    def __str__(self):
        return self.user.username
