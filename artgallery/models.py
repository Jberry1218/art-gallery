from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    pass


class Image(models.Model):
    title = models.TextField()
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    image = models.TextField()
    lastEdited = models.DateTimeField(auto_now_add=True)
    lastPosted = models.DateTimeField(null=True)
    likes = models.IntegerField(default=0)
    public = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} | {self.user.username}"


class Like(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    image = models.ForeignKey("Image", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.image} | {self.user.username}"