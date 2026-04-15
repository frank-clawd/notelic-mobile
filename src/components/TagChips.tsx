import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface TagChipsProps {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

export function TagChips({ tags, selected, onSelect }: TagChipsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (tags.length === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => onSelect(null)}>
        <View
          style={[
            styles.chip,
            !selected && { backgroundColor: colors.tint },
            selected && { backgroundColor: colors.tagBackground },
          ]}
        >
          <Text style={[styles.chipText, !selected && { color: '#fff' }, selected && { color: colors.tagText }]}>
            All
          </Text>
        </View>
      </Pressable>
      {tags.map((tag) => (
        <Pressable key={tag} onPress={() => onSelect(tag === selected ? null : tag)}>
          <View
            style={[
              styles.chip,
              tag === selected && { backgroundColor: colors.tint },
              tag !== selected && { backgroundColor: colors.tagBackground },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                tag === selected && { color: '#fff' },
                tag !== selected && { color: colors.tagText },
              ]}
            >
              {tag}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
