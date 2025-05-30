const toggle = document.getElementById('navbar-toggle');
const menu = document.querySelector('.navbar__list');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('is-active'); // clase genérica
  });

  document.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-active');
    });
  });
}
