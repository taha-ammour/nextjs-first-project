'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { gsap } from 'gsap';
import Navbar from "@/components/Navbar";
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { Movie } from '@/components/utils/Movietype';

interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
}

export default function Watch({ params }: { params: { movie_id: string } }) {
  const { data: session, status } = useSession();
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);
  const [seasonInput, setSeasonInput] = useState<string>('1');
  const [episodeInput, setEpisodeInput] = useState<string>('1');
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isTVShow, setIsTVShow] = useState<boolean>(false);
  const [contentType, setContentType] = useState<string>('movie');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const router = useRouter();
  const videoRef = React.useRef<HTMLIFrameElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });

    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/imdb/movie/${params.movie_id}`);
        setMovie(response.data);
        if (status === 'authenticated') {
          const watchlistResponse = await axios.get('/api/watchlist/get');
          const watchlist: WatchlistItem[] = watchlistResponse.data.watchlist;
          const inWatchlist = watchlist.some(item => item.movie.ttid === params.movie_id);
          setIsInWatchlist(inWatchlist);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    fetchMovie();
  }, [params.movie_id, status]);

  const handleSeasonInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeasonInput(event.target.value);
  };

  const handleEpisodeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEpisodeInput(event.target.value);
  };

  const handleWatchClick = () => {
    const seasonNum = parseInt(seasonInput);
    const episodeNum = parseInt(episodeInput);

    if (!isNaN(seasonNum) && !isNaN(episodeNum) && seasonNum > 0 && episodeNum > 0) {
      setSeason(seasonNum);
      setEpisode(episodeNum);
    } else {
      alert('Please enter valid season and episode numbers.');
    }
  };

  const toggleFullscreen = () => {
    const elem = videoRef.current;
    if (elem) {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen()
            .then(() => setFullscreen(true))
            .catch((err) => console.error('Error attempting to enable full-screen mode:', err));
        } else {
          console.error('Fullscreen API is not supported.');
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
            .then(() => setFullscreen(false))
            .catch((err) => console.error('Error attempting to exit full-screen mode:', err));
        }
      }
    }
  };

  const handleContentTypeChange = (type: string) => {
    setContentType(type);
    setIsTVShow(type === 'tvshow');
  };

  const handleAddToWatchlist = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      await axios.post('/api/watchlist/add', {  
        ttid: movie!.ttid,
        description: movie!.description,
        img_high: movie!.img_high,
        link: movie!.link,
        rating_count: movie!.rating_count,
        rating_value: movie!.rating_value,
        release_date: movie!.release_date,
        runtime: movie!.runtime,
        title: movie!.title,
        trailer: movie!.trailer,
        type: movie!.type,
        genres: movie!.genres,});
      setIsInWatchlist(true);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      await axios.delete('/api/watchlist/remove', {
        data: { movieId: movie!.id }
      });
      setIsInWatchlist(false);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <section className="min-h-screen bg-[#131313] text-white">
      <Navbar />
      <div className="container mx-auto p-8" ref={containerRef}>
        <div className="bg-[#1c1c1c] p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">{movie.title}</h2>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => handleContentTypeChange('movie')}
              className={`p-2 mx-2 rounded-lg ${contentType === 'movie' ? 'bg-blue-500' : 'bg-gray-700'} text-white hover:bg-blue-600`}
            >
              Movie
            </button>
            <button
              onClick={() => handleContentTypeChange('tvshow')}
              className={`p-2 mx-2 rounded-lg ${contentType === 'tvshow' ? 'bg-blue-500' : 'bg-gray-700'} text-white hover:bg-blue-600`}
            >
              TV Show
            </button>
          </div>
          {isTVShow && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex flex-col mb-4 md:mb-0">
                <label htmlFor="seasonInput" className="mb-2 text-lg font-semibold">Season:</label>
                <input
                  type="text"
                  id="seasonInput"
                  value={seasonInput}
                  onChange={handleSeasonInputChange}
                  className="p-2 border rounded bg-gray-800 text-white"
                />
              </div>
              <div className="flex flex-col mb-4 md:mb-0">
                <label htmlFor="episodeInput" className="mb-2 text-lg font-semibold">Episode:</label>
                <input
                  type="text"
                  id="episodeInput"
                  value={episodeInput}
                  onChange={handleEpisodeInputChange}
                  className="p-2 border rounded bg-gray-800 text-white"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleWatchClick}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Watch
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Toggle Fullscreen
                </button>
              </div>
            </div>
          )}
          <div className="relative pt-[56.25%]">
            <iframe
              ref={videoRef}
              src={contentType === 'tvshow'
                ? `https://vidsrc.to/embed/tv/${params.movie_id}/${season}/${episode}`
                : `https://vidsrc.to/embed/movie/${params.movie_id}`}
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              title="Video Player"
            />
          </div>
          <button onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}>
            {isInWatchlist ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart className="text-gray-500" />}
          </button>
        </div>
      </div>
    </section>
  );
}
