'use client'

import Link from 'next/link';
import { Button, Typography, List, ListItem } from '@mui/material';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
      <Typography variant="h2" component="h1" gutterBottom style={{ textAlign: 'center' }}>
        Menu
      </Typography>

      <Button variant="contained" component={Link} href={`/instructions/`} sx={{ margin: '5vh', textTransform: 'none', }}>
        <Typography variant="h5" component="div">
          Please click here for instructions.
        </Typography>
      </Button>
      <List>
        <ListItem disablePadding>
          <Button variant="contained" component={Link} href={`/flashcards/`} sx={{ textAlign: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" component="div">
              Flashcards
            </Typography>
          </Button>
        </ListItem>
      </List>
    </div>
  );
}
