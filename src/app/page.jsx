'use client'

import Link from 'next/link';
import { Typography, List, ListItem, ListItemButton } from '@mui/material';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
      <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center' }}>
        Menu
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} href={`/flashcards/`} sx={{ textAlign: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" component="div">
              Flashcards
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}
