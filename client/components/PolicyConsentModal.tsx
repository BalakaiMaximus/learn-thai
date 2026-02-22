import React, { useMemo, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Linking, ScrollView } from 'react-native';
import StyledText from './StyledText';

type PolicyName = 'terms' | 'privacy' | 'content';

export interface PolicyVersions {
  terms: { version: string };
  privacy: { version: string };
  content: { version: string };
}

interface PolicyConsentModalProps {
  visible: boolean;
  versions: PolicyVersions | null;
  onViewPolicy?: (name: PolicyName) => void;
  onCancel: () => void;
  onAccept: (acceptedPolicies: Record<PolicyName, { version: string; acceptedAt: string }>) => void;
}

export default function PolicyConsentModal({ visible, versions, onViewPolicy, onCancel, onAccept }: PolicyConsentModalProps) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeContent, setAgreeContent] = useState(false);

  const allChecked = agreeTerms && agreePrivacy && agreeContent;

  const versionText = useMemo(() => {
    if (!versions) return '';
    return `v${versions.terms.version} / v${versions.privacy.version} / v${versions.content.version}`;
  }, [versions]);

  const handleAccept = () => {
    if (!versions) return;
    const now = new Date().toISOString();
    onAccept({
      terms: { version: versions.terms.version, acceptedAt: now },
      privacy: { version: versions.privacy.version, acceptedAt: now },
      content: { version: versions.content.version, acceptedAt: now },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <StyledText style={styles.title} bold>
              Review & Accept Policies
            </StyledText>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.subtitle}>You must agree to the latest Terms, Privacy Policy, and Content Policy to continue.</Text>
            {versions && (
              <Text style={styles.meta}>Versions: {versionText}</Text>
            )}

            {(['terms','privacy','content'] as PolicyName[]).map((name) => {
              const mapLabel: Record<PolicyName, string> = {
                terms: 'Terms of Service',
                privacy: 'Privacy Policy',
                content: 'Content Policy',
              };
              const checked = name === 'terms' ? agreeTerms : name === 'privacy' ? agreePrivacy : agreeContent;
              return (
                <View key={name} style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      if (name === 'terms') setAgreeTerms(!agreeTerms);
                      if (name === 'privacy') setAgreePrivacy(!agreePrivacy);
                      if (name === 'content') setAgreeContent(!agreeContent);
                    }}
                    style={[styles.checkbox, checked && styles.checkboxChecked]}
                    activeOpacity={0.7}
                  >
                    {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onViewPolicy && onViewPolicy(name)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.link}>{mapLabel[name]}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.acceptBtn, !allChecked && styles.acceptBtnDisabled]}
              disabled={!allChecked}
              onPress={handleAccept}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptText}>I Agree</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 480, backgroundColor: 'rgba(255, 234, 250, 0.98)', borderRadius: 16, borderWidth: 3, borderColor: 'rgba(255, 105, 180, 0.8)', overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'rgb(251, 187, 82)', borderBottomWidth: 2, borderColor: 'rgb(170, 26, 170)' },
  title: { fontSize: 18, color: 'rgb(175, 88, 97)' },
  closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  closeText: { fontSize: 18, color: 'rgb(175, 88, 97)' },
  content: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 360 },
  subtitle: { color: '#333', marginBottom: 8 },
  meta: { color: '#666', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: 'rgba(255, 105, 180, 0.8)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  checkboxChecked: { backgroundColor: '#ff69b4' },
  checkboxMark: { color: 'white', fontWeight: 'bold' },
  link: { color: '#5a275a', textDecorationLine: 'underline', fontSize: 14 },
  footer: { padding: 12, borderTopWidth: 2, borderColor: 'rgba(255, 105, 180, 0.5)', alignItems: 'flex-end' },
  acceptBtn: { backgroundColor: '#ff69b4', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  acceptBtnDisabled: { backgroundColor: 'rgb(201,201,201)' },
  acceptText: { color: 'white', fontWeight: '800' },
});


