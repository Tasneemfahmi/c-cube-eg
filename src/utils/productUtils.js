import { db } from '../firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getProductsByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];

  const chunks = [];
  const chunkSize = 10;
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }

  const allResults = [];

  for (const chunk of chunks) {
    const q = query(collection(db, 'products'), where('__name__', 'in', chunk));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allResults.push({ id: doc.id, ...doc.data() });
    });
  }

  return allResults;
};
