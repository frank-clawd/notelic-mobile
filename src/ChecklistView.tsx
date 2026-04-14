import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistViewProps {
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
}

const ITEM_HEIGHT = 50; // approximate row height for drag calculations

function DraggableItem({
  item,
  index,
  totalCount,
  toggleItem,
  updateText,
  onReorder,
}: {
  item: ChecklistItem;
  index: number;
  totalCount: number;
  toggleItem: (id: string) => void;
  updateText: (id: string, text: string) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const startIndex = useSharedValue(index);
  const currentIndex = useSharedValue(index);

  // Update index when items change
  startIndex.value = index;
  currentIndex.value = index;

  const longPressDrag = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      isDragging.value = true;
      startIndex.value = index;
      currentIndex.value = index;
    })
    .onFinalize(() => {
      if (isDragging.value) {
        isDragging.value = false;
        const from = startIndex.value;
        const to = currentIndex.value;
        if (from !== to) {
          runOnJS(onReorder)(from, to);
        }
        translateY.value = withTiming(0);
      }
    });

  const pan = Gesture.Pan()
    .enabled(false) // controlled by simultaneous
    .onUpdate((e) => {
      if (!isDragging.value) return;
      translateY.value = e.translationY;
      // Calculate target index
      const diff = e.translationY / ITEM_HEIGHT;
      const newIndex = Math.round(Math.max(0, Math.min(totalCount - 1, startIndex.value + diff)));
      currentIndex.value = newIndex;
    })
    .onFinalize(() => {
      if (isDragging.value) {
        isDragging.value = false;
        const from = startIndex.value;
        const to = currentIndex.value;
        if (from !== to) {
          runOnJS(onReorder)(from, to);
        }
        translateY.value = withTiming(0);
      }
    });

  const composed = Gesture.Simultaneous(longPressDrag, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    elevation: isDragging.value ? 5 : 0,
    zIndex: isDragging.value ? 999 : 1,
    opacity: withTiming(isDragging.value ? 0.9 : 1, { duration: 150 }),
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleItem(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkboxBox,
                item.checked && styles.checkboxChecked,
              ]}
            >
              {item.checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <TextInput
            style={[styles.itemText, item.checked && styles.itemTextChecked]}
            value={item.text}
            onChangeText={(text) => updateText(item.id, text)}
            placeholder="List item..."
            placeholderTextColor="#aaa"
            multiline
          />
          <View style={styles.dragHandle}>
            <Text style={styles.dragHandleText}>≡</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function ChecklistView({
  items,
  onItemsChange,
}: ChecklistViewProps) {
  const toggleItem = useCallback(
    (id: string) => {
      onItemsChange(
        items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    },
    [items, onItemsChange]
  );

  const updateText = useCallback(
    (id: string, text: string) => {
      onItemsChange(
        items.map((item) => (item.id === id ? { ...item, text } : item))
      );
    },
    [items, onItemsChange]
  );

  const addItem = useCallback(() => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: '',
      checked: false,
    };
    onItemsChange([...items, newItem]);
  }, [items, onItemsChange]);

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newItems = [...items];
      const [moved] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, moved);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onItemsChange(newItems);
    },
    [items, onItemsChange]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ChecklistItem; index: number }) => (
      <DraggableItem
        item={item}
        index={index}
        totalCount={items.length}
        toggleItem={toggleItem}
        updateText={updateText}
        onReorder={handleReorder}
      />
    ),
    [items.length, toggleItem, updateText, handleReorder]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.addButtonText}>+ Add item</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: ITEM_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  checkbox: {
    padding: 4,
    marginRight: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 2,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  dragHandle: {
    padding: 8,
    marginLeft: 4,
  },
  dragHandleText: {
    fontSize: 20,
    color: '#bbb',
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
