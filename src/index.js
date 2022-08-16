import './css/styles.css';
import Notiflix from 'notiflix';
import PisabayApiServise from './pixabay-servise';

const refs = {
    formEl: document.querySelector('#search-form'),
    boxForGallery: document.querySelector('.gallery'),
loadMoreBtn: document.querySelector('.load-more'),
}

const pisabayApiServise = new PisabayApiServise();

refs.formEl.addEventListener('submit', searchPhoto);
refs.loadMoreBtn.addEventListener('click', loadMorePhoto);

function searchPhoto(e) {
    e.preventDefault();

    clearContent();
    pisabayApiServise.query = e.currentTarget.elements.searchQuery.value.trim();
    if (pisabayApiServise.query === '') {
        Notiflix.Notify.info(
          'Please enter something.'
        );
        return;
    }
    pisabayApiServise.resetPage();
    pisabayApiServise.fetchPhoto()
        .then((photos) => {
             if (photos.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            }
                insertContent(photos.hits); 
        } 
        );
}

function loadMorePhoto() {
    pisabayApiServise.fetchPhoto().then((photos) => insertContent(photos.hits));
}
function insertContent(photos) {
    refs.boxForGallery.insertAdjacentHTML('beforeend', createCardWithPhoto(photos));
  
}
function createCardWithPhoto(photos) {
  return photos
    .map(
      photo =>   `<div class="photo-card">
  <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" width= "300px"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${photo.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${photo.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${photo.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${photo.downloads}</b>
    </p>
  </div>
</div> `)
    .join('');
}
function clearContent() {
  refs.boxForGallery.innerHTML = '';
}
