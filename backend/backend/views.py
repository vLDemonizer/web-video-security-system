import base64
import datetime

from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'index.html'


def handleVideoFeed(request):
    video_stream = request.FILES.get('video').read()
    video_id = request.POST.get('videoId')
    node_id = request.POST.get('nodeId')
    print(datetime)
    with open('video_file.webm', 'wb') as video:
        video.write(base64.b64encode(video_stream))

    return 