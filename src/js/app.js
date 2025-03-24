document.addEventListener("DOMContentLoaded", () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {
            let postContainer = document.getElementById("posts");
            data.slice(0, 5).forEach(post => {
                let postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <small>Post ID: ${post.id}</small>
                `;
                postContainer.appendChild(postElement);
            });
        })
        .catch(() => {
            document.getElementById("posts").innerHTML = "<p>Gagal memuat data. Pastikan koneksi internet tersedia.</p>";
        });
});