from django.conf import settings
from django.db import models


class Node(models.Model):
    identifier = models.CharField(max_length=64, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.identifier


class Camera(models.Model):
    identifier = models.CharField(max_length=64, unique=True)
    description = models.TextField(blank=True, null=True)
    node = models.ForeignKey(Node, on_delete=None)

    def __str__(self):
        return self.identifier
        

class Day(models.Model):
    name = models.CharField(max_length=32)
    camera = models.ForeignKey(Camera, on_delete=None)

    @property
    def path(self):
        return '{0}/{1}/{2}/{3}.mp4'.format(
            settings.MEDIA_ROOT,
            self.camera.node.identifier,
            self.camera.identifier, 
            self.name
        )
    
    @property
    def url(self):
        return '{0}/{1}/{2}/{3}.mp4'.format(
            settings.MEDIA_URL,
            self.camera.node.identifier,
            self.camera.identifier, 
            self.name
        )