'use client'

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Slider, Paper } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';

export default function PracticePage() {
  const [flashcards, setFlashcards] = useState([]);
  const [originalFlashcards, setOriginalFlashcards] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [displayMode, setDisplayMode] = useState('both'); // 'both', 'image', 'vocab'
  const [tempDisplayBoth, setTempDisplayBoth] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);

  const lastToggleRef = useRef(null); // 'image' or 'vocab'

  useEffect(() => {
    const storedCards = JSON.parse(sessionStorage.getItem('selectedCards'));
    if (storedCards && storedCards.length > 0) {
      fetchFlashcards(storedCards);
    } else {
      // No flashcards selected
      setLoading(false);
      setFlashcards([]);  // Ensure flashcards array is empty
    }

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handleBack();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setTempDisplayBoth(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flashcards.length]);

  const fetchFlashcards = async (cardIds) => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true);
    try {
      const promises = cardIds.map(id =>
        axios.get(`${api}/flashcards/${id}`)
      );
      const cardsResponses = await Promise.all(promises);
      const cardsData = cardsResponses.map(res => res.data);
      setFlashcards(cardsData);
      setOriginalFlashcards(cardsData); // Store the original order
    } catch (error) {
      console.error('Failed to fetch flashcards', error);
      // Handle errors, e.g., display a message
    }
    setLoading(false);
  };

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const handleShuffleToggle = () => {
    if (!isShuffled) {
        // Shuffle the flashcards and update the display
        setFlashcards(shuffleArray([...flashcards]));
    } else {
        // Restore the original order of flashcards
        setFlashcards(originalFlashcards);
        setCurrent(0); // Optionally reset the current index
    }
    setIsShuffled(!isShuffled);
  };

  const toggleImageDisplay = () => {
    setDisplayMode(prevMode => prevMode === 'image' ? 'both' : 'image');
    setTempDisplayBoth(false);
    lastToggleRef.current = 'image';
  };
  
  const toggleVocabDisplay = () => {
    setDisplayMode(prevMode => prevMode === 'vocab' ? 'both' : 'vocab');
    setTempDisplayBoth(false);
    lastToggleRef.current = 'vocab';
  };

  const handleNext = () => {
    setEnableTransition(false);  // Disable transitions
    setCurrent(prev => (prev + 1) % flashcards.length);
    setTempDisplayBoth(false);
    setTimeout(() => {
        setEnableTransition(true);  // Re-enable transitions after navigation
    }, 100);  // Short delay to skip the transition
  };

  const handleBack = () => {
    setEnableTransition(false);  // Disable transitions
    setCurrent(prev => (prev - 1 + flashcards.length) % flashcards.length);
    setTempDisplayBoth(false);
    setTimeout(() => {
        setEnableTransition(true);  // Re-enable transitions after navigation
    }, 100);  // Short delay to skip the transition
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <p>Loading flashcards...</p>
      ) : flashcards.length > 0 ? (
        <>
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
            <Button onClick={handleBack} disabled={flashcards.length <= 1} aria-label="Previous Flashcard">
              <ArrowBackIosNewIcon fontSize="large" />
            </Button>
            <div style={{
              position: 'relative',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }} onClick={() => setTempDisplayBoth(prev => !prev)} >
              <img src={flashcards[current].image} alt={flashcards[current].vocab} style={{
                maxWidth: '100%',
                objectFit: 'contain',
                opacity: (displayMode === 'vocab' && !tempDisplayBoth) ? 0 : 1,
                transition: enableTransition ? 'all 300ms ease' : 'none'
              }} />
              <p style={{
                position: 'absolute',
                bottom: (displayMode === 'vocab' && !tempDisplayBoth) ? '50%' : '10%',
                opacity: (displayMode === 'image' && !tempDisplayBoth) ? 0 : 1,
                transform: 'translateY(50%)',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                fontSize: (displayMode === 'vocab' && !tempDisplayBoth) ? '6em' : '3em',
                padding: '1rem',
                color: 'black',
                transition: enableTransition ? 'all 300ms ease' : 'none'
              }}>
                {flashcards[current].vocab}
              </p>
              <Slider
                value={current+1}
                onChange={(e, newValue) => { setCurrent(newValue-1) }}
                defaultValue={1}
                min={1}
                max={flashcards.length}
                aria-label="Flashcard Selector"
                valueLabelDisplay="auto"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  transform: 'translateY(50%)',
                }}
              />
            </div>
            <Button onClick={handleNext} disabled={flashcards.length <= 1} aria-label="Next Flashcard">
              <ArrowForwardIosNewIcon fontSize="large" />
            </Button>
          </div>
          <Paper elevation={3}>
            <Button onClick={handleShuffleToggle} color={isShuffled ? 'primary' : 'default'}>
              <ShuffleIcon fontSize="large" />
            </Button>
            <Button onClick={toggleImageDisplay} color={displayMode === 'image' ? 'primary' : 'default'} aria-label="Toggle Image Display">
              <ImageOutlinedIcon fontSize="large" />
            </Button>
            <Button onClick={toggleVocabDisplay} color={displayMode === 'vocab' ? 'primary' : 'default'} aria-label="Toggle Vocabulary Display">
              <AbcOutlinedIcon fontSize="large" />
            </Button>
          </Paper>
        </>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)',
          transform: 'translateY(-32px)',
          fontSize: '2em'
        }}>
          Please select flashcards.
        </div>
      )}
    </div>
  );
}


