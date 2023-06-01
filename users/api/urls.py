from django.urls import path
from users.api import views as users_api_views

urlpatterns=[
    path('signup/customer/', users_api_views.CustomerSignupView.as_view()),
    path('signup/owner/', users_api_views.OwnerSignupView.as_view()),
    path('login/', users_api_views.UserLoginView.as_view(), name='auth-token'),
    path('logout/', users_api_views.LogoutView.as_view(), name='logout-view'),
    path('customer/dashboard', users_api_views.CustomerOnlyView.as_view(), name='customer-dashboard'),
    path('owner/dashboard', users_api_views.OwnerOnlyView.as_view(), name='owner-dashboard'),
    path('profiles/', users_api_views.UserList.as_view()),
    path('profiles/owner/', users_api_views.OwnerList.as_view()),
    path('profiles/customer/', users_api_views.CustomerList.as_view()),
    path('profiles/owner/<int:owner>/', users_api_views.OwnerDetail.as_view()),
    path('profiles/owner/<int:owner>/update/', users_api_views.OwnerUpdate.as_view()),
    path('profiles/customer/<int:user>/update/', users_api_views.CustomerUpdate.as_view()),
    path('profiles/customer/<int:user>/', users_api_views.CustomerDetail.as_view()),
    path('changepassword/', users_api_views.UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', users_api_views.SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', users_api_views.UserPasswordResetView.as_view(), name='reset-password'),
]