from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Customer, Owner

class Admins(UserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_customer', 'is_owner')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    list_display = ['email', 'username', 'is_customer', 'is_owner',]
    list_filter = ['is_customer', 'is_owner']

admin.site.register(User, Admins)
admin.site.register(Customer)
admin.site.register(Owner)