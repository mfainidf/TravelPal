import translations from './it.json';

export type Translations = typeof translations;

// Simple translation function
export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return typeof value === 'string' ? value : key;
}

export { translations };
