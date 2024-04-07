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
    <div className="top250 justify-end block bg-[#101015] rounded-xl text-center overflow-hidden mt-10">
      <div className="bg-[#0e0e11] rounded-t-xl p-2">
        <h1 >IMDb Top 250</h1>
        <div className="pt-2">
          <button className="pr-4 border-r-2 border-gray-900">
            Movies
          </button>
          <button className="pl-1 ">
            TVshows
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="movies-list flex flex-col">
          {paginatedMovies.map((movie) => (
            <div key={movie.id} className="movie-item flex flex-row items-center w-full h-full m-0 border-t-2 p-4 border-[#333]">
              <a
                href={movie.link}
                target="_blank"
                rel="noopener noreferrer"
                className="movie-link w-full h-fit object-cover  "
              >
                <img
                  className="movie-poster"
                  src={movie.img_src}
                  alt={movie.title}
                  style={{ width: "100%", height: "100%" }}
                />
              </a>
              <div className="movie-details block ">
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
            className={currentPage === pageNumber ? "active text-center" : ""}
          >
            &nbsp; {pageNumber} &nbsp;
          </button>
        ))}
      </div>
    </div>
  );
};

export default Top250;
