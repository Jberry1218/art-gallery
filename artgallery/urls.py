from django.urls import path

from . import views

urlpatterns = [

    # URL paths
    path("", views.index, name="index"),
    path("filter/<str:filterView>", views.index, name="index"),
    path("login", views.loginView, name="login"),
    path("logout", views.logoutView, name="logout"),
    path("register", views.register, name="register"),
    path("create", views.create, name="create"),
    path("create/<int:imageId>", views.create, name="create"),
    path("gallery/<str:username>", views.gallery, name="gallery"),
    path("gallery/<str:username>/<str:filterView>", views.gallery, name="gallery"),

    # API paths
    path("saveimage", views.saveImage, name="saveImage"),
    path("postimage", views.postImage, name="postImage"),
    path("unpostimage", views.unpostImage, name="unpostImage"),
    path("deleteimage", views.deleteImage, name="deleteImage"),
    path("likeimage", views.likeImage, name="likeImage"),
    path("unlikeimage", views.unlikeImage, name="unlikeImage")
   
]