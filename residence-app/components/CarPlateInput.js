import { View, TextInput, StyleSheet } from 'react-native';

const TEXT_DARK = '#0f172a';

export default function CarPlateInput({ value, onChange }) {
  const updatePart = (text, index) => {
    const updated = [...value];
    updated[index] = text;
    onChange(updated);
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.box}
        value={value[0]}
        onChangeText={(t) => updatePart(t, 0)}
        placeholder="1234"
        keyboardType="default"
        maxLength={6}
      />

      <TextInput
        style={styles.box}
        value={value[1]}
        onChangeText={(t) => updatePart(t, 1)}
        placeholder="A"
        keyboardType="default"
        maxLength={2}
      />

      <TextInput
        style={styles.box}
        value={value[2]}
        onChangeText={(t) => updatePart(t, 2)}
        placeholder="56"
        keyboardType="default"
        maxLength={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10
  },
  box: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_DARK
  }
});
