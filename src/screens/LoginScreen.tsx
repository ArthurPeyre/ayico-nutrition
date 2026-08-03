import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import type { AuthStackParamList } from "../navigation/AuthNavigator";
import { HttpStatusCode as HSC } from "../utils/HttpStatusCode";
import { useAsyncAction } from "../hooks/useAsyncAction";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        run: handleLogin,
        error,
        loading,
    } = useAsyncAction(
        () => login(email, password),
        (err) =>
            err.statusCode === HSC.UNAUTHORIZED
                ? "Email ou mot de passe invalide"
                : err.message,
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>

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
            <Button
                title="Se connecter"
                onPress={handleLogin}
                disabled={loading}
            />
            {error && <Text style={styles.error}>{error}</Text>}

            <Button
                title="Je n'ai pas encore de compte"
                onPress={() => navigation.navigate("Register")}
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
