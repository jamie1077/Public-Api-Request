const gallery = document.querySelector('#gallery');
const body = document.querySelector('body');

let currentCard = 0;

// ------------------------------------------
//  FETCH FUNCTION
// ------------------------------------------
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Looks like there was a problem', error));
}

fetchData('https://randomuser.me/api/?results=12&nat=us')
    .then(data => {
        const users = data.results;
        generateProfiles(users);
        generateModal();
        toggleModal(users);
        cardsHandler(users);
    });


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------   
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


//Function for modal markup + modal closes if user clicks outside of modal
function generateModal() {
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
    });
}

//Function to update modal data
function updateModal(data) {
    const dob = new Date(data.dob.date);
    const [month, day, year] = [dob.getMonth()+1, dob.getDate(), dob.getFullYear()];
    const modal = document.querySelector('.modal');
    modal.innerHTML = '';
   
    const employeeData = `
        <div class="modal-info-container">
            <img class="modal-img" src="${data.picture.large}" alt="${data.name.first} ${data.name.last}">
            <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
            <p class="modal-text">${data.email}</p>
            <p class="modal-text cap">${data.location.city}</p>
            <hr>
            <p class="modal-text">${data.phone}</p>
            <p class="modal-text">${data.location.state}, ${data.location.city}, ${data.location.country} ${data.location.postcode}</p>
            <p class="modal-text">Birthday: ${[month]}/${[day]}/${[year]}</p>
        </div>
    `;  
    
    modal.insertAdjacentHTML('afterbegin', employeeData);
}

function toggleModal(data) {
    const prevBtn = document.querySelector("#modal-prev");
    const nextBtn = document.querySelector("#modal-next");
    let currentIndex = 0;
   
    prevBtn.addEventListener("click", (e) => {
      if (currentIndex === 0) {
        currentIndex = data.length -1;
   
      } else {
        currentIndex--;
     
      }
      updateModal(data[currentIndex]);
    });

    nextBtn.addEventListener("click", (e) => {
        if (currentIndex === 11) {
            currentIndex = data.length - 1;
        } else {
          currentIndex++;
        }
        updateModal(data[currentIndex]);
    });

  }

//Function to handle the click on the cards
function cardsHandler(data) {
    const cards = document.querySelectorAll('.card');
    const nextBtn = document.querySelector('#modal-next');
    const prevBtn = document.querySelector('#modal-prev');

    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', (e) => {
            document.querySelector('.modal-container').style.display = 'block';
            updateModal(data[i]);

            //if card is first in list remove 'prev' button and if card is last in list remove 'next' button
            if (i === 0) {
                prevBtn.style.display = 'none';
            } else{
                prevBtn.style.display = 'block';
            }
           
            if (i === 11) {
                nextBtn.style.display = 'none';
            } else{
                nextBtn.style.display = 'block';
            }
            
        })
    }  
}
















