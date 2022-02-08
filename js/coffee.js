"use strict";

// function to convert one coffee object from array to html format, used for both tBody and favBody
function renderCoffee(coffee) {
	let html = '<div class="coffee">';
	html += '<h3>' + coffee.name + '</h3>';
	html += '<p class="roast">' + coffee.roast + '</p>';
	if (favorite.id === 0) {
		html += '<i class="far fa-star"></i> <button data-id="' + coffee.id + '" class="btn favoriteButton m-2">Mark Favorite</button>';
	} else if (coffee.id !== favorite.id) {
		html += '<i class="far fa-star"></i> <button data-id="' + coffee.id + '" class="btn favoriteButton">Mark Favorite</button>';
	} else {
		html += '<i class="fas fa-star"></i> <button data-id="' + coffee.id + '" class="btn" id="removeFavoriteButton">Remove Favorite</button>';
	}
	html += '<button data-id="' + coffee.id + '" class="btn editButton m-2">' + "Edit Coffee" + '</button>';
	html += '<button data-id="' + coffee.id + '" class="btn deleteButton m-2" >' + "Delete Coffee" + '</button>';
	html += '<form>';
	html += '<label>Change Name <input style="text-align: center" class="editName" data-id="' + coffee.id + '" type="text" value="' + coffee.name + '"></label>';
	html += '<label>Change Roast <select style="text-align: center" class="editRoast" data-id="' + coffee.id + '"><option>(light roast)</option><option>(medium roast)</option><option>(dark roast)</option></select></label>';
	html += '</form>';
	html += '</div>';
	return html;
}

// function to convert coffee objects to html by calling renderCoffee function
function renderCoffees(coffees) {
	let html = '';
	// if the favorite coffee exists, do not render it with the rest of the coffees
	coffees.forEach(function (coffee) {
		if (coffee.id !== favorite.id) {
			html += renderCoffee(coffee);
		}
	});
	return html;
}

// function to filter list of coffees displayed in html based on user inputs
function filterCoffees() {
	let userSearch = document.getElementById("coffeeSearch").value.toUpperCase();
	let selectedRoast = document.querySelector('#roast-selection').value;
	let filteredCoffees = [];
	coffees.forEach(function (coffee) {
		if (coffee.name.toUpperCase().includes(userSearch) && (selectedRoast === coffee.roast)) {
			filteredCoffees.push(coffee);
		} else if (coffee.name.toUpperCase().includes(userSearch) && (selectedRoast === "(all roasts)")) {
			filteredCoffees.push(coffee);
		}
	});
	// if the favorite coffee exists, always display it
	if (favorite.id !== 0) {
		favBody.innerHTML = renderCoffee(favorite);
	} else {
		favBody.innerHTML = "";
	}
	tbody.innerHTML = renderCoffees(filteredCoffees);
	activateButtons();
}

// function to add event listeners to make buttons work
function activateButtons() {
	// loop through all delete buttons to give them all listeners
	document.querySelectorAll(".deleteButton").forEach(function (deleteButton) {
		deleteButton.addEventListener("click", function () {
			let coffeeId = Number(deleteButton.getAttribute("data-id"));
			let coffeeIndex;
			// find the index of the coffee to be deleted by checking if the coffee's id matches the clicked button's data-id
			coffees.forEach(function (coffee, index) {
				if (coffee.id === coffeeId) {
					coffeeIndex = index;
				}
			});
			coffees.splice(coffeeIndex, 1);
			if (coffeeId === favorite.id) {
				favorite = {
					id: 0
				};
			}
			refreshFavorite();
			localStorage.setItem("coffees", JSON.stringify(coffees));
			filterCoffees();
		});
	});
	// loop through all edit buttons to give them all listeners
	document.querySelectorAll(".editButton").forEach(function (editButton) {
		editButton.addEventListener("click", function () {
			let coffeeId = Number(editButton.getAttribute("data-id"));
			let coffeeIndex;
			// find the index of the coffee to be edited by checking if the coffee's id matches the clicked button's data-id
			coffees.forEach(function (coffee, index) {
				if (coffee.id === coffeeId) {
					coffeeIndex = index;
				}
			});
			document.querySelectorAll(".editName").forEach(function (newNameInput) {
				if (Number(newNameInput.getAttribute("data-id")) === coffeeId) {
					coffees[coffeeIndex].name = newNameInput.value;
				}
			});
			document.querySelectorAll(".editRoast").forEach(function (newRoastSelect) {
				if (Number(newRoastSelect.getAttribute("data-id")) === coffeeId) {
					coffees[coffeeIndex].roast = newRoastSelect.value;
				}
			});
			refreshFavorite();
			localStorage.setItem("coffees", JSON.stringify(coffees));
			filterCoffees();
		});
	});
	// loop through all favorite buttons to give them all listeners
	document.querySelectorAll(".favoriteButton").forEach(function (favoriteButton) {
		favoriteButton.addEventListener("click", function () {
			let coffeeId = Number(favoriteButton.getAttribute("data-id"));
			// loop through coffees array and only assign the favorite if the coffee's id matches the clicked button's data-id
			coffees.forEach(function (coffee) {
				if (coffee.id === coffeeId) {
					favorite = JSON.parse(JSON.stringify(coffee));
				}
			});
			storeFavorite();
			filterCoffees();
		});
	});
	// event listener for "remove favorite" button should only be added if the button exists
	if (favorite.id !== 0) {
		document.getElementById("removeFavoriteButton").addEventListener("click", function () {
			favorite = {
				id: 0
			};
			storeFavorite();
			filterCoffees();
		});
	}
}

// function to store favorite coffee to localStorage
function storeFavorite() {
	localStorage.setItem("favorite", JSON.stringify(favorite));
}

// function to sync favorite coffee to be called whenever the coffee array gets modified
function refreshFavorite() {
	coffees.forEach(function (coffee) {
		if (coffee.id === favorite.id) {
			favorite = coffee;
		}
	});
	storeFavorite();
}

// from http://www.ncausa.org/About-Coffee/Coffee-Roasts-Guide
// creates initial list of coffees
const initialCoffees = [
	{id: 1, name: 'Light City', roast: '(light roast)'},
	{id: 2, name: 'Half City', roast: '(light roast)'},
	{id: 3, name: 'Cinnamon', roast: '(light roast)'},
	{id: 4, name: 'City', roast: '(medium roast)'},
	{id: 5, name: 'American', roast: '(medium roast)'},
	{id: 6, name: 'Breakfast', roast: '(medium roast)'},
	{id: 7, name: 'High', roast: '(dark roast)'},
	{id: 8, name: 'Continental', roast: '(dark roast)'},
	{id: 9, name: 'New Orleans', roast: '(dark roast)'},
	{id: 10, name: 'European', roast: '(dark roast)'},
	{id: 11, name: 'Espresso', roast: '(dark roast)'},
	{id: 12, name: 'Viennese', roast: '(dark roast)'},
	{id: 13, name: 'Italian', roast: '(dark roast)'},
	{id: 14, name: 'French', roast: '(dark roast)'},
];
// creates empty array to be filled by either the initial list or the user's localStorage
let coffees = [];
// fill coffees array
if (localStorage.getItem("coffees") === null) {
	// initialCoffees.forEach(function (coffee) {
	// 	coffees.push(coffee);
	// });
	coffees = JSON.parse(JSON.stringify(initialCoffees));
	localStorage.setItem("coffees", JSON.stringify(coffees));
} else {
	coffees = JSON.parse(localStorage.getItem("coffees"));
}
// creates initial favorite of none
let favorite = {
	id: 0
};
// retrieve favorite from localStorage
if (localStorage.getItem("favorite") !== null) {
	favorite = JSON.parse(localStorage.getItem("favorite"));
} else {
	storeFavorite();
}
// listener for updating the displayed coffees based on user's search input
document.getElementById("coffeeSearch").addEventListener("keyup", filterCoffees);
// listener for updating the displayed coffees based on user's roast selection by calling filterCoffees function
document.getElementById("roast-selection").addEventListener("change", filterCoffees);
// listener for adding a new coffee object to the coffees array
document.getElementById("addCoffeeButton").addEventListener('click', function () {
	let newCoffeeName = document.getElementById("newCoffee").value;
	if (newCoffeeName === "") {
		alert("Please name your coffee!");
	} else {
		if (coffees.length === 0) {
			coffees.push(
				{
					id: 1,
					name: newCoffeeName,
					roast: document.getElementById("addRoast").value
				}
			);
		} else {
			coffees.push(
				{
					id: coffees[coffees.length - 1].id + 1,
					name: newCoffeeName,
					roast: document.getElementById("addRoast").value
				}
			)
		}
		localStorage.setItem("coffees", JSON.stringify(coffees));
		document.getElementById("newCoffee").value = "";
		filterCoffees();
	}
});
// listener for resetting the coffee list to the initial list
document.querySelector("#resetButton").addEventListener("click", function () {
	coffees = JSON.parse(JSON.stringify(initialCoffees));
	// coffees = [];
	// initialCoffees.forEach(function (coffee) {
	// 	coffees.push(coffee);
	// });
	// keep the favorite coffee even if it doesn't exist in the initial list
	refreshFavorite();
	if (favorite.id > 14) {
		coffees.push(favorite);
	}
	localStorage.setItem("coffees", JSON.stringify(coffees));
	filterCoffees();
});
// variable to identify html element that will be changed by listeners
let tbody = document.querySelector('#coffees');
// creates the initial displayed coffees on page load by calling the renderCoffees function
tbody.innerHTML = renderCoffees(coffees);
// variable to identify html element for favorite
let favBody = document.getElementById("favoriteCoffee");
// displays favorite if it exists
if (favorite.id !== 0) {
	favBody.innerHTML = renderCoffee(favorite);
}
// calls function to make generated buttons work
activateButtons();
// play a song when user interacts with page
let song = new Audio("bob-dylan.webm");
document.body.addEventListener("mousemove", function () {
	song.volume = 0.15;
	song.play();
});