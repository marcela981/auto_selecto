# Generated by Django 4.2.1 on 2023-06-30 05:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_remove_staffmember_company_position_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='staffmember',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
