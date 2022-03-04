"use strict";
let drawMovies = moviesList => {
	$(".movie-collection").html("");
	moviesList.forEach(movieObject => {
		let ratingString = "";
		let goldRatingString = "";
		let rating = Number(movieObject.rating);
		for (let i = 0; i < rating; i++) {
			goldRatingString += "&#9733;";
		}
		for (let i = 0; i < 5 - rating; i++) {
			ratingString += "&#9733;";
		}
		let youtubeSearch = movieObject.title.split(" ").join("+").toLowerCase();
		youtubeSearch = youtubeSearch.split("%").join("%25");
		youtubeSearch = youtubeSearch.split("@").join("%40");
		youtubeSearch = youtubeSearch.split("#").join("%23");
		youtubeSearch = youtubeSearch.split("$").join("%24");
		youtubeSearch = youtubeSearch.split("^").join("%5E");
		youtubeSearch = youtubeSearch.split("&").join("%26");
		youtubeSearch = youtubeSearch.split("=").join("%3D");
		youtubeSearch = youtubeSearch.split("+").join("%2B");
		youtubeSearch = youtubeSearch.split(":").join("%3A");
		youtubeSearch = youtubeSearch.split(",").join("%2C");
		youtubeSearch = youtubeSearch.split("?").join("%3F");
		$(".movie-collection").append(`
			<div id="movie${movieObject.id}" class="card mx-3 my-3">
				<div class="card-header bg-dark">
					<a href="#card${movieObject.id}" data-bs-toggle="collapse">
						<img src="${movieObject.poster}" class="card-img-top" alt="${movieObject.title} movie poster">
						<div class="card-bg">
							<p class="p-0 m-1">${movieObject.genre}</p>
							<p class="p-0 m-1"><span class="goldStar">${goldRatingString}</span>${ratingString}</p>
						</div>
					</a>
				</div>
				<div id="card${movieObject.id}" class="collapse">
					<div class="card-body">
					<h3>${movieObject.title}</h3>
						<h6>${movieObject.year}</h6>
						<a href="https://www.youtube.com/results?search_query=${youtubeSearch}+${movieObject.year}+trailer" target="_blank">Watch Trailer</a>
							<hr>
						<dl>
							<dt>Plot</dt><dd>${movieObject.plot}</dd>
							<br>
							<dt>Director</dt><dd>${movieObject.director}</dd>
							<br>
							<dt>Actors</dt><dd>${movieObject.actors}</dd>
						</dl>
						<div class="text-center"><button id="delete${movieObject.id}" class="btn movieDelete">Delete Movie</button></div>
					</div>
				</div>
			</div>
		`);
		let deleteButton = document.getElementById(`delete${movieObject.id}`)
		deleteButton.addEventListener("click", () => {
			deleteButton.setAttribute("disabled", "");
			fetch(url + "/" + movieObject.id, {
				method: "DELETE", headers: {'Content-Type': 'application/json'}
			})
				.then(() => {
					getMovies();
				})
				.catch(error => console.log(error));
		});
	});
}
let filterMovies = () => {
	let filteredMovies = drawnMovies;
	if (titleFilter) {
		let searchInput = $("#movieSearch").val().toUpperCase();
		filteredMovies = filteredMovies.reduce((filteredByTitle, movie) => {
			if (movie.title.toUpperCase().includes(searchInput)) {
				filteredByTitle.push(movie);
			}
			return filteredByTitle;
		}, []);
	}
	if (genreFilter) {
		filteredMovies = filteredMovies.reduce((filteredByGenre, movie) => {
			if (movie.genre.includes(selectedGenre)) {
				filteredByGenre.push(movie);
			}
			return filteredByGenre;
		}, []);
	}
	if (ratingFilter) {
		let selectedRating = $("input[name='sortRating']:checked").val();
		filteredMovies = filteredMovies.reduce((filteredByRating, movie) => {
			if (movie.rating === selectedRating) {
				filteredByRating.push(movie);
			}
			return filteredByRating;
		}, []);
	}
	drawMovies(filteredMovies);
}
let getMovies = () => fetch(url)
	.then(response => response.json())
	.then(data => {
		moviesArray.length = 0;
		genreList.length = 0;
		$("#genreList").html("")
		data.forEach(movie => moviesArray.push(movie));
		moviesArray.sort((a, b) => {
			return (a.title > b.title) ? 1 : -1
		});
		$("#movieList").html("");
		moviesArray.forEach((element) => {
			let movieButton = document.createElement("button");
			movieButton.setAttribute("class", "btn btn-link dropdown-item");
			movieButton.innerText = element.title;
			$('#movieList').append(movieButton);
			movieButton.addEventListener('click', () => {
				$('#editTitle').val(element.title);
				$('#editDirector').val(element.director);
				$('#editYear').val(element.year);
				$('#editGenre').val(element.genre);
				$('#editActors').val(element.actors);
				$('#editPlot').val(element.plot);
				$(`input[value=${element.rating}][name="editRating"]`).attr("checked", true);
				for (let i = 1; i <= Number(element.rating); i++) {
					$(`input[name='editRating'][value=${i}]`).parent().addClass("goldStar");
				}
				for (let i = 5; i > Number(element.rating); i--) {
					$(`input[name='editRating'][value=${i}]`).parent().removeClass("goldStar");
				}
				$('#editID').val(element.id);
				$("#editPoster").val(element.poster);
			});
		});
		drawnMovies = moviesArray;
		filterMovies();
		data.forEach(movie => {
			let genreArray = movie.genre.split(", ")
			genreArray.forEach(genre => {
				if (!genreList.includes(genre)) {
					genreList.push(genre);
				}
			});
		});
		genreList.sort();
		genreList.forEach(genre => {
			let genreButton = document.createElement("button");
			genreButton.setAttribute("class", "btn btn-link dropdown-item");
			genreButton.innerText = genre;
			$('#genreList').append(genreButton);
			genreButton.addEventListener("click", () => {
				genreFilter = true;
				selectedGenre = genre;
				filterMovies();
			});
		});
		$("#loading").attr('style', 'display: none');
	})
	.catch(err => console.log(err));
let addHoverStars = (star1, star2, star3, star4, star5) => {
	star1.hover(() => {
		star1.addClass("hoverStars");
	}, () => {
		star1.removeClass("hoverStars");
	});
	star2.hover(() => {
		star1.addClass("hoverStars");
		star2.addClass("hoverStars");
	}, () => {
		star1.removeClass("hoverStars");
		star2.removeClass("hoverStars");
	});
	star3.hover(() => {
		star1.addClass("hoverStars");
		star2.addClass("hoverStars");
		star3.addClass("hoverStars");
	}, () => {
		star1.removeClass("hoverStars");
		star2.removeClass("hoverStars");
		star3.removeClass("hoverStars");
	});
	star4.hover(() => {
		star1.addClass("hoverStars");
		star2.addClass("hoverStars");
		star3.addClass("hoverStars");
		star4.addClass("hoverStars");
	}, () => {
		star1.removeClass("hoverStars");
		star2.removeClass("hoverStars");
		star3.removeClass("hoverStars");
		star4.removeClass("hoverStars");
	});
	star5.hover(() => {
		star1.addClass("hoverStars");
		star2.addClass("hoverStars");
		star3.addClass("hoverStars");
		star4.addClass("hoverStars");
		star5.addClass("hoverStars");
	}, () => {
		star1.removeClass("hoverStars");
		star2.removeClass("hoverStars");
		star3.removeClass("hoverStars");
		star4.removeClass("hoverStars");
		star5.removeClass("hoverStars");
	});
}
let searchMovie = () => {
	titleFilter = true;
	filterMovies();
}
let searchRating = () => {
	ratingFilter = true;
	let selectedRating = $("input[name='sortRating']:checked").val();
	for (let i = 1; i <= Number(selectedRating); i++) {
		$(`input[name='sortRating'][value=${i}]`).parent().addClass("goldStar");
	}
	for (let i = 5; i > Number(selectedRating); i--) {
		$(`input[name='sortRating'][value=${i}]`).parent().removeClass("goldStar");
	}
	filterMovies();
}
let sortMoviesName = () => {
	drawnMovies.sort((a, b) => {
		return (a.title >= b.title) ? 1 : -1
	});
	filterMovies();
}
let sortMoviesGenre = () => {
	drawnMovies.sort((a, b) => {
		return (a.genre >= b.genre) ? 1 : -1;
	});
	filterMovies();
}
let sortMoviesRating = () => {
	drawnMovies.sort((a, b) => {
		return (a.rating <= b.rating) ? 1 : -1;
	});
	filterMovies();
}
$("#sortByName").click(() => sortMoviesName());
$("#sortByGenre").click(() => sortMoviesGenre());
$("#sortByRating").click(() => sortMoviesRating());
$("#clearFilters").click(() => {
	drawnMovies = moviesArray;
	$("#movieSearch").val("");
	$("input[name='sortRating']").attr("checked", false);
	$("input[name='sortRating']").parent().removeClass("goldStar");
	genreFilter = false;
	ratingFilter = false;
	titleFilter = false;
	drawMovies(drawnMovies);
});
$("#addMovieSearchButton").click(() => {
	let movieTitle = $("#addMovieSearch").val().split(" ").join("+").toLowerCase()
	fetch(`http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${movieTitle}`)
		.then(result => result.json())
		.then(data => {
			$("#addTitle").val(data.Title);
			$("#addDirector").val(data.Director);
			$("#addYear").val(data.Year);
			$("#addGenre").val(data.Genre);
			$("#addActors").val(data.Actors);
			$("#addPlot").val(data.Plot);
			$("#poster").val(data.Poster)
		})
		.catch(error => console.log(error));
});
$("input[name='addRating']").click(() => {
	let selectedRating = $("input[name='addRating']:checked").val();
	for (let i = 1; i <= Number(selectedRating); i++) {
		$(`input[name='addRating'][value=${i}]`).parent().addClass("goldStar");
	}
	for (let i = 5; i > Number(selectedRating); i--) {
		$(`input[name='addRating'][value=${i}]`).parent().removeClass("goldStar");
	}
});
$("#addMovieButton").click(() => {
	$("#addMovieButton").attr("disabled", true);
	fetch(url, {
		method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
			title: $("#addTitle").val(),
			director: $("#addDirector").val(),
			year: $("#addYear").val(),
			genre: $("#addGenre").val(),
			actors: $("#addActors").val(),
			plot: $("#addPlot").val(),
			rating: $("input[name='addRating']:checked").val(),
			poster: $("#poster").val()
		})
	})
		.then(() => {
			getMovies();
			$("#addMovieButton").attr("disabled", false);
			$("#addMovieSearch").val("");
			$("#addTitle").val("");
			$("#addDirector").val("");
			$("#addYear").val("");
			$("#addGenre").val("");
			$("#addActors").val("");
			$("#addPlot").val("");
			$("#poster").val("");
			$("input[name='addRating']:checked").attr("checked", false);
			$("input[name='addRating']").parent().removeClass("goldStar");
		})
		.catch(error => {
			console.log(error);
			$("#addMovieButton").attr("disabled", false);
		});
});
$("input[name='editRating']").click(() => {
	let selectedRating = $("input[name='editRating']:checked").val();
	for (let i = 1; i <= Number(selectedRating); i++) {
		$(`input[name='editRating'][value=${i}]`).parent().addClass("goldStar");
	}
	for (let i = 5; i > Number(selectedRating); i--) {
		$(`input[name='editRating'][value=${i}]`).parent().removeClass("goldStar");
	}
});
$("#saveButton").click(() => {
	$("#saveButton").attr("disabled", true);
	fetch(url + "/" + $('#editID').val(), {
		method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
			title: $("#editTitle").val(),
			director: $("#editDirector").val(),
			year: $("#editYear").val(),
			genre: $("#editGenre").val(),
			actors: $("#editActors").val(),
			plot: $("#editPlot").val(),
			rating: $("input[name='editRating']:checked").val(),
			poster: $("#editPoster").val()
		})
	})
		.then(() => {
			getMovies();
			$("#saveButton").attr("disabled", false);
			$("#editTitle").val("");
			$("#editDirector").val("");
			$("#editYear").val("");
			$("#editGenre").val("");
			$("#editActors").val("");
			$("#editPlot").val("");
			$("#editPoster").val("");
			$("input[name='editRating']:checked").attr("checked", false);
			$("#editID").val("");
			$("input[name='editRating']").parent().removeClass("goldStar");
		})
		.catch(error => {
			console.log(error);
			$("#saveButton").attr("disabled", false);
		});
});
const url = "https://rough-harvest-liver.glitch.me/movies";
let moviesArray = [];
let drawnMovies = [];
let genreList = [];
let genreFilter = false;
let ratingFilter = false;
let titleFilter = false;
let selectedGenre = "";
addHoverStars($("#addRatingLabel1"), $("#addRatingLabel2"), $("#addRatingLabel3"), $("#addRatingLabel4"), $("#addRatingLabel5"));
addHoverStars($("#editRatingLabel1"), $("#editRatingLabel2"), $("#editRatingLabel3"), $("#editRatingLabel4"), $("#editRatingLabel5"));
addHoverStars($("#oneStarFilter"), $("#twoStarFilter"), $("#threeStarFilter"), $("#fourStarFilter"), $("#fiveStarFilter"));
getMovies();