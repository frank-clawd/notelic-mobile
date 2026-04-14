import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View } from 'react-native';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  TenTapStartKit,
} from '@10play/tentap-editor';

export default function App() {
  const editor = useEditorBridge({
    bridgeExtensions: TenTapStartKit,
    initialContent: '<h2>Welcome to Notelic POC</h2><p>This is a <strong>TenTap</strong> editor proof-of-concept.</p><ul data-type="taskList"><li data-type="taskItem" data-checked="true"><p>Rich text editing ✓</p></li><li data-type="taskItem" data-checked="false"><p>Toggle this checkbox!</p></li></ul>',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notelic POC</Text>
      </View>
      <View style={styles.editorContainer}>
        <RichText editor={editor} />
      </View>
      <Toolbar editor={editor} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
  editorContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
