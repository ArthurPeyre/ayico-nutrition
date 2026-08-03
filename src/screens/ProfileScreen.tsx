import { Button, StyleSheet, Text, View } from "react-native";
import { API_URL } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
    const { me, logout, deleteAccount } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil</Text>
            <Text style={styles.url}>
                {API_URL ?? "EXPO_PUBLIC_API_URL non definie"}
            </Text>

            {me && "email" in me && (
                <Text style={styles.ok}>Connecté en tant que {me.name}</Text>
            )}
            {me && "error" in me && (
                <Text style={styles.error}>{me.error}</Text>
            )}

            <Button title="Se deconnecter" onPress={logout} />
            <Button
                title="Supprimer mon compte"
                onPress={deleteAccount}
                color={styles.error.color}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
    },
    url: {
        color: "#666",
    },
    ok: {
        color: "green",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
});
