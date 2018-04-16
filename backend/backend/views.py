import base64
import datetime
import os

from django.conf import settings
from django.http import JsonResponse
from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'index.html'


def handleVideoFeed(request):
    video_stream = request.FILES.get('video').read()
    video_id = request.POST.get('videoId')
    node_id = request.POST.get('nodeId')
    date = datetime.date.today()
    path = '{0}/media/{1}/{2}'.format(settings.BASE_DIR, node_id, video_id)
    if not os.path.exists(path):
        os.makedirs(path)
    with open('{0}/{1}.webm'.format(path, date), 'w+') as video:
        video.write(str(base64.b64encode(video_stream)))
    
    return JsonResponse({'foo': video_id})
