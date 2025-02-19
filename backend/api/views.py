from django.shortcuts import render
from rest_framework import generics
from .models import Page
from .form_serializers import FormSerializers


class DiaryListCreateView(generics.ListCreateAPIView):
    queryset = Page.objects.all()
    serializer_class = FormSerializers

class DiaryEditingDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Page.objects.all()
    serializer_class = FormSerializers

