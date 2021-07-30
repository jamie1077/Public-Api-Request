const gallery = document.querySelector('#gallery');

let currentIndex = 0;

//Resuable data fetch function that checks the returned promise status, parses and returns json and handles a catch method
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('Looks like there was a problem', error));
}

/* 
    * Fetch request to api(url) using the fetchData function, pulling back data for 12 users
    * Chain a then method to call the functions to generate profiles, generate the modal, handle the click event on the cards 
    * and toggle to modals using the pagination buttons
*/
fetchData('https://randomuser.me/api/?results=12&nat=us,gb')
    .then(data => {
        const employees = data.results;
        generateProfiles(employees);
        generateModal();
        cardHandler(employees);
        toggleModal(employees);
    });


//Check if the returned promise status was set to true, if not activate the catch method in fetchData
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}


/*
   Dynamically adds search bar at the top of the page
*/
const searchContainer = document.querySelector('.search-container');

const searchBar = `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50E;&#xFE0E;" id="search-submit" class="search-submit">
</form>`;

searchContainer.insertAdjacentHTML('beforeend', searchBar);


/* 
    * Pulls employee data from API and maps through each of the 12 employees info, attaches them to the card, 
    * then inserts them into the gallery.
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

//Modal markup set to display none until activated by cardsHandler function
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

/*
    * format the phone number to (XXX) XXX-XXXX for both us and gb phone numbers to use in updateModal() function
    * references from https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
*/
function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}


function updateModal(data) {
    //format date as MM/DD/YYYY
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
            <p class="modal-text">${formatPhoneNumber(data.cell)}</p>
            <p class="modal-text">${data.location.state}, ${data.location.city}, ${data.location.country} ${data.location.postcode}</p>
            <p class="modal-text">Birthday: ${[month]}/${[day]}/${[year]}</p>
        </div>
    `;  
    
    modal.insertAdjacentHTML('afterbegin', employeeData);

    //closes the modal if the close button is clicked or user clicks outside of the modal
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


//Loop through cards and add click to open employee data modal, on load if modal is first or last item in list show relevant pagination
function cardHandler(data){
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

//Show relevant employee data and handle pagination in modals as per data index
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
    });

    prevBtn.addEventListener('click', (e) => {
        nextBtn.style.display = '';
        currentIndex--;
        updateModal(data[currentIndex]);
        if (currentIndex <= 0) {
            prevBtn.style.display = 'none';
        }
    });
}


/*
   Search functionality
*/
const search = document.querySelector('#search-input');
const submit = document.querySelector('#search-submit');

function searchList(){
    const searchInput = search.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        if (!card.querySelector("#name").textContent.toLowerCase().includes(searchInput)) {
            card.style.display = "none";
        }
        else {
            card.style.display = "";
        }
    });
}

submit.addEventListener("click", (e) => {
    e.preventDefault();
    searchList();
});

search.addEventListener("keyup", () => {
    searchList();
});







