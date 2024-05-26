'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { z } from 'zod';
import Link from 'next/link';
import { gsap } from 'gsap';
import { GiAbstract069 } from "react-icons/gi";
import Navbar from '@/components/Navbar';

interface Movie {
    ttid: string;
    title: string;
    release_date: string;
    type: string;
    img_high: string;
}

const MovieSchema = z.object({
    ttid: z.string(),
    title: z.string(),
    release_date: z.string(),
    type: z.string(),
    img_high: z.string(),
});

const MovieList: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const movieListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            movieListRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
        fetchData();
    }, [searchQuery]);

    const fetchData = async () => {
        if (searchQuery.trim() === '') {
            setMovies([]);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`http://localhost:8080/imdb/search/${searchQuery}?page=${page}`);
            const newMovies = response.data.map((movie: any) => MovieSchema.parse(movie));
            setMovies((prevMovies) => [...prevMovies, ...newMovies]);
            setHasMore(newMovies.length > 0);
        } catch (error) {
            console.error('Error fetching or validating movie data:', error);
            setError('Error fetching movie data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPage(1);
        setMovies([]);
    };

    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div className='w-full h-full bg-[#141414] text-white'>
            <Navbar />
            <div className='mt-16'>
                <h2 className="text-center text-[#E50914] font-bold text-3xl mb-6">Movies</h2>
                <div className='w-full flex justify-center mb-8'>
                    <div className="relative w-3/4 max-w-md">
                        <input
                            type="text"
                            placeholder="Search for movies..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500"
                        />
                        <GiAbstract069 className="absolute right-3 top-3 text-gray-500" />
                    </div>
                </div>
                {loading && <p className="text-center mt-4">Loading...</p>}
                {error && <p className="text-center text-red-600 mt-4">{error}</p>}
                <div ref={movieListRef} style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <InfiniteScroll
                        dataLength={movies.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<p className="text-center mt-4">Loading more movies...</p>}
                    >
                        <ul className='flex flex-wrap justify-center p-4'>
                            {movies.map((movie) => (
                                <li key={movie.ttid} className='group flex-col items-center w-40 h-52 m-4 relative'>
                                    <Link href={`/mov/${movie.ttid}`}>
                                        <div className='group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl'>
                                            <img
                                                src={movie.img_high}
                                                alt={movie.title}
                                                className='object-cover w-full h-52'
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent transition-all duration-300">
                                                <p className='text-white text-sm'>
                                                    <strong>{movie.title}</strong> <br />
                                                    Year: {movie.release_date} <br />
                                                    Type: {movie.type} <br />
                                                    ID: {movie.ttid}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
};

export default MovieList;
