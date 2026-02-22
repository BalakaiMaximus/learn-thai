import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, ScrollView } from 'react-native';
import StyledText from './StyledText';
import { config } from '../config/environment';

type PolicyName = 'terms' | 'privacy' | 'content';

interface PolicyData {
  name: PolicyName;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  content: string; // markdown plaintext string
}

interface PoliciesModalProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: PolicyName;
}

const localPolicies: Record<PolicyName, PolicyData> = {
  terms: require('../assets/policies/terms.json'),
  privacy: require('../assets/policies/privacy.json'),
  content: require('../assets/policies/content.json'),
};

export default function PoliciesModal({ visible, onClose, initialTab = 'terms' }: PoliciesModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyName>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Partial<Record<PolicyName, PolicyData>>>({});

  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  const fetchPolicy = useCallback(async (name: PolicyName): Promise<PolicyData> => {
    try {
      const res = await fetch(`${config.SERVER_URL}/api/policies/${name}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success || !json?.data) throw new Error('Bad response');
      return json.data as PolicyData;
    } catch (_) {
      return localPolicies[name];
    }
  }, []);

  const ensureLoaded = useCallback(async (name: PolicyName) => {
    if (policies[name]) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPolicy(name);
      setPolicies(prev => ({ ...prev, [name]: data }));
    } catch (e: any) {
      setError(e?.message || 'Failed to load policy');
    } finally {
      setLoading(false);
    }
  }, [fetchPolicy, policies]);

  useEffect(() => {
    if (visible) {
      ensureLoaded(activeTab);
    }
  }, [visible, activeTab, ensureLoaded]);

  const tabs: Array<{ key: PolicyName; label: string }> = useMemo(
    () => [
      { key: 'terms', label: 'Terms' },
      { key: 'privacy', label: 'Privacy' },
      { key: 'content', label: 'Content' },
    ],
    []
  );

  const activePolicy: PolicyData | undefined = policies[activeTab] || localPolicies[activeTab];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <StyledText style={styles.title} bold>
              Policies
            </StyledText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabRow}>
            {tabs.map(t => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setActiveTab(t.key)}
                style={[styles.tab, activeTab === t.key && styles.activeTab]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === t.key && styles.activeTabText]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#ff69b4" />
            </View>
          ) : (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {activePolicy && (
                <>
                  <Text style={styles.meta}>
                    Version {activePolicy.version} • Effective {new Date(activePolicy.effectiveDate).toDateString()}
                  </Text>
                  <Text style={styles.body}>{activePolicy.content}</Text>
                  <Text style={styles.meta}>
                    Contact: support@haydenbulktechlabs.com
                  </Text>
                </>
              )}
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'rgba(255, 234, 250, 0.98)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 105, 180, 0.8)',
    overflow: 'hidden',
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgb(251, 187, 82)',
    borderBottomWidth: 2,
    borderColor: 'rgb(170, 26, 170)',
  },
  title: {
    fontSize: 20,
    color: 'rgb(175, 88, 97)',
  },
  closeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 18,
    color: 'rgb(175, 88, 97)',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 105, 180, 0.4)',
  },
  activeTab: {
    backgroundColor: '#ff69b4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  loadingBox: {
    paddingVertical: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  meta: {
    marginTop: 8,
    marginBottom: 8,
    color: '#666',
  },
  body: {
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  error: {
    color: 'crimson',
    marginTop: 8,
  },
});


