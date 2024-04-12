import React, { useState, useEffect } from 'react';
import { fetchReceipts, deleteReceipt } from '../../services/api'; // Import des fonctions d'API

const ReceiptList: React.FC = () => {
  const [receipts, setReceipts] = useState<any[]>([]); // Utilisation de any[] pour les données des reçus sans modèle spécifique

  useEffect(() => {
    const fetchReceiptsFromApi = async () => {
      try {
        const fetchedReceipts = await fetchReceipts();
        setReceipts(fetchedReceipts.body); // Récupérer le tableau de reçus depuis la propriété 'body'
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    };

    fetchReceiptsFromApi();
  }, []);

  const handleDeleteReceipt = async (id: string) => {
    try {
      await deleteReceipt(id);
      // Mettre à jour la liste des reçus après la suppression
      setReceipts(receipts.filter(receipt => receipt.receipts_Id !== id));
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

//   return (
//     <div>
//       <h2>Liste des reçus</h2>
//       <ul>
//         {receipts.map((receipt: any, index: number) => (
//           <li key={index}>
//             <h3>{receipt.receipts_Id}</h3>
//             <ul>
//               {Object.entries(receipt.KeyValuePairs).map(([key, value]: [string, any], index: number) => (
//                 <li key={index}><strong>{key}:</strong> {value}</li>
//               ))}
//             </ul>
//             <button onClick={() => handleDeleteReceipt(receipt.receipts_Id)}>Supprimer</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

return (
    <div className="container mt-4">
      <h2 className="mb-3">Liste des reçus</h2>
      <div className="list-group">
        {receipts.map((receipt: any, index: number) => (
          <div className="card mb-2" key={index}>
            <div className="card-body">
              <h3 className="card-title">{receipt.receipts_Id}</h3>
              <div className="list-group">
                {Object.entries(receipt.KeyValuePairs).map(([key, value]: [string, any], index: number) => (
                  <div key={index} className="list-group-item">
                    <p className='text-left'>
                        <strong>{key}:</strong> {value}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleDeleteReceipt(receipt.receipts_Id)}
                className="btn btn-danger mt-2"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiptList;
