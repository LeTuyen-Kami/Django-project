from django.urls import path
from Mapcovid.views import MainView,MapcovidJsonListView
from . import views
urlpatterns = [
    path('index', views.index1, name='chart'),
    path('',MainView.as_view(),name='map'),
    path('mapcovid-json/',MapcovidJsonListView.as_view(),name='mapcovid-json-views'),
]