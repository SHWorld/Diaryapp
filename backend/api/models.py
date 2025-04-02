from django.db import models
from django.contrib.auth.models import User

class Page(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, verbose_name="タイトル")
    body = models.TextField(max_length=2000, verbose_name="本文")
    page_date = models.DateField(verbose_name="日付")
    image = models.ImageField(upload_to="diary_images/", null=True, blank=True, verbose_name="画像")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    def __str__(self):
        return self.title


