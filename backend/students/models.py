from django.db import models

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    class_name = models.CharField(max_length=50)
    enrollment_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"

class ExamRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='exam_records')
    subject = models.CharField(max_length=100)
    term = models.CharField(max_length=20, choices=[
        ('Term1', 'Term 1'),
        ('Term2', 'Term 2'),
        ('Term3', 'Term 3'),
    ])
    marks = models.DecimalField(max_digits=5, decimal_places=2)
    max_marks = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    exam_date = models.DateField()
    
    # REMOVE OR COMMENT OUT THIS ENTIRE Meta class:
    # class Meta:
    #     unique_together = ['student', 'subject', 'term']
    
    def __str__(self):
        return f"{self.student.student_id} - {self.subject} - {self.term}"