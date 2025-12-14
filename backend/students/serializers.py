from rest_framework import serializers
from .models import Student, ExamRecord

class StudentSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d', 'iso-8601'])
    
    class Meta:
        model = Student
        fields = '__all__'

class ExamRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.first_name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    exam_date = serializers.DateField(format='%Y-%m-%d', input_formats=['%Y-%m-%d', 'iso-8601'])
    
    class Meta:
        model = ExamRecord
        fields = '__all__'