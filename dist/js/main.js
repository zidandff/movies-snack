// Selecting elements from the DOM
const hamburger = document.querySelector('.hamburger');
const navWrapper = document.querySelector('.nav-links');
const body = document.getElementsByTagName('body')[0];
const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]')
const openModalsButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButton = document.querySelector('[data-close-modal]');
const playTrailerBtn = document.querySelectorAll('[data-target-trailer]');
const closeModalTrailer = document.querySelector('[data-close-modal-trailer]');
const modalDetail = document.querySelector('#modal');
const modalTrailer = document.querySelector('#modal-trailer');
const sliderWrapper = document.querySelectorAll('.slider-movies');
const searchbox = document.querySelector('.search-input');
const CTAbackHome = document.querySelector('.back-home');
const searchResults = document.querySelector('.search-results');
const mainSection = document.querySelector('main');

// event handler search movies
searchbox.addEventListener('keyup', (event)=> {
    if(event.key == "Enter" || event.keycode == 13){
        searchMovies(searchbox.value)
    }
})

// event handler back to home
CTAbackHome.addEventListener('click', (e)=> {
    e.preventDefault();
    searchResults.style.display = 'none';
    mainSection.style.display = 'block'
    searchbox.value = ""
})

// event handler hamburger toggle
hamburger.addEventListener('click', function(){
    body.classList.toggle('overflow-hidden');
    this.classList.toggle('active');
    navWrapper.classList.toggle('collapse');
})

// accessibility detail movie
// document.addEventListener('keyup', function(e){
//     let buttonDetail = e.target
//     if(e.which == 9 || e.keyCode == 9){
//         if(buttonDetail.hasAttribute('data-modal-target')){
//             const buttonDetails = document.querySelectorAll('.overlay');
//             buttonDetails.forEach(btn => btn.classList.remove('active'))

//             buttonDetail.parentElement.classList.add('active')
//         }
//     }
// })

// Open modal on click in any movies
document.addEventListener('click', async function(event){
    if(event.target.hasAttribute('data-modal-target')){
        const buttonDetail = event.target;
        event.preventDefault()
        const movieTarget = buttonDetail.getAttribute('href');
        updateModal();
        getDetailMovie(movieTarget)
    }
    else if(event.target.hasAttribute('data-target-trailer')){
        const trailerSlider = event.target;
        modalTrailer.classList.add('active');
        playTrailer(trailerSlider.getAttribute('href'))
    }
    else if(event.target == modalDetail){
        updateModal();
        templateDetailLoading();
    }
    else if(event.target == modalTrailer){
        modalTrailer.classList.remove('active')
        loadingTrailer()
    }
})
// close modal trailer
closeModalTrailer.addEventListener('click', ()=> {
    modalTrailer.classList.remove('active')
    loadingTrailer()
})
// close modal
closeModalButton.addEventListener('click', ()=> {
    updateModal();
    templateDetailLoading();
})

function updateModal(){
    modalDetail.classList.toggle('active');
    body.classList.toggle('overflow-hidden');
}

// Event handler Tabs
// Detail tabs modal
tabs.forEach(tab => {
    tab.addEventListener('click', function(){
        
        tabs.forEach(tab => tab.classList.remove('active'))
        tabContents.forEach(tabContent => tabContent.classList.remove('active') )
        
        const tabTarget = document.querySelector(this.dataset.tabTarget)
        tabTarget.classList.add('active')
        this.classList.add('active')
    })
})



// Init slider 
const slideMovies = new Swiper('.slider-movies', {
    slidesPerView: 'auto',
    spaceBetween: 14,
    autoplay: true,
    freeMode: true,
    observer: true,
    navigation : {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        767: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 5,
            freeMode: false,
        }
    }
});

// Init main gallery
function galleryTopInit(){
    const galleryTop = new Swiper('.gallery-top', {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        centeredSlides: true,
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        observer: true,
        loop: true,
        spaceBetween: 15,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });    
}


// Init slider trailer
const slideTrailer = new Swiper('.slider-trailer', {
    slidesPerView: 'auto',
    spaceBetween: 14,
    autoplay: {
        disableOnInteraction: false,
    },
    observer: true,
    breakpoints: {
        767: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        }
    }
});

sliderWrapper.forEach(swiper => {
    swiper.addEventListener('mouseover', function() {
        slideMovies.autoplay.stop()
    })
    swiper.addEventListener('mouseout', function() {
        slideMovies.autoplay.start()
    })
})
