import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReceiptDetails } from '../../services/api'; // Assurez-vous d'avoir cette fonction d'API définie

const ReceiptDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupérer l'ID du reçu à partir des paramètres d'URL
  const [receiptDetails, setReceiptDetails] = useState<any>(null); // Utilisation de any pour les détails du reçu, assurez-vous d'avoir le bon type ici

  useEffect(() => {
    const fetchReceiptDetailsFromApi = async () => {
      try {
        if (!id) return; // Vérifier si id est défini
        const details = await fetchReceiptDetails(id); // Appeler la fonction d'API pour récupérer les détails du reçu en fonction de son ID
        setReceiptDetails(details);
      } catch (error) {
        console.error('Error fetching receipt details:', error);
      }
    };
    fetchReceiptDetailsFromApi();
  }, [id]); // Recharge les détails du reçu lorsque l'ID change
  return (
    <div className="container mt-4">
      <h2>Details du reçu</h2>
      {receiptDetails ? (
        <div className="list-group">
        {Object.entries(receiptDetails.KeyValuePairs).map(([key, value]: [string, any], index: number) => (
          <div key={index} className="list-group-item">
            <p className='text-left'>
                <strong>{key}:</strong> {value}
            </p>
          </div>
        ))}
      </div>
      ) : (
        <p>Chargement des détails du reçu...</p>
      )}
    </div>
  );
};

export default ReceiptDetails;
