import axios from 'axios';
import api from '../Api';

const API_URL = `/reviews`

export const ReviewService = {
  // Matches: POST /api/reviews/deck/{id}
  startSession: async (deckId) => {
    const response = await api.post(`${API_URL}/deck/${deckId}`);
    return response.data; 
  },

  // Matches: POST /api/reviews/{reviewId}/cards/{cardId}?choice=CHOICE
  submitChoice: async (reviewId, reviewCardId, choice) => {
    const response = await api.post(`${API_URL}/${reviewId}/cards/${reviewCardId}`, null, {
      params: { choice: choice }
    });
    return response.data; 
  }
};