from datetime import date
from django.shortcuts import render
from .updateData import update_news, udatedata, addAndUpdateXaHuyentoDatabase
from icecream import ic
from django.views.generic import TemplateView, View
from .models import Locations, total, newss, Covid_huyen
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
    return render(request, 'pages/index.html', {
        'total': (total.objects.filter(total_type='internal').get().cases),
    })


def update(request):
    if request.method == "GET":
        update_news()
        udatedata()
        addAndUpdateXaHuyentoDatabase()
    return HttpResponse("successful")


def news(request):
    if request.method == "GET":
        news_list = newss.objects.all()
        news_list = news_list.order_by('-id')
        paginator = Paginator(news_list, 15)
        page_number = request.GET.get('page')
        news_list_page = paginator.get_page(page_number)
        return render(request, 'pages/news.html', {
            'news_list': news_list_page,
        })
    return render(request, 'pages/news.html')


def search_result(request):
    if request.is_ajax() and request.method == "POST":
        res = None
        query = request.POST.get('query')
        page = request.POST.get('page')
        result = newss.objects.filter(title__icontains=query)
        result = result.order_by('-id')
        if len(result) > 0:
            data = []
            for pos in result:
                item = {
                    'title': pos.title,
                    'description': pos.description,
                    'url': pos.url,
                    'image': pos.image,
                    'id': pos.id,
                }
                data.append(item)
            res = data
        else:
            res = None
        if (query == ''):
            page = int(page)*15
            res = res[page-15:page]
        if (res == None):
            return JsonResponse({'query': res})
        return JsonResponse({'query': res[:15]}, safe=False)
    return JsonResponse({})
