from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student, ExamRecord
from .serializers import StudentSerializer, ExamRecordSerializer

# Add this function at the beginning
def api_home(request):
    return JsonResponse({
        "message": "Student Results & Performance Analytics System API",
        "system": "Student Results & Performance Analytics System",
        "version": "1.0",
        "endpoints": {
            "admin": "/admin/",
            "api": {
                "students": "/api/students/",
                "exam_records": "/api/exam-records/",
                "student_exam_records": "/api/students/{id}/exam_records/"
            }
        },
        "features": [
            "Student Profiles - Add, update, delete, view students",
            "Exam Records - Add marks for each student per subject",
            "Update or remove records"
        ],
        "documentation": "Use /api/ endpoints for CRUD operations",
        "frontend": "Angular app running on http://localhost:4200"
    })

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    @action(detail=True, methods=['get'])
    def exam_records(self, request, pk=None):
        student = self.get_object()
        records = ExamRecord.objects.filter(student=student)
        serializer = ExamRecordSerializer(records, many=True)
        return Response(serializer.data)

class ExamRecordViewSet(viewsets.ModelViewSet):
    queryset = ExamRecord.objects.all()
    serializer_class = ExamRecordSerializer