import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReceiptDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [receiptDetails, setReceiptDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [receiptName , setReceiptName] = useState<string>('');
  useEffect(() => {
    const fetchReceiptDetailsFromApi = async () => {
      try {
        if (!id) {
          setError('ID du reçu non spécifié dans l\'URL');
          return;
        }
        const json_payload =
        {
            receiptID: id

        }
        const response = await fetch('https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1/receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(json_payload)
        });
        console.log('Json_payload:', json_payload);

        const responseData = await response.json();
        if (response.ok) {
          //convert to json
          const response_data = JSON.parse(responseData.body);

          setMessage(responseData.body);
          setReceiptDetails(response_data);
          console.log('responseData:', response_data);
        setReceiptName(response_data.body.DocumentKey);
          setReceiptDetails(responseData.body);

            setLoading(false);


        } else {
          setError('Erreur lors de la récupération des détails du reçu');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du reçu:', error);
        setError('Erreur lors de la récupération des détails du reçu');
      }
    };

    fetchReceiptDetailsFromApi();
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
      {/* {error && <p>{error}</p>} */}
      {/* {message && <p>{message}</p>} */}
    {receiptDetails && (
    <div className="card">
        <div className="card-header">
        <h5 className="card-title">
            Détails du reçu- {receiptDetails.DocumentKey}
        </h5>
        </div>
        <div className="card-body">

        <dl className="row">
            {Object.entries(receiptDetails.KeyValuePairs).map(([key, value]: [string, any], index: number) => (
            <div className='row' key={index}>
                <div className="col">
                    <p className='text-left '>{key}
                    </p>
                    </div>
                <div className="col">{value}</div>
            </div>
            ))}
        </dl>
        </div>
    </div>
    )}
    </div>
  );
};

export default ReceiptDetails;
