import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import type { AuthStackParamList } from "../navigation/AuthNavigator";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
    const { createAccount } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>();

    const handleCreateAccount = useCallback(async () => {
        setError(undefined);
        try {
            await createAccount({ email, name }, password);
        } catch (err: any) {
            setError(err.message);
        }
    }, [email, name, password, createAccount]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Creer un compte</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Creer mon compte" onPress={handleCreateAccount} />
            {error && <Text style={styles.error}>{error}</Text>}

            <Button
                title="J'ai deja un compte"
                onPress={() => navigation.navigate("Login")}
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
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
    },
    error: {
        color: "red",
        textAlign: "center",
    },
});
