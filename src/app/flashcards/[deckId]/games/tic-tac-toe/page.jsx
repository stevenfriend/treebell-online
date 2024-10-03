'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill({ player: null }));
    const [currentPlayer, setCurrentPlayer] = useState('O');
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const storedCardIds = JSON.parse(sessionStorage.getItem('selectedCards'));
        if (!storedCardIds || storedCardIds.length < 9) {
            alert('Please select at least 9 flashcards.');
        } else {
            const shuffledCardIds = storedCardIds.sort(() => Math.random() - 0.5);
            fetchFlashcards(shuffledCardIds.slice(0, 9)); // Fetch only the first 9 cards needed for the game
        }
    }, []);

    const fetchFlashcards = async (cardIds) => {
        const api = process.env.NEXT_PUBLIC_API_URL;
        try {
            const promises = cardIds.map(id =>
                axios.get(`${api}/flashcards/${id}`)
            );
            const cardsResponses = await Promise.all(promises);
            setFlashcards(cardsResponses.map(res => res.data));
            setBoard(cardsResponses.map(res => ({ ...res.data, player: null }))); // Initialize board with no player moves
        } catch (error) {
            console.error('Failed to fetch flashcards', error);
        }
    };

    const handleClick = (index) => {
      if (winner || board[index].player) return; // If there's a winner or the spot is taken, ignore the click

      const newBoard = [...board];
      newBoard[index].player = currentPlayer;
      setBoard(newBoard);

      const nextPlayer = currentPlayer === 'O' ? 'X' : 'O';
      setCurrentPlayer(nextPlayer); // Switch turns

      if (checkForWinner(newBoard)) {
          setWinner(currentPlayer);
      }
  };

    const checkForWinner = (board) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a].player && board[a].player === board[b].player && board[a].player === board[c].player) {
                return board[a].player;
            }
        }
        return null;
    };

    return (
        <div style={{
            margin: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '60vw',
            // height: 'calc(80vh - 64px)',
            gridGap: '5px',
            backgroundColor: '#333', // Dark gray lines between cells
        }}>
            {board.map((card, index) => (
                <div key={index} onClick={() => handleClick(index)} style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}>
                    <img src={card.image} alt="Flashcard" style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain' // Ensure the image fits well without stretching
                    }} />
                    {card.player && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '3em',
                            color: card.player === 'X' ? 'red' : 'green',
                            pointerEvents: 'none' // Prevents click events on this overlay
                        }}>
                            {card.player === 'X' ? 'X' : 'O'}
                        </div>
                    )}
                </div>
            ))}
            {winner && <p>Winner: {winner}</p>}
        </div>
    );
  };

export default TicTacToe;
