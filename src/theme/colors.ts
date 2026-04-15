import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StyleSheet } from 'react-native';

export function useTheme() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return { colors, isDark: colorScheme === 'dark' };
}

export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  styleFactory: (colors: typeof Colors.light) => T,
) {
  return function useStyles() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    return StyleSheet.create(styleFactory(colors));
  };
}
