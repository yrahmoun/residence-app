import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import CarPlateInput from '../components/CarPlateInput';
import { getDB } from '../database/db';

const BG_COLOR = '#f5f7fa';
const CARD_COLOR = '#ffffff';
const PRIMARY = '#2563eb';
const DANGER = '#dc2626';

export default function ResidentDetailScreen({ route, navigation }) {
  const { residentId } = route.params;
  const [resident, setResident] = useState(null);
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phonePrimary: '',
    phoneSecondary: '',
    carPlate: ['', '', ''],
    section: '',
    building: '',
    door: ''
  });

  useEffect(() => {
    const fetchResident = async () => {
      const db = await getDB();
      const rows = await db.getAllAsync(
        `SELECT * FROM residents WHERE id = ?`,
        [residentId]
      );
      if (rows.length > 0) {
        const r = rows[0];
        setResident(r);

        // Split car plate into parts
        const plateParts = r.carPlate.split('-');
        setForm({
          fullName: r.fullName,
          phonePrimary: r.phonePrimary,
          phoneSecondary: r.phoneSecondary,
          carPlate: plateParts.length === 3 ? plateParts : ['', '', ''],
          section: r.section,
          building: r.building,
          door: r.door
        });
      }
    };
    fetchResident();
  }, [residentId]);

  const handleEdit = () => setEditable(true);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer ce résident ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            const db = await getDB();
            await db.runAsync(`DELETE FROM residents WHERE id = ?`, [residentId]);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    // Combine car plate parts
    const carPlateStr = form.carPlate.map(p => p.trim()).join('-');

    const db = await getDB();
    await db.runAsync(
      `UPDATE residents SET fullName = ?, phonePrimary = ?, phoneSecondary = ?, carPlate = ?, section = ?, building = ?, door = ? WHERE id = ?`,
      [
        form.fullName.trim(),
        form.phonePrimary.trim(),
        form.phoneSecondary.trim(),
        carPlateStr.toLowerCase(),
        form.section.trim(),
        form.building.trim(),
        form.door.trim(),
        residentId
      ]
    );

    Alert.alert("Succès", "Le résident a été mis à jour");
    setEditable(false);
    setResident({ ...form, carPlate: carPlateStr });
  };

  if (!resident) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: BG_COLOR }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Détails du résident</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom complet</Text>
        <Input
          value={form.fullName}
          onChangeText={v => setForm({ ...form, fullName: v })}
          editable={editable}
        />

        <Text style={styles.label}>Téléphone principal</Text>
        <Input
          value={form.phonePrimary}
          onChangeText={v => setForm({ ...form, phonePrimary: v })}
          editable={editable}
        />

        <Text style={styles.label}>Téléphone secondaire</Text>
        <Input
          value={form.phoneSecondary}
          onChangeText={v => setForm({ ...form, phoneSecondary: v })}
          editable={editable}
        />

        <Text style={styles.label}>Matricule</Text>
        <CarPlateInput
          value={form.carPlate}
          onChange={v => setForm({ ...form, carPlate: v })}
          editable={editable}
        />

        <Text style={styles.label}>Section</Text>
        <Input
          value={form.section}
          onChangeText={v => setForm({ ...form, section: v })}
          editable={editable}
        />

        <Text style={styles.label}>Bâtiment</Text>
        <Input
          value={form.building}
          onChangeText={v => setForm({ ...form, building: v })}
          editable={editable}
        />

        <Text style={styles.label}>Porte</Text>
        <Input
          value={form.door}
          onChangeText={v => setForm({ ...form, door: v })}
          editable={editable}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          {!editable && (
            <>
              <Button title="Modifier" onPress={handleEdit} color={PRIMARY} />
              <Button title="Supprimer" onPress={handleDelete} color={DANGER} />
            </>
          )}
        </View>

        {editable && (
          <Button title="Enregistrer" onPress={handleSave} color={PRIMARY} style={{ marginTop: 20 }} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  card: {
    backgroundColor: CARD_COLOR,
    padding: 20,
    borderRadius: 14,
    marginHorizontal: 20,
    elevation: 3
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#0f172a'
  }
});
