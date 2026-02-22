import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/environment';

export type PolicyName = 'terms' | 'privacy' | 'content';

export interface PolicyMeta { name: PolicyName; version: string }

export interface AcceptedPolicies {
  terms: { version: string; acceptedAt: string };
  privacy: { version: string; acceptedAt: string };
  content: { version: string; acceptedAt: string };
}

const STORAGE_KEY_ACCEPTED = 'policyAcceptedVersions';

export async function getServerPolicyVersions(): Promise<{ terms: PolicyMeta; privacy: PolicyMeta; content: PolicyMeta } | null> {
  try {
    const res = await fetch(`${config.SERVER_URL}/api/policies`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.success || !Array.isArray(json.data)) return null;
    const map: any = {};
    for (const item of json.data as Array<any>) {
      map[item.name] = { name: item.name as PolicyName, version: item.version };
    }
    if (map.terms && map.privacy && map.content) return map as any;
    return null;
  } catch {
    return null;
  }
}

export async function getAcceptedPolicies(): Promise<AcceptedPolicies | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_ACCEPTED);
    return raw ? (JSON.parse(raw) as AcceptedPolicies) : null;
  } catch {
    return null;
  }
}

export async function setAcceptedPolicies(accepted: AcceptedPolicies): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_ACCEPTED, JSON.stringify(accepted));
}

export function needsNewAcceptance(versions: { terms: PolicyMeta; privacy: PolicyMeta; content: PolicyMeta }, accepted: AcceptedPolicies | null): boolean {
  if (!accepted) return true;
  return (
    accepted.terms.version !== versions.terms.version ||
    accepted.privacy.version !== versions.privacy.version ||
    accepted.content.version !== versions.content.version
  );
}

export function getLocalPolicyVersions(): { terms: PolicyMeta; privacy: PolicyMeta; content: PolicyMeta } {
  // Use require to guarantee bundling in RN
  const terms = require('../assets/policies/terms.json');
  const privacy = require('../assets/policies/privacy.json');
  const content = require('../assets/policies/content.json');
  return {
    terms: { name: 'terms', version: terms.version },
    privacy: { name: 'privacy', version: privacy.version },
    content: { name: 'content', version: content.version },
  };
}


