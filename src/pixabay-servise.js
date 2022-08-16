export default class PisabayApiServise{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchPhoto() {
        const API_KEY = '29314953-9960e0c1117cd8f48e1da89de';
        const url = `https://pixabay.com/api/?key=${API_KEY}&page=${this.page}&per_page=40&q=${this.searchQuery}&orientation=horizontal&image_type=photo&safesearch=true`;
       
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        }).then(data => {
            this.page += 1;
            return data;
        } );
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
       this.searchQuery = newQuery;
    }
}