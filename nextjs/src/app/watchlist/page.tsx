'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { Movie } from '@/components/utils/Movietype';
import CustomCard from '@/components/CustomCard';

interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
}

const WatchlistPage = () => {
  const { data: session, status } = useSession();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchWatchlist = async () => {
        try {
          const response = await axios.get('/api/watchlist/get');
          setWatchlist(response.data.watchlist);
        } catch (error) {
          console.error('Error fetching watchlist:', error);
        }
      };

      fetchWatchlist();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-4xl mb-6">Loading...</h1>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-4xl mb-6">You are not signed in</h1>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-white">
    <Navbar />
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-center">Your watchlist is empty</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {watchlist.map((item) => (
            <li key={item.movie.id} className="bg-[#1c1c1c] p-4 rounded-lg shadow-lg">
              <Link href={`/browse/${item.movie.ttid}`}>
                <div className="block hover:opacity-90 transition">
                  <div className="relative w-full h-72">
                    <img 
                      src={item.movie.img_high} 
                      alt={item.movie.title} 
                      className="absolute inset-0 w-full h-full object-cover rounded" 
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{item.movie.title}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  );
};

export default WatchlistPage;
