const gallery = document.querySelector('#gallery');
const cards = document.querySelectorAll('.card');

//Fetch 12 random users from the random user api
fetch('https://randomuser.me/api/?results=12')
    //parse the response to JSON which returns a promise
    .then(response => response.json())
    //call the generate profiles function and pass in the api data results
    .then(data => generateProfiles(data.results))


//Gallery Profiles
function generateProfiles(data){
    const profiles = data.map(profile => `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${profile.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
            <p class="card-text">${profile.email}</p>
            <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
        </div>
    </div>
    `)
    gallery.insertAdjacentHTML('beforeend', profiles);
}


