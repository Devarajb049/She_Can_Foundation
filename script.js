/**
 * ================================================================
 * SHE CAN FOUNDATION - CORE SCRIPT INTERACTIONS (script.js)
 * ================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all dynamic features
  initThemeManager();
  initStickyNavbar();
  initScrollAnimations();
  initBackToTop();
  initImpactCounters();
  initContactForm();
});

/**
 * 1. THEME MANAGER (Light / Dark Mode Toggle)
 */
function initThemeManager() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  // Retrieve existing theme preference or fallback to system default
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  
  // Set initial state
  document.documentElement.setAttribute("data-theme", initialTheme);
  
  // Event listener
  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

/**
 * 2. STICKY NAVBAR DYNAMIC CLASS
 */
function initStickyNavbar() {
  const navbar = document.querySelector(".navbar-custom");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Trigger immediately in case page loads scrolled down
}

/**
 * 3. SCROLL-INTO-VIEW ANIMATIONS (IntersectionObserver)
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in-up");
  if (fadeElements.length === 0) return;

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.15 // trigger when 15% of element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * 4. BACK TO TOP BUTTON
 */
function initBackToTop() {
  // Create back to top button dynamically if it doesn't exist
  let backBtn = document.getElementById("backToTop");
  if (!backBtn) {
    backBtn = document.createElement("div");
    backBtn.id = "backToTop";
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backBtn);
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backBtn.classList.add("show");
    } else {
      backBtn.classList.remove("show");
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/**
 * 5. ANIMATED IMPACT COUNTERS
 */
function initImpactCounters() {
  const counters = document.querySelectorAll(".counter-value");
  if (counters.length === 0) return;

  const counterSection = document.querySelector(".stats-section");
  if (!counterSection) return;

  let animated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000; // 2 seconds total animation time
      const increment = target / (duration / 16); // 60 FPS
      
      let currentValue = 0;

      const updateCounter = () => {
        currentValue += increment;
        if (currentValue < target) {
          counter.innerText = Math.ceil(currentValue).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };

      updateCounter();
    });
  };

  const observerOptions = {
    root: null,
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
        observer.unobserve(counterSection);
      }
    });
  }, observerOptions);

  observer.observe(counterSection);
}

/**
 * 6. CONTACT FORM SUBMISSION HANDLER
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const successContainer = document.getElementById("successMessage");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect values
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    // Simple custom client validation feedback
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    // Success styling: simulate asynchronous response
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';

    setTimeout(() => {
      // Restore Button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Reveal success indicator
      if (successContainer) {
        successContainer.style.display = "block";
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        alert("Form Submitted Successfully");
      }

      // Reset form controls
      form.reset();
    }, 1200); // 1.2s delay for visual feedback realism
  });
}
