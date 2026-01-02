// core/src/profile.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    Switch,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, CommonActions } from '@react-navigation/native';


import { COLORS } from '../style/colors';
import { useAuth } from '../auth/AuthContext';

const { BRAND, BRAND2, BRAND_LIGHT, BORDER, BG } = COLORS;

export default function Profile() {
    const navigation = useNavigation<any>();
    const { signOut, user } = useAuth();

    const [notifEnabled, setNotifEnabled] = useState(true);
    const [reminderEnabled, setReminderEnabled] = useState(true);

    const handleLogout = () => {
        Alert.alert('Log out', 'Do you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                        // KHÔNG navigate
                    } catch (e: any) {
                        Alert.alert('Error', e?.message || 'Logout failed');
                    }
                },
            },
        ]);
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={{ width: 24 }} />
                <Text style={styles.headerTitle}>Profile</Text>
                <Pressable hitSlop={8} onPress={() => { }}>
                    <Feather name="settings" size={20} color={BRAND2} />
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* User card */}
                <View style={styles.userCard}>
                    <View style={styles.avatarWrap}>
                        <Image
                            source={require('../image/avatar.png')}
                            style={styles.avatar}
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.userName}>
                            {user?.fullName || 'User'}
                        </Text>
                        <Text style={styles.userEmail}>
                            {user?.email || '—'}
                        </Text>
                    </View>

                    <Pressable style={styles.editBtn} onPress={() => { }}>
                        <Feather name="edit-2" size={16} color={BRAND2} />
                        <Text style={styles.editText}>Edit</Text>
                    </Pressable>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Meal Plans</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>34</Text>
                        <Text style={styles.statLabel}>Saved Recipes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Grocery Lists</Text>
                    </View>
                </View>

                {/* Section: Account */}
                <Text style={styles.sectionLabel}>Account</Text>
                <View style={styles.card}>
                    <ProfileRow icon="user" label="Personal information" />
                    <ProfileRow icon="coffee" label="Food preferences" />
                    <ProfileRow icon="lock" label="Change password" isLast />
                </View>

                {/* Section: App Settings */}
                <Text style={styles.sectionLabel}>App Settings</Text>
                <View style={styles.card}>
                    <ProfileRow
                        icon="bell"
                        label="Notifications"
                        renderRight={() => (
                            <Switch
                                value={notifEnabled}
                                onValueChange={setNotifEnabled}
                                thumbColor={notifEnabled ? '#fff' : '#f4f3f4'}
                                trackColor={{ false: 'rgba(0,0,0,0.2)', true: BRAND }}
                            />
                        )}
                    />
                    <ProfileRow
                        icon="clock"
                        label="Meal reminders"
                        isLast
                        renderRight={() => (
                            <Switch
                                value={reminderEnabled}
                                onValueChange={setReminderEnabled}
                                thumbColor={reminderEnabled ? '#fff' : '#f4f3f4'}
                                trackColor={{ false: 'rgba(0,0,0,0.2)', true: BRAND }}
                            />
                        )}
                    />
                </View>

                {/* Section: Help */}
                <Text style={styles.sectionLabel}>Support & About</Text>
                <View style={styles.card}>
                    <ProfileRow icon="help-circle" label="Help & FAQ" />
                    <ProfileRow icon="mail" label="Contact support" />
                    <ProfileRow icon="info" label="About NomNom" isLast />
                </View>

                {/* Logout */}
                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                    <Feather name="log-out" size={18} color="#b3261e" />
                    <Text style={styles.logoutText}>Log out</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

type RowProps = {
    icon: string;
    label: string;
    isLast?: boolean;
    renderRight?: () => React.ReactNode;
};

function ProfileRow({ icon, label, isLast, renderRight }: RowProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.row,
                isLast && { borderBottomWidth: 0 },
                pressed && { backgroundColor: 'rgba(0,0,0,0.03)' },
            ]}
            onPress={() => { }}
        >
            <View style={styles.rowLeft}>
                <View style={styles.rowIconWrap}>
                    <Feather name={icon} size={18} color={BRAND2} />
                </View>
                <Text style={styles.rowLabel}>{label}</Text>
            </View>

            {renderRight ? (
                renderRight()
            ) : (
                <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.3)" />
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#0b1a18' },

    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f8f5',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: BORDER,
        marginTop: 6,
    },
    avatarWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ddebe2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatar: { width: 52, height: 52, borderRadius: 26 },
    userName: { fontSize: 18, fontWeight: '800', color: '#0b1a18' },
    userEmail: { fontSize: 12, color: BRAND2, opacity: 0.8, marginTop: 2 },

    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: BORDER,
    },
    editText: { marginLeft: 4, fontSize: 12, fontWeight: '700', color: BRAND2 },

    statsRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 10,
    },
    statItem: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        paddingVertical: 10,
        alignItems: 'center',
    },
    statNumber: { fontSize: 16, fontWeight: '800', color: BRAND2 },
    statLabel: { fontSize: 11, color: BRAND2, opacity: 0.8 },

    sectionLabel: {
        marginTop: 18,
        marginBottom: 6,
        fontSize: 13,
        fontWeight: '700',
        color: BRAND2,
        opacity: 0.85,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
        overflow: 'hidden',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        justifyContent: 'space-between',
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    rowIconWrap: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: BRAND_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: { fontSize: 14, color: '#0b1a18', fontWeight: '600' },

    logoutBtn: {
        marginTop: 20,
        marginBottom: 70,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(179,38,30,0.25)',
        backgroundColor: '#fff5f5',
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    logoutText: { color: '#b3261e', fontWeight: '700' },
});
