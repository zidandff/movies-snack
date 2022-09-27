const API_KEY = 'f5d2f9a681a468ceedcc6c60f57f82ee';
const MOVIES_ENDPOINT = 'https://api.themoviedb.org/3/';
const IMAGES_ENDPOINT = 'https://image.tmdb.org/t/p/';

function requestMovies(url, onSuccess, onError){
    return fetch(url)
    .then(response => response.json())
    .then(onSuccess)
    .catch(onError)
}

function urlRequest(path){
    return `${MOVIES_ENDPOINT}${path}?api_key=${API_KEY}`
}

function searchMovies(keyword){
    if(keyword == "" || keyword == " "){
        console.log("jangan kosong blok");
        return
    }
    const url = urlRequest('search/multi') + `&query=${keyword}`;
    const onError = error => console.log(error);
    requestMovies(url, renderSearchMovies, onError);
    pagging.url = url + '&page='
}

const pagging = {
    url: "",
    totalPage : 1,
    activePage: 1,
    btnPagination : function() {
        let btn = ''
        for(let i = 1; i <= this.totalPage; i++){
            btn += `<li class="pageNumber"><a class="" data-page="${i}">${i}</a></li>`
        }
        return btn
    }
}


function updatePagination(data){
    pagging.page = data.page
    pagging.totalPage = data.total_pages
    document.querySelector('.pagination').innerHTML = pagging.btnPagination()

    const paginationItems = document.querySelectorAll('.pageNumber a')
    paginationItems[pagging.activePage - 1].classList.add('active')

    paginationItems.forEach(btn => {
        btn.addEventListener('click', e => {
            pagging.activePage = btn.innerHTML.toString();

            e.preventDefault();
            const onError = error => console.log(error);
            requestMovies(pagging.url + btn.innerHTML, renderSearchMovies, onError )
        })
    })
}

function renderSearchMovies(data){
    updatePagination(data)
    const movies = data.results;
    let result = "";
    movies.forEach(movie => result += templateCardMovies(movie))
    const mainSection = document.querySelector('main');
    const searchResults = document.querySelector('.search-results');
    const containerResults = document.querySelector('.movie-results-container');
    mainSection.style.display = 'none';
    searchResults.style.display = 'block'
    containerResults.innerHTML = result
}

function trendingMovies(){
    const url = urlRequest('trending/all/week');
    const onError = errorMessage => console.error(errorMessage);
    requestMovies(url, renderTrendingMovies, onError);
}

function renderTrendingMovies(data){
    if(data.success == false){
        throw data.status_message
    }
    let result = "";
    const movies = data.results;
    movies.forEach(movie => result += templateSlider(movie) )

    const sliderWrapper = document.querySelector('.trending .swiper-wrapper');
    const sliderSkeleton = document.querySelector('.slider-movies.skeleton-loading');
    sliderSkeleton.classList.remove('skeleton-loading');
    sliderWrapper.innerHTML = result;
}

function getDetailMovie(movieUrl){
    const url = urlRequest(`${movieUrl}`) + '&append_to_response=videos';
    const onError = error => console.log(error);
    requestMovies(url, renderMovieDetail, onError);
}

function renderMovieDetail(data){
    const modalDetail = document.querySelector('.detail-movie');
    modalDetail.classList.remove('skeleton-loading');
    modalDetail.innerHTML = templateMovieDetail(data);
}

function upcomingMovies(){
    const url = urlRequest('movie/upcoming');
    const onError = error => console.log(error);
    return requestMovies(url, data => data.results , onError);
}

async function renderTopGallery(){
    let result = "";
    const movies = await upcomingMovies();
    movies.length = 15  ;
    movies.forEach(movie => result += templateGalleryTop(movie));
    const topGallery = document.querySelector('.gallery-top .swiper-wrapper')
    document.querySelector('.carousel').classList.remove('skeleton-loading')
    topGallery.innerHTML = result;
    galleryTopInit()
}

function newTrailler(){
    const url = urlRequest('movie/upcoming');
    const onError = error => console.log(error);
    requestMovies(url, renderNewTrailer, onError);
}

function renderNewTrailer(data){
    let result = "";
    const trailers = data.results;
    trailers.length = 10;
    trailers.forEach(trailer => result += templateNewTrailer(trailer));
    const trailerWrapper = document.querySelector('.slider-trailer .swiper-wrapper')
    trailerWrapper.parentElement.classList.remove('skeleton-loading')
    trailerWrapper.innerHTML = result;
}

function playTrailer(trailerUrl){
    const url = urlRequest(trailerUrl) + '&append_to_response=videos'
    requestMovies(url, renderModalTrailer)
}

function renderModalTrailer(data){
    const trailerVideo = data.videos.results
        .filter(trailer => trailer.type == "Trailer" || trailer.type == "Teaser");
    const keyTrailer = trailerVideo[trailerVideo.length - 1].key;
    const trailerEmbed = document.querySelector('.modal-trailer-video');
    trailerEmbed.innerHTML = `<iframe src="https://www.youtube.com/embed/${keyTrailer}" frameborder="0"  title="YouTube video" allowfullscreen></iframe>`;
}


function loadingTrailer(){
    const trailerEmbed = document.querySelector('.modal-trailer-video');
    trailerEmbed.innerHTML = `<iframe src="https://www.youtube.com/embed/" frameborder="0"  title="YouTube video" allowfullscreen></iframe>`
}

function templateGalleryTop({original_title, backdrop_path, poster_path, overview, id}){
    // Limit word if to long
    let str = overview.split(' ');
    if(str.length > 20){
        str.length = 20;
        str = str.join(" ") + "....";
    }
    else {
        str = str.join(" ");
    }

    return `<div class="swiper-slide">
                <img class="bg-gallery" src="${IMAGES_ENDPOINT}w780${backdrop_path || poster_path}" alt="">
                <div class="info-movie-slide">
                    <img src="${IMAGES_ENDPOINT}w342${poster_path}" alt="" class="poster" data-modal-target="#modal" href="movie/${id}">
                    <div>
                        <h1 data-modal-target="#modal" href="movie/${id}">${original_title}</h1>
                        <p>${str}</p>
                    </div>
                </div>
                </div>`
}

function templateCardMovies({original_title, original_name, media_type, release_date, first_air_date, vote_average, poster_path, id}){
    return `<div class="card-wrapper">
                <div class="card-movies">
                    <div class="overlay">
                        <h1>${original_title || original_name}</h1>
                        <p>${release_date || first_air_date}</p>
                        <div><img src="img/star.svg" class="star-slider">${vote_average}</div>
                        <button data-modal-target="#modal" href="${media_type}/${id}">Detail</button>
                    </div>
                    <img src="${IMAGES_ENDPOINT}/w342${poster_path}" alt="">
                </div>
            </div>`
}

function templateNewTrailer({backdrop_path, poster_path, id}){
    return `<div class="swiper-slide" data-target-trailer="#modal-trailer" href="movie/${id}">
                <img src="${IMAGES_ENDPOINT}/w300${backdrop_path || poster_path}" alt="" class="trailer">
                <svg class="play-trailer" xmlns="http://www.w3.org/2000/svg" viewBox="1.5 2 21 21" style="fill:rgba(255, 255, 255, 1);transform:-ms-filter"><path d="M21.593,7.203c-0.23-0.858-0.905-1.535-1.762-1.766C18.265,5.007,12,5,12,5S5.736,4.993,4.169,5.404 c-0.84,0.229-1.534,0.921-1.766,1.778c-0.413,1.566-0.417,4.814-0.417,4.814s-0.004,3.264,0.406,4.814 c0.23,0.857,0.905,1.534,1.763,1.765c1.582,0.43,7.83,0.437,7.83,0.437s6.265,0.007,7.831-0.403c0.856-0.23,1.534-0.906,1.767-1.763 C21.997,15.281,22,12.034,22,12.034S22.02,8.769,21.593,7.203z M9.996,15.005l0.005-6l5.207,3.005L9.996,15.005z"></path></svg>
            </div>`
}

function templateMovieDetail({poster_path, original_title, original_name,  genres, vote_average, overview, videos}){
    let elementTrailer
    if(videos.results.length == 0){
        elementTrailer = `<img src="/dist/img/404-Error.svg" alt="">`
    }
    else {
        const trailer = videos.results.filter(video => video.type == 'Trailer' || video.type == 'Teaser');
        const indexTrailer = trailer.length - 1;
        
        elementTrailer = `<iframe src="https://www.youtube.com/embed/${trailer[indexTrailer].key}" frameborder="0"  title="YouTube video" allowfullscreen></iframe>`;
    }
    return `<div class="poster-detail">
    <img src="${IMAGES_ENDPOINT}w780${poster_path}" alt="">
            </div>
            <div class="detail-info-movie">
                <h1 class="title">${original_title || original_name}</h1>
                <p class="category">${genres.map(genre => genre.name).join(', ')}</p>
                <div class="tabs-info">
                <ul>
                        <li data-tab-target="#details" class="active">DETAILS</li>
                        <li data-tab-target="#episode">EPISODE</li>
                        <li data-tab-target="#review">REVIEWS</li>
                    </ul>
                    <div class="tabs-content">
                        <article id="details" class="active" data-tab-content>
                            
                        <div id="trailer">
                                <h4>Trailer</h4>
                                <div class="trailer-video">
                                    ${elementTrailer}
                                </div>
                                </div>
                            <div id="rating">
                                <h4>Rating</h4>
                                <img src="img/star.svg" alt="">
                                <span><span class="rating-score">${vote_average}</span>/10</span>
                            </div>
                            <div id="Overview">
                                <h4>Overview</h4>
                                <p class="overview">${overview}</p>
                            </div>
                            
                        </article>
                        
                        <article id="episode" data-tab-content>
                        <h1>Ini episode</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio?</p>
                            </article>

                        <article id="review" data-tab-content>
                        <h1>Ini review</h1>
                            
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, tempora necessitatibus?</p>
                        </article>
                    </div>    
                </div>
                </div>
            <div class="option">
                <img src="img/playlist.svg" alt="">
                <img src="img/love.svg" alt="">
                <img src="img/share.svg" alt="">
                </div>`
}

function templateSlider({original_title, original_name, media_type, release_date, first_air_date, vote_average, poster_path, id}){
    return `<div class="swiper-slide">
                <div class="card-movies">
                    <div class="overlay">
                    <h1>${original_title || original_name}</h1>
                        <p>${release_date || first_air_date}</p>
                        <div><img src="img/star.svg" class="star-slider">${vote_average}</div>
                        <button data-modal-target="#modal" href="${media_type}/${id}">Detail</button>
                        </div>
                        <img src="${IMAGES_ENDPOINT}w185/${poster_path}" alt="">
                        </div>
            </div>`
}

function templateDetailLoading(){
    const modalDetail = document.querySelector('.detail-movie');
    modalDetail.classList.add('skeleton-loading');
    modalDetail.innerHTML = `<div class="poster-detail">
                <div></div>
                </div>
                <div class="detail-info-movie">
                <h1 class="title"></h1>
                <p class="box-wide"></p>
                <div class="tabs-info">
                <ul>
                        <li></li>
                        <li></li>
                        <li ></li>
                    </ul>
                    <div class="tabs-content">
                    <article id="details" class="active" data-tab-content>
                            
                    <div id="trailer">
                                <div class="trailer-video">
                                
                                </div>
                            </div>
                            <div id="rating">
                                
                            </div>
                            <div id="Overvie">
                                <p class="box-wide"></p>
                                <p class="box-wide"></p>
                                <p class="box-wide"></p>
                            </div>
                            
                        </article>
                    </div>    
                    </div>
            </div>`
        }
trendingMovies()
renderTopGallery()
newTrailler()