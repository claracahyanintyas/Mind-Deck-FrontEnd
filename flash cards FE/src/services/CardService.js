import api from '../Api';

const REST_API_BASE_URL = `/cards`

class DeckService{

    getCard = (id) => api.get(`${REST_API_BASE_URL}/${id}`);
    
    updateCard = (id, card) => api.put(`${REST_API_BASE_URL}/${id}`, card);

    deleteCard = (id) => api.delete(`${REST_API_BASE_URL}/${id}`);

}

export default new DeckService();

