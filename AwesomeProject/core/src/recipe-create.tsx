// core/src/recipe-create.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';

const API_BASE = 'http://10.0.2.2:3000';
const BRAND = '#0d4d3b';

export default function RecipeCreateScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !category) {
      Alert.alert('Missing info', 'Name and category are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          description: description || null,
          timeMinutes: timeMinutes ? Number(timeMinutes) : null,
          calories: calories ? Number(calories) : null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Create recipe failed');
      }

      Alert.alert('Success', 'Recipe created successfully');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Recipe</Text>

        <TextInput
          placeholder="Recipe name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Category (Breakfast, Lunch, Dinner...)"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 90 }]}
          multiline
        />

        <TextInput
          placeholder="Time (minutes)"
          value={timeMinutes}
          onChangeText={setTimeMinutes}
          keyboardType="number-pad"
          style={styles.input}
        />

        <TextInput
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
          style={styles.input}
        />

        <Pressable style={styles.btn} onPress={submit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Create</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
    color: BRAND,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    marginTop: 10,
    backgroundColor: BRAND,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
