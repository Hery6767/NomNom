// src/home.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    Dimensions,
    TextInput,
    ScrollView,
    Image,
    Pressable,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../style/colors';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';

const API_BASE = 'http://10.0.2.2:3000';

const { width } = Dimensions.get('window');
const CONTENT_W = Math.min(width * 0.92, 420);
const { BRAND, BRAND2, BRAND_LIGHT, BORDER, BG } = COLORS;

type DayItem = { key: string; day: string; date: string; iso: string };

type Recipe = {
    id?: number;
    title?: string;
    category?: string;
    description?: string;
    imageUrl?: string;
    timeMinutes?: number;
    calories?: number;
    videoUrl?: string;
};

const headerBG = {
    height: 170,
    backgroundColor: BRAND,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
};

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
}

function formatDayShort(d: Date) {
    // SAT SUN MON...
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[d.getDay()];
}

function pad2(n: number) {
    return String(n).padStart(2, '0');
}

function toISODate(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function buildRollingDays(): DayItem[] {
    // 7 days: từ -2 ngày đến +4 ngày (nhìn giống mockup có hôm trước và hôm sau)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const arr: DayItem[] = [];
    for (let i = -2; i <= 4; i++) {
        const x = new Date(today);
        x.setDate(today.getDate() + i);

        arr.push({
            key: toISODate(x),
            iso: toISODate(x),
            day: formatDayShort(x),
            date: String(x.getDate()),
        });
    }
    return arr;
}

export default function Home() {
    const navigation = useNavigation<any>();
    const { user } = useAuth();

    // ✅ greeting realtime
    const [greeting, setGreeting] = useState(getGreeting());
    useEffect(() => {
        const t = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
        return () => clearInterval(t);
    }, []);

    // ✅ user name from AuthContext
    const userName = (user?.fullName || '').trim();

    // ✅ realtime days
    const [days, setDays] = useState<DayItem[]>(() => buildRollingDays());
    const [activeDayISO, setActiveDayISO] = useState(() => toISODate(new Date()));

    useEffect(() => {
        // mỗi phút check lại ngày (đề phòng qua ngày mới)
        const t = setInterval(() => {
            const nowISO = toISODate(new Date());
            setDays(buildRollingDays());
            setActiveDayISO(prev => (prev ? prev : nowISO));
        }, 60 * 1000);

        return () => clearInterval(t);
    }, []);

    // ✅ Meal types (có Snacks lại)
    const MEAL_TYPES = useMemo(() => (['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const), []);
    // Nếu bạn muốn bỏ Snacks: đổi thành ['Breakfast','Lunch','Dinner'] thôi.

    const [activeMealType, setActiveMealType] =
        useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');

    // ✅ Search: debounce để mượt
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
        return () => clearTimeout(t);
    }, [query]);

    const [data, setData] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const fetchHomeData = useCallback(async () => {
        setLoading(true);
        setErr(null);

        try {
            const res = await fetch(`${API_BASE}/recipes`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();

            const normalized: Recipe[] = (Array.isArray(json) ? json : []).map((x: any, idx: number) => ({
                id: x.RecipeId ?? x.recipeId ?? x.Id ?? x.id ?? idx,
                title: x.Name ?? x.name ?? x.Title ?? x.title ?? 'Untitled',
                category: x.Category ?? x.category ?? 'Other',
                description: x.Description ?? x.description ?? '',
                timeMinutes:
                    typeof x.TimeMinutes === 'number'
                        ? x.TimeMinutes
                        : typeof x.timeMinutes === 'number'
                            ? x.timeMinutes
                            : undefined,
                calories:
                    typeof x.Calories === 'number'
                        ? x.Calories
                        : typeof x.calories === 'number'
                            ? x.calories
                            : undefined,
                imageUrl: x.ImageUrl ?? x.imageUrl ?? x.MainImageUrl ?? x.mainImageUrl ?? undefined,
                videoUrl: x.VideoUrl ?? x.videoUrl ?? undefined,
            }));

            setData(normalized);
        } catch (e: any) {
            setErr(e?.message || 'Fetch failed');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    // ✅ Search “xịn”: title + description + category
    const searched = useMemo(() => {
        const k = debouncedQuery.toLowerCase();
        if (!k) return data;

        return data.filter(r => {
            const title = (r.title || '').toLowerCase();
            const desc = (r.description || '').toLowerCase();
            const cat = (r.category || '').toLowerCase();
            return title.includes(k) || desc.includes(k) || cat.includes(k);
        });
    }, [data, debouncedQuery]);

    // ✅ Meals section:
    // - đang search => show top results (không filter theo mealType)
    // - không search => filter theo activeMealType
    const sectionMeals = useMemo(() => {
        const isSearching = !!debouncedQuery;

        // ✅ đang search cũng chỉ show 2 kết quả
        if (isSearching) return searched.slice(0, 2);

        const c = activeMealType.toLowerCase();

        // ✅ không search: lọc theo category rồi lấy 2 món
        return searched
            .filter(r => ((r.category || '').trim().toLowerCase() === c))
            .slice(0, 2);
    }, [searched, activeMealType, debouncedQuery]);


    // ✅ Categories distinct
    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const r of data) {
            const c = (r.category || '').trim();
            if (c) set.add(c);
        }

        const arr = Array.from(set);
        const order = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drink', 'Dessert'];
        arr.sort((a, b) => order.indexOf(a) - order.indexOf(b));

        return arr.map((c, i) => ({
            id: `c-${i}-${c}`,
            title: c,
            image: data.find(r => (r.category || '').trim() === c)?.imageUrl,
        }));
    }, [data]);

    // ✅ Popular: calories desc
    const popular = useMemo(() => {
        const arr = [...data];
        arr.sort((a, b) => (b.calories ?? 0) - (a.calories ?? 0));
        return arr.slice(0, 5);
    }, [data]);

    return (
        <View style={{ flex: 1, backgroundColor: BG }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={headerBG as any}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ width: CONTENT_W, alignSelf: 'center', paddingTop: 8 }}>
                        <Text style={styles.smallHello}>
                            {greeting}
                            {userName ? `, ${userName}` : ''}
                        </Text>

                        <Text style={styles.bigTitle}>
                            It’s time to cook <Text style={{ color: '#b7f57d' }}>{activeMealType}</Text>
                        </Text>

                        {/* Search bar */}
                        <View style={styles.searchRow}>
                            <View style={styles.searchBox}>
                                <Ionicons name="search-outline" size={16} color="rgba(0,0,0,0.40)" />
                                <TextInput
                                    value={query}
                                    onChangeText={setQuery}
                                    placeholder="Search recipes (name, description, category)"
                                    placeholderTextColor="rgba(0,0,0,0.40)"
                                    style={styles.searchInput}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {!!query && (
                                    <Pressable onPress={() => setQuery('')} hitSlop={10}>
                                        <Ionicons name="close-circle" size={18} color="rgba(0,0,0,0.40)" />
                                    </Pressable>
                                )}
                            </View>

                            {/* Refresh */}
                            {/* <Pressable
                                onPress={fetchHomeData}
                                style={({ pressed }) => [styles.filterBtn, { opacity: pressed ? 0.9 : 1 }]}
                            >
                                <Ionicons name="refresh" size={20} color={BRAND} />
                            </Pressable> */}
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            {/* Body */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.centerText}>Loading...</Text>
                </View>
            ) : err ? (
                <View style={styles.center}>
                    <Text style={styles.centerText}>Error: {err}</Text>
                    <Pressable onPress={fetchHomeData} style={styles.retryBtn}>
                        <Text style={styles.retryText}>Retry</Text>
                    </Pressable>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View style={{ width: CONTENT_W, alignSelf: 'center' }}>
                        {/* Days + title */}
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>
                                {activeMealType}’s Meals
                            </Text>
                            <Pressable hitSlop={6} onPress={() => { }}>
                                <Text style={styles.linkDark}>View Full Plan</Text>
                            </Pressable>
                        </View>

                        {/* Days picker realtime */}
                        <FlatList
                            data={days}
                            keyExtractor={d => d.key}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: 12 }}
                            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                            renderItem={({ item }) => {
                                const active = activeDayISO === item.iso;
                                const isToday = item.iso === toISODate(new Date());
                                return (
                                    <Pressable
                                        onPress={() => setActiveDayISO(item.iso)}
                                        style={[
                                            styles.dayPill,
                                            { backgroundColor: active ? BRAND : BRAND_LIGHT },
                                        ]}
                                    >
                                        <Text style={[styles.dayText, { color: active ? '#fff' : BRAND2, opacity: active ? 1 : 0.9 }]}>
                                            {item.day}
                                        </Text>
                                        <Text style={[styles.dayDate, { color: active ? '#fff' : BRAND2, opacity: active ? 1 : 0.9 }]}>
                                            {item.date}
                                        </Text>

                                        {/* {isToday && (
                                            <View style={[styles.todayDot, { backgroundColor: active ? '#fff' : BRAND }]} />
                                        )} */}
                                    </Pressable>
                                );
                            }}
                        />

                        {/* Meal type switch */}
                        <View style={styles.mealTypeRow}>
                            {MEAL_TYPES.map(t => {
                                const active = t === activeMealType;
                                return (
                                    <Pressable
                                        key={t}
                                        onPress={() => setActiveMealType(t)}
                                        style={[styles.mealTypeChip, active && styles.mealTypeChipActive]}
                                    >
                                        <Text style={[styles.mealTypeText, active && styles.mealTypeTextActive]}>{t}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Meals list */}
                        <View style={{ gap: 10 }}>
                            {sectionMeals.map(m => {
                                const timeText = typeof m.timeMinutes === 'number' ? `${m.timeMinutes} mins` : '—';
                                const calText = typeof m.calories === 'number' ? `${m.calories} Cal` : '—';

                                return (
                                    <Pressable
                                        key={String(m.id)}
                                        style={({ pressed }) => [styles.mealCard, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}
                                        onPress={() => {
                                            const recipeId = Number(m.id);
                                            if (!Number.isFinite(recipeId)) return;
                                            navigation.navigate('RecipeDetail', { id: recipeId });
                                        }}
                                    >
                                        <Image
                                            source={
                                                m.imageUrl
                                                    ? { uri: m.imageUrl }
                                                    : require('../assets/icon/image-placeholder.png')
                                            }
                                            style={styles.mealImg}
                                        />

                                        <View style={styles.mealContent}>
                                            <Text numberOfLines={1} style={styles.mealTitle}>
                                                {m.title || 'Untitled'}
                                            </Text>

                                            {!!m.description && (
                                                <Text numberOfLines={2} style={styles.desc}>
                                                    {m.description}
                                                </Text>
                                            )}

                                            <View style={styles.metaRow}>
                                                <View style={styles.metaItem}>
                                                    <Ionicons name="time-outline" size={14} color={BRAND} />
                                                    <Text style={styles.metaText}>{timeText}</Text>
                                                </View>
                                                <View style={styles.metaItem}>
                                                    <Ionicons name="flame-outline" size={14} color={BRAND} />
                                                    <Text style={styles.metaText}>{calText}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })}

                            {!sectionMeals.length && (
                                <View style={styles.emptyBox}>
                                    <Text style={styles.emptyText}>
                                        {debouncedQuery
                                            ? `No results for "${debouncedQuery}".`
                                            : `No recipes found for ${activeMealType}.`}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Explore categories */}
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Explore Categories</Text>
                            <Pressable onPress={() => { }}>
                                <Text style={styles.linkDark}>View All</Text>
                            </Pressable>
                        </View>

                        <FlatList
                            data={categories}
                            keyExtractor={i => i.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.catCard}
                                    onPress={() => {
                                        // Nếu category nằm trong meal types thì đổi meal type
                                        if ((MEAL_TYPES as readonly string[]).includes(item.title)) {
                                            setActiveMealType(item.title as any);
                                        } else {
                                            // Nếu category khác (Drink/Dessert) thì vẫn cho đổi header để lọc
                                            setActiveMealType('Breakfast');
                                            setQuery(item.title); // gợi ý: search theo category
                                        }
                                    }}
                                >
                                    <Image
                                        source={
                                            item.image
                                                ? { uri: item.image }
                                                : require('../assets/icon/image-placeholder.png')
                                        }
                                        style={styles.catImg}
                                    />
                                    <Text numberOfLines={1} style={styles.catText}>
                                        {item.title}
                                    </Text>
                                </Pressable>
                            )}
                            style={{ marginBottom: 8 }}
                        />

                        {/* Popular */}
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Popular Recipes</Text>
                            <Pressable onPress={() => { }}>
                                <Text style={styles.linkDark}>View All</Text>
                            </Pressable>
                        </View>

                        <View style={{ gap: 12 }}>
                            {popular.map(p => (
                                <Pressable
                                    key={String(p.id)}
                                    style={styles.popCard}
                                    onPress={() => {
                                        const recipeId = Number(p.id);
                                        if (!Number.isFinite(recipeId)) return;
                                        navigation.navigate('RecipeDetail', { id: recipeId });
                                    }}
                                >
                                    <Image
                                        source={
                                            p.imageUrl
                                                ? { uri: p.imageUrl }
                                                : require('../assets/icon/image-placeholder.png')
                                        }
                                        style={styles.popImg}
                                    />

                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="flame" size={12} color="#fff" />
                                        <Text style={styles.ratingText}>
                                            {typeof p.calories === 'number' ? p.calories : '—'}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    smallHello: {
        color: '#eaf6e8',
        fontSize: 12,
        opacity: 0.95,
    },
    bigTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '800',
        marginTop: 4,
    },
    searchRow: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    searchBox: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        color: '#0b1a18',
        fontSize: 14,
        paddingVertical: Platform.select({ ios: 10, android: 6 }),
    },
    // filterBtn: {
    //     height: 44,
    //     width: 44,
    //     borderRadius: 12,
    //     backgroundColor: '#fff',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },

    sectionHeaderRow: {
        marginTop: 14,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    sectionTitle: {
        color: '#0b1a18',
        fontWeight: '800',
        fontSize: 18,
    },
    linkDark: {
        color: BRAND2,
        textDecorationLine: 'underline',
        fontWeight: '700',
    },

    dayPill: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        width: 64,
    },
    dayText: { fontSize: 12, fontWeight: '700' },
    dayDate: { marginTop: 2, fontSize: 14, fontWeight: '800' },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 99,
        marginTop: 6,
    },

    mealTypeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    mealTypeChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: BORDER,
    },
    mealTypeChipActive: { backgroundColor: BRAND, borderColor: BRAND },
    mealTypeText: { color: BRAND2, fontWeight: '800', fontSize: 12 },
    mealTypeTextActive: { color: '#fff' },
    mealContent: {
        flex: 1,
        justifyContent: 'center', // ✅ cân bằng text với ảnh
    },
    mealCard: {
        flexDirection: 'row',
        alignItems: 'center',     // ✅ căn giữa theo trục dọc
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: '#fff',
        padding: 10,              // ✅ đệm đều cho card (đẹp hơn)
    },
    mealImg: {
        width: 76,
        height: 76,
        borderRadius: 12,
        marginRight: 12,          // ✅ thay vì margin: 10
        backgroundColor: '#eee',
    },
    mealTitle: { color: '#0b1a18', fontWeight: '800', fontSize: 16 },
    desc: { marginTop: 4, color: BRAND2, opacity: 0.85, fontWeight: '600' },

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },

    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },

    metaText: {
        marginLeft: 4,
        color: BRAND2,
        fontSize: 11,
        fontWeight: '700',
    },


    catCard: { width: 88, alignItems: 'center' },
    catImg: { width: 76, height: 76, borderRadius: 18, backgroundColor: '#eee' },
    catText: { marginTop: 6, fontSize: 12, color: '#0b1a18', fontWeight: '700' },

    popCard: { height: 130, borderRadius: 16, overflow: 'hidden', backgroundColor: '#eee' },
    popImg: { width: '100%', height: '100%' },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: BRAND,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingText: { color: '#fff', fontSize: 12, fontWeight: '800' },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
    centerText: { fontWeight: '700', color: BRAND2, textAlign: 'center' },
    retryBtn: { marginTop: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: BRAND },
    retryText: { color: '#fff', fontWeight: '900' },

    emptyBox: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
    },
    emptyText: { color: BRAND2, fontWeight: '700' },
});
