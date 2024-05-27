'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Movie } from "./utils/Movietype";
import LoadingSpinner from "./LoadingSpinner";
import { getDominantColors, isColorBright } from "./utils/colorUtils";
import { gsap } from 'gsap';
import CustomCard from "./CustomCard";

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  content: Movie | null;
  bgColors: string[];
  textColor: string;
}

interface ApiResponse {
  movies: Movie[];
}

const TVmeter = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, x: 0, y: 0, content: null, bgColors: [], textColor: '#fff' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>('/api/movies/getmovie');
        setMovies(response.data.movies);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchData();

    const updateInterval = setInterval(async () => {
      try {
        await updateMovies();
      } catch (err) {
        setError((err as Error).message);
      }
    }, 5 * 60 * 1000); 

    return () => clearInterval(updateInterval);
  }, []);

  const updateMovies = async () => {
    try {
      await axios.post('/api/movies/update');
      const response = await axios.get<ApiResponse>('/api/movies/getmovie');
      setMovies(response.data.movies);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleMouseEnter = async (event: React.MouseEvent<HTMLLIElement, MouseEvent>, movie: Movie) => {
    try {
      const dominantColors = await getDominantColors(movie.img_high);
      const textColor = isColorBright(dominantColors[0]) ? '#000' : '#fff';
      setTooltip({
        show: true,
        x: event.pageX,
        y: event.pageY,
        content: movie,
        bgColors: dominantColors,
        textColor,
      });
      gsap.fromTo(".tooltip", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" });
    } catch (error) {
      setTooltip({
        show: true,
        x: event.pageX,
        y: event.pageY,
        content: movie,
        bgColors: ['#2d2d2d', '#3d3d3d', '#4d4d4d'], 
        textColor: '#fff',
      });
      gsap.fromTo(".tooltip", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
  };

  const handleMouseLeave = () => {
    gsap.to(".tooltip", { opacity: 0, y: -10, duration: 0.3, ease: "power3.in", onComplete: () => setTooltip({ show: false, x: 0, y: 0, content: null, bgColors: [], textColor: '#fff' }) });
  };

  return (
    <div className="tvmeter p-5 rounded-xl bg-[#131313] text-white mt-10 mr-10">
      <h1 className="text-lg">Top Movies</h1>
      <div className="flex gap-2 mt-2">
        <button className="border-r border-gray-800 px-4">Movies</button>
        <button>TV Shows</button>
      </div>
      {loading && <div className="flex justify-center"><LoadingSpinner /></div>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="flex flex-wrap justify-center mt-2">
          {movies.map((movie) => (
            <li key={movie.id} className="w-32 h-48 p-2 m-2 relative"
              onMouseEnter={(e) => handleMouseEnter(e, movie)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={`/browse/${movie.ttid}`}>
                <CustomCard className="h-full">
                  <div className="relative w-full h-full overflow-hidden">
                    <img src={movie.img_high} alt={movie.title} className="w-full h-full object-cover" />
                  </div>
                </CustomCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {tooltip.show && (
        <div style={{ top: tooltip.y, left: tooltip.x, background: `linear-gradient(135deg, ${tooltip.bgColors.join(', ')})` }}
          className="tooltip absolute p-3 rounded-lg backdrop-blur-3xl backdrop-contrast-150 ring-2 ring-[#591919] shadow-lg shadow-red-700 flex flex-col transition-opacity duration-300 z-50"
          >
          <div style={{ color: tooltip.textColor }}>
            <strong className="flex justify-center">{tooltip.content?.ttid} : &nbsp;{tooltip.content?.title}</strong>
            <p className="border-b-2 p-2"><strong>Genres:</strong>
              {tooltip.content?.genres.map(genre => (
                <span key={genre} className="px-1 py-0.5 bg-gray-700/50 text-xs rounded-full m-1 block text-center">{genre}</span>
              ))}</p>
            <p className="w-56 break-normal">{tooltip.content?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVmeter;
