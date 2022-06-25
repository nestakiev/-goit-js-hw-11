const API_KEY = 'key=28262230-06a9bc056ad9b220b5bf9e6d0';
const BASE_URL = "https://pixabay.com/api/";
const base_filter = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class PicApiService {
   constructor (){
      this.searchQuery = "";
      this.page = 0;
   }

   async getPictures() {
         const url = `${BASE_URL}?${API_KEY}&q=${this.searchQuery}&${base_filter}&page=${this.page}`
         const axios = require('axios').default;
         this.page += 1;
         try {
            const response = await axios.get(url);
            
            return response;
         } catch (error) {
           console.error(error);
         }
       }
   
      incrementPage () {
         this.page += 1;
      }

      resetPage () {
         this.page = 1;
      }

      get query () {
         return this.searchQuery
      }

      set query (newQuery) {
         this.searchQuery = newQuery;
      }
}