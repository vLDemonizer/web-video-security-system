import base64
import datetime
import os
import subprocess
import shlex

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView

from moviepy.editor import VideoFileClip, concatenate_videoclips

from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from system import models, serializers


class IndexView(TemplateView):
    template_name = 'index.html'


class NodeViewSet(ModelViewSet):
    lookup_field = 'identifier'
    queryset = models.Node.objects.all()
    serializer_class = serializers.NodeSerializer


class CameraApiView(APIView):
    renderer_classes = (JSONRenderer,)

    def get(self, request, *args, **kwargs):
        node = models.Node.objects.get(identifier=kwargs['identifier'])
        ser = serializers.CameraSerializer(
            models.Camera.objects.filter(node=node), many=True
        )
        return Response(data=ser.data)
    
    def post(self, request, *args, **kwargs):
        node = models.Node.objects.get(identifier=kwargs['identifier'])
        identifier = request.POST.get('identifier')
        description = request.POST.get('description')
        camera, created = models.Camera.objects.get_or_create(
            identifier=identifier,
            node=node
        )
        print(identifier,description, camera)
        camera.description = description
        camera.save()
        ser = serializers.CameraSerializer(camera)
        return Response(data=ser.data)
 

def getNode(request):
    identifier = request.POST.get('identifier')
    print(identifier)
    node = get_object_or_404(models.Node, identifier=identifier)
    return JsonResponse({identifier: node.identifier})


def handleVideoFeed(request):
    video_file = request.FILES.get('video')
    camera_identifier = request.POST.get('camera')
    camera = models.Camera.objects.get(identifier=camera_identifier)
    date = datetime.date.today()
    day, created = models.Day.objects.get_or_create(name=date, camera=camera)
    print(day.path, day.url)
    path = day.folder_path
    file = day.path
    file_webm = file + '.webm'
    file_new_mp4 = file + '-new.mp4'
    existing_file = file + '.mp4'


    if not os.path.exists(path):
        os.makedirs(path)
    
    with open(file_webm, 'wb+') as video:
        for chunk in video_file.chunks():
            video.write(chunk)

    if os.path.exists(existing_file):
        command = shlex.split(
            "ffmpeg -fflags +genpts -i {0} -r 24 {1}".format(file_webm, file_new_mp4)
        )
        output = subprocess.check_output(command, stderr=subprocess.STDOUT)
        print(output)
        existing_video = VideoFileClip(existing_file)
        new_video = VideoFileClip(file_new_mp4)
        concatenated = concatenate_videoclips([existing_video, new_video])
        concatenated.write_videofile(existing_file)
        command = shlex.split("rm -r {0}".format(file_new_mp4))
        output = subprocess.check_output(command, stderr=subprocess.STDOUT)
        print(output)
    else:
        command = shlex.split(
            "ffmpeg -fflags +genpts -i {0} -r 24 {1}".format(file_webm, existing_file)
        )
        output = subprocess.check_output(command, stderr=subprocess.STDOUT)
        print(output)
    
    command = shlex.split("rm -r {0}".format(file_webm))
    output = subprocess.check_output(command, stderr=subprocess.STDOUT)
    print(output)
    
    return JsonResponse({'foo': True})

def login(request):
    username = request.POST.get('username')
    password = request.POST.get('pass')
    response = False

    user = User.objects.all().filter(username=username)
    

    if len(user) > 0 and username == user[0].username and user[0].check_password(password):
        response = True
    
    return JsonResponse({'login': response})

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})
