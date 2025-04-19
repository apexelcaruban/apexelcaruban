'use strict';

/**
 * element toggle function
 */
const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }

/**
 * header sticky & go to top
 */
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

/**
 * navbar toggle
 */
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

navToggleBtn.addEventListener("click", function () {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);
});

/**
 * skills toggle
 */
const toggleBtnBox = document.querySelector("[data-toggle-box]");
const toggleBtns = document.querySelectorAll("[data-toggle-btn]");
const skillsBox = document.querySelector("[data-skills-box]");

for (let i = 0; i < toggleBtns.length; i++) {
  toggleBtns[i].addEventListener("click", function () {
    elemToggleFunc(toggleBtnBox);
    for (let i = 0; i < toggleBtns.length; i++) {
      elemToggleFunc(toggleBtns[i]);
    }
    elemToggleFunc(skillsBox);
  });
}

/**
 * dark & light theme toggle
 */
const themeToggleBtn = document.querySelector("[data-theme-btn]");

themeToggleBtn.addEventListener("click", function () {
  elemToggleFunc(themeToggleBtn);

  if (themeToggleBtn.classList.contains("active")) {
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");
    localStorage.setItem("theme", "light_theme");
  } else {
    document.body.classList.add("dark_theme");
    document.body.classList.remove("light_theme");
    localStorage.setItem("theme", "dark_theme");
  }
});

/**
 * check & apply last time selected theme from localStorage
 */
if (localStorage.getItem("theme") === "dark_theme") {
  themeToggleBtn.classList.remove("active");
  document.body.classList.remove("light_theme");
  document.body.classList.add("dark_theme");
} else {
  themeToggleBtn.classList.add("active");
  document.body.classList.remove("dark_theme");
  document.body.classList.add("light_theme");
}

/**
 * Counter animation for stats section
 */
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('#stats');

const animateCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const duration = 1500; // Durasi animasi dalam milidetik (1.5 detik)
  const increment = target / (duration / 16); // Kecepatan increment berdasarkan 60 FPS (16ms per frame)
  let count = 0;

  const updateCount = () => {
    count += increment;
    if (count < target) {
      counter.textContent = Math.ceil(count);
      requestAnimationFrame(updateCount);
    } else {
      counter.textContent = target;
    }
  };

  updateCount();
};

// Menggunakan IntersectionObserver untuk memulai animasi saat elemen terlihat
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(counter => {
        if (!counter.classList.contains('animated')) {
          animateCounter(counter);
          counter.classList.add('animated'); // Tandai bahwa elemen sudah dianimasikan
        }
      });
      observer.unobserve(entry.target); // Hentikan pengamatan setelah animasi dimulai
    }
  });
}, { threshold: 0.5 });

observer.observe(statsSection);

/**
 * send to WhatsApp from form
 */
function sendToWA() {
  const nama = document.getElementById('nama').value;
  const alamat = document.getElementById('alamat').value;
  const sewa = document.getElementById('sewa').value;
  const text = `Halo! Saya ingin menyewa alat.\nNama: ${nama}\nAlamat: ${alamat}\nPilihan: ${sewa}`;
  const url = `https://wa.me/6289671172929?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  return false;
}