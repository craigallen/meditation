import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SongContext } from '../context/SongContext';

const Home = () => {
  const { currentSong } = useContext(SongContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0); // Duration in minutes
  const [timeRemaining, setTimeRemaining] = useState(0); // Time remaining in seconds
  const [sessionEnded, setSessionEnded] = useState(false); // Session ended state
  const [volume, setVolume] = useState(1); // Volume control state
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setIsPaused(false);
      setSessionEnded(false);
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    }
  }, [currentSong]);

  const handleDurationChange = (event) => {
    setDuration(Number(event.target.value)); // Ensure duration is a number
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const playSound = () => {
    if (currentSong) {
      if (!audioRef.current) {
        audioRef.current = new Audio(process.env.PUBLIC_URL + currentSong.file); // Use selected song file
        audioRef.current.volume = volume; // Set initial volume
        audioRef.current.play();
        audioRef.current.onloadedmetadata = () => {
          if (duration === 0) {
            setTimeRemaining(audioRef.current.duration); // Set time remaining to full song duration
          }
        };
      } else {
        audioRef.current.play();
      }
      setIsPlaying(true);
      setIsPaused(false);
      setSessionEnded(false);
      if (duration > 0) {
        setTimeRemaining(duration * 60); // Set time remaining in seconds
        timerRef.current = setTimeout(() => {
          audioRef.current.pause();
          setIsPlaying(false);
          setIsPaused(false);
          setSessionEnded(true);
          clearInterval(countdownRef.current);
        }, duration * 60000); // Convert minutes to milliseconds
      }

      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
  };

  const pauseSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPaused(true);
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
  };

  const resumeSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setIsPaused(false);

    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPaused(false);
        setSessionEnded(true);
        clearInterval(countdownRef.current);
      }, timeRemaining * 1000); // Use remaining time in milliseconds
    }

    countdownRef.current = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
  };

  const restartSession = () => {
    setDuration(0);
    setTimeRemaining(0);
    setSessionEnded(false);
  };

  const handleLibraryClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setSessionEnded(false);
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    navigate('/library');
  };

  return (
    <div className="container text-center d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h4>
        {isPlaying ? (isPaused ? 'Meditation is paused' : 'Meditation is playing') : 'Welcome to Meditation'}
      </h4>
      <div className="my-3">
        <button className="btn btn-primary" onClick={handleLibraryClick}>Go to Library</button>
      </div>
      {currentSong && <h5>Current Song: {currentSong.name}</h5>}
      <input
        type="number"
        value={duration}
        onChange={handleDurationChange}
        className="form-control my-3"
        disabled={isPlaying}
        placeholder="Duration (minutes)"
      />
      {isPlaying && (
        <h6>
          Time remaining: {Math.floor(timeRemaining / 60)}:{('0' + (timeRemaining % 60)).slice(-2)}
        </h6>
      )}
      <button className="btn btn-success my-3" onClick={isPlaying ? (isPaused ? resumeSound : pauseSound) : playSound} disabled={!currentSong}>
        {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
      </button>
      {sessionEnded && (
        <div className="my-3">
          <button className="btn btn-warning" onClick={playSound}>
            Continue
          </button>
          <button className="btn btn-danger ms-2" onClick={restartSession}>
            Restart
          </button>
        </div>
      )}
      <div className="my-3">
        <label htmlFor="volume-control" className="form-label">Volume: </label>
        <input
          id="volume-control"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="form-range"
        />
      </div>
    </div>
  );
};

export default Home;
