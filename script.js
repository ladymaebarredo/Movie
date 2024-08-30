document.addEventListener("DOMContentLoaded", function() {
    const API_KEY = "ecbfb1b71d48f5c5efa90e59c814d7e6";
    const API_URL = "https://api.themoviedb.org/3";
    const movieGrid = document.querySelector(".movie-grid");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    function fetchMovies(query = "") {
        const url = query 
            ? `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
            : `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

        console.debug("Fetching movies from URL:", url); 

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(data => {
                console.debug("Movies data:", data);
                displayMovies(data.results);
            })
            .catch(error => {
                console.error("Error fetching movie data:", error);
            });
    }

    function fetchTrailer(movieId) {
        const movieDetailsUrl = `${API_URL}/movie/${movieId}?api_key=${API_KEY}`;
    
        return fetch(movieDetailsUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok.");
                }
                return response.json();
            })
            .then(movieData => {
                console.debug("Movie data:", movieData);
                const imdbId = movieData.imdb_id;
                if (imdbId) {
                    const trailerUrl = `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`;
                    console.debug("Trailer URL:", trailerUrl); 
                    return trailerUrl;
                } else {
                    console.warn("IMDB ID not found for this movie."); 
                    return null;
                }
            })
            .catch(error => {
                console.error("Error fetching trailer data:", error);
                return null;
            });
    }
    

    function displayMovies(movies) {
        movieGrid.innerHTML = "";
        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            movieCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.overview}</p>
                </div>
            `;

            movieCard.addEventListener("click", function() {
                fetchTrailer(movie.id).then(trailerUrl => {
                    if (trailerUrl) {
                        openTrailerModal(trailerUrl);
                    } else {
                        alert("Trailer not available");
                    }
                });
            });

            movieGrid.appendChild(movieCard);
        });
    }

    function openTrailerModal(trailerUrl) {
        const trailerModal = document.getElementById("trailer-modal");
        const trailerVideo = document.getElementById("trailer-video");

        console.debug("Opening trailer modal with URL:", trailerUrl); 

        if (trailerUrl) {
            trailerVideo.src = trailerUrl;
            trailerModal.style.display = "block";

            const closeButton = document.querySelector(".close-button");
            closeButton.removeEventListener("click", closeModal);
            closeButton.addEventListener("click", closeModal);

            function closeModal() {
                trailerModal.style.display = "none";
                trailerVideo.src = "";  
            }
        } else {
            console.warn("No trailer URL provided."); 
        }
    }

    searchButton.addEventListener("click", function() {
        const query = searchInput.value.trim();
        fetchMovies(query);
    });

    const carouselContainer = document.querySelector(".carousel-container");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const prevButton = document.querySelector(".carousel-control.prev");
    const nextButton = document.querySelector(".carousel-control.next");
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselContainer.style.transform = `translateX(${offset}%)`;
    }

    nextButton.addEventListener("click", function() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });

    prevButton.addEventListener("click", function() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    fetchMovies();
});
