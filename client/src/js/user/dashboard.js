const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// OJT Recommendation Modal Functionality
const ojtRecommendationBtn = document.querySelector('.report');
const ojtRecommendationModal = document.getElementById('ojtRecommendationModal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// Open modal when OJT Recommendation button is clicked
ojtRecommendationBtn.addEventListener('click', function(e) {
    e.preventDefault();
    ojtRecommendationModal.style.display = 'block';
});

// Close modal when close buttons are clicked
closeModalButtons.forEach(button => {
    button.addEventListener('click', function() {
        ojtRecommendationModal.style.display = 'none';
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', function(e) {
    if (e.target === ojtRecommendationModal) {
        ojtRecommendationModal.style.display = 'none';
    }
});