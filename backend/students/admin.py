from django.contrib import admin
from .models import Student, ExamRecord

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'first_name', 'last_name', 'email', 'class_name', 'date_of_birth')
    search_fields = ('student_id', 'first_name', 'last_name', 'email')
    list_filter = ('class_name',)

@admin.register(ExamRecord)
class ExamRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'term', 'marks', 'max_marks', 'exam_date')
    list_filter = ('subject', 'term', 'exam_date')
    search_fields = ('student__student_id', 'student__first_name', 'student__last_name', 'subject')