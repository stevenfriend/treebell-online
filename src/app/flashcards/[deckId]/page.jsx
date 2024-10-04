'use client'

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Skeleton, Switch } from '@mui/material';


export default function Deck({ params }) {
 const { deckId } = params;
 const [deckName, setDeckName] = useState('');
 const [groups, setGroups] = useState([]);
 const [selectedCards, setSelectedCards] = useState(new Set());
 const [loadingStates, setLoadingStates] = useState({});

 useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    setLoadingStates({ groupsLoading: true });
    axios.get(`${api}/decks/${deckId}`)
      .then(res => {
        setDeckName(res.data.name);
        setGroups(res.data.groups);
        const initialLoadingStates = {};
        res.data.groups.forEach(group => {
          initialLoadingStates[group.id] = true;
          fetchGroupDetails(group.id);
          checkStoredCards(res.data.groups);
        });
        setLoadingStates(initialLoadingStates);
      })
      .catch(err => {
        console.error(err);
        setLoadingStates({ groupsLoading: false });
      });
  }, [deckId]);

  const checkStoredCards = (groups) => {
    const allFlashcards = groups.flatMap(group => group.flashcards); // Flatten the flashcards
    const currentCardIds = new Set(allFlashcards.map(card => card.id)); // Extract IDs

    const storedCards = JSON.parse(sessionStorage.getItem('selectedCards'));
    if (storedCards) {
      const storedCardIds = new Set(storedCards);
      const intersection = new Set([...storedCardIds].filter(id => currentCardIds.has(id)));

      if (intersection.size === 0) {
        // No overlap, user has switched decks
        sessionStorage.removeItem('selectedCards');
        setSelectedCards(new Set());
      } else {
        // Overlap exists, update selected cards
        setSelectedCards(intersection);
      }
    }
  };

  const fetchGroupDetails = (groupId) => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    axios.get(`${api}/groups/${groupId}`)
      .then(res => {
        setGroups(prevGroups => prevGroups.map(group =>
          group.id === groupId ? { ...group, ...res.data, subgroups: res.data.subgroups || [] } : group
        ));
        setLoadingStates(prev => ({ ...prev, [groupId]: false }));
      })
      .catch(err => {
        console.error(err);
        setLoadingStates(prev => ({ ...prev, [groupId]: false }));
      });
  };


  const toggleCardSelection = (cardId) => {
    setSelectedCards(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      sessionStorage.setItem('selectedCards', JSON.stringify(Array.from(newSelected)));
      return newSelected;
    });
  };


  const handleGroupSubgroupToggle = (cards) => {
    const cardIds = cards.map(card => card.id);
    const allSelected = cardIds.every(id => selectedCards.has(id));
    const newSelectedCards = new Set(selectedCards);
    if (allSelected) {
      cardIds.forEach(id => newSelectedCards.delete(id));
    } else {
      cardIds.forEach(id => newSelectedCards.add(id));
    }
    setSelectedCards(newSelectedCards);
    sessionStorage.setItem('selectedCards', JSON.stringify(Array.from(newSelectedCards)));
  };


  return (
    <div className="mx-auto w-4/5">
      <Typography variant="h2" component="h1" style={{ textAlign: 'center', paddingTop: '1em' }}>
        {deckName || 'Loading...'}
      </Typography>
      {loadingStates.groupsLoading ? (
        <Skeleton variant="rectangular" width="100%" height={150} sx={{ bgcolor: 'grey.100' }} />
      ) : (
        groups.map(group => (
          <div key={group.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '1em 0 .5em 0' }}>
              <h2 style={{ fontSize: '2em' }}>{group.name}</h2>
              <Switch
                checked={group.flashcards.every(card => selectedCards.has(card.id))}
                onChange={() => handleGroupSubgroupToggle(group.flashcards)}
              />
            </div>
            {group.subgroups && group.subgroups.length > 0 ? (
              group.subgroups.map(subgroup => (
                <div key={subgroup.id} style={{ padding: '1em' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1em' }}>
                    <Typography variant="h5" style={{ fontSize: '1.5em' }}>{subgroup.name}</Typography>
                    <Switch
                      checked={subgroup.flashcards.every(card => selectedCards.has(card.id))}
                      onChange={() => handleGroupSubgroupToggle(subgroup.flashcards)}
                    />
                  </div>
                  <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1em',
                        marginBottom: '1em',
                        justifyContent: 'space-between',
                      }}>
                    {subgroup.flashcards.map(card => renderCard(card))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '1em',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1em',
                marginBottom: '1em',
                justifyContent: 'space-between',
              }}>
                {group.flashcards.map(card => renderCard(card))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  function renderCard(card) {
    return (
      <Card key={card.id} sx={{ outline: selectedCards.has(card.id) ? '2px solid blue' : 'none' }}>
        <CardActionArea onClick={() => toggleCardSelection(card.id)} sx={{
          position: 'relative',
          '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            zIndex: 2,
            opacity: selectedCards.has(card.id) ? 1 : 0,
            transition: 'opacity 300ms ease-in-out'
          },
        }}>
          <CardMedia component="img" image={card.image} alt={card.vocab} />
          <CardContent>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>{card.vocab}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}