import { useEffect, useState } from "react";
import { Image, View, Text, StyleSheet } from "react-native";

export default function RecipeImage({ uri, height = 140, style }) {
    const [failed, setFailed] = useState(false);

    // Try again if the recipe gets a new image link
    useEffect(() => {
        setFailed(false);
    }, [uri]);

    if (!uri || failed) {
        return (
            <View style={[styles.placeholder, { height }, style]} accessible={false}>
                <Text style={styles.icon}>🍽️</Text>
            </View>
        );
    }

    return (
        <Image
            source={{ uri }}
            style={[{ width: "100%", height }, style]}
            resizeMode="cover"
            onError={() => setFailed(true)}
            accessible={false}
        />
    );
}

const styles = StyleSheet.create({
    placeholder: {
        width: "100%",
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: { fontSize: 36 },
});