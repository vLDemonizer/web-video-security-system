from django.db import models


class Node(models.Model):
    identifier = models.CharField(max_length=64, unique=True)


class Camera(models.Model):
    identifier = models.CharField(max_length=64, unique=True)
    node = models.ForeignKey(Node, on_delete=None)