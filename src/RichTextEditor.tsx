import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
} from '@10play/tentap-editor';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface RichTextEditorProps {
  checklistItems: ChecklistItem[];
  onContentChange?: (html: string) => void;
}

function checklistToHtml(items: ChecklistItem[]): string {
  if (items.length === 0) return '<p></p>';
  const listItems = items
    .map(
      (item) =>
        `<li data-type="taskItem" data-checked="${item.checked}"><p>${escapeHtml(item.text)}</p></li>`
    )
    .join('');
  return `<ul data-type="taskList">${listItems}</ul>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function RichTextEditor({ checklistItems }: RichTextEditorProps) {
  const initialContent = checklistToHtml(checklistItems);

  const editor = useEditorBridge({
    bridgeExtensions: TenTapStartKit,
    initialContent,
  });

  return (
    <View style={styles.container}>
      <View style={styles.editorContainer}>
        <RichText editor={editor} />
      </View>
      <Toolbar editor={editor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
