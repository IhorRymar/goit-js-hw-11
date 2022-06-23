import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
};

const PX_KEY = '28192905-9c9bb1b5a8af58fc3dabc837e';
let findImgs = '';
let numPage = 1;
let perPage = 40;

refs.btnLoad.style.visibility = 'hidden';

async function fetchImages(key, find) {
  try {
    const results = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${find}&image_type=photo&orientation=horizontal&safesearch=true&page=${numPage}&per_page=${perPage}`
    );
    const response = await results.data;
    return response;
  } catch (error) {
    console.log(error);
  }
}

function incrementPage() {
  numPage += 1;
  // return numPage;
}

function resetPage() {
  numPage = 1;
  // return numPage;
}

refs.form.addEventListener('submit', searchForm);
refs.btnLoad.addEventListener('click', loadMore);
refs.gallery.addEventListener('click', showModal);

async function searchForm(evt) {
  evt.preventDefault();

  clearMarkup();
  const findEl = refs.input.value;
  findImgs = findEl;
  resetPage();
  refs.btnLoad.style.visibility = 'hidden';

  const response = await fetchImages(PX_KEY, findImgs);
  try {
    renderGallery(response.hits);
    console.log(response);

    if (findImgs === '') {
      Notify.failure('Field cannot be empty.');
      refs.btnLoad.style.visibility = 'hidden';
    }
    if (response.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.btnLoad.style.visibility = 'hidden';
    }
    if (findImgs !== '' && response.hits.length !== 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      refs.btnLoad.style.visibility = 'visible';
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadMore() {
  incrementPage();
  const response = await fetchImages(PX_KEY, findImgs);
  try {
    renderGallery(response.hits);
    if (response.hits < perPage) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      refs.btnLoad.style.visibility = 'hidden';
      smoothScroll();
    }
  } catch (error) {
    console.log(error);
  }
}

function renderGallery(items) {
  const markup = items
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a href = "${largeImageURL}">
  <img class="image" src="${webformatURL}" alt="${tags}" width = "300" height = "300" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function showModal(evt) {
  evt.preventDefault();

  const lightbox = new SimpleLightbox('.gallery div a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
