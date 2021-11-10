from django.shortcuts import render
from Mapcovid.updateData import udatedata
from icecream import ic
from django.views.generic import TemplateView,View
from .models import Locations
from django.http import JsonResponse
# Create your views here.
# def index(request):
#     return render(request, 'pages/index1.html')
class MainView(TemplateView):
    template_name = 'pages/index1.html'
class MapcovidJsonListView(View):
    def get(self,*args,**kwargs):
        locations =list(Locations.objects.values())
        return JsonResponse(locations,safe=False)
def index1(request):
    if request.method=="GET":
        udatedata()
    return render(request, 'pages/index.html')
