import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistViewProps {
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
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

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ChecklistItem>) => (
      <ScaleDecorator>
        <View style={[styles.itemRow, isActive && styles.itemActive]}>
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
            onLongPress={drag}
            delayLongPress={150}
            style={styles.dragHandle}
            activeOpacity={0.6}
          >
            <Text style={styles.dragHandleText}>≡</Text>
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    ),
    [toggleItem, updateText]
  );

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => onItemsChange(data)}
        contentContainerStyle={styles.listContent}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  itemActive: {
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
