const gallery = document.querySelector('#gallery');

let currentIndex = 0;

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
        const employees = data.results;
        generateProfiles(employees);
        generateModal();
        cardHandler(employees);
        toggleModal(employees);
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

/* 
    * The generateProfiles function pulls employee data from API and maps through each of the 12 employees info to attach  to the card 
    * that is then added to the gallery. This shows the 12 employees on the web page.
*/
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
               
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
    </div>`
    gallery.insertAdjacentHTML('afterend', markup);
    
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.style.display = 'none';

}

//Function to update modal data
function updateModal(data) {
    const dob = new Date(data.dob.date);
    const [month, day, year] = [dob.getMonth()+1, dob.getDate(), dob.getFullYear()];
    const modal = document.querySelector('.modal');
    modal.innerHTML = '';
   
    const employeeData = `
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
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

    
    const modalCloseBtn = document.querySelector('#modal-close-btn');
    
    modalCloseBtn.addEventListener('click', () => {
        modal.parentElement.style.display = 'none';
    });

    document.addEventListener('click', (e) => { 
        if (e.target.className === 'modal-container') {
            modal.parentElement.style.display = 'none';  
        }
    });
}

function cardHandler(data){
    //Loop through cards and add click to open employee data modal
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            document.querySelector(".modal-container").style.display = "block";
            currentIndex = index;
            updateModal(data[currentIndex]);
            if(currentIndex <= 0){
                document.querySelector('#modal-prev').style.display = 'none';
            }
            if(currentIndex >= 11){
                document.querySelector('#modal-next').style.display = 'none';
                document.querySelector('#modal-prev').style.display = 'block';
            }
        });
    });
}

function toggleModal(data) {
    const prevBtn = document.querySelector("#modal-prev");
    const nextBtn = document.querySelector("#modal-next");
   
    nextBtn.addEventListener('click', (e) => {
        prevBtn.style.display = 'block';
        currentIndex++;
        updateModal(data[currentIndex]);
        if (currentIndex >= 11) {
            nextBtn.style.display = 'none';
        }
    })

    prevBtn.addEventListener('click', (e) => {
        nextBtn.style.display = '';
        currentIndex--;
        updateModal(data[currentIndex]);
        if (currentIndex <= 0) {
            prevBtn.style.display = 'none';
        }
    })
}
















