'use client'

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { Box, Backdrop, Fab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon for the FAB

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { faSquareCheck, faComment, faGamepad } from '@fortawesome/free-solid-svg-icons';

export default function DeckLayout({ params, children }) {
  const [open, setOpen] = useState(false);
  const { deckId } = params;
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [ 
    { icon: <FontAwesomeIcon icon={faSquareCheck} style={{ fontSize: '1.5rem' }}/>, name: 'SELECT', href: `/flashcards/${deckId}` },
    { icon: <FontAwesomeIcon icon={faComment} style={{ fontSize: '1.5rem' }}/>, name: 'PRACTICE', href: `/flashcards/${deckId}/practice`},
    { icon: <FontAwesomeIcon icon={faGamepad} style={{ fontSize: '1.5rem' }}/>, name: 'PLAY', href: `/flashcards/${deckId}/games` },
  ];

  const handleActionClick = (path) => {
    router.push(path);
  };

  const goToDecksPage = () => {
    router.push('/flashcards');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: 'fixed', display: 'flex', alignItems: 'center', transform: 'translateZ(0px)', flexGrow: 1, zIndex: 1000 }}>
        <Backdrop open={open} sx={{ width: '100vw', height: '100vh' }} />
        <Fab variant="extended" sx={{ margin: '1em' }} onClick={goToDecksPage} >
          <ArrowBackIcon sx={{ mr: 1 }}/>
          decks
        </Fab>
        <SpeedDial
          ariaLabel="Flashcards speed dial"
          icon={<SpeedDialIcon />}
          direction={'right'}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleActionClick(action.href)}
            />
          ))}
        </SpeedDial>
      </Box>
      {children}
    </ThemeProvider>
  );
}
