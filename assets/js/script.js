'use strict';

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }

// Header sticky & go to top
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 10) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});

// Navbar toggle
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

navToggleBtn.addEventListener("click", function () {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
});

// Smooth scroll for navbar links
document.querySelectorAll('.navbar-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    navbar.classList.remove('active');
    navToggleBtn.classList.remove('active');
  });
});

// Scroll animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(element => observer.observe(element));
};

document.addEventListener('DOMContentLoaded', animateOnScroll);

// Gallery modal
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.querySelector('#gallery-modal');
const modalImg = document.querySelector('#modal-img');
const modalClose = document.querySelector('.modal-close');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImg.src = item.querySelector('.card-banner img').src;
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

// Send to WhatsApp from form
function sendToWA() {
  const nama = document.getElementById('nama').value;
  const alamat = document.getElementById('alamat').value;
  const sewa = document.getElementById('sewa').value;
  const messageEl = document.querySelector('.form-message');

  if (!nama || !alamat || !sewa) {
    messageEl.textContent = 'Harap isi semua kolom!';
    messageEl.className = 'form-message error';
    return false;
  }

  const text = `Halo! Saya ingin menyewa alat.\nNama: ${nama}\nAlamat: ${alamat}\nPilihan: ${sewa}`;
  const url = `https://wa.me/6289671172929?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  messageEl.textContent = 'Pesan terkirim via WhatsApp!';
  messageEl.className = 'form-message success';
  document.querySelector('.contact-form').reset();
  return false;
}