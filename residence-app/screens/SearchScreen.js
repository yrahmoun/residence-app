import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

// Split car plate string into 3 parts for display
const splitPlateForDisplay = (plate) => {
  const parts = plate.split('-');
  return [
    parts[0] || '',
    parts[1] || '',
    parts[2] || ''
  ];
};

export default function SearchScreen({ navigation }) {
  const [type, setType] = useState('fullName');
  const [value, setValue] = useState('');
  const [carPlateParts, setCarPlateParts] = useState(['', '', '']);
  const [numeroDeMacaron, setNumeroDeMacaron] = useState('');
  const [results, setResults] = useState([]);
  const [noResult, setNoResult] = useState(false);

  const search = async () => {
    const db = await getDB();
    let query = '';
    let params = [];

    if (type === 'fullName') {
      query = `SELECT * FROM residents WHERE fullName LIKE ?`;
      params = [`%${value.trim().toLowerCase()}%`];
    } else if (type === 'phonePrimary') {
      query = `SELECT * FROM residents WHERE phonePrimary LIKE ?`;
      params = [`%${value.trim()}%`];
    } else if (type === 'carPlate') {
      const plate = carPlateParts.map(p => p.trim()).join('-').toLowerCase();
      query = `SELECT * FROM residents WHERE carPlate LIKE ?`;
      params = [`%${plate}%`];
    } else if (type === 'numeroDeMacaron') {
      query = `SELECT * FROM residents WHERE numeroDeMacaron = ?`;
      params = [numeroDeMacaron.trim()];
    }

    const rows = await db.getAllAsync(query, params);
    setResults(rows);
    setNoResult(rows.length === 0);
  };

  return (
    <ScrollView style={{ backgroundColor: BG_COLOR }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recherche</Text>

      <View style={styles.card}>
        <Picker
          selectedValue={['fullName', 'phonePrimary', 'carPlate', 'numeroDeMacaron'].includes(type) ? type : 'fullName'}
          onValueChange={setType}
        >
          <Picker.Item label="Nom complet" value="fullName" />
          <Picker.Item label="Téléphone" value="phonePrimary" />
          <Picker.Item label="Matricule" value="carPlate" />
          <Picker.Item label="Numéro de macaron" value="numeroDeMacaron" />
        </Picker>

        {type === 'carPlate' ? (
          <CarPlateInput value={carPlateParts} onChange={setCarPlateParts} />
        ) : type === 'numeroDeMacaron' ? (
          <Input value={numeroDeMacaron} onChangeText={setNumeroDeMacaron} />
        ) : (
          <Input value={value} onChangeText={setValue} />
        )}

        <Button title="Rechercher" onPress={search} color={PRIMARY} />
      </View>

      {noResult && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 15 }}>Aucun résultat trouvé</Text>}

      {results.map((r, i) => {
        const plateParts = splitPlateForDisplay(r.carPlate);

        return (
          <TouchableOpacity key={i} onPress={() => navigation.navigate('ResidentDetail', { residentId: r.id })}>
            <View style={styles.resultCard}>
              <Text style={styles.name}>{r.fullName}</Text>
              <Text style={styles.text}>Téléphone 📞: {r.phonePrimary}</Text>

              {/* Car plate label */}
              <Text style={styles.text}>Matricule 🚗:</Text>
              <View style={styles.plateContainer}>
                {plateParts.map((p, idx) => (
                  <View key={idx} style={styles.plateBox}>
                    <Text style={styles.plateText}>{p}</Text>
                  </View>
                ))}
              </View>

              {/* Numéro de macaron */}
              <Text style={styles.text}>Numéro de macaron 🎟️: {r.numeroDeMacaron}</Text>

              <Text style={styles.text}>Adresse 📍: {r.section} / {r.building} / {r.door}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
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
    marginBottom: 6
  },
  plateContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    justifyContent: 'flex-start'
  },
  plateBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 3,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  plateText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: TEXT_DARK,
    textAlign: 'center',
    writingDirection: 'ltr'
  }
});
