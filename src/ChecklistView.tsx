import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  LayoutAnimation,
  Animated,
  PanResponder,
  Platform,
  UIManager,
} from 'react-native';

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

const ITEM_HEIGHT = 50;

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
  const translateY = useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const startIndexRef = useRef(index);

  // Keep index in sync
  startIndexRef.current = index;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => isDraggingRef.current,
      onPanResponderMove: (_, gestureState) => {
        if (!isDraggingRef.current) return;
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setDragging(false);

        const from = startIndexRef.current;
        const diff = Math.round(gestureState.dy / ITEM_HEIGHT);
        const to = Math.max(0, Math.min(totalCount - 1, from + diff));

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
        }).start(() => {
          if (from !== to) {
            onReorder(from, to);
          }
        });
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
        setDragging(false);
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handlePressIn = () => {
    longPressTimer.current = setTimeout(() => {
      isDraggingRef.current = true;
      startIndexRef.current = index;
      setDragging(true);
    }, 300);
  };

  const handlePressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        elevation: dragging ? 5 : 0,
        zIndex: dragging ? 999 : 1,
        opacity: dragging ? 0.9 : 1,
      }}
      {...panResponder.panHandlers}
    >
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
        <TouchableOpacity
          style={styles.dragHandle}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.5}
        >
          <Text style={styles.dragHandleText}>≡</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
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
    <View style={styles.container}>
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
    </View>
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
