from django.db import models
from datetime import date

# Create your models here.
class Locations(models.Model):
    name = models.CharField(max_length=100)
    death=models.IntegerField(default=0)
    cases=models.IntegerField(default=0)
    casesToday=models.IntegerField(default=0)
    Today=models.DateField(auto_now=True)
    def __str__(self):
        return self.name
class overview(models.Model):
    date=models.CharField(max_length=100)
    death=models.IntegerField(default=0)
    treating=models.IntegerField(default=0)
    cases=models.IntegerField(default=0)
    recovered=models.IntegerField(default=0)
    avgCases7day=models.IntegerField(default=0)
    avgRecovered7day=models.IntegerField(default=0)
    avgDeath7day=models.IntegerField(default=0)
    def __str__(self):
        return self.date
class today(models.Model):
    death=models.IntegerField(default=0)
    treating=models.IntegerField(default=0)
    cases=models.IntegerField(default=0)
    recovered=models.IntegerField(default=0)
    Today=models.DateField(auto_now=True)
    today_type=models.CharField(max_length=100,default="")
    def __str__(self):
        return self.today_type
class total(models.Model):
    death=models.IntegerField(default=0)
    treating=models.IntegerField(default=0)
    cases=models.IntegerField(default=0)
    recovered=models.IntegerField(default=0)
    Today=models.DateField(auto_now=True)
    total_type=models.CharField(max_length=100,default="")
    def __str__(self):
        return self.total_type