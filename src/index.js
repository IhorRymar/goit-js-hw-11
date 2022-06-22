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

async function fetchImages(key, find) {
  return fetch(
    `https://pixabay.com/api/?key=${key}&q=${find}&image_type=photo&orientation=horizontal&safesearch=true&page=${numPage}&per_page=10`
  ).then(response => {
    return response.json();
  });
}

function incrementPage() {
  numPage += 1;
  return numPage;
}

function removeMarkup() {
  refs.gallery.innerHTML = '';
}

refs.form.addEventListener('submit', submitForm);
refs.btnLoad.addEventListener('click', loadMore);
refs.gallery.addEventListener('click', showModal);

function submitForm(evt) {
  evt.preventDefault();
  removeMarkup();
  const findEl = refs.input.value;
  findImgs = findEl;
  // console.log(findEl);

  fetchImages(PX_KEY, findImgs)
    .then(response => {
      renderGallery(response.hits);
      // console.log(response);
      if (response.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (findImgs === '') {
        removeMarkup();
      }
    })
    .catch(error => console.log(error));
}

function loadMore() {
  console.log(incrementPage());
  fetchImages(PX_KEY, findImgs).then(response => {
    renderGallery(response.hits);
  });
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

function showModal(evt) {
  evt.preventDefault();

  const lightbox = new SimpleLightbox('.gallery div a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}
