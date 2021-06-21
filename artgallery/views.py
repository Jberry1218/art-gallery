import json
import datetime
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse, resolve
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import User, Image, Like


def loginView(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "artgallery/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "artgallery/login.html")


def logoutView(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"].capitalize()
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "artgallery/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "artgallery/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "artgallery/register.html")


@csrf_exempt
def index(request, filterView=""):

    user = request.user
    
    # Return images based on filter
    if filterView == "posted":
        images = Image.objects.filter(public=True).order_by("-lastPosted")
    elif filterView == "user":
        images = Image.objects.filter(public=True).order_by("user__username")
    elif filterView == "likes":
        images = Image.objects.filter(public=True).order_by("-likes")
    else:
        images = Image.objects.filter(public=True).order_by("title")

    # If user logged in, check whether the user has liked the images
    if user.is_authenticated:
        loggedIn = True
        for image in images:
            try:
                Like.objects.get(image=image.id, user=user)
                image.userLike = True
            except:
                image.userLike = False
    else:
        loggedIn = False

    # Render html
    content = {
        "loggedIn": loggedIn,
        "images": images
    }
    return render(request, "artgallery/index.html", content)


@csrf_exempt
@login_required
def create(request, imageId=""):

    if imageId == "":
        return render(request, "artgallery/create.html")
    else:
        image = Image.objects.get(id=imageId)
        context = {"image": image}
    return render(request, "artgallery/create.html", context)


@csrf_exempt
@login_required
def gallery(request, username, filterView=""):

    # Viewed user's id
    user = User.objects.get(username=username)

    # Return images based on filter
    if filterView == "public":
        images = Image.objects.filter(user=user, public=True).order_by("-lastEdited")
    elif filterView == "private":
        images = Image.objects.filter(user=user, public=False)
    elif filterView == "last-edited":
        images = Image.objects.filter(user=user).order_by("-lastEdited")
    else:
        images = Image.objects.filter(user=user).order_by("title")

    if request.user == user:
        ownContent = True
    else:
        ownContent = False

    # Render html
    content = {
        "username": username,
        "images": images,
        "ownContent": ownContent
    }
    return render(request, "artgallery/gallery.html", content)


@csrf_exempt
@login_required
def saveImage(request):
    if request.method == "POST":

        # Get image details
        data = json.loads(request.body)
        canvas = data.get("image", "")
        title = data.get("title", "").capitalize()
        imageId = data.get("imageId", "")
        user = request.user
    
        # Save image
        if imageId == "":
            image = Image(
                image=canvas,
                title=title,
                user=user
            )
            image.save()
        else:
            image = Image.objects.get(id=int(imageId))
            image.image = canvas
            image.title = title
            image.lastEdited = datetime.datetime.now()
            image.save()

        # Go to user's gallery
        return JsonResponse({"username": user.username}, status=201)

    else: 
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def postImage(request):
    if request.method == "POST":

        # Get image details
        data = json.loads(request.body)
        imageId = int(data.get("imageId", ""))
    
        # Make image public
        image = Image.objects.get(id=imageId)
        image.public = True
        image.lastPosted = datetime.datetime.now()
        image.save()

        return JsonResponse({"message": "Post succesful."}, status=201)

    else: 
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def unpostImage(request):
    if request.method == "POST":

        # Get image details
        data = json.loads(request.body)
        imageId = int(data.get("imageId", ""))
    
        # Make image private
        image = Image.objects.get(id=imageId)
        image.public = False
        image.likes = 0
        image.save()

        # Delete images likes
        likes = Like.objects.filter(image=image)
        likes.delete()

        return JsonResponse({"message": "Unpost succesful."}, status=201)

    else: 
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def deleteImage(request):
    if request.method == "POST":

        # Get image details
        data = json.loads(request.body)
        imageId = int(data.get("imageId", ""))
    
        # Delete image
        image = Image.objects.get(id=imageId)
        image.delete()

        return JsonResponse({"message": "Delete succesful."}, status=201)

    else: 
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def likeImage(request):
    if request.method == "POST":

        # Get image details
        data = json.loads(request.body)
        imageId = int(data.get("imageId", ""))
        user = request.user
    
        # Add like
        like = Like(
                image=Image.objects.get(id=imageId),
                user=user
            )
        like.save()

        # Update image's like count
        image = Image.objects.get(id=imageId)
        image.likes = image.likes + 1
        likeCount = image.likes
        image.save()

        return JsonResponse({"message": "Like successful.", "likeCount": likeCount}, status=201)

    else: 
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
@login_required
def unlikeImage(request):
    if request.method == "POST":

        # Get image details
        data = json.loads(request.body)
        imageId = int(data.get("imageId", ""))
        user = request.user
    
        # Remove like
        like = Like.objects.get(
                image=Image.objects.get(id=imageId),
                user=user
            )
        like.delete()

        # Update image's like count
        image = Image.objects.get(id=imageId)
        image.likes = image.likes - 1
        likeCount = image.likes
        image.save()

        return JsonResponse({"message": "Unlike successful.", "likeCount": likeCount}, status=201)

    else: 
        return HttpResponseRedirect(reverse("index"))