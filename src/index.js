import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';
import PicApiService from './fetchPictures';
import markupPictures from './makeMarkup';

const refs = {
    form: document.querySelector('[id="search-form"]'),
    picturesContainer: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
}

const picturesApiService = new PicApiService();
let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
refs.loadMoreBtn.classList.add('is-hidden');


function onSearch(event) {
    event.preventDefault();
    let search = event.currentTarget.elements.searchQuery.value.trim();
    if (search.length === 0) {
        Notify.info(`Please enter a request`);
        return
    }
    picturesApiService.query = search;
    picturesApiService.resetPage();
    refs.picturesContainer.innerHTML ="";
    picturesApiService.getPictures().then(response => {
        appendPictures(response.data.hits);
        if (response.data.hits.length !== 0) {
        Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
        refs.loadMoreBtn.classList.remove('is-hidden'); 
        gallery.refresh();
        // infiniteScroll();
    }          
    });

        
}

function appendPictures (items) {
    if (items.length === 0) {
        Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return
    }
    console.log(items)
    refs.picturesContainer.insertAdjacentHTML('beforeend', markupPictures(items))
}

function onLoadMoreBtn () {
    picturesApiService.getPictures().then(response => { 
    appendPictures(response.data.hits) 
    gallery.refresh();
    smoothScroll ()
    const isEndPics = response.data.totalHits < ((picturesApiService.page - 1) * 40);
    if (isEndPics) {
        Notify.warning(`We're sorry, but you've reached the end of search results.`);
        refs.loadMoreBtn.classList.add('is-hidden');
    }
});
}

function smoothScroll () {
    const { height: cardHeight } = refs.picturesContainer.firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
        });
}

// function infiniteScroll () {
//     window.ias = new InfiniteAjaxScroll('.gallery', {
//         item: '.photo-card',
//         next: onLoadMoreBtn(),
//         pagination: false,
//         trigger: '.load-more',
//         logger: false,
//         prefill: false,
//       });
// }
