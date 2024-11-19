const apiURL = "https://6732d6602a1b1a4ae111108b.mockapi.io/movie/movies";

const movieLibrary = document.getElementById("movie-library");
const addMovieBtn = document.getElementById("add-movie-btn");
const filterGenre = document.getElementById("filterGenre");
const filterRating = document.getElementById("filterRating");
const showWatchedButton = document.getElementById("showWatched");

async function addMovie() {
    const title = document.getElementById("movie-title").value;
    const genre = document.getElementById("movie-genre").value;
    const rating = document.getElementById("movie-rating").value;
    const poster = document.getElementById("movie-poster").value;
    const watched = document.getElementById("movie-watched").checked;

    if (!title || !genre || !rating || !poster) {
        alert("Please fill out all fields.");
        return;
    }

    const movie = {
        title,
        genre,
        rating,
        watched,
        favorite: false,
        image: poster,
    };

    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movie),
        });

        if (response.ok) {
            const newMovie = await response.json();
            displayMovie(newMovie);
            clearForm();
        } else {
            alert("Error adding movie.");
        }
    } catch (error) {
        console.error("Error adding movie:", error);
    }
}

function clearForm() {
    document.getElementById("movie-title").value = "";
    document.getElementById("movie-genre").value = "";
    document.getElementById("movie-rating").value = "";
    document.getElementById("movie-poster").value = "";
    document.getElementById("movie-watched").checked = false;
}

async function fetchMovies() {
    try {
        const response = await fetch(apiURL);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

function displayMovies(movies) {
    movieLibrary.innerHTML = "";
    const selectedGenre = filterGenre.value;
    const selectedRating = filterRating.value;

    const filteredMovies = movies
        .filter(movie => !selectedGenre || movie.genre === selectedGenre)
        .filter(movie => !selectedRating || movie.rating == selectedRating);

    if (filteredMovies.length === 0) {
        movieLibrary.classList.add("empty");
        movieLibrary.innerHTML = "<p>No movies to display</p>";
    } else {
        movieLibrary.classList.remove("empty");
        filteredMovies.forEach(displayMovie);
    }
}

function displayMovie(movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.dataset.id = movie.id;
    movieCard.innerHTML = `
        <img src="${movie.image}" alt="Movie poster" style="width: 100%; height: 200px; object-fit: cover;">
        <h3>${movie.title}</h3>
        <p>${movie.genre}</p>
        <p>${'★'.repeat(Number(movie.rating))}</p>
        <p>${movie.watched ? "Viewed" : "Not viewed"}</p>
        <div class="movie-actions" style="display: flex; gap: 10px; align-items: center;">
            <button onclick="toggleWatchedStatus(${movie.id}, '${movie.watched}')" class="action-btn">
                ${movie.watched ? "Mark as not viewed" : "Mark as viewed"}
            </button>
            <i 
                class="fa ${movie.favorite ? 'fa-heart' : 'fa-heart-o'} favorite-icon" 
                title="${movie.favorite ? 'Remove from Favorites' : 'Add to Favorites'}"
                onclick="toggleFavorite(${movie.id})">
            </i>
            <i 
                class="fa fa-trash delete-icon" 
                title="Delete Movie" 
                onclick="deleteMovie(${movie.id})">
            </i>
        </div>
    `;
    movieLibrary.appendChild(movieCard);
}

async function deleteMovie(movieId) {
    try {
        const response = await fetch(`${apiURL}/${movieId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            fetchMovies();
        } else {
            alert("Error deleting movie.");
        }
    } catch (error) {
        console.error("Error deleting movie:", error);
    }
}

async function toggleWatchedStatus(movieId, currentStatus) {
    try {
        const updatedMovie = {
            watched: currentStatus === 'true' ? false : true,
        };

        const response = await fetch(`${apiURL}/${movieId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedMovie),
        });

        if (response.ok) {
            fetchMovies();
        } else {
            alert("Error updating movie status.");
        }
    } catch (error) {
        console.error("Error updating movie status:", error);
    }
}

async function toggleFavorite(movieId) {
    try {
        const response = await fetch(`${apiURL}/${movieId}`);
        const movie = await response.json();

        const updatedMovie = {
            ...movie,
            favorite: !movie.favorite,
        };

        const updateResponse = await fetch(`${apiURL}/${movieId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedMovie),
        });

        if (updateResponse.ok) {
            fetchMovies();
        } else {
            alert("Error updating favorite status.");
        }
    } catch (error) {
        console.error("Error updating favorite status:", error);
    }
}

const showFavoritesButton = document.createElement("button");
showFavoritesButton.textContent = "Show Favorites";
showFavoritesButton.addEventListener("click", async () => {
    const response = await fetch(apiURL);
    const movies = await response.json();

    if (showFavoritesButton.innerText === "Show Favorites") {
        const favoriteMovies = movies.filter(movie => movie.favorite);
        displayMovies(favoriteMovies);
    } else {
        showFavoritesButton.innerText = "Show Favorites";
        fetchMovies();
    }
});
document.getElementById("filters").appendChild(showFavoritesButton);

showWatchedButton.addEventListener("click", async () => {
    const showWatchedOnly = showWatchedButton.innerText === "Show watched";
    showWatchedButton.innerText = showWatchedOnly ? "Show all" : "Show watched";
    const response = await fetch(apiURL);
    const movies = await response.json();

    const filteredMovies = showWatchedOnly
        ? movies.filter(movie => movie.watched)
        : movies;

    displayMovies(filteredMovies);
});

addMovieBtn.addEventListener("click", addMovie);
filterGenre.addEventListener("change", fetchMovies);
filterRating.addEventListener("change", fetchMovies);

fetchMovies();
