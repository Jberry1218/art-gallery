# Generated by Django 3.1.7 on 2021-05-03 23:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('artgallery', '0006_remove_image_lastedited'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.TextField(),
        ),
    ]
