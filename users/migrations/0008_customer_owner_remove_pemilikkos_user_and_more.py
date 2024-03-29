# Generated by Django 4.2 on 2023-05-21 07:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_costumer_address_alter_pemilikkos_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(blank=True, max_length=20, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('address', models.CharField(blank=True, max_length=200, null=True)),
                ('date_of_birth', models.DateField(blank=True, max_length=200, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='profile_pictures/%Y/%m/%d/')),
            ],
        ),
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('agency_name', models.CharField(blank=True, max_length=20, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=25, null=True)),
                ('address', models.CharField(blank=True, max_length=200, null=True)),
                ('bio', models.TextField(blank=True, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='profile_pictures/%Y/%m/%d/')),
            ],
        ),
        migrations.RemoveField(
            model_name='pemilikkos',
            name='user',
        ),
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.RenameField(
            model_name='user',
            old_name='is_costumer',
            new_name='is_customer',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='is_pemilikKos',
            new_name='is_owner',
        ),
        migrations.RemoveField(
            model_name='user',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='user',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='last_name',
        ),
        migrations.AddField(
            model_name='user',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='user',
            name='tc',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='updated_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=255),
        ),
        migrations.DeleteModel(
            name='Costumer',
        ),
        migrations.DeleteModel(
            name='PemilikKos',
        ),
        migrations.AddField(
            model_name='owner',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='customer',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='customer', to=settings.AUTH_USER_MODEL),
        ),
    ]
