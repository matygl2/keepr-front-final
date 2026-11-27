import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ApiError, errorMessage } from "../api/client";
import { colors, fonts, radius, spacing } from "../constants/theme";
import { useProducts } from "../context/ProductsContext";
import { isValidEmail } from "../utils/validation";
import FormField from "./FormField";

interface Props {
  visible: boolean;
  productId: string;
  productName: string;
  onClose: () => void;
  /** Se llama cuando el traspaso salió bien, con el email al que se mandó. */
  onTransferred: (email: string) => void;
}

/** Pide el email de otra cuenta de Keepr y le pasa el producto (con sus documentos e historial). */
export default function TransferProductModal({
  visible,
  productId,
  productName,
  onClose,
  onTransferred,
}: Props) {
  const { transferProduct } = useProducts();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);

  const close = () => {
    if (sending) return;
    setEmail("");
    setEmailError("");
    setFormError("");
    onClose();
  };

  const submit = async () => {
    if (sending) return;
    const target = email.trim();
    setEmailError("");
    setFormError("");
    if (!isValidEmail(target)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setSending(true);
    try {
      await transferProduct(productId, target);
      setEmail("");
      onTransferred(target.toLowerCase());
    } catch (err) {
      // El servidor dice si el problema es el email (no tiene cuenta, es la propia);
      // cualquier otro error (sin conexión, etc.) va arriba del botón.
      const fromServer = err instanceof ApiError ? err.fields?.email?.[0] : undefined;
      if (fromServer) setEmailError(fromServer);
      else setFormError(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Transfer product</Text>
          <Text style={styles.body}>
            {`"${productName}" will move to another Keepr account, together with its receipt, documents and maintenance history. You will lose access to it, and only the new owner will be able to transfer it again.`}
          </Text>

          <FormField
            label="NEW OWNER'S EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="name@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            error={emailError}
          />

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, sending && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={submit}
            disabled={sending}
          >
            <Text style={styles.primaryButtonText}>
              {sending ? "Transferring…" : "Transfer product"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={close}
            disabled={sending}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: spacing.lg,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    color: colors.primary,
    marginBottom: spacing.sm,
  },

  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  formError: {
    color: colors.danger,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
    fontSize: 13,
    marginBottom: spacing.md,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },

  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },

  cancelText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
});
