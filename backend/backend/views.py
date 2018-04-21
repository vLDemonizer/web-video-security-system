import base64
import datetime
import os
import subprocess
import shlex

from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.generic import TemplateView

from moviepy.editor import VideoFileClip, concatenate_videoclips


class IndexView(TemplateView):
    template_name = 'index.html'


def handleVideoFeed(request):
    video_file = request.FILES.get('video')
    video_id = request.POST.get('videoId')
    node_id = request.POST.get('nodeId')
    date = datetime.date.today()
    path = '{0}/media/{1}/{2}'.format(settings.BASE_DIR, node_id, video_id)
    file = '{0}/{1}'.format(path, date)
    file_mp4 = file + '.mp4'
    file_raw = file + 'raw.mp4'
    file_h264 = file + '.h264'


    if not os.path.exists(path):
        os.makedirs(path)
    
    with open(file_h264, 'wb+') as video:
        for chunk in video_file.chunks():
            video.write(chunk)
    command = shlex.split("MP4Box -add {0} {1}".format(file_h264, file_raw))
    output = subprocess.check_output(command, stderr=subprocess.STDOUT)
    print(output)
    
    if os.path.exists(file_mp4):
        existing_video = VideoFileClip(file_mp4)
        raw_video = VideoFileClip(file_raw)
        new_video = concatenate_videoclips([existing_video, raw_video])
        new_video.write_videofile(file_mp4)
    
    return JsonResponse({'foo': video_id})

def login(request):
    username = request.POST.get('username')
    password = request.POST.get('pass')
    print(username + ' ' + password)