'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, Inset, Strong, Text, TextField } from '@radix-ui/themes';
import { GiAbstract069 } from "react-icons/gi";
import { z } from 'zod';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Movie {
    id: string;
    title: string;
    release_date: string;
    type: string;
    img_high: string;
}

const MovieSchema = z.object({
    id: z.string(),
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

    useEffect(() => {
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

    const handleMovieClick = (imdbId: string) => {
        // Handle movie click
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
        <div className='w-full h-full mt-12 ml-2'>
            <Navbar/>
            <h2 className="text-center text-[#78A083] font-bold">Movie</h2>
            <div className='w-full flex justify-center'>
                <TextField.Root >
                    <TextField.Slot>
                        <GiAbstract069 />
                    </TextField.Slot>
                    <TextField.Input
                        placeholder="Search the docs…"
                        value={searchQuery}
                        variant="surface"
                        color="mint"
                        radius='medium'
                        onChange={handleSearchChange}
                    />
                </TextField.Root>
            </div>
            {loading && <p className="text-center mt-4">Loading...</p>}
            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
            <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <InfiniteScroll
                    dataLength={movies.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<p className="text-center mt-4">Loading more movies...</p>}
                >
                    <ul className='flex flex-wrap justify-center p-4'>
                        {movies.map((movie) => (
                            <li key={movie.id} className='group flex-col items-center w-40 h-52 m-4 relative '>
                                <Link href={`/mov/${movie.id}`}>
                                    <Card size="2" style={{ width: '100%', cursor: 'pointer', position: 'absolute', maxWidth: 240 }} className='shadow-xl h-52 m-2 bg-lime-950 mix-blend-multiply' onClick={() => handleMovieClick(movie.id)}>
                                        <Inset clip="padding-box" side="all" pb="0">
                                            <img
                                                src={movie.img_high}
                                                alt={movie.title}
                                                style={{
                                                    display: 'block',
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'var(--gray-5)',
                                                }}
                                            />
                                        </Inset>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-red-900 to-transparent transition-all duration-300 group-hover:scale-110">
                                            <Text as="p" size="1" className='text-sky-50'>
                                                <Strong>{movie.title}</Strong> Year: {movie.release_date} Type: {movie.type} ID: {movie.id}
                                            </Text>
                                        </div>
                                    </Card>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default MovieList;
