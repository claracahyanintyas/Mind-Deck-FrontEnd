import api from '../Api';

class AuthService {
    register(user) {
        return api.post(`/auth/register`, user);
    }

    guest(){
        return api.post(`/auth/guest`);
    }

    login(credentials) {
        return api.post(`/auth/login`, credentials);
    }

    logout() {
        return api.post(`/auth/logout`);
    }
}

export default new AuthService();