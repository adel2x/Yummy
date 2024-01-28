let sidebar = document.getElementById('sidebar');
let toggleBtn = document.getElementById('toggleBtn');
let navHeader = document.getElementById('nav-header');
let headerIcon = document.getElementById('header-icon');

toggleBtn.addEventListener('click', function () {

    if (sidebar.style.width === '242px') {
        sidebar.style.width = '0';
        navHeader.style.right = '242px';
        headerIcon.classList.replace('fa-x', 'fa-align-justify');
    } else {
        sidebar.style.width = '242px';
        navHeader.style.right = '0';
        headerIcon.classList.replace('fa-align-justify', 'fa-x');
    }
});


// =================================


let loader = document.getElementById('main-loader');
let innerLoader = document.getElementById('inner-loading-screen');
let rowData = document.getElementById('Data');
let searchContainer = document.getElementById('searchContainer');


document.addEventListener('DOMContentLoaded', function () {
    // Document is fully loaded

    loader.style.display = 'none';

}
)

/// search container filling

function writeSearch() { // work when click on search container
    searchContainer.innerHTML = `
    <div class="row m-auto py-4 ">
        <div class="col-md-6 px-5">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white px-3" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6 px-5">
            <input onkeyup="searchByFirst(this.value)" maxlength="1" class="form-control bg-transparent text-white px-3" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    rowData.innerHTML = ""
}

async function searchByName(name) {
    rowData.innerHTML = '';

    // Add fadeIn class to show the loader
    innerLoader.classList.replace('fadeOut', 'fadeIn');

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    response = await response.json();
    // console.log(response.meals.length);
    displayMeals(response.meals);

    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader
        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);
}


async function searchByFirst(first) {
    rowData.innerHTML = '';

    // Add fadeIn class to show the loader
    innerLoader.classList.replace('fadeOut', 'fadeIn');

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${first}`);
    response = await response.json();
    // console.log(response.meals.length);
    if (response.meals) displayMeals(response.meals);
    else displayMeals(emptyarray);

    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader
        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);
}

// Display All meals we have first open
let emptyarray = [];
searchByName(emptyarray);


function displayMeals(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 click-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }


    rowData.innerHTML = cartoona;
}



async function getMealDetails(id) {

    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = '';

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    response = await response.json();
    // console.log(response.meals.length);
    displayMealsDetails(response.meals[0])

    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader
        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);
}

function displayMealsDetails(arr) {

    searchContainer.innerHTML = "";

    let listIngredient = '';
    for (let i = 1; i <= 20; i++) {
        listIngredient += `<li class="w-fit alert alert-info m-2 p-1">${arr[`strMeasure${i}`]} ${arr[`strIngredient${i}`]}</li>`;
    }
    // ingredient list is ready now >>>

    let tags = arr.strTags?.split(',').map(tag => tag.trim()) || [];
    let listTags = '';

    for (let i = 0; i < tags.length; i++) {
        listTags += `<li class="w-fit alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }

    // tags is ready now if found

    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${arr.strMealThumb}"
                    alt="">
                    <h2>${arr.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${arr.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${arr.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${arr.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="d-flex g-2 flex-wrap">
                    ${listIngredient}
                </ul>

                <h3>Tags :</h3>
                <ul class="d-flex g-2 flex-wrap">
                    ${listTags}
                </ul>

                <a target="_blank" href="${arr.strSource}" class="btn btn-secondary">Source</a>
                <a target="_blank" href="${arr.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

    rowData.innerHTML = cartoona;
}

async function getCategories() {

    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = ""
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)
    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader 

        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);

}

function displayCategories(arr) {

    let cartonaa = ``;

    for (let i = 0; i < arr.length; i++) {
        cartonaa += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 click-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 15).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartonaa;
}

async function getCategoryMeals(category) {

    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = ""
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()

    displayMeals(response.meals)
    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader 

        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);

}


// Area Time !! 

async function getAreaList() {

    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();

    displayArea(response.meals);
    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader 

        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 1000);
}


function displayArea(arr) {
    let cartonaa = ``;

    for (let i = 0; i < arr.length; i++) {
        cartonaa += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center click-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartonaa;
}

async function getAreaMeals(area) {
    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();

    displayMeals(response.meals)
    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader 

        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);
}

// Ingredients TIME !!!!

async function getIngredientsList() {
    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();

    displayIngredients(response.meals);
    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader 

        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 1000);
}

function displayIngredients(arr) {

    let cartonaa = ``;

    for (let i = 0; i < 20; i++) {
        cartonaa += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center click-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription ? arr[i].strDescription.split(" ").slice(0, 20).join(" ") : ''}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartonaa;
}

async function getIngredientsMeals(ing) {

    innerLoader.classList.replace('fadeOut', 'fadeIn');
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    response = await response.json();

    displayMeals(response.meals)
    setTimeout(() => {
        // Remove fadeIn class and add fadeOut class to hide the loader 

        innerLoader.classList.replace('fadeIn', 'fadeOut');
    }, 2000);
}

// Contact US SECTION TIME !!!OOO!!!

// display contact us section first 

// variables for checking typing status for input fields >> defult False !!!

let nameTouched = false;
let emailTouched = false;
let phoneTouched = false;
let ageTouched = false;
let passwordTouched = false;
let repasswordTouched = false;

function displayContactUs() {

    rowData.innerHTML = ''; // make it clear to show up contact field

    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
                    <div class="container w-75 text-center">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <input id="nameInput" onkeyup="Validation()" type="text" class="form-control" placeholder="Enter Your Name">
                                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Special characters and numbers not allowed
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="emailInput" onkeyup="Validation()" type="email" class="form-control " placeholder="Enter Your Email">
                                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Email is not valid 
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="phoneInput" onkeyup="Validation()" type="number" class="form-control " placeholder="Enter Your Phone">
                                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid Phone Number
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input id="ageInput" onkeyup="Validation()" type="number" class="form-control " placeholder="Enter Your Age">
                                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid age
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input  id="passwordInput" onkeyup="Validation()" type="password" class="form-control " placeholder="Enter Your Password">
                                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    Enter valid password, (Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character)
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input  id="repasswordInput" onkeyup="Validation()" type="password" class="form-control " placeholder="Repassword">
                                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                    reEnter your passsword correctly
                                </div>
                            </div>
                            <button id="submitBtn" disabled class="m-auto w-fit btn btn-outline-danger px-2 mt-5">Submit</button>
                        </div>
                    </div>
                </div> `


    let submitBtn = document.getElementById('submitBtn');
    let nameInput = document.getElementById('nameInput');
    let emailInput = document.getElementById('emailInput');
    let phoneInput = document.getElementById('phoneInput');
    let ageInput = document.getElementById('ageInput');
    let passwordInput = document.getElementById('passwordInput');
    let repasswordInput = document.getElementById('repasswordInput');


    nameInput.addEventListener("focus", () => {
        nameTouched = true;
    })
    emailInput.addEventListener("focus", () => {
        emailTouched = true;
    })

    phoneInput.addEventListener("focus", () => {
        phoneTouched = true;
    })

    ageInput.addEventListener("focus", () => {
        ageTouched = true;
    })

    passwordInput.addEventListener("focus", () => {
        passwordTouched = true;
    })

    repasswordInput.addEventListener("focus", () => {
        repasswordTouched = true;
    })


}

function Validation() {
    if (nameTouched) {
        if (nameValidation()) {

            document.getElementById("nameAlert").classList.replace("d-block", "d-none");
        }
        else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block");
        }
    }

    if (emailTouched) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none");
        }
        else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block");
        }
    }
    if (phoneTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none");
        }
        else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block");
        }
    }
    if (ageTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none");
        }
        else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block");
        }
    }
    if (passwordTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none");
        }
        else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block");
        }
    }
    if (repasswordTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none");
        }
        else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block");
        }
    }


    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.replace("btn-outline-danger", "btn-success");
    }
    else {
        submitBtn.setAttribute("disabled", true);
        submitBtn.classList.replace("btn-success", "btn-outline-danger");
    }

}

// regex time for validating the inputs !! 
let emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
let fullNameRegex = /^[A-Za-z\s]+$/;
let phoneNumberRegex = /^\d{9,}$/;
let ageRegex = /^[1-9][0-9]*$/;


function nameValidation() {
    return (fullNameRegex.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (emailRegex.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (phoneNumberRegex.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (ageRegex.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (passwordRegex.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}  