from rest_framework import serializers
from .models import Page

class FormSerializers(serializers.ModelSerializer):
    class Meta:

        model = Page
        fields = ["id", "title", "body", "image", "page_date", "created_at", "updated_at"]
