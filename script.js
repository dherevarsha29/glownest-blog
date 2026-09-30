/**
 * GlowNest Beauty Blog - Core JavaScript
 * Handles navigation, reading progress, interactive quiz,
 * category filtering, comment system, social sharing, and notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initReadingProgressBar();
  initActiveTocHighlighter();
  initCategoryFilters();
  initSkincareQuiz();
  initSocialSharing();
  initReactionsAndBookmarks();
  initCommentSystem();
  initNewsletterForms();
  initBackToTop();
});

/* ==========================================================================
   1. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking outside or clicking any nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   2. HEADER SCROLL SHADOW
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. READING PROGRESS BAR (blog.html)
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
  }, { passive: true });
}

/* ==========================================================================
   4. ACTIVE TABLE OF CONTENTS HIGHLIGHTER (blog.html)
   ========================================================================== */
function initActiveTocHighlighter() {
  const sidebarLinks = document.querySelectorAll('.sidebar-toc-link');
  const tipSections = document.querySelectorAll('.tip-block');

  if (!sidebarLinks.length || !tipSections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  tipSections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   5. INTERACTIVE CATEGORY FILTERING (index.html)
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const categoryCards = document.querySelectorAll('.category-card');
  const articleCards = document.querySelectorAll('.article-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      // Filter category cards
      categoryCards.forEach(card => {
        const cardType = card.getAttribute('data-cat-type');
        if (filterVal === 'all' || cardType === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });

      // Filter article cards if category mapping applies
      if (articleCards.length) {
        articleCards.forEach(card => {
          const articleCat = card.getAttribute('data-category');
          if (filterVal === 'all' || (filterVal === 'sun' && articleCat === 'sun') || 
             (filterVal === 'actives' && articleCat === 'serums') || 
             (filterVal === 'routines' && articleCat === 'barrier')) {
            card.style.display = 'flex';
          } else if (filterVal !== 'all') {
            card.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE SKINCARE QUIZ (index.html)
   ========================================================================== */
function initSkincareQuiz() {
  const options = document.querySelectorAll('.quiz-opt-btn');
  const resultBox = document.getElementById('quiz-result');

  if (!options.length || !resultBox) return;

  const quizRecommendations = {
    glow: {
      title: "✨ Radiance & Hyperpigmentation Protocol",
      recommendation: "Introduce a 10%-15% stabilized Vitamin C serum in the morning paired with low-pH AHA exfoliants 2x weekly.",
      link: "blog.html#tip-4",
      action: "Read Vitamin C Guide &rarr;"
    },
    hydration: {
      title: "💧 Deep Moisture & Plumping Protocol",
      recommendation: "Apply multi-molecular Hyaluronic Acid & Glycerin directly onto damp skin, sealed with a ceramide cream.",
      link: "blog.html#tip-3",
      action: "Read Damp Skin Trick &rarr;"
    },
    barrier: {
      title: "🛡️ Barrier Defense & Redness Soothing",
      recommendation: "Pause active acids. Re-establish lipid matrices using 3:1:1 physiological ceramide, cholesterol, and fatty acid balms.",
      link: "blog.html#tip-6",
      action: "Read Barrier Repair Guide &rarr;"
    },
    aging: {
      title: "⏳ Collagen Longevity & Cell Renewal",
      recommendation: "Broad-spectrum SPF 50 daily without exception, coupled with evening encapsulated retinol or plant bakuchiol.",
      link: "blog.html#tip-2",
      action: "Read SPF 50 Protocol &rarr;"
    }
  };

  options.forEach(button => {
    button.addEventListener('click', () => {
      options.forEach(b => b.classList.remove('selected'));
      button.classList.add('selected');

      const goal = button.getAttribute('data-goal');
      const data = quizRecommendations[goal];

      if (data) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <h4 style="color: var(--primary-rose-dark); font-size: 1rem; margin-bottom: 0.4rem;">${data.title}</h4>
          <p style="font-size: 0.88rem; color: var(--neutral-700); margin-bottom: 0.75rem;">${data.recommendation}</p>
          <a href="${data.link}" class="read-more-link" style="font-size: 0.88rem;">${data.action}</a>
        `;
      }
    });
  });
}

/* ==========================================================================
   7. SOCIAL SHARING (blog.html)
   ========================================================================== */
function initSocialSharing() {
  const copyBtn = document.getElementById('share-copy-btn');
  const pinBtn = document.getElementById('share-pinterest-btn');
  const twitterBtn = document.getElementById('share-twitter-btn');
  const fbBtn = document.getElementById('share-facebook-btn');

  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent("10 Skincare Tips for Healthy and Glowing Skin | GlowNest Beauty");

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast("🔗 Article link copied to clipboard!");
        }).catch(() => {
          showToast("Link ready to share!");
        });
      } else {
        showToast("Link ready to share!");
      }
    });
  }

  if (pinBtn) {
    pinBtn.addEventListener('click', () => {
      window.open(`https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${pageTitle}`, '_blank', 'width=600,height=500');
    });
  }

  if (twitterBtn) {
    twitterBtn.addEventListener('click', () => {
      window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`, '_blank', 'width=600,height=500');
    });
  }

  if (fbBtn) {
    fbBtn.addEventListener('click', () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank', 'width=600,height=500');
    });
  }
}

/* ==========================================================================
   8. ARTICLE REACTIONS & BOOKMARKING (blog.html)
   ========================================================================== */
function initReactionsAndBookmarks() {
  const likeBtn = document.getElementById('like-btn');
  const likeCountSpan = document.getElementById('like-count');
  const bookmarkBtn = document.getElementById('bookmark-btn');
  const bookmarkText = document.getElementById('bookmark-text');

  // Like Toggle
  if (likeBtn && likeCountSpan) {
    let isLiked = localStorage.getItem('glownest_liked_10tips') === 'true';
    let count = 1248;

    if (isLiked) {
      likeBtn.classList.add('liked');
      likeCountSpan.textContent = `${count + 1}`;
    }

    likeBtn.addEventListener('click', () => {
      isLiked = !isLiked;
      localStorage.setItem('glownest_liked_10tips', isLiked);
      likeBtn.classList.toggle('liked', isLiked);
      likeCountSpan.textContent = isLiked ? `${count + 1}` : `${count}`;
      showToast(isLiked ? "❤️ Thank you for liking this guide!" : "Like removed");
    });
  }

  // Bookmark Toggle
  if (bookmarkBtn && bookmarkText) {
    let isBookmarked = localStorage.getItem('glownest_bookmarked_10tips') === 'true';

    if (isBookmarked) {
      bookmarkBtn.classList.add('liked');
      bookmarkText.textContent = "Saved to Library";
    }

    bookmarkBtn.addEventListener('click', () => {
      isBookmarked = !isBookmarked;
      localStorage.setItem('glownest_bookmarked_10tips', isBookmarked);
      bookmarkBtn.classList.toggle('liked', isBookmarked);
      bookmarkText.textContent = isBookmarked ? "Saved to Library" : "Save Post";
      showToast(isBookmarked ? "🔖 Article saved for offline reading!" : "Removed from saved posts");
    });
  }
}

/* ==========================================================================
   9. INTERACTIVE COMMENT SYSTEM (blog.html)
   ========================================================================== */
function initCommentSystem() {
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');
  const commentsCount = document.getElementById('comments-total-count');

  if (!commentForm || !commentList) return;

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('comment-author');
    const emailInput = document.getElementById('comment-email');
    const bodyInput = document.getElementById('comment-body');

    const name = nameInput.value.trim();
    const commentText = bodyInput.value.trim();

    if (!name || !commentText) return;

    // Create new comment element
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.style.animation = 'fadeIn 0.5s ease';
    newComment.innerHTML = `
      <div class="comment-item-header">
        <span class="commenter-name">${escapeHTML(name)}</span>
        <span class="comment-date">Just now</span>
      </div>
      <p class="comment-text">${escapeHTML(commentText)}</p>
    `;

    commentList.prepend(newComment);

    // Update count
    if (commentsCount) {
      const current = parseInt(commentsCount.textContent, 10) || 3;
      commentsCount.textContent = `${current + 1}`;
    }

    // Reset inputs
    commentForm.reset();
    showToast("💬 Comment posted! Thanks for contributing to the community.");
  });
}

/* ==========================================================================
   10. NEWSLETTER FORMS
   ========================================================================== */
function initNewsletterForms() {
  const forms = [
    document.getElementById('homepage-newsletter-form'),
    document.getElementById('sidebar-newsletter-form'),
    document.getElementById('footer-newsletter-form')
  ];

  forms.forEach(form => {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast("🌸 Welcome to GlowNest! Check your inbox for the 7-Day Guide.");
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   11. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
