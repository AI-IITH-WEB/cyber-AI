document.addEventListener("DOMContentLoaded", function () {
    fetch("nav.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            updateNavLinks(); 
            hideApplyButton();
        })
        .catch(error => console.error("Error loading header:", error));

        fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});

function updateNavLinks() {
    const links = document.querySelectorAll(".nav-links a");
    links.forEach(link => {
        if (!link.href.includes("index.html") && window.location.pathname.includes("index.html")) {
            link.href = link.href.replace("index.html#", "#");
        }
    });
}

function hideApplyButton() {
  if (
    window.location.pathname.includes("register.html") ||
    window.location.pathname.includes("thankyou.html") ||
    window.location.pathname.includes("thankyou-enroll.html")
  ) {
    setTimeout(() => {
      const applyButton = document.querySelector(".contact-btn");
      if (applyButton) {
        applyButton.style.visibility = "hidden";
      }
    }, 200);
  }
}
