import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchReceipts, deleteReceipt } from '../../services/api';
import { Receipt } from '../../types';

const ReceiptList: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReceiptsFromApi = async () => {
      try {
        const fetchedReceipts = await fetchReceipts();
        setReceipts(fetchedReceipts.body);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching receipts:', error);
      }
    };

    fetchReceiptsFromApi();
  }, []);

  const handleDeleteReceipt = async (id: string) => {
    try {
      await deleteReceipt(id);
      setReceipts(receipts.filter(receipt => receipt.receipts_Id !== id));
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  const handleDownloadReceipt = (id: string) => {
    console.log(`Downloading receipt with ID: ${id}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Liste des reçus extraits de la base de données</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Document</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts && receipts.length > 0 ? (
              receipts.map((receipt: Receipt, index: number) => (
                <tr key={index}>
                  <td>{receipt.receipts_Id}</td>
                  <td>
                    <Link to={`/receipt/${receipt.receipts_Id}`}>{receipt.DocumentKey}</Link>
                  </td>
                  <td className="d-flex align-items-center">
                    <button className="btn btn-sm btn-danger me-1" onClick={() => handleDeleteReceipt(receipt.receipts_Id)}>
                      Supprimer
                    </button>
                    <button className="btn btn-sm btn-success me-1" onClick={() => handleDownloadReceipt(receipt.receipts_Id)}>
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Aucun reçu trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReceiptList;
