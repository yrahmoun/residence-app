import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
} from 'react-native';
import { getResidents, searchResidents } from '../database/residents';
import ResidentItem from '../components/ResidentItem';
import AddResidentScreen from './AddResidentScreen';

export default function HomeScreen() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);

  async function load() {
    const data = search
      ? await searchResidents(search)
      : await getResidents();
    setResidents(data);
  }

  useEffect(() => {
    load();
  }, [search]);

  if (adding) {
    return <AddResidentScreen onDone={() => {
      setAdding(false);
      load();
    }} />;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Residents
      </Text>

      <TextInput
        placeholder="Search name or plate"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 10,
        }}
      />

      <Button title="Add Resident" onPress={() => setAdding(true)} />

      <FlatList
        data={residents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ResidentItem resident={item} />}
      />
    </View>
  );
}
