import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { NoteCard } from '@/src/components/NoteCard';
import { SearchBar } from '@/src/components/SearchBar';
import { TagChips } from '@/src/components/TagChips';
import type { Note } from '@/api/types';

// Mock data
const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Ideas for Q2',
    content: 'Launch mobile app, redesign onboarding flow, integrate AI suggestions for note organization',
    tags: ['work', 'planning'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'Meeting Notes — Product Review',
    content: 'Discussed roadmap priorities. Team agreed on focusing on mobile experience first. Follow up with design team by Friday.',
    tags: ['work', 'meetings'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Book Recommendations',
    content: 'Atomic Habits, Deep Work, The Design of Everyday Things, Thinking Fast and Slow',
    tags: ['personal'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    title: 'Grocery List',
    content: 'Avocados, eggs, sourdough bread, olive oil, tomatoes, basil, mozzarella',
    tags: ['personal', 'errands'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '5',
    title: 'API Design Notes',
    content: 'REST endpoints for notes CRUD. Consider GraphQL for search. Auth via JWT with refresh tokens.',
    tags: ['work', 'technical'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '6',
    title: 'Workout Routine',
    content: 'Mon: Upper body, Tue: Cardio, Wed: Lower body, Thu: Rest, Fri: Full body, Sat: Yoga',
    tags: ['personal', 'health'],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '7',
    title: 'Travel Packing List — Denver Trip',
    content: 'Jacket, hiking boots, sunscreen, water bottle, camera, laptop charger',
    tags: ['personal', 'travel'],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

const ALL_TAGS = [...new Set(MOCK_NOTES.flatMap((n) => n.tags))];

export default function NotesListScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredNotes = MOCK_NOTES.filter((note) => {
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar value={search} onChangeText={setSearch} />
      <TagChips tags={ALL_TAGS} selected={selectedTag} onSelect={setSelectedTag} />
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={(id) => router.push(`/note/${id}`)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 20,
  },
});
