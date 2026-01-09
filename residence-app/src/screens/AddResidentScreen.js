import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addResident } from '../database/residents';

export default function AddResidentScreen({ onDone }) {
  const [form, setForm] = useState({
    fullName: '',
    section: '',
    building: '',
    doorNumber: '',
    carPlate: '',
    phonePrimary: '',
    phoneSecondary: '',
  });

  function setField(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function save() {
    await addResident(form);
    onDone();
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22 }}>Add Resident</Text>

      {Object.keys(form).map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          value={form[key]}
          onChangeText={(v) => setField(key, v)}
          style={{ borderWidth: 1, padding: 8, marginVertical: 4 }}
        />
      ))}

      <Button title="Save" onPress={save} />
      <Button title="Cancel" onPress={onDone} />
    </View>
  );
}
