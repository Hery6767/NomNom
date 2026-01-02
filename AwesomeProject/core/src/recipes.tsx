// core/src/recipes.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Pressable,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../auth/AuthContext';

const API_BASE = 'http://10.0.2.2:3000';

// ===== Types =====
type Category = 'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Drink' | 'Dessert';

type Recipe = {
    id: number;
    title: string;
    category: string;
    description?: string;
    imageUrl?: string;
    timeMinutes?: number;
    calories?: number;
};

const CATEGORIES: Category[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drink', 'Dessert'];

// ===== Theme =====
const BRAND = '#0d4d3b';
const BG = '#F6F7F9';
const CARD = '#FFFFFF';
const TEXT = '#101828';
const MUTED = '#667085';
const BORDER = 'rgba(16, 24, 40, 0.12)';

export default function RecipesScreen() {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [category, setCategory] = useState<Category>('All');
    const [q, setQ] = useState('');
    const [data, setData] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // ===== Fetch =====
    const fetchRecipes = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setErr(null);

        try {
            const res = await fetch(`${API_BASE}/recipes`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();

            const normalized: Recipe[] = (Array.isArray(json) ? json : []).map((x: any) => ({
                id: x.RecipeId,
                title: x.Name ?? 'Untitled',
                category: x.Category ?? 'Other',
                description: x.Description ?? '',
                timeMinutes: x.TimeMinutes ?? undefined,
                calories: x.Calories ?? undefined,
                imageUrl: x.ImageUrl ?? undefined,
            }));

            setData(normalized);
        } catch (e: any) {
            setErr(e?.message || 'Fetch failed');
            setData([]);
        } finally {
            if (!silent) setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRecipes(true);
    }, [fetchRecipes]);

    // ===== Filter =====
    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        return data
            .filter(r => (category === 'All' ? true : r.category.toLowerCase() === category.toLowerCase()))
            .filter(r => (!keyword ? true : r.title.toLowerCase().includes(keyword)));
    }, [data, category, q]);

    // ===== Render =====
    const renderChip = ({ item }: { item: Category }) => {
        const active = item === category;
        return (
            <Pressable onPress={() => setCategory(item)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
            </Pressable>
        );
    };

    const renderItem = ({ item }: { item: Recipe }) => (
        <Pressable
            onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
            android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
        >
            <View style={styles.media}>
                {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.mediaImg} />
                ) : (
                    <View style={styles.mediaPlaceholder}>
                        <Ionicons name="image-outline" size={18} color={MUTED} />
                        <Text style={styles.noImg}>No image</Text>
                    </View>
                )}
            </View>

            <View style={styles.body}>
                <View style={styles.rowBetween}>
                    <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.category.toUpperCase()}</Text>
                    </View>
                </View>

                {!!item.description && (
                    <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
                )}

                <View style={styles.metaRow}>
                    <View style={styles.meta}>
                        <Ionicons name="time-outline" size={14} color={MUTED} />
                        <Text style={styles.metaText}>
                            {typeof item.timeMinutes === 'number' ? `${item.timeMinutes} min` : '—'}
                        </Text>
                    </View>

                    <View style={styles.meta}>
                        <Ionicons name="flame-outline" size={14} color={MUTED} />
                        <Text style={styles.metaText}>
                            {typeof item.calories === 'number' ? `${item.calories} kcal` : '—'}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.h1}>Recipes</Text>

                    {isAdmin && (
                        <Pressable
                            onPress={() => navigation.navigate('RecipeCreate')}
                            style={styles.addBtn}
                        >
                            <Ionicons name="add" size={18} color="#fff" />
                            <Text style={styles.addText}>Add</Text>
                        </Pressable>
                    )}
                </View>

                <Text style={styles.sub}>Search & filter your meals quickly</Text>

                {/* Search */}
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={18} color={MUTED} />
                    <TextInput
                        value={q}
                        onChangeText={setQ}
                        placeholder="Search by recipe name..."
                        placeholderTextColor={MUTED}
                        style={styles.search}
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {!!q && (
                        <Pressable onPress={() => setQ('')} hitSlop={10}>
                            <Ionicons name="close-circle" size={18} color={MUTED} />
                        </Pressable>
                    )}
                </View>

                {/* Categories */}
                <FlatList
                    horizontal
                    data={CATEGORIES}
                    keyExtractor={i => i}
                    renderItem={renderChip}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                />
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.centerText}>Loading...</Text>
                </View>
            ) : err ? (
                <View style={styles.center}>
                    <Text style={styles.centerText}>Error: {err}</Text>
                    <Pressable style={styles.retryBtn} onPress={() => fetchRecipes()}>
                        <Text style={styles.retryText}>Retry</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => `recipe-${item.id}`}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={filtered.length ? styles.list : styles.empty}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.centerText}>No recipes found</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

// ===== Styles =====
const shadow = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 2 },
    default: {},
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },

    header: { padding: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 26, fontWeight: '900', color: TEXT },
    sub: { marginTop: 4, color: MUTED, fontWeight: '600' },

    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: BRAND,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    addText: { color: '#fff', fontWeight: '900' },

    searchBox: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: CARD,
        borderRadius: 16,
        paddingHorizontal: 12,
        height: 46,
        borderWidth: 1,
        borderColor: BORDER,
        ...shadow,
    },
    search: { flex: 1, fontSize: 14.5, color: TEXT, fontWeight: '600' },

    chips: { marginTop: 12, gap: 10 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: BORDER,
    },
    chipActive: { backgroundColor: BRAND, borderColor: BRAND },
    chipText: { fontWeight: '800', fontSize: 12.5, color: MUTED },
    chipTextActive: { color: '#fff' },

    list: { paddingHorizontal: 16, paddingBottom: 16 },
    empty: { flexGrow: 1 },
    row: { justifyContent: 'space-between' },

    card: {
        width: '48.5%',
        backgroundColor: CARD,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: BORDER,
        overflow: 'hidden',
        marginBottom: 12,
        ...shadow,
    },

    media: { width: '100%', height: 110, backgroundColor: '#EEE' },
    mediaImg: { width: '100%', height: '100%' },
    mediaPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
    noImg: { fontSize: 11, fontWeight: '700', color: MUTED },

    body: { padding: 12, gap: 8 },

    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' },
    title: { flex: 1, fontSize: 14.5, fontWeight: '900', color: TEXT },

    badge: {
        backgroundColor: 'rgba(13,77,59,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: { fontSize: 10, fontWeight: '900', color: BRAND },

    desc: { fontSize: 12.2, fontWeight: '600', color: MUTED, lineHeight: 16 },

    metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 12.2, fontWeight: '800', color: MUTED },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
    centerText: { fontWeight: '700', color: MUTED, textAlign: 'center' },

    retryBtn: { marginTop: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: BRAND },
    retryText: { color: '#fff', fontWeight: '900' },
});
