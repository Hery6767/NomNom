import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    ActivityIndicator,
    Platform,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const API_BASE = 'http://10.0.2.2:3000';

// Theme
const BRAND = '#0d4d3b';
const BG = '#F6F7F9';
const CARD = '#FFFFFF';
const TEXT = '#101828';
const MUTED = '#667085';
const BORDER = 'rgba(16, 24, 40, 0.12)';

type RecipeImage = { ImageId?: number; ImageUrl: string };
type RecipeIngredient = { IngredientId?: number; Ingredient: string };
type RecipeStep = { StepId?: number; StepNumber: number; Instruction: string };

type RecipeDetail = {
    RecipeId: number;
    Name: string;
    Category: string;
    Description?: string | null;
    TimeMinutes?: number | null;
    Calories?: number | null;
    VideoUrl?: string | null;
    images?: RecipeImage[];
    ingredients?: RecipeIngredient[];
    steps?: RecipeStep[];
};

export default function RecipeDetailScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const id = Number(route?.params?.id);

    const [data, setData] = useState<RecipeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [videoOpen, setVideoOpen] = useState(false);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setErr(null);

        try {
            const res = await fetch(`${API_BASE}/recipes/${id}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();

            const normalized: RecipeDetail = {
                RecipeId: json.RecipeId,
                Name: json.Name ?? 'Untitled',
                Category: json.Category ?? 'Other',
                Description: json.Description ?? '',
                TimeMinutes: json.TimeMinutes ?? null,
                Calories: json.Calories ?? null,
                VideoUrl: json.VideoUrl ?? null,
                images: Array.isArray(json.images) ? json.images : [],
                ingredients: Array.isArray(json.ingredients) ? json.ingredients : [],
                steps: Array.isArray(json.steps) ? json.steps : [],
            };

            setData(normalized);
        } catch (e: any) {
            setErr(e?.message || 'Fetch failed');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!Number.isFinite(id)) {
            setErr('Missing recipe id');
            setLoading(false);
            return;
        }
        fetchDetail();
    }, [fetchDetail, id]);

    const coverUrl = useMemo(() => {
        const first = data?.images?.[0]?.ImageUrl;
        return first || null;
    }, [data]);

    const timeText = typeof data?.TimeMinutes === 'number' ? `${data?.TimeMinutes} min` : '—';
    const calText = typeof data?.Calories === 'number' ? `${data?.Calories} kcal` : '—';
    const hasVideo = !!data?.VideoUrl && String(data.VideoUrl).trim().length > 0;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.topbar}>
                <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconBtn}>
                    <Ionicons name="chevron-back" size={22} color={TEXT} />
                </Pressable>
                <Text numberOfLines={1} style={styles.topTitle}>Recipe Detail</Text>
                <View style={{ width: 38 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.centerText}>Loading...</Text>
                </View>
            ) : err ? (
                <View style={styles.center}>
                    <Text style={styles.centerText}>Error: {err}</Text>
                    <Pressable style={styles.retryBtn} onPress={fetchDetail}>
                        <Text style={styles.retryText}>Retry</Text>
                    </Pressable>
                </View>
            ) : !data ? (
                <View style={styles.center}><Text style={styles.centerText}>No data</Text></View>
            ) : (
                <>
                    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                        {/* Cover */}
                        <View style={styles.hero}>
                            {coverUrl ? (
                                <Image source={{ uri: coverUrl }} style={styles.heroImg} />
                            ) : (
                                <View style={styles.heroPlaceholder}>
                                    <Ionicons name="image-outline" size={26} color={MUTED} />
                                    <Text style={styles.heroPlaceholderText}>No image</Text>
                                </View>
                            )}

                            {/* Video button overlay */}
                            {hasVideo && (
                                <Pressable onPress={() => setVideoOpen(true)} style={styles.playBtn}>
                                    <Ionicons name="play" size={18} color="#fff" />
                                    <Text style={styles.playText}>Watch video</Text>
                                </Pressable>
                            )}
                        </View>

                        {/* Header card */}
                        <View style={styles.card}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.h1} numberOfLines={2}>{data.Name}</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{(data.Category || 'Other').toUpperCase()}</Text>
                                </View>
                            </View>

                            {!!data.Description && <Text style={styles.desc}>{data.Description}</Text>}

                            <View style={styles.metaRow}>
                                <View style={styles.meta}>
                                    <Ionicons name="time-outline" size={16} color={MUTED} />
                                    <Text style={styles.metaText}>{timeText}</Text>
                                </View>
                                <View style={styles.meta}>
                                    <Ionicons name="flame-outline" size={16} color={MUTED} />
                                    <Text style={styles.metaText}>{calText}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Ingredients */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            {(data.ingredients || []).length === 0 ? (
                                <Text style={styles.emptyText}>No ingredients</Text>
                            ) : (
                                data.ingredients!.map((ing, idx) => (
                                    <View key={ing.IngredientId ?? `ing-${idx}`} style={styles.bulletRow}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.bulletText}>{ing.Ingredient}</Text>
                                    </View>
                                ))
                            )}
                        </View>

                        {/* Steps */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Steps</Text>
                            {(data.steps || []).length === 0 ? (
                                <Text style={styles.emptyText}>No steps</Text>
                            ) : (
                                data.steps!
                                    .slice()
                                    .sort((a, b) => (a.StepNumber ?? 0) - (b.StepNumber ?? 0))
                                    .map((st, idx) => (
                                        <View key={st.StepId ?? `step-${idx}`} style={styles.stepRow}>
                                            <View style={styles.stepNo}>
                                                <Text style={styles.stepNoText}>{st.StepNumber ?? idx + 1}</Text>
                                            </View>
                                            <Text style={styles.stepText}>{st.Instruction}</Text>
                                        </View>
                                    ))
                            )}
                        </View>

                        <View style={{ height: 18 }} />
                    </ScrollView>

                    {/* Video Modal */}
                    <Modal visible={videoOpen} animationType="slide" onRequestClose={() => setVideoOpen(false)}>
                        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
                            <View style={styles.videoTop}>
                                <Pressable onPress={() => setVideoOpen(false)} hitSlop={10} style={styles.videoClose}>
                                    <Ionicons name="close" size={22} color="#fff" />
                                </Pressable>
                                <Text style={styles.videoTitle} numberOfLines={1}>{data.Name}</Text>
                                <View style={{ width: 38 }} />
                            </View>

                            <WebView
                                source={{ uri: String(data.VideoUrl) }}
                                allowsFullscreenVideo
                                mediaPlaybackRequiresUserAction
                            />
                        </SafeAreaView>
                    </Modal>
                </>
            )}
        </SafeAreaView>
    );
}

const shadow = Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
    android: { elevation: 2 },
    default: {},
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },

    topbar: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: {
        width: 38, height: 38, borderRadius: 12, backgroundColor: CARD,
        borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center', ...shadow,
    },
    topTitle: { flex: 1, fontSize: 16, fontWeight: '900', color: TEXT },

    scroll: { padding: 16, paddingTop: 6 },

    hero: {
        borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, backgroundColor: CARD, ...shadow,
    },
    heroImg: { width: '100%', height: 220 },
    heroPlaceholder: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#EEE' },
    heroPlaceholderText: { fontSize: 12.5, fontWeight: '800', color: MUTED },

    playBtn: {
        position: 'absolute',
        left: 12,
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: BRAND,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
    },
    playText: { color: '#fff', fontWeight: '900' },

    card: {
        marginTop: 12, backgroundColor: CARD, borderRadius: 18, borderWidth: 1, borderColor: BORDER,
        padding: 14, gap: 10, ...shadow,
    },

    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' },
    h1: { flex: 1, fontSize: 20, fontWeight: '900', color: TEXT, lineHeight: 26 },

    badge: { backgroundColor: 'rgba(13,77,59,0.12)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
    badgeText: { fontSize: 10.5, fontWeight: '900', color: BRAND },

    desc: { fontSize: 13.2, fontWeight: '600', color: MUTED, lineHeight: 18 },

    metaRow: { flexDirection: 'row', gap: 18 },
    meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    metaText: { fontSize: 13, fontWeight: '800', color: MUTED },

    sectionTitle: { fontSize: 16, fontWeight: '900', color: TEXT },
    emptyText: { color: MUTED, fontWeight: '700' },

    bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    bullet: { width: 7, height: 7, borderRadius: 99, backgroundColor: BRAND, marginTop: 6 },
    bulletText: { flex: 1, fontSize: 13.2, fontWeight: '700', color: TEXT, lineHeight: 18 },

    stepRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    stepNo: { width: 28, height: 28, borderRadius: 10, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center' },
    stepNoText: { color: '#fff', fontWeight: '900', fontSize: 12 },
    stepText: { flex: 1, fontSize: 13.2, fontWeight: '700', color: TEXT, lineHeight: 18 },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
    centerText: { fontWeight: '700', color: MUTED, textAlign: 'center' },
    retryBtn: { marginTop: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: BRAND },
    retryText: { color: '#fff', fontWeight: '900' },

    videoTop: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#000' },
    videoClose: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    videoTitle: { flex: 1, color: '#fff', fontWeight: '900' },
});
