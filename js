const blogForm = document.getElementById("blogForm");
const postsContainer = document.getElementById("postsContainer");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalDate = document.getElementById("modalDate");
const closeModal = document.getElementById("closeModal");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function renderPosts() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = filterCategory.value;

  postsContainer.innerHTML = "";

  posts
    .map((post, i) => ({ ...post, originalIndex: i }))
    .filter(post =>
      post.title.toLowerCase().includes(searchTerm) &&
      (category === "" || post.category === category)
    )
    .reverse()
    .forEach((post) => {
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.innerHTML = `
        <div class="post-header">
          <h3>${post.title}</h3>
          <span class="delete-btn" onclick="deletePost(${post.originalIndex})">&times;</span>
        </div>
        <p>${post.content.slice(0, 100)}...</p>
        <small>${post.date} - <strong>${post.category}</strong></small><br>
        <button onclick="showDetail(${post.originalIndex})">📖 Detay</button>
      `;
      postsContainer.appendChild(postEl);
    });
}

function deletePost(index) {
  const result = confirm("Bu gönderiyi silmek istiyor musun?");
  if (!result) return;

  posts.splice(index, 1);
  savePosts();
  renderPosts();
}

blogForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const content = document.getElementById("content").innerHTML.trim();

  if (!title || !content || !category) return;

  const newPost = {
    title,
    category,
    content,
    date: new Date().toLocaleString("tr-TR")
  };

  posts.push(newPost);
  savePosts();
  renderPosts();

  blogForm.reset();
  document.getElementById("content").innerHTML = "";
});

searchInput.addEventListener("input", renderPosts);
filterCategory.addEventListener("change", renderPosts);

function showDetail(index) {
  const post = posts[index];
  modalTitle.innerText = post.title;
  modalDate.innerText = `${post.date} - ${post.category}`;
  modalContent.innerHTML = post.content;
  modal.classList.remove("hidden");
}

closeModal.onclick = () => {
  modal.classList.add("hidden");
};

window.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

renderPosts();
