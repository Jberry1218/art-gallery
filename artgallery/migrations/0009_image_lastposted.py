# Generated by Django 3.1.7 on 2021-05-12 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artgallery', '0008_auto_20210505_1950'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='lastPosted',
            field=models.DateTimeField(null=True),
        ),
    ]
