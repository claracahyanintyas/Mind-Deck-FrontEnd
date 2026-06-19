import api from '../Api';

export const ClassroomService = {

  startSession: async (deckId) => {
    try {
      const response = await api.post('/classroom/start', { deckId });
      return response.data; 
    } catch (error) {
      console.error('Error initiating classroom session:', error);
      throw error;
    }
  },
};