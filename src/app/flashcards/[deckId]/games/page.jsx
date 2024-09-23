import React from 'react';
import Link from 'next/link';
import { Typography, Button } from '@mui/material';

const GamesMenu = ({ params }) => {
  const { deckId } = params;

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h2" component="h1" style={{ textAlign: 'center', padding: '1em 0' }}>
                {'Games Menu'}
            </Typography>
            <div>
                <Link href={`/flashcards/${deckId}/games/concentration`}>
                    <Button variant="contained" style={{ margin: '10px' }}>Concentration</Button>
                </Link>
                <Link href={`/flashcards/${deckId}/games/tic-tac-toe`}>
                    <Button variant="contained" style={{ margin: '10px' }}>Tic-Tac-Toe</Button>
                </Link>
                {/* Additional game links can be added here */}
            </div>
        </div>
    );
};

export default GamesMenu;