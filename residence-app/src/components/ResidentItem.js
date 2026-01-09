import { View, Text } from 'react-native';

export default function ResidentItem({ resident }) {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text>{resident.fullName}</Text>
      <Text>
        {resident.building} - {resident.doorNumber}
      </Text>
      <Text>Plate: {resident.carPlate}</Text>
      <Text>Phone: {resident.phonePrimary}</Text>
    </View>
  );
}
