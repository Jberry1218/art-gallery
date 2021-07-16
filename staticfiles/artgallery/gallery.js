document.addEventListener("DOMContentLoaded", function() {

    // Add eventlisteners to filter
    document.querySelector(".dropdown-button").addEventListener("click", ShowDropdown);

    // Add eventlisteners to post, unpost, edit, and delete buttons
    document.querySelectorAll('.gallery-button-post').forEach(item => {item.addEventListener("click", Post)});
    document.querySelectorAll('.gallery-button-unpost').forEach(item => {item.addEventListener("click", Unpost)});
    document.querySelectorAll('.gallery-button-edit').forEach(item => {item.addEventListener("click", Edit)});
    document.querySelectorAll('.gallery-button-delete').forEach(item => {item.addEventListener("click", Delete)});

})

function ShowDropdown() {

    dropdownContent = document.querySelector(".dropdown-content");
    dropdown1 = document.querySelector("#dropdown-option-1");
    dropdown2 = document.querySelector("#dropdown-option-2");
    dropdown3 = document.querySelector("#dropdown-option-3");
    dropdown4 = document.querySelector("#dropdown-option-4");
    
    if (dropdownContent.style.display === "inline-block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "inline-block";
        dropdown1.style.animationPlayState = "running";
        dropdown2.style.animationPlayState = "running";
        dropdown3.style.animationPlayState = "running";
        dropdown4.style.animationPlayState = "running";
    }

}

function Post() {

    imageId = this.value;

    // Make the image public and update buttons
    fetch("/postimage", {
        method: "POST",
        body: JSON.stringify({
            imageId: imageId
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log(result);

        // Get current url
        let currentUrl = window.location.href.toString();

        // Pull filter out of url
        let filter = currentUrl.substr(currentUrl.lastIndexOf('/') + 1);

        // If filtering on private, then hide image; else, update buttons
        if (filter === "private") {
            document.querySelector(`#ImageDiv${imageId}`).style.display = "none";
        } else {

            // Clear post, edit, and delete buttons
            document.querySelector(`#ImageButtons${imageId}`).innerHTML = "";

            // Create unpost button
            let unpostButton = document.createElement("button");
            unpostButton.innerHTML = "Unpost";
            unpostButton.value = `${imageId}`;
            unpostButton.className = "gallery-button-unpost";
            unpostButton.id = `Unpost${imageId}`;
            unpostButton.addEventListener("click", Unpost);
            document.querySelector(`#ImageButtons${imageId}`).append(unpostButton);
        }
    })
    .catch(error => {
        console.log(error);
    });
    return false;
}

function Unpost() {

    confirm("Are you sure you want to unpost this image? This will reset all likes the image has received.");

    imageId = this.value;

    // Make the image private and update buttons
    fetch("/unpostimage", {
        method: "POST",
        body: JSON.stringify({
            imageId: imageId
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log(result);

        // Get current url
        let currentUrl = window.location.href.toString();

        // Pull filter out of url
        let filter = currentUrl.substr(currentUrl.lastIndexOf('/') + 1);

        // If filtering on private, then hide image; else, update buttons and like count
        if (filter === "public") {
            document.querySelector(`#ImageDiv${imageId}`).style.display = "none";
        } else {

            // Clear unpost button
            document.querySelector(`#ImageButtons${imageId}`).innerHTML = "";

            // Create post button
            let postButton = document.createElement("button");
            postButton.innerHTML = "Post";
            postButton.value = `${imageId}`;
            postButton.className = "gallery-button-post";
            postButton.id = `Post${imageId}`;
            postButton.addEventListener("click", Post);
            document.querySelector(`#ImageButtons${imageId}`).append(postButton);

            // Create edit button
            let editButton = document.createElement("button");
            editButton.innerHTML = "Edit";
            editButton.value = `${imageId}`;
            editButton.className = "gallery-button-unpost";
            editButton.id = `Edit${imageId}`;
            editButton.addEventListener("click", Edit);
            document.querySelector(`#ImageButtons${imageId}`).append(editButton);

            // Create delete button
            let deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.value = `${imageId}`;
            deleteButton.className = "gallery-button-delete";
            deleteButton.id = `Delete${imageId}`;
            deleteButton.addEventListener("click", Delete);
            document.querySelector(`#ImageButtons${imageId}`).append(deleteButton);

            // Update like count
            document.querySelector(`#Likes${imageId}`).innerHTML = "<strong>Like count: 0</strong>";
        }

    })
    .catch(error => {
        console.log(error);
    });
    return false;
    
}


function Edit() {

    imageId = this.value;

    window.open(`/create/${imageId}`,"_self")
}


function Delete() {

    confirm("Are you sure you want to delete this image? You will not be able to recover the image.");

    imageId = this.value;

        // Make the image private and update buttons
        fetch("/deleteimage", {
            method: "POST",
            body: JSON.stringify({
                imageId: imageId
            })
        })
        .then(response => response.json())
        .then(result => {  
            console.log(result);

            // Clear image
            document.querySelector(`#ImageDiv${imageId}`).innerHTML = ""; 
        })
        .catch(error => {
            console.log(error);
        });
        return false;   
}