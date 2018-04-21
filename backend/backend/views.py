import base64
import datetime
import os
import subprocess
import shlex

from django.conf import settings
from django.http import JsonResponse
from django.views.generic import TemplateView

from moviepy.editor import VideoFileClip, concatenate_videoclips


class IndexView(TemplateView):
    template_name = 'index.html'


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

    command = shlex.split(
        "ffmpeg -fflags +genpts -i {0} -r 24 {1}".format(file_webm, file_new_mp4)
    )
    output = subprocess.check_output(command, stderr=subprocess.STDOUT)
    print(output)
    
    if os.path.exists(existing_file):
        existing_video = VideoFileClip(existing_file)
        new_video = VideoFileClip(file_new_mp4)
        concatenated = concatenate_videoclips([existing_video, new_video])
        concatenated.write_videofile(existing_file)
    command = shlex.split("rm -r {0}".format(file_webm))
    output = subprocess.check_output(command, stderr=subprocess.STDOUT)
    print(output)
    command = shlex.split("rm -r {0}".format(file_new_mp4))
    output = subprocess.check_output(command, stderr=subprocess.STDOUT)
    print(output)
    
    return JsonResponse({'foo': video_id})
