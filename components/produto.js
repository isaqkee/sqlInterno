import { Pressable, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function Produto({ data, onPress, isSelected, onDelete }) {
    return (
        <Pressable
            style={[styles.container, isSelected && styles.selectedContainer]} 
            onPress={onPress}
        >
            <Text style={styles.text}>
                {data.quantidade} - {data.nome}
            </Text>
            <TouchableOpacity onPress={onDelete}>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#CECECE",
        padding: 24,
        borderRadius: 5,
        gap: 12,
        flexDirection: "row",
    },
    selectedContainer: {
        borderColor: "#007BFF", // cor da borda ao selecionar
        borderWidth: 2,
    },
    text: {
        flex: 1,
    },
});
