'use client'
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
    <div className="top250 justify-end block  rounded-xl text-center overflow-hidden mt-10">
      <div className="bg-[#0e0e11] rounded-xl p-2">
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
      {loading && <p className="bg-[#131313]  -m-2">Loading...</p>}
      {error && <p className="bg-[#131313]  -m-2">{error}</p>}
      {!loading && !error && (
        <div className="movies-list flex flex-col">
          {paginatedMovies.map((movie) => (
            <button key={movie.ttid} className="movie-item hover:shadow-2xl bg-[#131313] flex mt-5 rounded-xl flex-row items-center w-23 h-36 m-0 border-t-2 p-4 border-[#333] duration-0 hover:duration-300 ease-in-out">
              <Link
                href={`/mov/${movie.ttid}`}
                target="_self"
                rel="noopener noreferrer"
                className="movie-link w-full h-full flex-row flex "
              >
                <img
                  className="movie-poster rounded-xl "
                  src={movie.img_src}
                  alt={movie.title}
                  style={{
                    display: 'block',
                    objectFit: 'cover',
                    width: "100%", height: "100%"
                  }}
                /> <div className="movie-details flex h-full items-center p-2">
                  <h2>{movie.title}</h2>
                </div>
              </Link>

            </button>
          ))}
        </div>
      )}
      <div className="pagination mt-5">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "active text-center bg-slate-600" : ""}
          >
            &nbsp; {pageNumber} &nbsp;
          </button>
        ))}
      </div>
    </div>
  );
};

export default Top250;
