from django.contrib import admin
from .models import Locations, overview, today, total, newss, Covid_huyen, Covid_xa
# Register your models here.


@admin.register(Locations)
class LocationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'death',
                    'cases', 'casesToday', 'Today')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(overview)
class overviewAdmin(admin.ModelAdmin):
    list_display = ('date', 'death', 'treating', 'cases', 'recovered',
                    'avgCases7day', 'avgRecovered7day', 'avgDeath7day')


@admin.register(today)
class todayAdmin(admin.ModelAdmin):
    list_display = ('death', 'treating', 'cases',
                    'recovered', 'Today', 'today_type')


@admin.register(total)
class totalAdmin(admin.ModelAdmin):
    list_display = ('death', 'treating', 'cases',
                    'recovered', 'Today', 'total_type')


@admin.register(newss)
class newsAdmin(admin.ModelAdmin):
    list_display = ('image', 'title', 'description', 'url', 'id')


@admin.register(Covid_huyen)
class Covid_huyenAdmin(admin.ModelAdmin):
    list_display = ('id_huyen', 'name', 'id_tinh', 'death',
                    'cases', 'recovered', 'Today')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Covid_xa)
class Covid_xaAdmin(admin.ModelAdmin):
    list_display = ('id_xa', 'name', 'id_huyen', 'death',
                    'cases', 'recovered', 'Today')
    search_fields = ('name',)
    ordering = ('name',)
