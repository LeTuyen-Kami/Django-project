from django.urls import path
from Mapcovid.views import MainView, MapcovidJsonListView
from . import views
urlpatterns = [
    path('index/', views.index1, name='chart'),
    path('', MainView.as_view(), name='map'),
    path('mapcovid-json/', MapcovidJsonListView.as_view(),
         name='mapcovid-json-views'),
    path('update_news/', views.update, name='update_news'),
    path('news/', views.news, name='news'),
    path('search_result/', views.search_result, name='search_result'),
]
