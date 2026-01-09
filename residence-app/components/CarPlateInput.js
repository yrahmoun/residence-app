import { View, TextInput, StyleSheet, Text } from 'react-native';

export default function CarPlateInput({ value = ['', '', ''], onChange }) {
  const updatePart = (index, text) => {
    const newVal = [...value];
    newVal[index] = text;
    onChange(newVal);
  };

  return (
    <View style={styles.container}>
      {['Part 1', 'Lettre', 'Part 2'].map((label, i) => (
        <View key={i} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={value[i]}
            onChangeText={t => updatePart(i, t)}
            placeholder={label}
            placeholderTextColor="#aaa"
            autoCapitalize="characters"
            textAlign="center"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    fontSize: 16,
  },
});
