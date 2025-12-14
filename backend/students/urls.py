from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, ExamRecordViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'exam-records', ExamRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]