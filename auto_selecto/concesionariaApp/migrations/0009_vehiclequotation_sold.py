# Generated by Django 4.2.1 on 2023-07-03 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('concesionariaApp', '0008_alter_vehiclequotation_vendor'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehiclequotation',
            name='sold',
            field=models.BooleanField(default=False),
        ),
    ]
