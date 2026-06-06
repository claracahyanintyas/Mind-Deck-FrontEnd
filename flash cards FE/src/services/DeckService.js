import api from '../Api';

const REST_API_BASE_URL = `/decks`

class DeckService{

    getAllDecks = () => api.get(`${REST_API_BASE_URL}`);

    getDeck = (id) => api.get(`${REST_API_BASE_URL}/${id}`);

    createDeck = (deck) => api.post(`${REST_API_BASE_URL}`, deck);

}

export default new DeckService();

