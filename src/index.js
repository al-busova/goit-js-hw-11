import './css/styles.css';
import Notiflix from 'notiflix';
import PisabayApiServise from './pixabay-servise';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  formEl: document.querySelector('#search-form'),
  boxForGallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const pisabayApiServise = new PisabayApiServise();
const lightBoxGallery = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 250,
  captionPosition: "bottom",
});

refs.formEl.addEventListener('submit', searchPhoto);
refs.loadMoreBtn.addEventListener('click', loadMorePhoto);

function searchPhoto(e) {
  e.preventDefault();

  clearContent();

  pisabayApiServise.query = e.currentTarget.elements.searchQuery.value.trim();
  if (pisabayApiServise.query === '') {
    Notiflix.Notify.info('Please enter something.');
    return;
  }

  pisabayApiServise.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');
  //      логіка через звичайні проміси
  // pisabayApiServise.fetchPhoto()
  //       .then((photos) => {
  //         if (photos.totalHits === 0) {
  //               Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  //               return;
  //         }
  //         Notiflix.Notify.info(`Hooray! We found ${photos.totalHits} images.`);
  //         refs.loadMoreBtn.classList.remove("is-hidden");
  //         insertContent(photos.hits);
  //       }
  //   );
  const insertCollection = async () => {
    try {
      const photos = await pisabayApiServise.fetchPhoto();
      if (photos.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      refs.loadMoreBtn.classList.remove('is-hidden');
      insertContent(photos.hits);
    } catch (error) {
      Notiflix.Notify.failure(error.message);

      console.log(error);
    }
  };
  insertCollection();
}

function loadMorePhoto() {
  pisabayApiServise.fetchPhoto().then(photos => insertContent(photos.hits));
}

async function insertContent(photos) {
  refs.boxForGallery.insertAdjacentHTML(
    'beforeend',
    createCardWithPhoto(photos)
  );
 lightBoxGallery.refresh();
  const elemCount =
    document.getElementsByClassName('gallery')[0].childElementCount;
  if (elemCount === pisabayApiServise.totalHits) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
  {
    timeout: 10000,
  },
    );
  }
}

function createCardWithPhoto(photos) {
  return photos
    .map(
      photo => `<div class="photo-card">
      <a class="gallery__item" href="${photo.largeImageURL}">
  <img class="gallery__image" src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy"/>
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes </b><b><span>${photo.likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views </b><b><span>${photo.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments </b><b><span>${photo.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads </b><b><span>${photo.downloads}</span></b>
    </p>
  </div>
</div> `
    )
    .join('');
}
function clearContent() {
  refs.boxForGallery.innerHTML = '';
}
