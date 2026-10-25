import { createContext, useCallback, useContext, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import ActionButton from "../components/ActionButton";
import COLORS from "../constants/colors";

const SuccessModalContext = createContext(null);

export function SuccessModalProvider({ children }) {
    const [message, setMessage] = useState(null);

    const showSuccess = useCallback((title, description) => {
        setMessage({ title, description });
    }, []);

    const showConfirmation = useCallback((title, description, onConfirm) => {
        setMessage({ title, description, onConfirm });
    }, []);

    const dismiss = useCallback(() => setMessage(null), []);
    const confirm = useCallback(() => {
        const onConfirm = message?.onConfirm;
        dismiss();
        onConfirm?.();
    }, [dismiss, message]);

    return (
        <SuccessModalContext.Provider value={{ showSuccess, showConfirmation }}>
            {children}
            <Modal
                visible={message !== null}
                transparent
                animationType="fade"
                onRequestClose={dismiss}
            >
                <View style={styles.backdrop}>
                    <View style={styles.card} accessibilityViewIsModal>
                        <Text style={styles.title} accessibilityRole="header">
                            {message?.title}
                        </Text>
                        <Text style={styles.description}>{message?.description}</Text>
                        {message?.onConfirm ? (
                            <View style={styles.actions}>
                                <View style={styles.action}>
                                    <ActionButton
                                        title="Cancel"
                                        onPress={dismiss}
                                        variant="secondary"
                                    />
                                </View>
                                <View style={styles.action}>
                                    <ActionButton
                                        title="Delete"
                                        onPress={confirm}
                                        variant="danger"
                                    />
                                </View>
                            </View>
                        ) : (
                            <ActionButton title="Done" onPress={dismiss} />
                        )}
                    </View>
                </View>
            </Modal>
        </SuccessModalContext.Provider>
    );
}

export function useSuccessModal() {
    const modal = useContext(SuccessModalContext);
    if (!modal) {
        throw new Error("useSuccessModal must be used within SuccessModalProvider");
    }
    return modal.showSuccess;
}

export function useConfirmationModal() {
    const modal = useContext(SuccessModalContext);
    if (!modal) {
        throw new Error(
            "useConfirmationModal must be used within SuccessModalProvider"
        );
    }
    return modal.showConfirmation;
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "rgba(31, 48, 39, 0.55)",
    },
    card: {
        width: "100%",
        maxWidth: 420,
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    title: {
        marginBottom: 8,
        color: COLORS.primaryDark,
        fontSize: 22,
        lineHeight: 28,
        fontWeight: "800",
        textAlign: "center",
    },
    description: {
        marginBottom: 24,
        color: COLORS.text,
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
    },
    actions: { flexDirection: "row", gap: 12 },
    action: { flex: 1 },
});
