const API_URL = 'https://script.google.com/macros/s/AKfycbxNIExln9zqlHi3sg5oAyZVfS70iEdqjZ6SN_UYvqMi1LZweJEnIIfD481AaaWaCpcJ/exec';

export const apiClient = {
  fetchData: async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error', schools: [], classes: [] };
    }
  },
  addClass: async (classData: any) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ADD_CLASS', payload: classData })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error' };
    }
  }
};
