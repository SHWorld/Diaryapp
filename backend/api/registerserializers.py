from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "password", "email")

    def create(self, validated_data):  # ← `def create()` のインデントも修正
        user = User.objects.create_user(  # ← ここを修正
            username=validated_data["username"],
            password=validated_data["password"],  # ← 自動でハッシュ化される
            email=validated_data.get("email", ""),  # ← `.get("email", "")` に修正
        )
        return user
