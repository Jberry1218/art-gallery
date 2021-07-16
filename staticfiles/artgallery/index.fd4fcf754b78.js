document.addEventListener("DOMContentLoaded", function() {

    // Add eventlisteners to filter
    document.querySelector(".dropdown-button").addEventListener("click", ShowDropdown);

    // Add eventlisteners to like and unlike buttons
    document.querySelectorAll('.gallery-button-like').forEach(item => {item.addEventListener("click", Like)});
    document.querySelectorAll('.gallery-button-unlike').forEach(item => {item.addEventListener("click", Unlike)});

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

function Like() {

    imageId = this.value;

    // Make the image public and update buttons
    fetch("/likeimage", {
        method: "POST",
        body: JSON.stringify({
            imageId: imageId
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log(result);

        // Update like count
        document.querySelector(`#LikeCount${imageId}`).innerHTML = `<strong>Like count: ${result.likeCount}</strong>`;
        
        // Clear like button
        document.querySelector(`#ImageButtons${imageId}`).innerHTML = "";

        // Create unlike button
        let unlikeButton = document.createElement("button");
        unlikeButton.innerHTML = "Unlike";
        unlikeButton.value = `${imageId}`;
        unlikeButton.className = "gallery-button-unlike";
        unlikeButton.id = `Unlike${imageId}`;
        unlikeButton.addEventListener("click", Unlike);
        document.querySelector(`#ImageButtons${imageId}`).append(unlikeButton);
        
    })
    .catch(error => {
        console.log(error);
    });
    return false;
}

function Unlike() {

    imageId = this.value;

    // Make the image public and update buttons
    fetch("/unlikeimage", {
        method: "POST",
        body: JSON.stringify({
            imageId: imageId
        })
    })
    .then(response => response.json())
    .then(result => {

        console.log(result);

        // Update like count
        document.querySelector(`#LikeCount${imageId}`).innerHTML = `<strong>Like count: ${result.likeCount}</strong>`;
        
        // Clear unlike button
        document.querySelector(`#ImageButtons${imageId}`).innerHTML = "";

        // Create like button
        let likeButton = document.createElement("button");
        likeButton.innerHTML = "Like";
        likeButton.value = `${imageId}`;
        likeButton.className = "gallery-button-like";
        likeButton.id = `Like${imageId}`;
        likeButton.addEventListener("click", Like);
        document.querySelector(`#ImageButtons${imageId}`).append(likeButton);
        
    })
    .catch(error => {
        console.log(error);
    });
    return false;
}