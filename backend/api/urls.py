from django.urls import path
from .views import DiaryListCreateView, DiaryEditingDestroyView

urlpatterns = [
    path("", DiaryListCreateView.as_view(), name="diary_list_create"),
    path("<int:pk>/", DiaryEditingDestroyView.as_view(), name="diary_editing_destroy")
]