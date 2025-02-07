document.addEventListener("DOMContentLoaded", function () {
    const postContainer = document.getElementById("postContainer");
    const openModalBtn = document.getElementById("openModalBtn");
    const postModal = document.getElementById("postModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const postBtn = document.getElementById("postBtn");
    const postText = document.getElementById("postText");
    const postImage = document.getElementById("postImage");
    const imagePreview = document.getElementById("imagePreview");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    function loadPosts() {
        postContainer.innerHTML = "";
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}" class="post-image">` : ""}
                <button class="like-btn" data-id="${post.id}">
                    👍 Like (<span id="likes-${post.id}">${post.likes}</span>)
                </button>
            `;
            postContainer.appendChild(postElement);
        });

        document.querySelectorAll(".like-btn").forEach(button => {
            button.addEventListener("click", function () {
                const postId = this.getAttribute("data-id");
                likePost(postId);
            });
        });
    }

    function likePost(postId) {
        const postIndex = posts.findIndex(p => p.id == postId);
        if (postIndex !== -1) {
            posts[postIndex].likes += 1;
            localStorage.setItem("posts", JSON.stringify(posts));
            document.getElementById(`likes-${postId}`).textContent = posts[postIndex].likes;
        }
    }

    openModalBtn.addEventListener("click", () => {
        postModal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => {
        postModal.style.display = "none";
    });

    postBtn.addEventListener("click", () => {
        const newText = postText.value.trim();
        const newImage = imagePreview.style.backgroundImage.slice(5, -2); // Extracts the URL

        if (newText || newImage) {
            const newPost = {
                id: posts.length + 1,
                text: newText,
                image: newImage || null,
                likes: 0
            };
            posts.unshift(newPost);
            localStorage.setItem("posts", JSON.stringify(posts));
            loadPosts();
            postText.value = "";
            imagePreview.style.backgroundImage = "";
            postModal.style.display = "none";
        }
    });

    postImage.addEventListener("change", () => {
        if (postImage.files && postImage.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
            };
            reader.readAsDataURL(postImage.files[0]);
        }
    });

    loadPosts();
});
