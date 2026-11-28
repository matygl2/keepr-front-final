import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../constants/theme';

// Botón de volver único para las pantallas que se abren encima de las pestañas.
// Va siempre en su propia fila, pegado al margen izquierdo del contenido (así el título de
// abajo queda alineado con él) y mide al menos 44 de alto, el mínimo cómodo para el dedo.
export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={22} color={colors.secondary} />
      <Text style={styles.label}>Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingRight: spacing.md,
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
