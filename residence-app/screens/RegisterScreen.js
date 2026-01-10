import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import CarPlateInput from '../components/CarPlateInput';
import { getDB } from '../database/db';

const BG_COLOR = '#f5f7fa';
const CARD_COLOR = '#ffffff';
const PRIMARY = '#2563eb';
const TEXT_DARK = '#0f172a';
const TEXT_MUTED = '#475569';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: '',
    phonePrimary: '',
    phoneSecondary: '',
    carPlateParts: ['', '', ''],
    section: '',
    building: '',
    door: ''
  });

  const [message, setMessage] = useState(null);

  const save = async () => {
    const db = await getDB();

    const fullName = form.fullName.trim().toLowerCase();
    const phonePrimary = form.phonePrimary.trim();
    const phoneSecondary = form.phoneSecondary.trim();
    const carPlate = form.carPlateParts.map(p => p.trim()).join('-').toLowerCase();
    const section = form.section.trim();
    const building = form.building.trim();
    const door = form.door.trim();

    if (!fullName || !phonePrimary || !carPlate || !section || !building || !door) {
      setMessage({ text: 'Veuillez remplir tous les champs obligatoires', color: 'red' });
      return;
    }

    try {
      await db.runAsync(
        `INSERT INTO residents
          (fullName, phonePrimary, phoneSecondary, carPlate, section, building, door)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          fullName,
          phonePrimary,
          phoneSecondary,
          carPlate,
          section,
          building,
          door
        ]
      );

      setForm({
        fullName: '',
        phonePrimary: '',
        phoneSecondary: '',
        carPlateParts: ['', '', ''],
        section: '',
        building: '',
        door: ''
      });

      setMessage({ text: 'Enregistrement terminé', color: 'green' });
    } catch (e) {
      console.error(e);
      setMessage({ text: "Erreur lors de l'enregistrement", color: 'red' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG_COLOR }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Enregistrement</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nom complet:</Text>
          <Input value={form.fullName} onChangeText={v => setForm({ ...form, fullName: v })} />

          <Text style={styles.label}>Téléphone principal:</Text>
          <Input value={form.phonePrimary} onChangeText={v => setForm({ ...form, phonePrimary: v })} />

          <Text style={styles.label}>Téléphone secondaire:</Text>
          <Input value={form.phoneSecondary} onChangeText={v => setForm({ ...form, phoneSecondary: v })} />

          <Text style={styles.label}>Matricule:</Text>
          <CarPlateInput
            value={form.carPlateParts}
            onChange={v => setForm({ ...form, carPlateParts: v })}
          />

          <Text style={styles.label}>Section:</Text>
          <Input value={form.section} onChangeText={v => setForm({ ...form, section: v })} />

          <Text style={styles.label}>Bâtiment:</Text>
          <Input value={form.building} onChangeText={v => setForm({ ...form, building: v })} />

          <Text style={styles.label}>Porte:</Text>
          <Input value={form.door} onChangeText={v => setForm({ ...form, door: v })} />

          <Button title="Enregistrer" onPress={save} color={PRIMARY} />

          {message && (
            <Text style={[styles.message, { color: message.color }]}>
              {message.text}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 25
  },
  card: {
    backgroundColor: CARD_COLOR,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3
  },
  label: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 6,
    marginTop: 12
  },
  message: {
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
