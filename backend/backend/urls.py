"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import login, logout
from django.urls import path

from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r'nodes', views.NodeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.IndexView.as_view(), name='index'),
    path('video-stream/', views.handleVideoFeed, name='video-feed'),
    path('get-node/', views.getNode, name='get-node'),
    path('get-cameras/<identifier>/', views.CameraApiView.as_view(), name='api-cameras'),
    path('backend-log-in', views.backend_login, name='backend-log-in'),
    path('log-in/', views.front_login, name='log-in'),
    path('sign-up/', views.signup, name='sign-up'),
    path('log-out/', logout, name='log-out'),
    path('create-node/', views.CreateNodeView.as_view(), name='create-node'),
    path('node-camera/<identifier>/', views.GetNodeCameraView.as_view(), name='node-camera'),
    path('node-camera/video-camera/<identifier>/', views.CameraVideoView.as_view(), name='video-camera')
] 

urlpatterns += router.urls + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


