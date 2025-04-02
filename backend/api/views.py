from django.shortcuts import render
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Page
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

from .form_serializers import FormSerializers
from .registerserializers import RegisterSerializer


class DiaryListCreateView(generics.ListCreateAPIView):
    serializer_class = FormSerializers
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Page.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # 🔒 新しい日記の `user` をログインユーザーに設定


class DiaryEditingDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FormSerializers
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Page.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.image:
            instance.image.delete(save=False)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RegisterCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

