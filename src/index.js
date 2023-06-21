import getRefs from './js/references/get-refs';
import PixabayApiService from './js/api-service';
import galleryItemTpl from './templates/gallery-item.hbs';
import LoadMoreBtn from './js/components/load-more-btn';

const refs = getRefs();
const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  const input = evt.currentTarget.elements.query;
  const searchQuery = input.value.trim();

  if (searchQuery === '') {
    return;
  }

  pixabayApiService.query = searchQuery;
  refs.gallery.innerHTML = '';

  pixabayApiService.resetPage();
  pixabayApiService.fetchImages().then(({ hits }) => {
    renderGallery(hits);
    loadMoreBtn.show();
  });

  evt.target.reset();
}

function onLoadMore() {
  loadMoreBtn.disable();

  pixabayApiService
    .fetchImages()
    .then(({ hits }) => {
      renderGallery(hits);
      loadMoreBtn.enable();

      const lastLoadedImage = refs.gallery.lastElementChild;
      console.log("🚀 ~ file: index.js:46 ~ pixabayApiService.fetchImages ~ lastLoadedImage:", lastLoadedImage)
      lastLoadedImage.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    })
    .then();
}

function renderGallery(images) {
  const markup = galleryItemTpl(images);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
