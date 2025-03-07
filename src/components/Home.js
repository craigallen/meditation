import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Typography, TextField } from '@mui/material';

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0); // Duration in minutes
  const [timeRemaining, setTimeRemaining] = useState(0); // Time remaining in seconds
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(process.env.PUBLIC_URL + '/november.wav'); // Corrected sound file path
      audioRef.current.play();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(true);
    setIsPaused(false);
    setTimeRemaining(duration * 60); // Set time remaining in seconds

    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsPaused(false);
        clearInterval(countdownRef.current);
      }, duration * 60000); // Convert minutes to milliseconds

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
        clearInterval(countdownRef.current);
      }, timeRemaining * 1000); // Use remaining time in milliseconds

      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
  };

  return (
    <Container style={styles.container}>
      <Typography variant="h4" gutterBottom>
        {isPlaying ? (isPaused ? 'Meditation is paused' : 'Meditation is playing') : 'Welcome to Meditation'}
      </Typography>
      <TextField
        label="Duration (minutes)"
        type="number"
        value={duration}
        onChange={handleDurationChange}
        style={{ marginBottom: '20px' }}
      />
      {isPlaying && !isPaused && (
        <Typography variant="h6" gutterBottom>
          Time remaining: {Math.floor(timeRemaining / 60)}:{('0' + (timeRemaining % 60)).slice(-2)}
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={isPlaying ? (isPaused ? resumeSound : pauseSound) : playSound}>
        {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
      </Button>
    </Container>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#e0f7fa', // Pastel color
  }
};

export default Home;
