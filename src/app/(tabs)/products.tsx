import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarView from '../../components/CalendarView';
import CategoryFilter from '../../components/CategoryFilter';
import ProductCard from '../../components/ProductCard';
import SegmentedControl from '../../components/SegmentedControl';
import SwipeToDeleteRow from '../../components/SwipeToDeleteRow';
import WarrantiesView from '../../components/WarrantiesView';
import { colors, fonts, radius, spacing } from '../../constants/theme';
import { useProducts } from '../../context/ProductsContext';

// Las tres vistas que se alternan dentro de la pestaña Products.
const VIEWS = [
  { key: 'products', label: 'Products' },
  { key: 'warranties', label: 'Warranties' },
  { key: 'calendar', label: 'Calendar' },
] as const;

type ProductsView = (typeof VIEWS)[number]['key'];

// La vista elegida vive en el parámetro `view` de la ruta (/products?view=calendar), así otras
// pantallas pueden abrir una vista concreta (por ejemplo, el aviso de garantías por vencer).
function parseView(value: string | string[] | undefined): ProductsView {
  const first = Array.isArray(value) ? value[0] : value;
  return VIEWS.find((v) => v.key === first)?.key ?? 'products';
}

export default function ProductsScreen() {
  const router = useRouter();
  const { view: viewParam } = useLocalSearchParams<{ view?: string }>();
  const view = parseView(viewParam);
  const { products } = useProducts();
  // La categoría se guarda acá (no en la lista) para que no se pierda al cambiar de vista.
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    if (category === 'All') return products;
    return products.filter((p) => p.category === category);
  }, [category, products]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Products</Text>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => router.push('/product/new')}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <SegmentedControl
          options={VIEWS}
          selected={view}
          onSelect={(key) => router.setParams({ view: key })}
        />
      </View>

      {view === 'products' && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeToDeleteRow product={item}>
              <ProductCard product={item} />
            </SwipeToDeleteRow>
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <CategoryFilter selected={category} onSelect={setCategory} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {products.length === 0 ? 'No products yet' : 'Nothing in this category'}
              </Text>
              <Text style={styles.emptyText}>
                {products.length === 0
                  ? 'Add your first product to start tracking its warranty.'
                  : 'Try another category or add a new product.'}
              </Text>
            </View>
          }
        />
      )}
      {view === 'warranties' && <WarrantiesView />}
      {view === 'calendar' && <CalendarView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});
