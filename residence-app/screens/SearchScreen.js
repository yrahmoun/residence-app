import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
const ERROR_RED = '#dc2626';

export default function SearchScreen() {
  const [type, setType] = useState('fullName');
  const [value, setValue] = useState('');
  const [carPlateParts, setCarPlateParts] = useState(['', '', '']);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    const db = await getDB();
    let query = '';
    let params = [];

    if (type === 'fullName') {
      query = `SELECT * FROM residents WHERE fullName LIKE ?`;
      params = [`%${value.trim().toLowerCase()}%`];
    }

    if (type === 'phonePrimary') {
      query = `SELECT * FROM residents WHERE phonePrimary LIKE ?`;
      params = [`%${value.trim()}%`];
    }

    if (type === 'carPlate') {
      const plate = carPlateParts.map(p => p.trim()).join('-').toLowerCase();
      query = `SELECT * FROM residents WHERE carPlate LIKE ?`;
      params = [`%${plate}%`];
    }

    const rows = await db.getAllAsync(query, params);
    setResults(rows);
    setSearched(true);
  };

  const renderPlate = (plate) => {
    const parts = plate.split('-');

    return (
      <View style={styles.plateRow}>
        {parts.map((p, i) => (
          <View key={i} style={styles.plateBox}>
            <Text style={styles.plateText}>{p}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: BG_COLOR }}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Recherche</Text>

      <View style={styles.card}>
        <Picker selectedValue={type} onValueChange={setType}>
          <Picker.Item label="Nom complet" value="fullName" />
          <Picker.Item label="Téléphone" value="phonePrimary" />
          <Picker.Item label="Matricule" value="carPlate" />
        </Picker>

        {type === 'carPlate' ? (
          <CarPlateInput value={carPlateParts} onChange={setCarPlateParts} />
        ) : (
          <Input value={value} onChangeText={setValue} />
        )}

        <Button title="Rechercher" onPress={search} color={PRIMARY} />
      </View>

      {searched && results.length === 0 && (
        <Text style={styles.noResult}>
          Aucun résultat trouvé
        </Text>
      )}

      {results.map((r, i) => (
        <View key={i} style={styles.resultCard}>
          <Text style={styles.name}>{r.fullName}</Text>
          <Text style={styles.text}>Téléphone 1 📞: {r.phonePrimary}</Text>
          <Text style={styles.text}>Téléphone 2 📞: {r.phoneSecondary}</Text>
          <Text style={styles.text}>Matricule 🚗:</Text>
          {renderPlate(r.carPlate)}

          <Text style={styles.text}>
            Adresse 📍: {r.section} / {r.building} / {r.door}
          </Text>
        </View>
      ))}
    </ScrollView>
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
    marginBottom: 20,
    elevation: 3
  },
  resultCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: TEXT_DARK,
    marginBottom: 4
  },
  text: {
    color: TEXT_MUTED,
    marginBottom: 4
  },
  noResult: {
    color: ERROR_RED,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600'
  },

  /* === CAR PLATE DISPLAY === */
  plateRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6
  },
  plateBox: {
    minWidth: 44,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  plateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_DARK,
    textAlign: 'center'
  }
});
