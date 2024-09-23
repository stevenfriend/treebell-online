'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Concentration = () => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedCards = JSON.parse(sessionStorage.getItem('selectedCards'));
        if (storedCards && storedCards.length > 0) {
            fetchFlashcards(storedCards);
        } else {
            setLoading(false);
            setError('Please select flashcards.');
        }
    }, []);

    const fetchFlashcards = async (cardIds) => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL;
            const promises = cardIds.map(id =>
                axios.get(`${api}/flashcards/${id}`)
            );
            const cardsResponses = await Promise.all(promises);
            const fetchedCards = cardsResponses.map(res => res.data);
            setCards(shuffleCards([...fetchedCards, ...fetchedCards])); // Duplicate and shuffle for pairing
        } catch (error) {
            console.error('Failed to fetch flashcards', error);
            setError('Failed to load flashcards.');
        }
        setLoading(false);
    };

    function shuffleCards(cards) {
        return cards.sort(() => Math.random() - 0.5);
    }

    const handleCardClick = index => {
        if (flippedIndices.includes(index) || matchedIndices.includes(index)) {
            return; // Ignore clicks on already flipped or matched cards
        }

        const newFlippedIndices = [...flippedIndices, index];

        if (newFlippedIndices.length === 2) {
            // Display both cards
            setFlippedIndices(newFlippedIndices);

            const firstCard = cards[newFlippedIndices[0]];
            const secondCard = cards[newFlippedIndices[1]];

            if (firstCard.id === secondCard.id) {
              // If cards match, permanently add them to matchedIndices and reset flippedIndices immediately
              setMatchedIndices(prev => [...prev, ...newFlippedIndices]);
              setFlippedIndices([]);
            }
            setTimeout(() => {
                setFlippedIndices([]);
            }, 1000); // Allow some time to see the cards before flipping back
        } else {
            setFlippedIndices(newFlippedIndices);
        }
    };

    if (loading) {
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 64px)',
            transform: 'translateY(-32px)',
            fontSize: '2em'
          }}>
            Loading...
          </div>
        );
      }
      
      if (error) {
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 64px)',
            transform: 'translateY(-32px)',
            fontSize: '2em'
          }}>
            {error}
          </div>
        );
    }

    return (
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '15px',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          padding: '20px'
      }}>
          {cards.map((card, index) => (
              <div
                  key={index}
                  style={{
                      width: '300px',
                      height: '200px',
                      margin: 'auto',
                      backgroundColor: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '16px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      position: 'relative'
                  }}
                  onClick={() => handleCardClick(index)}
              >
                  {(flippedIndices.includes(index) || matchedIndices.includes(index)) ? (
                      <img src={card.image} alt={card.vocab} style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                      }} />
                  ) : (
                      <div style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '5em',
                          color: 'black',
                          fontWeight: 'bold'
                      }}>
                          {index + 1} {/* Display the card number, incremented by one for human-friendly numbering */}
                      </div>
                  )}
              </div>
          ))}
      </div>
    );
};

export default Concentration;
