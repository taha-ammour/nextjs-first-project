'use client'
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";

export default function Watch({ params }: {
    params: { movie_id: string }
}) {
    const [season, setSeason] = useState<number>(1);
    const [episode, setEpisode] = useState<number>(1);
    const [seasonInput, setSeasonInput] = useState<string>('1');
    const [episodeInput, setEpisodeInput] = useState<string>('1');
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const videoRef = React.useRef<HTMLIFrameElement>(null);

    const handleSeasonInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSeasonInput(event.target.value);
    };

    const handleEpisodeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEpisodeInput(event.target.value);
    };

    const handleWatchClick = () => {
        setSeason(parseInt(seasonInput));
        setEpisode(parseInt(episodeInput));
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
    

    return (
        <section>
            <div className="m-2">
                <Navbar />
            </div>
            <div className="m-2">
                <label htmlFor="seasonInput">Season:</label>
                <input type="text" id="seasonInput" value={seasonInput} onChange={handleSeasonInputChange} />
            </div>
            <div className="m-2">
                <label htmlFor="episodeInput">Episode:</label>
                <input type="text" id="episodeInput" value={episodeInput} onChange={handleEpisodeInputChange} />
            </div>
            <div className="m-2">
                <button onClick={handleWatchClick}>Watch</button>
                <button onClick={toggleFullscreen}>Toggle Fullscreen</button>
            </div>
            <div className='h-96'>
                <iframe ref={videoRef} src={`https://vidsrc.to/embed/tv/${params.movie_id}/${season}/${episode}`} className='w-full h-full'></iframe>
            </div>
        </section>
    );
}
