from django.db import models
from datetime import date

# Create your models here.


class Locations(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    code = models.IntegerField(default=0)
    death = models.IntegerField(default=0)
    cases = models.IntegerField(default=0)
    casesToday = models.IntegerField(default=0)
    Today = models.DateField(auto_now=True)

    def __int__(self):
        return self.code


class overview(models.Model):
    date = models.CharField(max_length=100)
    death = models.IntegerField(default=0)
    treating = models.IntegerField(default=0)
    cases = models.IntegerField(default=0)
    recovered = models.IntegerField(default=0)
    avgCases7day = models.IntegerField(default=0)
    avgRecovered7day = models.IntegerField(default=0)
    avgDeath7day = models.IntegerField(default=0)

    def __str__(self):
        return self.date


class today(models.Model):
    death = models.IntegerField(default=0)
    treating = models.IntegerField(default=0)
    cases = models.IntegerField(default=0)
    recovered = models.IntegerField(default=0)
    Today = models.DateField(auto_now=True)
    today_type = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.today_type


class total(models.Model):
    death = models.IntegerField(default=0)
    treating = models.IntegerField(default=0)
    cases = models.IntegerField(default=0)
    recovered = models.IntegerField(default=0)
    Today = models.DateField(auto_now=True)
    total_type = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.total_type


class newss(models.Model):
    title = models.TextField()
    description = models.TextField()
    url = models.TextField()
    image = models.TextField()
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.title


class Covid_huyen(models.Model):
    id_huyen = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000)
    id_tinh = models.ForeignKey(
        Locations, on_delete=models.CASCADE, related_name='tinh')
    cases = models.IntegerField(default=0)
    death = models.IntegerField(default=0)
    recovered = models.IntegerField(default=0)
    Today = models.DateField(auto_now=True)

    def __int__(self):
        return self.id_huyen


class Covid_xa(models.Model):
    id_xa = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1000)
    id_huyen = models.ForeignKey(
        Covid_huyen, on_delete=models.CASCADE, related_name='huyen')
    cases = models.IntegerField(default=0)
    death = models.IntegerField(default=0)
    recovered = models.IntegerField(default=0)
    Today = models.DateField(auto_now=True)

    def __int__(self):
        return self.id_xa
