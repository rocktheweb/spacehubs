import '../sass/main.scss';

const navToggler = document.querySelector('.navbar-toggler');

navToggler.addEventListener('click', (e) => {
    e.currentTarget.parentElement.classList.toggle('navbar--active');
    document.body.classList.toggle('menu-open');
});