'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Top250 from '@/components/Top250';
import TVmeter from '@/components/TVMETER';
import { Movie } from '@/components/utils/Movietype';
import gsap from 'gsap';
import { SessionProvider } from 'next-auth/react';
import LoadingScreen from '@/components/LoadingScreenSign';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ show: boolean, content: Movie | null, bgColor: string }>({ show: false, content: null, bgColor: '#fff' });

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get<{ movies: Movie[] }>('/api/movies/getmovie');
        setMovies(response.data.movies.slice(0, 5)); 
      } catch (error) {
        setError('Failed to fetch random movies. Please try again later. ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [movies]);

  useEffect(() => {
    if (movies.length > 0) {
      gsap.fromTo(
        '.movie-slide',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, [currentIndex, movies]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePlayNowClick = () => {
    if (movies.length > 0) {
      const movie = movies[currentIndex];
      setTooltip({
        show: true,
        content: movie,
        bgColor: '#000000'
      });
      gsap.fromTo(
        '.tooltip',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  };

  return (
    <div className="w-full h-full m-0 p-3 overflow-hidden text-cyan-100">
      <SessionProvider>
        <Navbar />
      </SessionProvider>
      <div className="relative w-full h-screen mt-14 flex justify-center items-center">
        {loading && <LoadingScreen />}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && movies.length > 0 && (
          <div className="movie-slide absolute w-full h-full">
            <img
              src={movies[currentIndex].img_high}
              alt={movies[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end items-start space-y-4">
              <h2 className="text-white text-4xl font-bold">{movies[currentIndex].title}</h2>
              <button
                onClick={handlePlayNowClick}
                className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Play Now
              </button>
            </div>
          </div>
        )}
        {!loading && !error && movies.length > 0 && (
          <>
            <button
              onClick={handlePrevClick}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
            >
              &lt;
            </button>
            <button
              onClick={handleNextClick}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
            >
              &gt;
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {movies.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
        {tooltip.show && tooltip.content && (
          <div
            className="tooltip absolute p-4 rounded-lg shadow-lg text-white"
            style={{ backgroundColor: tooltip.bgColor, top: '10%', left: '50%', transform: 'translateX(-50%)' }}
          >
            <h2 className="text-lg font-bold">{tooltip.content.title}</h2>
            <p>{tooltip.content.description}</p>
            <p>Genres: {tooltip.content.genres.join(', ')}</p>
            <p>Rating: {tooltip.content.rating_value}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row justify-between mt-10 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="lg:w-3/4 w-full">
          <TVmeter />
        </div>
        <div className="lg:w-1/4 w-full">
          <Top250 />
        </div>
      </div>
    </div>
  );
}
