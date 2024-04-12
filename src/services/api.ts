// api.ts
const BASE_URL = 'https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1';

const fetchWithRetry = async (url: string, options: RequestInit, retries = 2): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      throw new Error(`Failed to fetch: ${response.statusText}`);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  }
  throw new Error('Failed to fetch after multiple attempts');
};



export const fetchReceipts = async () => {
  console.info('fetchReceipts');
  try {
    const response = await fetchWithRetry(`${BASE_URL}/receipts`, {});
    return await response.json();
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }
};

// export const fetchReceiptDetails = async (id: string) => {
//   console.info('fetchReceiptDetails');
//   try {
//     const response = await fetchWithRetry(`${BASE_URL}/receipts/${id}`, {});
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching receipt details:', error);
//     return null;
//   }
// };
// export const fetchReceiptDetails = async (id: string) => {
//   try {
//         const response = await fetch('https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1/receipt', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ receiptID: id })
//         });
//     if (response.ok) {
//       const responseData = await response.json();
//       const response_data = JSON.parse(responseData.body);
//       console.log('responseData:', response_data);
//       return response_data;
//     }
//     throw new Error(`Failed to fetch receipt details: ${response.statusText}`);
//   } catch (error) {
//     console.error('Error fetching receipt details:', error);
//     throw error;
//   }
// };

export const fetchReceiptDetails = async (id: string) => {
  try {
    for (let i = 0; i < 2; i++) { // Essaie deux fois
      const response = await fetch('https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiptID: id })
      });
      if (response.ok) {
        const responseData = await response.json();
        const response_data = JSON.parse(responseData.body);
        console.log('responseData:', response_data);
        return response_data;
      }
      console.error('Failed to fetch receipt details:', response.statusText);
    }
    throw new Error('Failed to fetch receipt details after multiple attempts');
  } catch (error) {
    console.error('Error fetching receipt details:', error);
    throw error;
  }
};

export const deleteReceipt = async (id: string): Promise<void> => {
  console.info('deleteReceipt');
  try {
    const response = await fetchWithRetry(`${BASE_URL}/receipts/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Failed to delete receipt: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting receipt:', error);
  }
};
