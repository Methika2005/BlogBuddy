// ----------- User Register / Login / Blog Logic -----------
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const blogForm = document.getElementById("blogForm");

    const logoutBtn = document.getElementById("logoutBtn");
    const profileMenu = document.querySelector(".profile-menu");
    const loginBtn = document.querySelector("#loginLink");
    const registerBtn = document.querySelector("#registerLink");
    const createPostSection = document.getElementById("createPostSection");
    const loginWarning = document.createElement("p");
    loginWarning.style.color = "red";
    loginWarning.style.display = "none";
    loginWarning.innerText = "Please login to create a post.";
    if (createPostSection) createPostSection.appendChild(loginWarning);

    // -------- Register User --------
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("regUsername").value.trim();
            const displayName = document.getElementById("regDisplayName").value.trim();
            const password = document.getElementById("regPassword").value;

            if (localStorage.getItem(username)) {
                alert("User already exists! Please login.");
                return;
            }

            localStorage.setItem(
                username,
                JSON.stringify({ password, displayName })
            );
            alert("Registration successful! You can now login.");
            document.getElementById("registerModal").style.display = "none";
        });
    }

    // -------- Login User --------
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value;

            const storedUser = JSON.parse(localStorage.getItem(username));
            if (storedUser && storedUser.password === password) {
                localStorage.setItem("currentUser", username);
                alert(`Hi, ${storedUser.displayName}! Welcome back 👋`);
                updateUI();

                document.getElementById("loginModal").style.display = "none";
            } else {
                alert("Invalid credentials!");
            }
        });
    }

    // -------- Update UI Based on Login State --------
    function updateUI() {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const storedUser = JSON.parse(localStorage.getItem(currentUser));
            if (loginBtn) loginBtn.style.display = "none";
            if (registerBtn) registerBtn.style.display = "none";
            if (profileMenu) profileMenu.style.display = "flex";

            // Set profile icon tooltip
            const profileIcon = document.getElementById("profileIcon");
            if (profileIcon && storedUser) {
                profileIcon.title = storedUser.displayName;
            }

            // Enable blog form
            if (blogForm) blogForm.querySelector("button").disabled = false;
            if (loginWarning) loginWarning.style.display = "none";
        } else {
            if (loginBtn) loginBtn.style.display = "inline-block";
            if (registerBtn) registerBtn.style.display = "inline-block";
            if (profileMenu) profileMenu.style.display = "none";

            if (blogForm) blogForm.querySelector("button").disabled = true;
            if (loginWarning) loginWarning.style.display = "block";
        }
    }

    // Initialize UI
    updateUI();

    // -------- Logout --------
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            updateUI();
            window.location.href = "index.html";
        });
    }

    // -------- Blog Page --------
    if (blogForm) {
        blogForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentUser = localStorage.getItem("currentUser");

            // Check login only when user tries to post
            if (!currentUser) {
                alert("You need to register/login to publish a post.");
                document.getElementById("loginModal").style.display = "flex"; // open modal
                return;
            }

            const title = document.getElementById("title").value.trim();
            const content = document.getElementById("content").value.trim();
            const storedUser = JSON.parse(localStorage.getItem(currentUser));
            const author = storedUser ? storedUser.displayName : currentUser;

            const post = { title, content, author, date: new Date() };

            let posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts.push(post);
            localStorage.setItem("posts", JSON.stringify(posts));

            // Append post to feed
            const postsList = document.getElementById("postsList");
            if (postsList) {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                postDiv.innerHTML = `<h3>${title}</h3><p>${content}</p><small>by ${author} | ${new Date(post.date).toLocaleString()}</small>`;
                postsList.prepend(postDiv);
            }

            alert("Post published!");
            blogForm.reset();
        });
    }

    // -------- Load Existing Posts on Page Load --------
    const postsList = document.getElementById("postsList");
    if (postsList) {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts.reverse().forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";
            postDiv.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p><small>by ${post.author} | ${new Date(post.date).toLocaleString()}</small>`;
            postsList.appendChild(postDiv);
        });
    }
});
