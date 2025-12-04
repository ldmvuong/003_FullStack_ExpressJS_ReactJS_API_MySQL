import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name, email, password
  }
  return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email, password
  }
  return axios.post(URL_API, data)
}

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API)
}

const getProductApi = (params) => {
    const URL_API = '/v1/api/products';
    // Truyền params vào config của axios
    // Axios sẽ tự động chuyển object params thành: ?page=1&limit=10&keyword=Samsung...
    return axios.get(URL_API, {
        params: params
    });
}

// Product Detail API
const getProductDetailApi = (productId) => {
    const URL_API = `/v1/api/product/${productId}`;
    return axios.get(URL_API);
}

// Favorites APIs
const getFavoritesApi = () => {
    const URL_API = '/v1/api/favorites';
    return axios.get(URL_API);
}

const toggleFavoriteApi = (productId) => {
    const URL_API = '/v1/api/favorite';
    return axios.post(URL_API, { productId });
}

const removeFavoriteApi = (productId) => {
    const URL_API = `/v1/api/favorite/${productId}`;
    return axios.delete(URL_API);
}

// Review API
const createReviewApi = (productId, rating, comment) => {
    const URL_API = '/v1/api/review';
    return axios.post(URL_API, { productId, rating, comment });
}

export {
  createUserApi, loginApi, getUserApi, getProductApi,
  getProductDetailApi, getFavoritesApi, toggleFavoriteApi, removeFavoriteApi, createReviewApi
}