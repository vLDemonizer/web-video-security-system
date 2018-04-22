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
from django.shortcuts import render, redirect
from django.views.generic import TemplateView

from moviepy.editor import VideoFileClip, concatenate_videoclips
from rest_framework.viewsets import ModelViewSet

from system import models, serializers


class IndexView(TemplateView):
    template_name = 'base.html'


class NodeViewSet(ModelViewSet):
    lookup_field = 'identifier'
    queryset = models.Node.objects.all()
    serializer_class = serializers.NodeSerializer()


def handleVideoFeed(request):
    video_file = request.FILES.get('video')
    print(video_file)
    video_id = request.POST.get('videoId')
    node_id = request.POST.get('nodeId')
    date = datetime.date.today()
    path = '{0}/media/{1}/{2}'.format(settings.BASE_DIR, node_id, video_id)
    file = '{0}/{1}'.format(path, date)
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
    
    return JsonResponse({'foo': video_id})

def login(request):
    username = request.POST.get('username')
    password = request.POST.get('pass')
    response = False

    user = User.objects.all().filter(username=username)
    

    if len(user) > 0 and username == user[0].username and user[0].check_password(password):
        response = True
    
    return JsonResponse({'login': response})
