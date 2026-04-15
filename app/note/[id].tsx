import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const MOCK_NOTES: Record<string, { title: string; content: string }> = {
  '1': { title: 'Project Ideas for Q2', content: 'Launch mobile app, redesign onboarding flow, integrate AI suggestions for note organization' },
  '2': { title: 'Meeting Notes — Product Review', content: 'Discussed roadmap priorities. Team agreed on focusing on mobile experience first.' },
  '3': { title: 'Book Recommendations', content: 'Atomic Habits, Deep Work, The Design of Everyday Things, Thinking Fast and Slow' },
  '4': { title: 'Grocery List', content: 'Avocados, eggs, sourdough bread, olive oil, tomatoes, basil, mozzarella' },
  '5': { title: 'API Design Notes', content: 'REST endpoints for notes CRUD. Consider GraphQL for search. Auth via JWT with refresh tokens.' },
  '6': { title: 'Workout Routine', content: 'Mon: Upper body, Tue: Cardio, Wed: Lower body, Thu: Rest, Fri: Full body, Sat: Yoga' },
  '7': { title: 'Travel Packing List — Denver Trip', content: 'Jacket, hiking boots, sunscreen, water bottle, camera, laptop charger' },
};

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const note = MOCK_NOTES[id ?? ''];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {note?.title || 'Untitled Note'}
        </Text>
        <Text style={[styles.content, { color: colors.secondaryText }]}>
          {note?.content || 'Editor will go here (TenTap integration)'}
        </Text>
        <View style={styles.saveIndicator}>
          <Text style={[styles.saveText, { color: colors.secondaryText }]}>All changes saved</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
  },
  saveIndicator: {
    paddingTop: 16,
  },
  saveText: {
    fontSize: 12,
  },
});
