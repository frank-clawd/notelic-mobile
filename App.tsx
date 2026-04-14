import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
} from '@10play/tentap-editor';
import ChecklistView from './src/ChecklistView';
import type { ChecklistItem } from './src/ChecklistView';

type Mode = 'richtext' | 'checklist';

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Rich text editing ✓', checked: true },
  { id: '2', text: 'Toggle this checkbox!', checked: false },
  { id: '3', text: 'Drag to reorder items', checked: false },
  { id: '4', text: 'Add new items below', checked: false },
];

export default function App() {
  const [mode, setMode] = useState<Mode>('checklist');
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);

  const toggleMode = () => {
    setMode((prev) => (prev === 'richtext' ? 'checklist' : 'richtext'));
  };

  const editor = useEditorBridge({
    bridgeExtensions: TenTapStartKit,
    initialContent:
      '<h2>Welcome to Notelic POC</h2><p>This is a <strong>TenTap</strong> editor proof-of-concept.</p><ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Rich text editing ✓</p></li><li data-type="taskItem" data-checked="false"><p>Toggle this checkbox!</p></li></ul>',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notelic POC</Text>
        <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
          <Text style={styles.modeButtonText}>
            {mode === 'richtext' ? '✓ Checklist' : '✎ Rich Text'}
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'checklist' ? (
        <ChecklistView items={items} onItemsChange={setItems} />
      ) : (
        <View style={styles.editorWrapper}>
          <View style={styles.editorContainer}>
            <RichText editor={editor} />
          </View>
          <Toolbar editor={editor} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  editorWrapper: {
    flex: 1,
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
