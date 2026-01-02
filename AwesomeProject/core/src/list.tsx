// src/list.tsx
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    Pressable,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../style/colors';

const { BRAND, BRAND2, BRAND_LIGHT, BORDER, BG } = COLORS;

type Unit = 'G' | 'KG' | 'L' | 'Bunch' | 'Loaf' | 'Piece';
type Category = 'Vegetables' | 'Dairy' | 'Grains' | 'Other';

type GroceryItem = {
    id: string;
    name: string;
    qty: number;
    unit: Unit;
    checked?: boolean;
    category: Category;
};

type Section = {
    id: string;
    title: Category;
    items: GroceryItem[];
};

// Dữ liệu mẫu
const seed: Section[] = [
    {
        id: 's1',
        title: 'Vegetables',
        items: [
            { id: 'i1', name: 'Carrots', qty: 2, unit: 'KG', category: 'Vegetables' },
            { id: 'i2', name: 'Potatoes', qty: 1.5, unit: 'KG', category: 'Vegetables' },
            { id: 'i3', name: 'Broccoli', qty: 1, unit: 'Bunch', category: 'Vegetables' },
        ],
    },
    {
        id: 's2',
        title: 'Dairy',
        items: [
            { id: 'i4', name: 'Cheddar Cheese', qty: 500, unit: 'G', category: 'Dairy' },
            { id: 'i5', name: 'Milk', qty: 2, unit: 'L', category: 'Dairy' },
        ],
    },
    {
        id: 's3',
        title: 'Grains',
        items: [
            { id: 'i6', name: 'Rice', qty: 1, unit: 'KG', category: 'Grains' },
            { id: 'i7', name: 'Whole-Wheat Bread', qty: 1, unit: 'Loaf', category: 'Grains' },
        ],
    },
];

export default function ListScreen() {
    const [sections, setSections] = useState<Section[]>(seed);
    const [addVisible, setAddVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    // form Add
    const [fName, setFName] = useState('');
    const [fCategory, setFCategory] = useState<Category>('Vegetables');
    const [fQty, setFQty] = useState<string>('1');
    const [fUnit, setFUnit] = useState<Unit>('KG');

    const allUnits: Unit[] = ['G', 'KG', 'L', 'Bunch', 'Loaf', 'Piece'];
    const allCats: Category[] = ['Vegetables', 'Dairy', 'Grains', 'Other'];

    const itemCount = useMemo(
        () => sections.reduce((acc, s) => acc + s.items.length, 0),
        [sections]
    );

    const toggleCheck = (sid: string, iid: string) => {
        setSections(prev =>
            prev.map(s =>
                s.id !== sid
                    ? s
                    : {
                        ...s,
                        items: s.items.map(it =>
                            it.id === iid ? { ...it, checked: !it.checked } : it
                        ),
                    }
            )
        );
    };

    const addItem = () => {
        const qtyNum = Number(fQty);
        if (!fName.trim() || !isFinite(qtyNum) || qtyNum <= 0) return;

        setSections(prev => {
            const idx = prev.findIndex(s => s.title === fCategory);
            const newItem: GroceryItem = {
                id: `n${Date.now()}`,
                name: fName.trim(),
                qty: qtyNum,
                unit: fUnit,
                category: fCategory,
            };
            if (idx >= 0) {
                // gộp nếu trùng tên + unit
                const list = [...prev[idx].items];
                const dup = list.find(
                    x =>
                        x.name.toLowerCase() === newItem.name.toLowerCase() &&
                        x.unit === newItem.unit
                );
                if (dup) {
                    dup.qty += newItem.qty;
                    const copy = [...prev];
                    copy[idx] = { ...copy[idx], items: [...list] };
                    return copy;
                }
                const copy = [...prev];
                copy[idx] = { ...copy[idx], items: [...list, newItem] };
                return copy;
            }
            return [...prev, { id: `s${Date.now()}`, title: fCategory, items: [newItem] }];
        });

        // reset form
        setFName('');
        setFQty('1');
        setFCategory('Vegetables');
        setFUnit('KG');
        setAddVisible(false);
    };

    const clearAll = () => {
        setSections(prev => prev.map(s => ({ ...s, items: [] })));
        setConfirmVisible(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: BG }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Grocery List</Text>
                    <Pressable onPress={() => setConfirmVisible(true)} hitSlop={10}>
                        <Image
                            source={require('../assets/icon/trash.png')}
                            style={{ width: 22, height: 22, tintColor: BRAND }}
                        />
                    </Pressable>
                </View>

                {/* Action bar */}
                <View style={styles.actionRow}>
                    <Pressable style={[styles.actionBtn, styles.actionPrimary]} onPress={() => { }}>
                        <Text style={[styles.actionText, { color: '#fff' }]}>Update List</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionBtn, styles.actionGhost]}
                        onPress={() => setAddVisible(true)}
                    >
                        <Text style={[styles.actionText, { color: BRAND2 }]}>Manually Add Item</Text>
                    </Pressable>
                </View>

                {/* Sections */}
                <FlatList
                    data={sections}
                    keyExtractor={s => s.id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                    renderItem={({ item: s }) => (
                        <View style={styles.sectionBox}>
                            <View style={styles.sectionHeader}>
                                <View>
                                    <Text style={styles.sectionTitle}>{s.title}</Text>
                                    <Text style={styles.sectionSub}>{s.items.length} items</Text>
                                </View>
                                <Image
                                    source={require('../assets/icon/dots.png')}
                                    style={{ width: 15, height: 15, tintColor: BRAND }}
                                />
                            </View>

                            <View style={{ gap: 8 }}>
                                {s.items.length === 0 ? (
                                    <View style={styles.emptyRow}>
                                        <Text style={styles.emptyText}>No items in this section</Text>
                                    </View>
                                ) : (
                                    s.items.map(it => (
                                        <Pressable
                                            key={it.id}
                                            style={({ pressed }) => [
                                                styles.itemRow,
                                                { opacity: pressed ? 0.75 : 1 },
                                            ]}
                                            onPress={() => toggleCheck(s.id, it.id)}
                                        >
                                            {/* Checkbox */}
                                            <View
                                                style={[
                                                    styles.checkBox,
                                                    it.checked && { backgroundColor: BRAND, borderColor: BRAND },
                                                ]}
                                            >
                                                {it.checked && (
                                                    <Image
                                                        source={require('../assets/icon/x.png')}
                                                        style={{ width: 13, height: 13, tintColor: '#fff' }}
                                                    />
                                                )}
                                            </View>

                                            {/* Name */}
                                            <Text
                                                numberOfLines={1}
                                                style={[
                                                    styles.itemName,
                                                    it.checked && { textDecorationLine: 'line-through', opacity: 0.6 },
                                                ]}
                                            >
                                                {it.name}
                                            </Text>

                                            {/* Qty badge */}
                                            <View style={styles.badge}>
                                                <Text style={it.checked ? styles.changeText : styles.badgeText}>
                                                    {it.qty} {it.unit}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))
                                )}
                            </View>
                        </View>
                    )}
                    ListFooterComponent={
                        <Text style={styles.footerNote}>Total: {itemCount} items</Text>
                    }
                />
            </SafeAreaView>

            {/* ===== Modal: Add Item (bottom sheet) ===== */}
            <Modal
                visible={addVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setAddVisible(false)}
            >
                <View style={styles.sheetOverlay}>
                    <View style={styles.sheetBox}>
                        <View style={styles.sheetHandle} />
                        <View style={styles.sheetTitleRow}>
                            <Image
                                source={require('../assets/icon/add.png')}
                                style={{ width: 18, height: 18, tintColor: '#b7f57d' }}
                            />
                            <Text style={styles.sheetTitleText}>
                                Add Item to Grocery List
                            </Text>
                        </View>
                        {/* Item Name */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Item Name</Text>
                            <TextInput
                                value={fName}
                                onChangeText={setFName}
                                placeholder="e.g. Tomatoes"
                                placeholderTextColor="rgba(0,0,0,0.4)"
                                style={styles.input}
                            />
                        </View>

                        {/* Category (chips) */}
                        <View style={styles.field}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.chipRow}>
                                {allCats.map(c => (
                                    <Pressable
                                        key={c}
                                        onPress={() => setFCategory(c)}
                                        style={[
                                            styles.chip,
                                            fCategory === c && { backgroundColor: BRAND_LIGHT, borderColor: BRAND },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                fCategory === c && { color: BRAND2, fontWeight: '800' },
                                            ]}
                                        >
                                            {c}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Quantity + Unit */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={styles.label}>Quantity</Text>
                                <TextInput
                                    value={fQty}
                                    onChangeText={setFQty}
                                    keyboardType="numeric"
                                    placeholder="1"
                                    placeholderTextColor="rgba(0,0,0,0.4)"
                                    style={styles.input}
                                />
                            </View>

                            <View style={[styles.field, { width: 160 }]}>
                                <Text style={styles.label}>Unit</Text>
                                <View style={styles.chipRow}>
                                    {allUnits.map(u => (
                                        <Pressable
                                            key={u}
                                            onPress={() => setFUnit(u)}
                                            style={[
                                                styles.chipSmall,
                                                fUnit === u && { backgroundColor: BRAND_LIGHT, borderColor: BRAND },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.chipText,
                                                    fUnit === u && { color: BRAND2, fontWeight: '800' },
                                                ]}
                                            >
                                                {u}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <Pressable style={styles.addBtn} onPress={addItem}>
                            <Text style={styles.addBtnText}>Add Item</Text>
                        </Pressable>

                        <Pressable style={styles.cancelBtn} onPress={() => setAddVisible(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal >

            {/* ===== Modal: Confirm Clear All ===== */}
            < Modal
                visible={confirmVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setConfirmVisible(false)
                }
            >
                <View style={styles.alertOverlay}>
                    <View style={styles.alertBox}>
                        <View style={styles.alertIconCircle}>
                            <Image
                                source={require('../assets/icon/alert.png')}
                                style={{ width: 30, height: 30, tintColor: '#fff' }}
                            />
                        </View>
                        <Text style={styles.alertTitle}>
                            Are you sure you want to clear your entire grocery list?
                        </Text>
                        <Text style={styles.alertSub}>
                            This will delete all items from your list. You can’t undo this action.
                        </Text>

                        <Pressable style={styles.alertPrimary} onPress={() => setConfirmVisible(false)}>
                            <Text style={styles.alertPrimaryText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.alertGhost} onPress={clearAll}>
                            <Text style={styles.alertGhostText}>Clear All</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b1a18' },

    actionRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 8 },
    actionBtn: {
        flex: 1,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    actionPrimary: { backgroundColor: BRAND, borderColor: BRAND },
    actionGhost: { backgroundColor: '#fff', borderColor: BORDER },
    actionText: { fontWeight: '800', fontSize: 14 },

    sectionBox: {
        backgroundColor: '#f4f8f5',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 12,
        marginTop: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0b1a18' },
    sectionSub: { fontSize: 12, color: BRAND2, opacity: 0.8 },
    changeText: {
        color: 'red',
        fontWeight: "700",
        fontSize: 11,
    },

    emptyRow: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: { color: BRAND2 },

    itemRow: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkBox: {
        width: 18,
        height: 18,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: { flex: 1, color: '#0b1a18', fontWeight: '700' },
    badge: {
        backgroundColor: BRAND_LIGHT,
        borderWidth: 1,
        borderColor: '#d3e9d7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: { color: BRAND2, fontWeight: '700', fontSize: 11, },

    footerNote: { marginTop: 16, textAlign: 'center', color: BRAND2, fontWeight: '700' },

    // ===== Add Sheet =====
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
    sheetBox: {
        backgroundColor: BG,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
        maxHeight: '100%',
    },
    sheetHandle: {
        alignSelf: 'center',
        width: 42, height: 4, borderRadius: 2, backgroundColor: BORDER, marginTop: 6, marginBottom: 10,
    },
    sheetTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,                // khoảng cách giữa icon & text
        marginBottom: 8,
    },
    sheetTitleText: {
        fontSize: 16,
        fontWeight: '800',
        color: BRAND2,
    },

    field: { marginBottom: 12 },
    label: { fontSize: 12, fontWeight: '700', color: BRAND2, opacity: 0.85, marginBottom: 6 },
    input: {
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        paddingHorizontal: 12,
        color: '#0b1a18',
        fontWeight: '700',
        backgroundColor: '#fff',
    },

    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: '#fff',
    },
    chipSmall: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: '#fff',
    },
    chipText: { color: BRAND2, fontWeight: '700' },

    addBtn: {
        marginTop: 4,
        backgroundColor: BRAND,
        height: 46,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: { color: '#fff', fontWeight: '800' },
    cancelBtn: {
        marginTop: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: BORDER,
    },
    cancelText: { color: BRAND2, fontWeight: '800' },

    // ===== Alert Clear All =====
    alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
    alertBox: {
        width: '86%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 10,
    },
    alertIconCircle: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: '#b7f57d',
        alignItems: 'center', justifyContent: 'center',
    },
    alertTitle: { textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#0b1a18' },
    alertSub: { textAlign: 'center', fontSize: 12, color: BRAND2, opacity: 0.8 },

    alertPrimary: {
        marginTop: 8,
        backgroundColor: BRAND,
        height: 44,
        borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        alignSelf: 'stretch',
    },
    alertPrimaryText: { color: '#fff', fontWeight: '800' },

    alertGhost: {
        marginTop: 8,
        backgroundColor: '#fff',
        height: 44,
        borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        alignSelf: 'stretch',
        borderWidth: 1, borderColor: BRAND,
    },
    alertGhostText: { color: BRAND2, fontWeight: '800' },
});
