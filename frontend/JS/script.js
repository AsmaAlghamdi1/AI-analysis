document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://ai-analysis-4n6p.onrender.com";

  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("header nav a");

  window.onscroll = () => {
    sections.forEach((sec) => {
      const top = window.scrollY;
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
        });

        const activeLink = document.querySelector(
          `header nav a[href*="${id}"]`
        );

        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  };

  if (menuIcon && navbar) {
    menuIcon.onclick = () => {
      menuIcon.classList.toggle("bx-x");
      navbar.classList.toggle("active");
    };
  }

  const start = document.getElementById("start");
  const blurBg = document.getElementById("blurBg");
  const closeBtn = document.getElementById("close-btn");

  if (start && blurBg) {
    start.addEventListener("click", () => {
      blurBg.style.display = "flex";
    });
  }

  if (closeBtn && blurBg) {
    closeBtn.addEventListener("click", () => {
      blurBg.style.display = "none";
    });
  }

  // Contact Form
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullname = document
        .getElementById("full-name")
        ?.value.trim();

      const email = document
        .getElementById("email")
        ?.value.trim();

      const subject = document
        .getElementById("subject")
        ?.value.trim();

      const message = document
        .getElementById("message")
        ?.value.trim();

      if (!fullname || !email || !subject || !message) {
        showAlert("Please fill in all fields.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname,
            email,
            subject,
            message,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          showAlert(data.message || "Submission failed.");
          return;
        }

        showAlert("Your message has been successfully sent.");
        form.reset();
      } catch (error) {
        showAlert("Could not connect to the server.");
      }
    });
  }

  // Analyze Button
  const analyzeBtn = document.getElementById("btn");

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const fileInput = document.querySelector('input[type="file"]');
      const analysisBox = document.querySelector(".analysis-UI");
      const loadingSpinner = document.getElementById("loading-spinner");

      if (!fileInput || !analysisBox) {
        showAlert("Something went wrong. Please refresh the page.");
        return;
      }

      const file = fileInput.files[0];

      if (!file) {
        showAlert("Please select an image.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showAlert("Please upload a valid image file.");
        return;
      }

      const formData = new FormData();

      formData.append("image", file);

      const prompt =
        "Please provide a comprehensive analysis of this UI design from a UX/UI perspective. Evaluate the color scheme, contrast, whitespace, typography, element spacing, icon sizing, layout alignment, and overall user experience. Highlight both strengths and weaknesses, and suggest specific, actionable improvements with clear reasoning for each point.";

      formData.append("prompt", prompt);

      try {
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Analyzing...";

        if (loadingSpinner) {
          loadingSpinner.style.display = "flex";
        }

        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: "POST",
          body: formData,
        });

        let data = {};

        try {
          data = await response.json();
        } catch {
          showAlert("Invalid server response.");
          return;
        }

        if (!response.ok) {
          const errorMessage = getFriendlyErrorMessage(data);
          showAlert(errorMessage);
          return;
        }

        if (!data.result || typeof data.result !== "string") {
          showAlert("No analysis result was returned.");
          return;
        }

        analysisBox.innerHTML = formatAnalysis(data.result);

        showAlert("Analysis completed successfully.");
      } catch (error) {
        showAlert("Could not analyze the image. Please try again later.");
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze";

        if (loadingSpinner) {
          loadingSpinner.style.display = "none";
        }
      }
    });
  }
});

// Friendly Error Messages
function getFriendlyErrorMessage(data) {
  const rawError =
    `${data?.error || ""} ${data?.details || ""}`.toLowerCase();

  if (
    rawError.includes("quota") ||
    rawError.includes("rate") ||
    rawError.includes("retry")
  ) {
    return "Gemini limit reached. Please wait a little and try again.";
  }

  if (rawError.includes("api key")) {
    return "API key issue. Please check server settings.";
  }

  if (rawError.includes("model")) {
    return "AI model is currently unavailable.";
  }

  return data?.error || "Failed to analyze image.";
}

// Format AI Analysis
function formatAnalysis(text) {
  if (!text || typeof text !== "string") {
    return "<p>No analysis available.</p>";
  }

  const lines = text.split("\n");

  let html = "";

  lines.forEach((line) => {
    const safeLine = escapeHTML(line);

    if (line.startsWith("**") && line.endsWith("**")) {
      html += `<h3>${escapeHTML(
        line.replace(/\*\*/g, "")
      )}</h3>`;
    } else if (line.startsWith("* **")) {
      html += `<p><strong>${escapeHTML(
        line.replace("* **", "").replace(":**", ":")
      )}</strong></p>`;
    } else if (line.startsWith("*")) {
      html += `<p>${safeLine.replace("* ", "• ")}</p>`;
    } else if (line.trim() !== "") {
      html += `<p>${safeLine}</p>`;
    }
  });

  return html;
}

// Prevent HTML Injection
function escapeHTML(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Custom Alert
function showAlert(message) {
  const alertBox = document.getElementById("custom-alert");

  if (!alertBox) return;

  alertBox.textContent = message;

  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 5000);
}