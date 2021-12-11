import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    serchInp: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryBox: document.querySelector('.country-info'),
};


refs.serchInp.addEventListener('input', debounce((event) => {
    if (event.target.value.trim() !== '') { 
    fetchCountries(event.target.value)
        .then(country => country.json())
        .then(country => {
            if (country.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
            }
            else if (2 < country.length < 10 && country.length !== 1) {
                createManyCards(country);
            }
            else if (country.length === 1) {
                createOneBigCard(country);
            }
        })
        .catch(() => {
            Notify.failure("Oops, there is no country with that name");
        });
    };
}, DEBOUNCE_DELAY));

refs.serchInp.addEventListener('input', () => {
    refs.countryList.innerHTML = '';
    refs.countryBox.innerHTML = '';
});


function createStyleForManyCards(p1) {
    p1.forEach(li => {
        li.parentNode.style.paddingLeft = 0;
        li.style.display = 'flex';
        li.style.width = '250px';
        li.style.alignItems = 'center';
        li.lastElementChild.style.marginLeft = '15px';
        li.lastElementChild.style.fontWeight = 'bold';
    });
};

function createStyleForOneCard(p1, p2) {
    p1.forEach(li => {
        li.parentNode.style.paddingLeft = 0;
        li.style.display = 'flex';
        li.style.width = '500px';
        li.style.alignItems = 'center';
        li.lastElementChild.style.lineHeight = '20px';
        li.lastElementChild.style.marginLeft = '10px';
        li.lastElementChild.style.fontWeight = 'bold';
        li.lastElementChild.style.fontSize = '40px';
    });
    p2.forEach(p => { 
        p.firstElementChild.style.fontWeight = 'bold';
    });
 };

function createManyCards(p1) {
    p1.forEach(el => {
        refs.countryList.insertAdjacentHTML('afterbegin', `
        <li>
            <img src="${el.flags.svg}" alt='' width=60px height=40px>
            <p>${el.name}</p>
        </li>
        `);
    }); 
    
    createStyleForManyCards([...refs.countryList.children]);
};

function createOneBigCard(p1) {
    p1.forEach(el => {
        const values = Object.values(el.languages[0]);
        refs.countryList.insertAdjacentHTML('afterbegin', `
    <li>
        <img src="${el.flags.svg}" alt='' width=60px height=40px>
        <p>${el.name}</p>
    </li>
    `);
        refs.countryBox.insertAdjacentHTML('afterbegin', `
        <p><span>Capital:</span> ${el.capital}</p>
        <p><span>Population:</span> ${el.population}</p>
        <p><span>Languages:</span> ${values}</p>
        `);
    });
    
    createStyleForOneCard([...refs.countryList.children],[...refs.countryBox.children]);
};

