# Art Gallery
## Description
 Art Gallery is a web application that allows users to create images in a paint environment. Users can then share their creations with other users by posting them and can view and like/unlike the posts of other users. Art Gallery was my capstone project for CS50's Web Programming with Python and JavaScript course.
## How to Use
### Home Page
Both the website logo in the top left of the website and the Art Gallery link will bring the viewer to the list of all public images. On this page users that are logged in are able to like and unlike posts. All viewers can filter the posts on newest, title, user, and like count. Every post contains a link to view that user's public gallery.
### User Galleries
Each user has a user gallery view. Other users can follow the links from the home page to see the public posts of another user. A user can use their own gallery to edit existing images and make images private or public. When an image is taken private, its like count resets.
### Painting Creation
Users that are logged in can create images of their own. There are six paint tools - paint brush, paint bucket, line, rectangle, circle, and eraser. The paint bucket relies on a flood fill algorithm to detect what pixels should be filled. Users also have the option to change the thickness and color of the stroke.
## File Summary
* create.html: HTML for the paint creation page
* gallery.html: HTML for the user gallery pages
* index.html: HTML for home page showing all public posts
* layout.html: HTML layout for all pages with navigation links
* login.html: HTML for login page
* register.html: HTML for register page
* static > images: icon folder for tool icons and webpage icon
* create.js: Javascript for the paint creation page. Controls all canvas drawing
* gallery.js: Javascript for user gallery pages. Controls filter and makes API calls for posting, unposting, etc.
* index.js: Javascript for home page. Controls filter and makes API calls for liking and unliking images
* styles.css: CSS styling sheet
* models.py: Contains Django models for Users, Images, and Likes
* urls.py: Contains URL and API routes
* views.py: Contains all backend calls