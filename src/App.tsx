import React, { useState } from "react";
import './styles/movie-search.css';
import ApiKeyForm from "./ApiKeyForm";
import { searchMoviesWithUserApiKey } from "./api/moovie";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // Ajout de l'état d'erreur
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "" && apiKey !== null) {
      setIsLoading(true);
      setError(null);
  
      try {
        const moviedata = await searchMoviesWithUserApiKey(searchTerm, apiKey);
        setMovies(moviedata);
        setSearchTerm('');
      } catch (error) {
        console.error("Error in handleSearch:", error);
        setError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  function truncateOverview(overview: string, wordLimit: number): string {
    const words = overview.split(" ");

    if (words.length <= wordLimit) {
      return overview;
    }

    const truncatedText = words.slice(0, wordLimit).join(" ");
    return `${truncatedText} ...`;
  }

  return (
    <div className="container">
      {apiKey ? ( 
        <div>
          <h1>Chercher des films</h1>
          <div id="searchBar">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter a movie name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isLoading ? (
                <button id="searchButton" disabled>Searching...</button>
              ) : (
                <button id="searchButton" type="submit">Search</button>
              )}
            </form>
          </div>
  
          {error && <div className="error-message">{error}</div>}
  
          <div>
            {movies?.map((movie: any, index: number) => {
              return (
                <div key={index} id="movies">
                  <div key={index} className="movies">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <div >
                    <div >
                      <div className="movie-title">
                        {movie.title} (Titre : {movie.original_title})
                      </div>
                      <div className="movie-overview">
                        <b>Synopsis: </b> {truncateOverview(movie.overview, 10)}
                      </div>
                      </div>
                    </div>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <ApiKeyForm onSubmit={setApiKey} />
      )}
    </div>
  );
  
  
};

export default App;
