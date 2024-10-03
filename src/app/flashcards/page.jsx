'use client'

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CircularProgress, Typography, List, ListItem, Button } from '@mui/material';

export default function Home() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true); // Start loading
    axios.get(`${api}/decks/`)
      .then(res => {
        setDecks(res.data);
        setLoading(false); // End loading after data is fetched
      })
      .catch(err => {
        console.error(err);
        setLoading(false); // End loading if there is an error
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
      <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center' }}>
        Flashcards Menu
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {decks.map(deck => (
            <ListItem key={deck.id} disablePadding>
              <Link href={`/flashcards/${deck.id}`} passHref>
                <Button variant="contained" sx={{ width: '200px', textAlign: 'center', justifyContent: 'center', textTransform: 'none', margin: '.5em' }}>
                  <Typography variant="h5" component="div">
                    {deck.name}
                  </Typography>
                </Button>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
