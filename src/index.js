import Notiflix from 'notiflix';
import ImagesApiService from './images_service';
import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  // captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  scrollZoom: false,
});

const imagesApiService = new ImagesApiService();

const Handlebars = require('handlebars');
const template = Handlebars.compile(
  "<div class='photo-card'><a href={{webformatURL}} class='gallery__link'><img class='gallary__image' loading='lazy' style='width: 100%; height: auto' src={{largeImageURL}} alt={{tags}} /></a><div class='info'><p class='info-item'><b>Likes</b><br>{{likes}}</p><p class='info-item'><b>Views</b><br>{{views}}</p><p class='info-item'><b>Comments</b><br>{{comments}}</p><p class='info-item'><b>Downloads</b><br>{{downloads}}</p></div></div>"
);

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  btnSearch: document.querySelector('.search'),
  btnLoadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  submitSpinner: document.querySelector('.submit__spinner'),
  loadMoreSpinner: document.querySelector('.load-more__spinner'),
};

refs.form.addEventListener('submit', handleSubmit);
refs.btnLoadMore.addEventListener('click', handleLoadMore);

refs.btnLoadMore.style = 'display:none';

async function handleSubmit(event) {
  event.preventDefault();
  clearGallery();
  refs.btnLoadMore.style = 'display:none';

  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  if (imagesApiService.query === '') {
    Notiflix.Notify.failure('Sorry, nothing entered. Please try again.');

    return;
  }

  imagesApiService.resetPage();

  refs.submitSpinner.style = 'display:block';
  try {
    const responseApi = await axios.get(imagesApiService.getImagesApi());
    addMarkup(responseApi);
  } catch (error) {
    console.log(error);
  }

  refs.form.reset();
}

async function handleLoadMore(event) {
  refs.loadMoreSpinner.style = 'display:block';

  try {
    const responseApi = await axios.get(imagesApiService.getImagesApi());
    addMarkup(responseApi);
  } catch (error) {
    console.log(error);
  }
}

async function addMarkup({ data }) {
  buttonsDisabledTrue();

  let markup = data.hits
    .map(image =>
      template({
        webformatURL: image.largeImageURL,
        largeImageURL: image.webformatURL,
        tags: image.tags,
        likes: image.likes,
        views: image.views,
        comments: image.comments,
        downloads: image.downloads,
      })
    )
    .join('');

  refs.gallery.insertAdjacentHTML(
    'beforeend',
    `<div class=gallery__item${imagesApiService.pagePixabay} data-display=gallery__i style = 'opacity: 0; position: absolute;z-index: -1'></div>`
  );
  const photoCardEL = document.querySelector(
    `.gallery__item${imagesApiService.pagePixabay}`
  );
  photoCardEL.insertAdjacentHTML('beforeend', markup);

  gallery.refresh();

  const timerId = setTimeout(() => {
    photoCardEL.style = 'opacity: 1; z-index: 1';
    refs.btnLoadMore.style = 'display:block';
    refs.btnSearch.disabled = false;
    refs.btnLoadMore.disabled = false;

    buttonSpinerDisplayNone();

    if (imagesApiService.pagePixabay === 2 && data.hits.length !== 0)
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }, 3000);

  if (imagesApiService.pagePixabay === 2 && data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    buttonSpinerDisplayNone();

    buttonsDisabledFalse();

    clearTimeout(timerId);
    return;
  }
  if (imagesApiService.pagePixabay !== 2 && data.hits.length === 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );

    buttonSpinerDisplayNone();

    refs.btnLoadMore.style = 'display:none';

    buttonsDisabledFalse();

    clearTimeout(timerId);
    return;
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
function buttonSpinerDisplayNone() {
  refs.submitSpinner.style = 'display:none';
  refs.loadMoreSpinner.style = 'display:none';
}
function buttonsDisabledFalse() {
  refs.btnSearch.disabled = false;
  refs.btnLoadMore.disabled = false;
}

function buttonsDisabledTrue() {
  refs.btnSearch.disabled = true;
  refs.btnLoadMore.disabled = true;
}
