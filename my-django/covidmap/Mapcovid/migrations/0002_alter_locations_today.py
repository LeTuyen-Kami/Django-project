# Generated by Django 3.2.9 on 2021-11-08 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Mapcovid', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='locations',
            name='Today',
            field=models.DateField(auto_now=True),
        ),
    ]