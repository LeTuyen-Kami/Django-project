from django.shortcuts import render
from .updateData import update_news, udatedata
from icecream import ic
from django.views.generic import TemplateView, View
from .models import Locations, total, newss
from django.http import JsonResponse
from django.http import HttpResponse
from django.core.paginator import Paginator
# Create your views here.
# def index(request):
#     return render(request, 'pages/index1.html')


class MainView(TemplateView):
    template_name = 'pages/index1.html'


class MapcovidJsonListView(View):
    def get(self, *args, **kwargs):
        locations = list(Locations.objects.values())
        return JsonResponse(locations, safe=False)


def index1(request):
    if request.method == "GET":
        udatedata()
    return render(request, 'pages/index.html', {
        'total': (total.objects.filter(total_type='internal').get().cases),
    })


def update(request):
    if request.method == "GET":
        update_news()
    return HttpResponse("successful")


def news(request):
    if request.method == "GET":
        news_list = newss.objects.all()
        paginator = Paginator(news_list, 15)
        page_number = request.GET.get('page')
        news_list_page = paginator.get_page(page_number)
        return render(request, 'pages/news.html', {
            'news_list': news_list_page,
        })
    return render(request, 'pages/news.html')
