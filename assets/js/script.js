document.addEventListener('DOMContentLoaded', () => {
  // Navbar Toggle
  const navToggleBtn = document.querySelector('.nav-toggle-btn');
  const navbar = document.querySelector('.navbar');

  navToggleBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
    navToggleBtn.classList.toggle('active');
  });

  // Smooth Scroll
  document.querySelectorAll('.navbar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
      navbar.classList.remove('active');
      navToggleBtn.classList.remove('active');
    });
  });

  // Gallery Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('#gallery-modal');
  const modalImg = document.querySelector('#modal-img');
  const modalClose = document.querySelector('.modal-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = item.querySelector('.gallery-img').src;
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Swiper for Testimonials
  new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });

  // Contact Form
  const contactForm = document.querySelector('#contact-form');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const messageEl = contactForm.querySelector('.form-message');

    // Basic validation
    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
      messageEl.textContent = 'Please fill in all fields.';
      messageEl.className = 'form-message error';
      return;
    }

    // Simulate form submission (replace with actual API endpoint)
    try {
      // Example: await fetch('/api/contact', { method: 'POST', body: formData });
      messageEl.textContent = 'Message sent successfully!';
      messageEl.className = 'form-message success';
      contactForm.reset();
    } catch (error) {
      messageEl.textContent = 'Failed to send message. Please try again.';
      messageEl.className = 'form-message error';
    }
  });

  // Rental Form
  const rentalForm = document.querySelector('#rental-form');
  rentalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(rentalForm);
    const messageEl = rentalForm.querySelector('.form-message');

    // Basic validation
    if (!formData.get('rental-name') || !formData.get('rental-date') || !formData.get('rental-time') || !formData.get('rental-product')) {
      messageEl.textContent = 'Please fill in all fields.';
      messageEl.className = 'form-message error';
      return;
    }

    // Send to WhatsApp
    const text = `Rental Request\nName: ${formData.get('rental-name')}\nDate: ${formData.get('rental-date')}\nTime: ${formData.get('rental-time')}\nProduct: ${formData.get('rental-product')}`;
    const url = `https://wa.me/6289671172929?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    messageEl.textContent = 'Booking request sent via WhatsApp!';
    messageEl.className = 'form-message success';
    rentalForm.reset();
  });
});