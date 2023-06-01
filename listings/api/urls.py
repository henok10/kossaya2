from django.urls import path
from listings.api import views as listings_api_views

urlpatterns = [
    path('listings/', listings_api_views.ListingList.as_view()),
    path('listings/create/', listings_api_views.ListingCreate.as_view()),
    path('listings/<int:pk>/', listings_api_views.ListingDetail.as_view()),
    path('listings/<int:owner>/list', listings_api_views.ListingUserList.as_view()),
    path('listings/<int:pk>/delete/',
         listings_api_views.ListingDelete.as_view()),
    path('listings/<int:pk>/update/',
         listings_api_views.ListingUpdate.as_view()),
    path('transaction/<int:listing>/list', listings_api_views.TransactionList.as_view()),
    path('transaction/<int:customer>/listu', listings_api_views.TransactionList.as_view()),
    path('transaction/<int:listing>/user', listings_api_views.TransactionListUser.as_view()),
    path('transaction/<int:customer>/userdetail', listings_api_views.TransactionUser.as_view()),
    path('transaction/<int:pk>/update', listings_api_views.TransactionUpdate.as_view()),
    path('transaction/create', listings_api_views.TransactionCreate.as_view()),
    path('transaction/<int:customer>/detail', listings_api_views.TransactionDetail.as_view()), 
    path('transaction/<int:pk>/delete/',
         listings_api_views.TransactionDelete.as_view()),
     
     path('review/create', listings_api_views.ReviewCreate.as_view()),
     path('review/<int:listing>/', listings_api_views.ReviewList.as_view()),    
]