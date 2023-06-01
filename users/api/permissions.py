from rest_framework.permissions import BasePermission
# from users.models import Owner, Customer, User

class IsCustomerUser(BasePermission):
    def has_permission(self, request, view):

        return bool(request.user and request.user.is_customer)
        # return bool(request.user.is_customer)

class IsOwnerUser(BasePermission):
    def has_permission(self, request, view):

        return bool(request.user and request.user.is_owner)

        
