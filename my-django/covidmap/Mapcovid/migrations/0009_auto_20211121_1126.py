# Generated by Django 3.2.9 on 2021-11-21 04:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Mapcovid', '0008_alter_newss_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='locations',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.CreateModel(
            name='Covid_huyen',
            fields=[
                ('id_huyen', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=1000)),
                ('cases', models.IntegerField(default=0)),
                ('death', models.IntegerField(default=0)),
                ('recovered', models.IntegerField(default=0)),
                ('Today', models.DateField(auto_now=True)),
                ('id_tinh', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='id_tinh', to='Mapcovid.locations')),
            ],
        ),
    ]
