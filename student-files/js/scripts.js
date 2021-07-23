const gallery = document.querySelector('#gallery');
const body = document.querySelector('body');

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Looks like there was a problem', error));
}

fetchData('https://randomuser.me/api/?results=12&nat=us')
    .then(data => {
        const users = data.results
        generateProfiles(users)
        modalMarkup()
        cardsHandler(users)
    });
     
//Helper functions
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}

//Gallery Profiles
function generateProfiles(data){
    const profiles = data.map(profile => `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${profile.picture.large}" alt="${profile.name.first} ${profile.name.last}">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
            <p class="card-text">${profile.email}</p>
            <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
        </div>
    </div>
    `).join('');
    
    gallery.insertAdjacentHTML('beforeend', profiles);
}

//Function to handle the click on the cards
function cardsHandler(data) {
    const cards = document.querySelectorAll('.card');

    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', (e) => {
            document.querySelector('.modal-container').style.display = 'block';
            updateModal(data[i]);
        })
    }
}
//Function for modal markup + modal closes if user clicks outside of modal
function modalMarkup() {
    const markup =  `
    <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
    </div>`
    gallery.insertAdjacentHTML('afterend', markup);
    
    const modalContainer = document.querySelector('.modal-container');
    const modalCloseBtn = document.querySelector('#modal-close-btn');
    
    modalContainer.style.display = 'none';
    
    modalCloseBtn.addEventListener('click', () => {
        modalContainer.style.display = 'none';
        document.querySelector('.modal-info-container').remove();
    });

    document.addEventListener('click', (e) => { 
        if (e.target.className === 'modal-container') {
        modalContainer.style.display = 'none';
        document.querySelector('.modal-info-container').remove();
        }
    })
}
//Function to update modal data
function updateModal(data) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const dob = `${data.dob.date.substring(0,10)}`;
    const cell = `${data.cell.substring(0,14)}`
    const cellRegex = /^.(\d{3}).-(\d{3})-(\d{4})$/
    
    const addData = `
            <div class="modal-info-container">
                <img class="modal-img" src="${data.picture.large}" alt="${data.name.first} ${data.name.last}">
                <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
                <p class="modal-text">${data.email}</p>
                <p class="modal-text cap">${data.location.city}</p>
                <hr>
                <p class="modal-text">${cell.replace(cellRegex, `($1) $2-$3`)}</p>
                <p class="modal-text">${data.location.state}, ${data.location.city}, ${data.location.country} ${data.location.postcode}</p>
                <p class="modal-text">Birthday: ${dob.replace(regex, `$2/$3/$1`)}</p>
            </div>
        `    
    const modalContainer = document.querySelector('.modal');
    modalContainer.insertAdjacentHTML('afterbegin', addData);
}












