document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.hidden = isOpen;
    });

    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        mobileNav.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  const track = document.getElementById("universities-track");

  if (track) {
    const originalSet = track.querySelector(".universities-set");
    if (originalSet && !track.querySelector(".universities-set.clone")) {
      const clone = originalSet.cloneNode(true);
      clone.classList.add("clone");
      clone.setAttribute("aria-hidden", "true");

      clone.querySelectorAll("a").forEach(link => {
        link.setAttribute("tabindex", "-1");
      });

      clone.querySelectorAll("img").forEach(img => {
        img.alt = "";
      });

      track.appendChild(clone);
    }
  }

  const animatedElements = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    animatedElements.forEach(el => el.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
  }
});