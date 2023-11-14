import { fetchBreeds, fetchCatByBreed } from './cat-api';

import SlimSelect from 'slim-select';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicSlider from 'basicslider';

import 'modern-normalize';
import 'slim-select/dist/slimselect.css';
import 'basicslider/dist/basicSlider.min.css';
import 'basicslider/dist/themes/default.min.css';
import './css/style.css';

const catInfo = document.querySelector('.cat-section');
const option = {
  select: '.breed-select',
  events: {
    beforeChange: newVal => {
      fetchOnClickBreed(newVal[0]);
    },
  },
};
const select = new SlimSelect(option);

showLoading();
fetchBreeds()
  .then(data => {
    return data.map(cat => {
      return { value: cat.id, text: cat.name };
    });
  })
  .then(cats => {
    select.setData([
      { placeholder: true, text: 'Choose the cat breed' },
      ...cats,
    ]);
  })
  .catch(error => {
    console.log(error);
    Notify.failure('Oops, something went wrong. Reload the page.');
  })
  .finally(() => hideLoading());

function fetchOnClickBreed({ value }) {
  showLoading();
  catInfo.innerHTML = '';
  fetchCatByBreed(value)
    .then(dataCat => {
      renderCatInfo(dataCat);
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, something went wrong. Reload the page.');
    })
    .finally(() => hideLoading());
}

function renderCatInfo(cat) {
  const markupInfoCat = markupCatInfo(cat[0].breeds[0]);
  const imageCat = markupImagesForCarusel(cat);

  const markup = `
      <div id="slider">
      </div>
      ${markupInfoCat}
  `;
  catInfo.innerHTML = markup;

  const instance = basicSlider.create(
    document.querySelector('#slider'),
    imageCat
  );
}
function markupImagesForCarusel(catImages) {
  const markup = [...catImages].map(catImage => {
    const nameCat = catImage.breeds[0].name;

    return `
      <img src='${catImage.url}' width="583" height="500" alt='breed cat ${nameCat}'/>    </li>
    `;
  });
  return markup;
}
function markupCatInfo({ name, description, temperament }) {
  return `
    <div class="cat-info">
      <h1 class="cat-name">${name}</h1>
      <p class="cat-description">${description}</p>
      <p class="cat-temperament"><span class="cat-temperament-title">Temperament: </span>${temperament}</p>
    </div>
  `;
}

function showLoading() {
  Loading.arrows();
  select.disable();
}

function hideLoading() {
  Loading.remove();
  select.enable();
}
