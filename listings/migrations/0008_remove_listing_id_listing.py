# Generated by Django 4.1.3 on 2023-02-07 09:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0007_listing_id_listing'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='id_listing',
        ),
    ]
