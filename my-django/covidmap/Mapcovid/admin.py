from django.contrib import admin
from .models import Locations, overview,today,total
# Register your models here.
@admin.register(Locations)
class LocationsAdmin(admin.ModelAdmin):
    list_display = ('name','death','cases','casesToday','Today')
@admin.register(overview)
class overviewAdmin(admin.ModelAdmin):
    list_display = ('date','death','treating','cases','recovered','avgCases7day','avgRecovered7day','avgDeath7day')
@admin.register(today)
class todayAdmin(admin.ModelAdmin):
    list_display = ('death','treating','cases','recovered','Today','today_type')
@admin.register(total)
class totalAdmin(admin.ModelAdmin):
    list_display = ('death','treating','cases','recovered','Today','total_type')