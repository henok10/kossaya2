from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from listings.api import views as listings_api_views
from users.api import views as users_api_views
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('api/', include('users.api.urls')),
    path('api/', include('listings.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)