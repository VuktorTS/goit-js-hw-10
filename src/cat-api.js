import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_VtiXmRE9sErrcVHXAb1UKDQXuI3LqYrlyarqxd6iBz2AJmKDhmCsqE2DJ3xetw10';

const instance = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
});

function fetchBreeds() {
  return instance.get('/breeds').then(response => response.data);
}

function fetchCatByBreed(breedId) {
  const params = {
    breed_ids: breedId,
    limit: 20,
  };

  return instance
    .get(`/images/search`, { params })
    .then(response => response.data);
}

export { fetchBreeds, fetchCatByBreed };
