from django.contrib.auth.models import User

from . import models

from rest_framework import serializers


class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Node
        fields = '__all__'


class CameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Camera
        fields = '__all__'