import { customAlphabet } from 'nanoid';

// 8-char URL-safe slug, lowercase letters + digits (no confusable chars)
const alphabet = '23456789abcdefghjkmnpqrstuvwxyz';
const nano = customAlphabet(alphabet, 8);

export const generateShareSlug = () => nano();
