import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReceiptDetails } from '../../services/api';

const ReceiptDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const handleDownloadTxt = () => {
    if (!receiptDetails) return;

    const keyValuePairs = receiptDetails.KeyValuePairs;
    const txtContent = Object.entries(keyValuePairs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    //splite le nom du fichier et extension receiptDetails.DocumentKey

    // const fileName = receiptDetails.DocumentKey + '.txt';
    const fileName = receiptDetails.DocumentKey.slice(0, -4) + '.txt';


    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };


  const handleDownloadTxt2 = () => {
    if (!receiptDetails) return;

    const keyValuePairs = receiptDetails.KeyValuePairs;
    const txtContent = Object.entries(keyValuePairs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const fileName = 'keyValuePairs.txt';

  };





  // useEffect(() => {
  //   const fetchReceiptDetailsFromApi = async () => {
  //     try {
  //       if (!id) {
  //         setError('ID du reçu non spécifié dans l\'URL');
  //         return;
  //       }

  //       setLoading(true);

  //       const response = await fetch('https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1/receipt', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ receiptID: id })
  //       });

  //       if (response.ok) {
  //         const responseData = await response.json();
  //         const response_data = JSON.parse(responseData.body);
  //         setReceiptDetails(response_data.body);
  //       } else {
  //         setError('Erreur lors de la récupération des détails du reçu');
  //       }
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération des détails du reçu:', error);
  //       setError('Erreur lors de la récupération des détails du reçu');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchReceiptDetailsFromApi();
  // }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError('ID du reçu non spécifié dans l\'URL');
          return;
        }
        setLoading(true);
        const details = await fetchReceiptDetails(id);
        console.log('details:', details);
        setReceiptDetails(details);

      } catch (error) {
        setError('Erreur lors de la récupération des détails du reçu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mt-4">
      <h1>Détails du reçu</h1>

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {error && <p>{error}</p>}

      {receiptDetails && (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">
              Détails du reçu - {receiptDetails.DocumentKey}
            </h5>
          </div>
          <div className="card-body">
            <dl className="row">
              {Object.entries(receiptDetails.KeyValuePairs).map(([key, value]: [string, any], index: number) => (
                <div className="row" key={index}>
                  <div className="col">
                    <p className="text-left">{key}</p>
                  </div>
                  <div className="col">{value}</div>
                </div>
              ))}
            </dl>
          </div>
          <div className="row mt-2 mb-2">
  <div className="col">
    <button onClick={handleDownloadTxt} className="btn btn-primary mt-2"> Télécharger en format texte </button>
  </div>
</div>
        </div>

      )}

    </div>
  );
};

export default ReceiptDetails;
