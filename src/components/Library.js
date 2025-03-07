import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SongContext } from '../context/SongContext';

const Library = () => {
  const { setCurrentSong } = useContext(SongContext);
  const songs = [
    { name: 'November', file: '/november.wav' },
    { name: 'Guitar', file: '/guitar.wav' },
    { name: 'Empty', file: '/song3.wav' },
  ];

  const handleSongClick = (song) => {
    setCurrentSong(song);
  };

  return (
    <div style={styles.container}>
      <h2>Library</h2>
      <ul style={styles.list}>
        {songs.map((song, index) => (
          <li key={index} style={styles.listItem}>
            <Link to="/" onClick={() => handleSongClick(song)}>{song.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    margin: '10px 0',
  },
};

export default Library;
