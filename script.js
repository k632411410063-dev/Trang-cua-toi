/**
 * ==========================================================================
 * Phạm Hùng - Personal Portfolio JavaScript
 * Features:
 *   - Mobile menu toggle & navigation
 *   - Active section scroll-spy (IntersectionObserver)
 *   - Header background on scroll
 *   - Scroll reveal animations
 *   - Back-to-top button
 *   - Client-side contact form validation & feedback toast
 *   - Dynamic current year
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Dynamic Year in Footer
  // ------------------------------------------------------------------------
  const currentYearElem = document.getElementById('current-year');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 2. Mobile Menu Navigation Toggle
  // ------------------------------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    // Toggle menu when clicking hamburger button
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside of the navbar
    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. Header Scrolled State & Back to Top Button
  // ------------------------------------------------------------------------
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScrollEffects = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Add shadow/background to header when scrolled down
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Toggle Back to Top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects(); // Initial check on load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Scroll-Spy: Highlight Active Nav Link on Scroll
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // ------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (IntersectionObserver)
  // ------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    fadeElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers without IntersectionObserver
    fadeElements.forEach((element) => {
      element.classList.add('revealed');
    });
  }

  // ------------------------------------------------------------------------
  // 6. Contact Form Validation & Toast Feedback
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  const showToast = (title, message, isSuccess = true) => {
    if (!toast) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (isSuccess) {
      toast.style.borderColor = 'rgba(34, 197, 94, 0.4)';
    } else {
      toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    }

    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent full page reload

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Helper function to validate fields
      const validateField = (input, condition) => {
        const parent = input.closest('.form-group');
        if (!condition) {
          parent.classList.add('has-error');
          isValid = false;
        } else {
          parent.classList.remove('has-error');
        }
      };

      // Validate Name
      validateField(nameInput, nameInput.value.trim().length > 0);

      // Validate Email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailPattern.test(emailInput.value.trim()));

      // Validate Subject
      validateField(subjectInput, subjectInput.value.trim().length > 0);

      // Validate Message
      validateField(messageInput, messageInput.value.trim().length > 5);

      if (isValid) {
        const senderName = nameInput.value.trim();

        // Show friendly feedback
        showToast(
          'Message Sent Successfully!',
          `Thank you, ${senderName}! This is a demo form, your message was handled locally.`,
          true
        );

        // Reset form inputs
        contactForm.reset();

        // Clear any remaining error styles
        document.querySelectorAll('.form-group').forEach((group) => {
          group.classList.remove('has-error');
        });
      } else {
        showToast(
          'Please Check Inputs',
          'Please complete all required fields correctly before submitting.',
          false
        );
      }
    });

    // Clear error on input change
    contactForm.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('input', () => {
        const parent = input.closest('.form-group');
        if (parent) {
          parent.classList.remove('has-error');
        }
      });
    });
  }
});
