// src/components/Top250.tsx
'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import Link from "next/link";

const MovieSchema = z.object({
  ttid: z.string(),
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
        const validatedMovies = response.data.map((movie) => MovieSchema.parse(movie));
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
    <div className="top250 rounded-xl text-center overflow-hidden mt-10">
      <div className="bg-[#0e0e11] rounded-t-xl p-2">
        <h1 className="text-xl font-bold">IMDb Top 250</h1>
        <div className="pt-2">
          <button className="pr-4 border-r-2 border-gray-900">Movies</button>
          <button className="pl-1">TV Shows</button>
        </div>
      </div>
      {loading && <p className="bg-[#131313] p-4">Loading...</p>}
      {error && <p className="bg-[#131313] p-4">{error}</p>}
      {!loading && !error && (
        <div className="movies-list flex flex-col bg-[#1c1c1c] p-4">
          {paginatedMovies.map((movie) => (
            <Link
              key={movie.ttid}
              href={`/browse/${movie.ttid}`}
              className="movie-item hover:shadow-2xl bg-[#131313] flex mt-5 rounded-xl items-center p-4 border-t-2 border-[#333] transition-all duration-300 hover:duration-300 ease-in-out"
            >
              <img
                className="movie-poster rounded-xl"
                src={movie.img_src}
                alt={movie.title}
                style={{
                  display: 'block',
                  objectFit: 'cover',
                  width: "50px",
                  height: "75px",
                }}
              />
              <div className="movie-details ml-4">
                <h2 className="text-lg font-semibold">{movie.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="pagination mt-5 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-3 py-1 mx-1 rounded-full transition-colors duration-300 ${
              currentPage === pageNumber ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-200'
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Top250;
