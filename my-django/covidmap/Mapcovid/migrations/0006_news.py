# Generated by Django 3.2.9 on 2021-11-14 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Mapcovid', '0005_auto_20211108_2025'),
    ]

    operations = [
        migrations.CreateModel(
            name='news',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('url', models.TextField()),
                ('image', models.TextField()),
            ],
        ),
    ]