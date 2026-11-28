import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Option<T extends string> {
  key: T;
  label: string;
}

interface Props<T extends string> {
  options: readonly Option<T>[];
  selected: T;
  onSelect: (key: T) => void;
}

// Selector de vistas con segmentos de igual ancho (el activo en verde, como CategoryFilter).
export default function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: Props<T>) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option.key === selected;
        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.segment, active && styles.segmentActive]}
            activeOpacity={0.8}
            onPress={() => onSelect(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: colors.secondary,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.secondary,
  },
  labelActive: {
    color: colors.white,
  },
});
