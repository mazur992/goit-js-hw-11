export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.pagePixabay = 1;
  }
  // fetchImages() {
  //   const PIXABAY_API = 'https://pixabay.com/api/';
  //   const MY_PIXABAY_KEY = '34897790-a423b54c5255b60572e3509aa';
  //   let fetchName = `${PIXABAY_API}?key=${MY_PIXABAY_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pagePixabay}&per_page=40`;

  //   return fetch(fetchName).then(response => {

  //     if (!response.ok) {
  //       throw new Error(response.status);
  //     }
  //     this.incrementPage();

  //     return response.json();
  //   });
  // }

  getImagesApi() {
    const PIXABAY_API = 'https://pixabay.com/api/';
    const MY_PIXABAY_KEY = '34897790-a423b54c5255b60572e3509aa';
    let fetchName = `${PIXABAY_API}?key=${MY_PIXABAY_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.pagePixabay}&per_page=40`;
    this.incrementPage();

    return fetchName;
  }

  incrementPage() {
    this.pagePixabay += 1;
  }
  resetPage() {
    this.pagePixabay = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
