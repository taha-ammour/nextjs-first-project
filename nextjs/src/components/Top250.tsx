'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";

// Define schema for movie data validation using Zod
const MovieSchema = z.object({
  id: z.string(),
  img_src: z.string(),
  link: z.string(),
  title: z.string(),
});

type Movie = z.infer<typeof MovieSchema>;

const PAGE_SIZE = 10;

const Top250 = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop250Movies = async () => {
      try {
        const response = await axios.get<Movie[]>("http://localhost:8080/imdb/top250");
        // Validate fetched data against schema
        const validatedMovies = response.data.map((movie) =>
          MovieSchema.parse(movie)
        );
        setMovies(validatedMovies);
      } catch (error) {
        setError("Failed to fetch top 250 movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTop250Movies();
  }, []);

  const totalPages = Math.ceil(movies.length / PAGE_SIZE);

  const paginatedMovies = movies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="top250-container">
      <h1>IMDb Top 250 Movies</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="movies-list">
          {paginatedMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <a
                href={movie.link}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-link"
              >
                <img
                  className="movie-poster"
                  src={movie.img_src}
                  alt={movie.title}
                />
              </a>
              <div className="movie-details">
                <h2>{movie.title}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "active" : ""}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Top250;
