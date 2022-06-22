import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const KEY = '28192905-9c9bb1b5a8af58fc3dabc837e';
let findImages = '';
let numberPage = 1;
console.log(form);
console.log(input);
console.log(gallery);
console.log(btnLoadMore);

async function fetchImages(key, find) {
  return fetch(
    `https://pixabay.com/api/?key=${key}&q=${find}&image_type=photo&orientation=horizontal&safesearch=true&page=${numberPage}&per_page=4`,
  ).then(response => {
    return response.json();
  });
}

function incrementPage() {
  numberPage += 1;
  return numberPage;
}

form.addEventListener('submit', submitForm);
btnLoadMore.addEventListener('click', loadMore);
function loadMore() {
  console.log(incrementPage());
  fetchImages(KEY, findImages).then(response => {
    renderImages(response.hits);
  });
}

function submitForm(e) {
  e.preventDefault();
  removeMarcup();
  const findToInput = input.value;
  findImages = findToInput;
  console.log(findToInput);

  fetchImages(KEY, findImages)
    .then(response => {
      renderImages(response.hits);
      console.log(response);
      if (response.hits.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }
      if (findToInput === '') {
        removeMarcup();
      }
    })
    .catch(error => console.log(error));
}

function renderImages(items) {
  const marcup = items
    .map(
      ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <a href = "${largeImageURL}">
  <img class="image" src="${webformatURL}" alt="${tags}" width = "300" height = "300" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`,
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', marcup);
}

function removeMarcup() {
  gallery.innerHTML = '';
}

gallery.addEventListener('click', showModal);

function showModal(e) {
  e.preventDefault();

  new SimpleLightbox('.gallery .photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}
