'use client'

import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Box, Button, IconButton, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon for the FAB

export default function DeckLayout({ params, children }) {
  const { deckId } = params;
  const router = useRouter();
  
  const goToDecksPage = () => {
    router.push('/flashcards');
  };

  const goToSelectPage = () => {
    router.push(`/flashcards/${deckId}`);
  };

  const goToPracticePage = () => {
    router.push(`/flashcards/${deckId}/practice`);
  };

  const goToGamesPage = () => {
    router.push(`/flashcards/${deckId}/games`);
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Fab variant="extended" onClick={goToDecksPage} sx={{ position: 'absolute', left: 10, top: 6 }}>
            <ArrowBackIcon sx={{ mr: 1 }}/>
            decks
          </Fab>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button color="inherit" onClick={goToSelectPage}>Select</Button>
            <Button color="inherit" onClick={goToPracticePage}>Practice</Button>
            <Button color="inherit" onClick={goToGamesPage}>Play</Button>
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
}
