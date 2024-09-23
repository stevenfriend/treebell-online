'use client'

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemButton } from '@mui/material';

export default function Home() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${api}/decks/`)
      .then(res => {
        console.log(res.data)
        setDecks(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
      <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center' }}>
        Flashcards Menu
      </Typography>
      <List>
        {decks.map(deck => (
          <ListItem key={deck.id} disablePadding>
            <ListItemButton component={Link} href={`/flashcards/${deck.id}`} sx={{ textAlign: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" component="div">
                {deck.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
