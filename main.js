document.addEventListener("DOMContentLoaded", function () {
    var menuBtn = document.getElementById("menu-btn");
    var menuClose = document.getElementById("menu-close");
    var navList = document.querySelector("nav .nav-list ul");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var body = document.body;
    var certificatePreviewImage = document.getElementById("certificate-preview-image");
    var certificatePreviewTitle = document.getElementById("certificate-preview-title");
    var showMoreBtn = document.getElementById("show-more-certificates");
    var filterBtns = document.querySelectorAll(".filter-btn");
    var projectCards = document.querySelectorAll(".project-card");

    if (menuBtn && navList) {
        menuBtn.addEventListener("click", function () {
            navList.classList.add("active");
        });
    }

    if (menuClose && navList) {
        menuClose.addEventListener("click", function () {
            navList.classList.remove("active");
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            var targetId = this.getAttribute("href");
            var target = null;

            if (!targetId || targetId === "#") {
                return;
            }

            try {
                target = document.querySelector(targetId);
            } catch (error) {
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();
            var targetTop = target.getBoundingClientRect().top + window.scrollY - 80;

            window.scrollTo({
                top: targetTop,
                behavior: reducedMotion ? "auto" : "smooth"
            });

            if (navList) {
                navList.classList.remove("active");
            }
        });
    });

    if (body && !reducedMotion) {
        body.classList.add("home-intro-ready");
        window.requestAnimationFrame(function () {
            body.classList.add("home-intro-start");
        });
    }

    // Set Figma certificate as active by default
    var figmaCertificateBtn = document.querySelector('.certificate-trigger[data-image="Figma.png"]');
    if (figmaCertificateBtn) {
        figmaCertificateBtn.classList.add("is-active");
    }

    document.querySelectorAll(".certificate-trigger").forEach(function (button) {
        button.addEventListener("click", function () {
            if (!certificatePreviewImage || !certificatePreviewTitle) {
                return;
            }

            // Remove active class from all buttons
            document.querySelectorAll(".certificate-trigger").forEach(function (btn) {
                btn.classList.remove("is-active");
            });

            // Add active class to clicked button
            this.classList.add("is-active");

            var imagePath = this.getAttribute("data-image");
            var title = this.getAttribute("data-title") || "Certificate Preview";

            certificatePreviewImage.src = imagePath;
            certificatePreviewImage.alt = title;
            certificatePreviewImage.classList.add("has-image");
            certificatePreviewTitle.textContent = title;
        });
    });

    // Show more button logic
    if (showMoreBtn) {
        showMoreBtn.addEventListener("click", function () {
            // Show all hidden certificates
            document.querySelectorAll(".hidden-certificate").forEach(function (cert) {
                // Show the certificate
                cert.classList.add("show-certificate");
                // Add scroll reveal visible state
                cert.classList.add("is-visible");
            });

            // Hide the show more button
            this.classList.add("is-hidden");
        });
    }

    var revealGroups = [
        { selector: "section:not(#home)", variant: "" },
        { selector: ".about-info, .contact-info, .skill-badges-image, .resume-column:first-child, .certifications-left", variant: "scroll-reveal-left" },
        { selector: ".education-cards, .resume-column:last-child, .contact-form, .skill-badges-content, .certifications-right", variant: "scroll-reveal-right" },
        { selector: ".section-header, .resume-header, .projects-header", variant: "" },
        { selector: ".edu-card, .skill-card, .project-card, .badge-section, .info-item, .certificate-trigger, .show-more-btn, .filter-btn", variant: "scroll-reveal-zoom" }
    ];

    revealGroups.forEach(function (group) {
        document.querySelectorAll(group.selector).forEach(function (element, index) {
            element.classList.add("scroll-reveal");

            if (group.variant) {
                element.classList.add(group.variant);
            }

            var delayClass = "scroll-delay-" + ((index % 3) + 1);
            element.classList.add(delayClass);
        });
    });

    // Projects filter function
    function filterProjects(filterType) {
        projectCards.forEach(function(card) {
            card.classList.remove("visible");
        });

        var filteredCards = [];
        if (filterType === "major") {
            // Major projects: Personal Portfolio, Amazon Clone, VK Teach Platform
            filteredCards = Array.from(projectCards).filter(function(card) {
                var title = card.querySelector("h4").textContent.trim();
                return title === "Personal Portfolio" || title === "Amazon Clone" || title === "VK Teach Platform";
            });
        } else {
            // Basic projects: the other two
            filteredCards = Array.from(projectCards).filter(function(card) {
                var title = card.querySelector("h4").textContent.trim();
                return title === "HTML Page" || title === "Fun Games" || title === "VK Teach";
            });
        }

        // Show only the first 3
        filteredCards.slice(0, 3).forEach(function(card) {
            card.classList.add("visible");
        });
    }

    // Initialize filter with major projects
    filterProjects("major");

    // Add click event listeners to filter buttons
    filterBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            // Remove active class from all buttons
            filterBtns.forEach(function(b) {
                b.classList.remove("active");
            });
            // Add active class to clicked button
            this.classList.add("active");
            // Filter projects
            var filter = this.getAttribute("data-filter");
            filterProjects(filter);
        });
    });

    var revealElements = document.querySelectorAll(".scroll-reveal");

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                entry.target.classList.remove("is-visible");
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
    });

    revealElements.forEach(function (element) {
        observer.observe(element);
    });
});
