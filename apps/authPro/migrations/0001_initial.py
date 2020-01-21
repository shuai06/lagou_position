# Generated by Django 3.0 on 2020-01-01 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('telephone', models.CharField(max_length=11, unique=True)),
                ('username', models.CharField(max_length=30)),
                ('join_date', models.DateTimeField(auto_now_add=True)),
                ('gender', models.IntegerField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]