// api.ts
const BASE_URL = 'https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1';

export const fetchReceipts = async () => {
    console.info('fetchReceipts');
  try {
    const response = await fetch(`${BASE_URL}/receipts`);
    if (!response.ok) {
      throw new Error(`Failed to fetch receipts: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }
};
// fetchReceiptDetails
export const fetchReceiptDetails = async (id: string) => {
console.info('fetchReceiptDetails');
  try {
    const response = await fetch(`${BASE_URL}/receipts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch receipt details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching receipt details:', error);
    return null;
  }
};
// fetchReceiptDetails2
export const fetchReceiptDetails2 = async (id: string) => {
console.info('fetchReceiptDetails');
  try {
    const response = await fetch(`${BASE_URL}/receipts/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch receipt details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching receipt details:', error);
    return null;
  }
};

export const deleteReceipt = async (id: string): Promise<void> => {
    console.info('deleteReceipt');
  try {
    const response = await fetch(`${BASE_URL}/receipts/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Failed to delete receipt: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting receipt:', error);
  }
};

