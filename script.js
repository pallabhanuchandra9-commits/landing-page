/**
 * ============================================================
 * FILE: script.js
 * PURPOSE: Interactivity for the DRAPE landing page
 *
 * JAVASCRIPT FUNDAMENTALS — HOW JS WORKS IN A BROWSER
 * ============================================================
 * JavaScript (JS) is a programming language that runs inside
 * the browser and makes web pages interactive.
 *
 * KEY CONCEPTS USED IN THIS FILE:
 *
 * DOM  — Document Object Model
 *        The browser's internal representation of HTML as a
 *        tree of objects. JS can read, modify, add, or remove
 *        any element via the DOM.
 *        e.g. document.getElementById('hamburger')
 *
 * EVENT — Something that happens in the browser
 *         (click, scroll, load, keypress, mouseover, etc.)
 *         We "listen" for events with addEventListener().
 *
 * SELECTOR — How we find HTML elements in JS
 *         document.getElementById()  — finds by id=""
 *         document.querySelector()   — finds first match (CSS selector)
 *         document.querySelectorAll()— finds all matches (CSS selector)
 *
 * CLASS — CSS class names can be toggled, added, removed by JS
 *         to change an element's appearance or behaviour.
 *         element.classList.add('open')
 *         element.classList.remove('open')
 *         element.classList.toggle('open')
 *         element.classList.contains('open')
 *
 * TABLE OF CONTENTS
 * ─────────────────
 * 1.  DOMContentLoaded — Wait for HTML to be ready
 * 2.  Sticky Header    — Transparent → solid on scroll
 * 3.  Mobile Nav       — Hamburger toggle
 * 4.  Smooth Scroll    — Anchor link offsets
 * 5.  Counter Animation — Stats count up when visible
 * 6.  Scroll Animations — Fade-up reveal on scroll
 * 7.  CTA Form         — Email subscribe handling
 * ============================================================
 */


/**
 * ============================================================
 * 1. DOMContentLoaded — Entry Point
 * ============================================================
 * JS runs as soon as the browser encounters the <script> tag.
 * But if our script is in <head>, the HTML elements we need
 * don't exist yet!
 *
 * Two safe patterns:
 *   A) Put <script> at the bottom of <body> (what we did in HTML)
 *   B) Wrap code in the 'DOMContentLoaded' event listener
 *
 * 'DOMContentLoaded' fires when the full HTML has been parsed,
 * but before images and other external resources finish loading.
 *
 * We use BOTH — script at bottom AND this event — for safety.
 *
 * document.addEventListener(eventName, callbackFunction)
 *   eventName        — the event to listen for (a string)
 *   callbackFunction — a function that runs when event fires
 *                      Arrow function syntax: () => { ... }
 * ============================================================
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Find elements we'll use across multiple functions ──
  // We store references in variables at the top so we only
  // query the DOM once — this is better for performance.

  /** @type {HTMLElement} The fixed header */
  const header = document.getElementById('main-header');

  /** @type {HTMLButtonElement} The hamburger menu button */
  const hamburger = document.getElementById('hamburger');

  /** @type {HTMLUListElement} The nav links list */
  const navLinks = document.getElementById('nav-links');

  // ── Initialise all features ──
  initStickyHeader(header);
  initMobileNav(hamburger, navLinks, header);
  initSmoothScroll(navLinks);
  initCounters();
  initScrollAnimations();
  initCTAForm();
});


/**
 * ============================================================
 * 2. STICKY HEADER — Transparent → Solid on Scroll
 * ============================================================
 * The header starts transparent (showing the hero image through
 * it). When the user scrolls 80px down, we add the 'scrolled'
 * CSS class which makes the background solid.
 *
 * BROWSER API USED: window.scrollY
 *   → Returns how many pixels the page has been scrolled vertically.
 *
 * EVENT: 'scroll' fires continuously as the user scrolls.
 * ============================================================
 *
 * @param {HTMLElement} header - The header element
 */
function initStickyHeader(header) {

  /**
   * handleScroll — checks scroll position and toggles the class.
   * We define this as a named function (not anonymous) so we could
   * remove the listener later if needed.
   */
  function handleScroll() {

    // window.scrollY = vertical scroll distance in pixels
    const isScrolled = window.scrollY > 80;

    /*
      classList.toggle(className, condition)
      ─ Adds className if condition is true
      ─ Removes className if condition is false
      Much cleaner than an if/else!
    */
    header.classList.toggle('scrolled', isScrolled);
  }

  // Attach the scroll listener to the window (the browser viewport)
  window.addEventListener('scroll', handleScroll);

  // Run once immediately in case page loads already scrolled (e.g. refresh)
  handleScroll();
}


/**
 * ============================================================
 * 3. MOBILE NAVIGATION — Hamburger Toggle
 * ============================================================
 * On mobile, the nav links are hidden and replaced with a
 * hamburger icon. Clicking the icon:
 *   1. Toggles the nav's .open class (shows/hides it)
 *   2. Animates the hamburger icon into an X (via CSS)
 *   3. Prevents body scrolling while menu is open
 *   4. Updates aria-expanded (accessibility)
 *
 * Pressing Escape or clicking outside the nav closes it.
 * ============================================================
 *
 * @param {HTMLButtonElement} hamburger - The toggle button
 * @param {HTMLUListElement}  navLinks  - The nav list
 * @param {HTMLElement}       header    - Used for scroll lock
 */
function initMobileNav(hamburger, navLinks, header) {

  // Track whether the menu is currently open
  let isMenuOpen = false;

  /**
   * toggleMenu — opens or closes the mobile nav
   * @param {boolean} [forceClose=false] - Set true to always close
   */
  function toggleMenu(forceClose = false) {
    isMenuOpen = forceClose ? false : !isMenuOpen;

    // Toggle CSS classes that show/hide and animate the nav & button
    navLinks.classList.toggle('open', isMenuOpen);
    hamburger.classList.toggle('open', isMenuOpen);

    /*
      aria-expanded: accessibility attribute on the button.
      Screen readers announce "expanded" or "collapsed" to users.
      String conversion: isMenuOpen.toString() → "true" or "false"
    */
    hamburger.setAttribute('aria-expanded', isMenuOpen.toString());

    /*
      Prevent body scroll while the mobile overlay menu is open.
      overflow: hidden stops the page from scrolling behind the menu.
      We toggle it on document.body directly.
    */
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }

  // ── Hamburger click ──
  hamburger.addEventListener('click', () => toggleMenu());

  // ── Close menu when a nav link is clicked ──
  // querySelectorAll returns a NodeList — we use forEach to loop through it
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // ── Close menu on Escape key ──
  document.addEventListener('keydown', (event) => {
    /*
      event.key — the name of the pressed key.
      'Escape' closes any open overlay — standard UX pattern.
    */
    if (event.key === 'Escape' && isMenuOpen) {
      toggleMenu(true);
      hamburger.focus(); // Return keyboard focus to the button
    }
  });

  // ── Close menu when clicking OUTSIDE the nav ──
  document.addEventListener('click', (event) => {
    /*
      event.target — the exact element that was clicked.
      .contains() — checks if an element is inside another.
      If the click was outside both the header and navLinks, close.
    */
    if (isMenuOpen &&
        !navLinks.contains(event.target) &&
        !hamburger.contains(event.target)) {
      toggleMenu(true);
    }
  });
}


/**
 * ============================================================
 * 4. SMOOTH SCROLL — Offset for Fixed Header
 * ============================================================
 * HTML anchor links (#products) jump instantly to the element.
 * CSS `scroll-behavior: smooth` makes it animate smoothly.
 * BUT the fixed header covers the top 70px of the target.
 *
 * SOLUTION: Intercept anchor clicks, calculate the correct
 * position accounting for the header, and scroll manually
 * using window.scrollTo().
 *
 * BROWSER APIs USED:
 *   event.preventDefault() — stops default browser behaviour
 *   element.getBoundingClientRect() — gets position/size info
 *   window.scrollTo({ top, behavior }) — programmatic scrolling
 * ============================================================
 *
 * @param {HTMLElement} navLinks - Nav element containing links
 */
function initSmoothScroll(navLinks) {

  /*
    Select ALL anchor links in the document that have an href
    starting with '#' (internal anchor links).
    CSS selector: a[href^="#"] = anchor tags whose href begins with "#"
  */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (event) => {

      // Get the href attribute value (e.g. "#products")
      const href = link.getAttribute('href');

      // Skip if it's just "#" (no target)
      if (href === '#') return;

      // Find the target element (remove the # to get the id)
      const targetId = href.substring(1); // "#products" → "products"
      const targetElement = document.getElementById(targetId);

      // Only proceed if the target element exists
      if (!targetElement) return;

      // Prevent the default instant jump
      event.preventDefault();

      /*
        getBoundingClientRect() returns an object with the element's
        position relative to the VIEWPORT (visible area):
          { top, bottom, left, right, width, height }
        
        To get position relative to the whole PAGE (not just viewport),
        we add window.scrollY (how far we've already scrolled).
      */
      const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;

      // Header height + a little breathing room
      const headerOffset = 80;

      // window.scrollTo() scrolls the page to an absolute position
      window.scrollTo({
        top: elementTop - headerOffset,
        behavior: 'smooth'    // CSS-equivalent smooth animation
      });
    });
  });
}


/**
 * ============================================================
 * 5. COUNTER ANIMATION — Stats Count Up When Visible
 * ============================================================
 * The trust strip stats (48,000+, 320+, etc.) animate from 0
 * to their final value when the user scrolls to that section.
 *
 * HOW IT WORKS:
 * 1. We read each .trust-number's data-target attribute
 *    (the final number defined in HTML as data-target="48000")
 * 2. We use IntersectionObserver to detect when it's on-screen
 * 3. We run an animation loop using requestAnimationFrame
 *    that increments the displayed number over ~1.5 seconds
 *
 * BROWSER APIs USED:
 *   IntersectionObserver — fires when element enters/leaves viewport
 *   requestAnimationFrame — schedules animations in sync with screen refresh
 *   performance.now() — high-precision current timestamp (in ms)
 *   element.dataset — access data-* HTML attributes
 * ============================================================
 */
function initCounters() {

  // Find all counter elements that have a data-target attribute
  const counters = document.querySelectorAll('.trust-number[data-target]');

  /**
   * animateCounter — incrementally counts a number from 0 to target
   * @param {HTMLElement} el     - The element to update
   * @param {number}      target - The final number to count to
   */
  function animateCounter(el, target) {
    const duration = 1500;          // Animation duration in milliseconds

    /*
      performance.now() returns the time (in ms) since the page loaded.
      We capture the start time to calculate how far through the animation we are.
    */
    const startTime = performance.now();

    /**
     * step — called on each animation frame (~60 times per second)
     * @param {number} currentTime - Current timestamp from requestAnimationFrame
     */
    function step(currentTime) {
      // How many ms have elapsed since animation started?
      const elapsed = currentTime - startTime;

      /*
        Progress: a value from 0 (start) to 1 (end)
        Math.min() prevents it going above 1 if time overshoots.
      */
      const progress = Math.min(elapsed / duration, 1);

      /*
        EASING FUNCTION: easeOutQuart
        Without easing, the number increments at a constant rate (linear).
        easeOutQuart starts fast and slows down near the end — more natural.
        
        Formula: 1 - (1 - progress)^4
        At progress=0: eased = 0 (start)
        At progress=1: eased = 1 (end)
        The curve accelerates at start, decelerates at end.
      */
      const eased = 1 - Math.pow(1 - progress, 4);

      // Current displayed number = rounded interpolation
      const currentValue = Math.round(eased * target);

      /*
        toLocaleString() adds comma thousands separators:
        48000 → "48,000" (locale-dependent)
      */
      el.textContent = currentValue.toLocaleString();

      // If not done yet, schedule the next frame
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    // Kick off the animation loop
    requestAnimationFrame(step);
  }

  /*
    INTERSECTION OBSERVER API
    ─────────────────────────
    IntersectionObserver watches elements and fires a callback
    when they enter or leave the viewport (the visible area).
    
    This is much more efficient than running code on every scroll event.
    
    Options:
      threshold: 0.5 = fire when 50% of the element is visible
  */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      /*
        entry.isIntersecting = true when element enters the viewport
        entry.target = the element being observed
      */
      if (entry.isIntersecting) {
        const el = entry.target;

        // Read the target number from the data-target attribute
        // parseInt() converts a string "48000" to a number 48000
        const target = parseInt(el.dataset.target, 10);

        // Start the count-up animation
        animateCounter(el, target);

        // Stop observing after animation starts — no need to re-trigger
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  // Attach the observer to each counter element
  counters.forEach(counter => observer.observe(counter));
}


/**
 * ============================================================
 * 6. SCROLL ANIMATIONS — Fade-Up Reveal on Scroll
 * ============================================================
 * Elements fade up into view as they enter the viewport.
 * 
 * HOW IT WORKS:
 * 1. We find all elements with the class .fade-up-ready
 *    (set in CSS to opacity:0, translateY:24px)
 * 2. An IntersectionObserver watches them
 * 3. When an element enters the viewport, we add
 *    .animate-fade-up (CSS animation) and a delay class
 * 4. After animation completes, cleanup the helper classes
 *
 * The staggered delay classes (.delay-1, .delay-2 etc.) make
 * sibling elements animate in sequence rather than all at once.
 * ============================================================
 */
function initScrollAnimations() {

  // Add the "ready" class to elements we want to animate
  // Using querySelectorAll with multiple CSS selectors separated by commas
  const animatables = document.querySelectorAll(
    '.feature-card, .product-card, .trust-item, .about-image-wrap, .about-text'
  );

  // Add the initial hidden state class to each element
  animatables.forEach(el => el.classList.add('fade-up-ready'));

  /*
    SIBLING STAGGERING
    ──────────────────
    For grid items (feature cards, product cards), we want each
    card in the same row to animate with a slight delay after
    the previous one.
    
    We check if siblings share the same parent and assign
    delay-1, delay-2, etc. classes based on position.
  */
  // Group elements by parent
  const parents = new Map(); // Map = key-value collection (like a dictionary)

  animatables.forEach(el => {
    const parent = el.parentElement;
    if (!parents.has(parent)) {
      parents.set(parent, []);
    }
    parents.get(parent).push(el);
  });

  // Assign delay classes within each parent group
  parents.forEach(children => {
    children.forEach((child, index) => {
      // Only add delays for elements 2-4 (index 1-3)
      if (index > 0 && index < 4) {
        child.classList.add(`delay-${index}`);
      }
    });
  });

  // Create the IntersectionObserver for scroll reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Trigger the animation
        el.classList.add('animate-fade-up');
        el.classList.remove('fade-up-ready');

        // Clean up animation classes after animation completes
        // to prevent interference with hover transitions
        el.addEventListener('animationend', () => {
          el.classList.remove('animate-fade-up', 'delay-1', 'delay-2', 'delay-3', 'delay-4');
          // Ensure final state is visible
          el.style.opacity = '1';
          el.style.transform = 'none';
        }, { once: true }); // { once: true } auto-removes the listener after it fires once

        // Stop observing — animation should only happen once
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,      // Fire when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'  // Trigger 40px before the bottom of viewport
  });

  // Observe each element
  animatables.forEach(el => revealObserver.observe(el));
}


/**
 * ============================================================
 * 7. CTA FORM — Email Subscribe Handling
 * ============================================================
 * Handles the newsletter signup form in the CTA section.
 * 
 * In a real application, this would make an API call to a
 * service like Mailchimp, Klaviyo, or your own backend.
 * Here we demonstrate the form handling pattern.
 *
 * CONCEPTS COVERED:
 *   querySelector — find a single element by CSS selector
 *   submit event  — fires when a form is submitted
 *   FormData API  — extract form field values
 *   DOM manipulation — create and insert new elements
 * ============================================================
 */
function initCTAForm() {

  // Find the form — querySelector returns the FIRST matching element
  const form = document.querySelector('.cta-form');

  // If no form exists on this page, exit early
  if (!form) return;

  // Find the email input inside the form
  const emailInput = form.querySelector('input[type="email"]');

  /**
   * showMessage — displays a success or error message in the form
   * @param {string}  text      - The message to display
   * @param {'success'|'error'} type - Which style to apply
   */
  function showMessage(text, type) {

    // Remove any existing message first
    const existing = form.parentElement.querySelector('.form-message');
    if (existing) existing.remove();

    /*
      createElement — creates a new HTML element
      The element doesn't appear on the page until we insert it.
    */
    const message = document.createElement('p');
    message.className = `form-message form-message--${type}`;
    message.textContent = text;

    // Apply inline styles for the message appearance
    Object.assign(message.style, {
      marginTop: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: type === 'success' ? '#7ED88A' : '#FF8080',
      textAlign: 'center',
      animation: 'fadeUp 0.3s ease forwards'
    });

    /*
      insertAdjacentElement — inserts an element at a position relative to another.
      'afterend' = after the form's closing </form> tag.
      Other options: 'beforebegin', 'afterbegin', 'beforeend'
    */
    form.insertAdjacentElement('afterend', message);

    // Auto-remove the message after 4 seconds
    // setTimeout(callback, delay) runs the callback after `delay` milliseconds
    setTimeout(() => {
      if (message.parentElement) {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.4s ease';
        setTimeout(() => message.remove(), 400);
      }
    }, 4000);
  }

  /**
   * Basic email validation beyond the browser's built-in check.
   * Regex test: checks if the string matches the email pattern.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    // Regular expression for basic email format validation
    // /pattern/ = regex literal. .test(string) returns true/false.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Handle form submission
   * The 'submit' event fires when the form is submitted —
   * either by clicking the button or pressing Enter in an input.
   */
  form.addEventListener('submit', async (event) => {
    /*
      event.preventDefault() — stops the browser from doing its
      default form action (navigating to a new page or refreshing).
      We want to handle submission ourselves with JavaScript.
    */
    event.preventDefault();

    // Get the submitted email value and trim whitespace
    const email = emailInput.value.trim();

    // Validate email format
    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      emailInput.focus(); // Return focus to the input
      return; // Stop execution here
    }

    // ── Simulate API call ──
    // Find the submit button and show a loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button and show loading text to prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    /*
      In a real app, you'd make an API call here:
      
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        ...
      }
      
      We simulate the async wait with a Promise + setTimeout.
      async/await is modern JS syntax for handling asynchronous operations.
    */
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1s API call

    // Success!
    showMessage(`You're in! Check ${email} for your 20% off code.`, 'success');

    // Reset the form to its empty state
    form.reset();

    // Re-enable and restore the button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}


/**
 * ============================================================
 * UTILITY — Page Load Complete
 * ============================================================
 * The 'load' event fires after EVERYTHING has loaded:
 * HTML, CSS, images, fonts, etc.
 * (Compared to DOMContentLoaded which fires after just HTML)
 *
 * We use this to:
 *   • Remove any loading skeleton states
 *   • Log performance metrics
 *   • Start any animations that need images to be loaded
 * ============================================================
 */
window.addEventListener('load', () => {

  // Log a performance mark for analysis (visible in DevTools > Performance)
  performance.mark('page-fully-loaded');

  /*
    console.log() outputs to the browser's Developer Console.
    Open it with F12 (Windows/Linux) or Cmd+Option+I (Mac).
    This is purely for development — remove from production.
  */
  console.log(
    '%c DRAPE 🧥 ',
    'background: #C4622D; color: #fff; font-size: 16px; padding: 4px 8px; border-radius: 4px;',
    '\nPage fully loaded. Happy styling! ✨'
  );

  /*
    NAVIGATION PERFORMANCE API
    ──────────────────────────
    performance.getEntriesByType('navigation') returns timing info
    about the page load. Useful for monitoring real-world perf.
  */
  const [navEntry] = performance.getEntriesByType('navigation');
  if (navEntry) {
    const loadTime = Math.round(navEntry.loadEventEnd - navEntry.startTime);
    console.log(`⚡ Page load time: ${loadTime}ms`);
  }
});