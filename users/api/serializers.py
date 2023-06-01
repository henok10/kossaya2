from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings

from users.models import User, Customer, Owner
from listings.models import Listing
from listings.api.serializers import ListingSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError

from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes

from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    is_customer = serializers.BooleanField(default=False)
    is_owner = serializers.BooleanField(default=False)
    class Meta:
        model = User
        fields = ['email', 'is_customer', 'is_owner']

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    is_customer = serializers.BooleanField(default=False)
    is_owner = serializers.BooleanField(default=False)
    owner_id = serializers.SerializerMethodField()
    customer_id = serializers.SerializerMethodField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(email=email, password=password)
            if user:
                attrs['user'] = user
                attrs['is_customer'] = user.is_customer
                attrs['is_owner'] = user.is_owner
                attrs['user_id'] = user.pk
            else:
                raise serializers.ValidationError('Invalid email or password')
        else:
            raise serializers.ValidationError('Email and password are required')

        return attrs
    
    def get_owner_id(self, attrs):
        user = attrs.get('user')
        if user.is_owner:
            return user.owner.pk
        return None

    def get_customer_id(self, attrs):
        user = attrs.get('user')
        if user.is_customer:
            return user.customer.pk
        return None


class CustomerSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'tc']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Validating Password and Confirm Password while Registration
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        return attrs

    def create(self, validate_data):
        return User.objects.create_user_customer(**validate_data)

class OwnerSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'tc']
        extra_kwargs = {
            'password': {'write_only': True}
        }

     # Validating Password and Confirm Password while Registration
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        return attrs

    def create(self, validate_data):
        return User.objects.create_user_owner(**validate_data)

class OwnerSerializer(serializers.ModelSerializer):
    user_listings = serializers.SerializerMethodField()

    def get_user_listings(self, obj):
        query = Listing.objects.filter(owner=obj)
        listings_serialized = ListingSerializer(query, many=True)
        return listings_serialized.data

    class Meta:
        model = Owner
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = Customer
        fields = '__all__'



class UserChangePasswordSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    user = self.context.get('user')
    if password != password2:
      raise serializers.ValidationError("Password and Confirm Password doesn't match")
    user.set_password(password)
    user.save()
    return attrs

from django.core.mail import send_mail
from django.conf import settings

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            link = f'http://localhost:3000/api/user/reset/{uid}/{token}'
            body = f'Click the following link to reset your password: {link}'
            recipient_email = user.email

            send_mail(
                'Reset Your Password',
                body,
                settings.EMAIL_HOST_USER,
                [recipient_email],
                fail_silently=False,
            )

            return attrs
        else:
            raise serializers.ValidationError('You are not a registered user')


class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)

    class Meta:
        fields = ('password', 'password2')

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError("Password and Confirm Password don't match")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not Valid or Expired')
            user.set_password(password)
            user.save()
            return attrs
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError('Token is not Valid or Expired')