'use client'

import React from 'react';
import { Button, Typography, Switch, Slider, Link } from '@mui/material';

import ShuffleIcon from '@mui/icons-material/Shuffle';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosNewIcon from '@mui/icons-material/ArrowForwardIos';
import HomeIcon from '@mui/icons-material/Home';

export default function Instructions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5vh', margin: '1em'}}>
      <Button component={Link} href={`/`} startIcon={<HomeIcon />} variant="outlined" sx={{ alignSelf: 'flex-start' }}>Home</Button> {/* Home Button at the top */}
      <Typography variant="h2" component="h1" style={{ textAlign: 'center', margin: '1em' }}>
        Instructions
      </Typography>
      <Typography variant="h4">Accessing and Selecting Flashcards</Typography>
      <ol>
        <li style={{ margin: '1em' }}>
          <Typography variant="h5">
            1. Start on the Menu Page:
          </Typography>
          <Typography>
            Click <Button variant="contained" color="primary">FLASHCARDS</Button> to view available decks.
          </Typography>
        </li>
        <li style={{ margin: '1em' }}>
          <Typography variant="h5">2.Choose a Flashcard Deck:</Typography>
          <Typography>Select the deck you wish to use for your class.</Typography>
        </li>
        <li style={{ margin: '1em' }}>
          <Typography variant="h5">3. Select Flashcards:</Typography>
          <Typography>Choose individual flashcards for the lesson, or use the toggle switches (<Switch />) to select all flashcards within a specific unit or lesson.</Typography>
        </li>
        <li style={{ margin: '1em' }}>
          <Typography variant="h5">4. Begin Practice:</Typography>
          <Typography>Once you have selected the desired flashcards, click <Button variant="contained" color="primary">PRACTICE</Button> at the top of the page.</Typography>
        </li>
      </ol>

      <Typography variant="h4" sx={{marginTop: '2em'}}>Using the Practice Controls</Typography>
      <ul>
        <li style={{ display: 'flex', margin: '1em', alignItems: 'center' }}>
          <Button><ArrowBackIosNewIcon /></Button><Button style={{ width: '25px' }}><ArrowForwardIosNewIcon /></Button>: Use the left and right arrows to move to the previous or next flashcard.
        </li>
        <li style={{ display: 'flex', margin: '1em', alignItems: 'center' }}>
          <Slider defaultValue={30} step={10} min={0} max={100} sx={{width: '50px', margin: '0 1em'}}/>: You can also use the slider at the bottom of the flashcard to navigate through the flashcards.
        </li>
        <li style={{ display: 'flex', margin: '1em', alignItems: 'center' }}>
          <Button><ShuffleIcon  fontSize="large"/></Button>: This button shuffles the order of the flashcards. You can toggle shuffle on and off.
        </li>
        <li style={{ display: 'flex', margin: '1em', alignItems: 'center' }}>
          <Button><ImageOutlinedIcon  fontSize="large"/></Button>: This button allows you to only show the picture and to hide the text. Toggle this setting to practice the students' knowledge of the vocabulary. You can tap the flashcard to reveal the text.
        </li>
        <li style={{ display: 'flex', margin: '1em', alignItems: 'center' }}>
          <Button><AbcOutlinedIcon  fontSize="large"/></Button>: This button allows you to only show the text and to hide the picture. Toggle this setting to practice reading the vocabulary with the students. You can tap the flashcard to reveal the image.
        </li>
      </ul>
    </div>
  );
}



