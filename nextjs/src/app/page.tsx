'use client'
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Top250 from "@/components/Top250";
import TVmeter from '@/components/TVMETER';

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const playVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="w-full h-full m-0 p-3 overflow-hidden text-cyan-100">
      <Navbar />

      <div className="flex justify-center mt-24">
        <div className="block m-0 w-full justify-center text-center">
          {isVideoPlaying ? (
            <video tabIndex={-1} disableRemotePlayback webkit-playsinline="" playsInline src="https://imdb-video.media-imdb.com/vi595575321/1434659607842-pgv4ql-1661267931768.mp4?Expires=1712512862&amp;Signature=RYV6Jiqw6IfL8GKwVUN-5t0~O8eJoqMiWzp94VT6IKVT0W4ZxryuAMZkv~RS~zTAz02vpvfaQ8K4VzL~EyYWGfrruQWO0JT0cuzjnUqeszRj0ZAHRzmi6accqwBB46mxLkMorKvHYQ1XPRSv0jBy2ZbCRRfYKU5Xli52qiwpAMngzEukuu~sVx8sY9QX7JluUXpxLYThJ7XvqL0FKlXvgVO-g3UyH4xh54b8HtwATM~AAc4qHoXxmyZFUIoGBYIVWTfAS2P3lzhlOXoFmwl8UqrvGlAmkRYB9bHaiUOxl2gZO4ZCcBdW~VBFLYJ4KHSAwIX5kwiD18RbDDt2~5vc7w__&amp;Key-Pair-Id=APKAIFLZBVQZ24NQH3KA" className="fill jw-video jw-reset w-full h-full" loop autoPlay ></video>
          ) : (
            <button onClick={playVideo}>Play Video</button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-3/4">
          <div>
            <TVmeter />
          </div>
        </div>
        <div className="w-1/4">
          <Top250 />
        </div>
      </div>
    </div>
  );
}
