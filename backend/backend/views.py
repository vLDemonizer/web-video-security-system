import base64
import datetime
import os
import subprocess
import shlex

from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.views.generic.list import ListView

from moviepy.editor import VideoFileClip, concatenate_videoclips
from rest_framework.viewsets import ModelViewSet

from . import forms
from system import models, serializers



class IndexView(LoginRequiredMixin, ListView):
    model = models.Node
    template_name = 'base.html'
    login_url = reverse_lazy('backend-log-in')


class NodeViewSet(LoginRequiredMixin, ModelViewSet):
    lookup_field = 'identifier'
    queryset = models.Node.objects.all()
    serializer_class = serializers.NodeSerializer
    login_url = reverse_lazy('backend-log-in')

class CreateNodeView(LoginRequiredMixin,CreateView):
    model = models.Node
    template_name = 'dashboard/create-node.html'
    success_url = reverse_lazy('index')
    login_url = reverse_lazy('backend-log-in')
    fields = ['identifier', 'description']


class GetNodeCameraView(LoginRequiredMixin, ListView):
    #login_url = reverse_lazy('backend-log-in')
    model = models.Camera
    template_name = 'dashboard/node-camera.html'
    queryset = None

    def get_queryset(self):
        return models.Camera.objects.filter(node=self.kwargs['identifier'])


class CameraVideoView(LoginRequiredMixin, ListView):
    model = models.Day
    template_name = 'dashboard/video-camera.html'
    queryset = None

    def get_queryset(self):
        return models.Day.objects.filter(camera=self.kwargs['identifier'])

@login_required
def getNode(request):
    identifier = request.POST.get('identifier')
    print(identifier)
    node = get_object_or_404(models.Node, identifier=identifier)
    return JsonResponse({identifier: node.identifier})

@login_required
def handleVideoFeed(request):
    video_file = request.FILES.get('video')
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

def backend_login(request):
    print(request.method)
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            return redirect('log-out')

    return render(request, 'registration/login.html')

def front_login(request):
    username = request.POST.get('username')
    password = request.POST.get('pass')
    response = False

    user = User.objects.all().filter(username=username)
    

    if len(user) > 0 and username == user[0].username and user[0].check_password(password):
        response = True
    
    return JsonResponse({'login': response})

@login_required  
def signup(request):
    if request.method == 'POST':
        form = forms.SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            return redirect('index')
    else:
        form = forms.SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})