import React, { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import axios from 'axios';
import Header from '../Header';
export const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorDropzone, setErrorDropzone] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Set API endpoint URL
    const apiUrl = 'https://ssj7vr3i93.execute-api.us-east-1.amazonaws.com/v1/receipts';

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
          },
        onDrop: (acceptedFiles) => {
            setMessage(null);
            setError(null);
            setSelectedFile(acceptedFiles[0]);
            setErrorDropzone
            (
                null
            );

        },
        onDropRejected: (fileRejections) => {
            setErrorDropzone('Veuillez sélectionner un fichier PDF.');
        },
        onDropAccepted: (acceptedFiles) => {
            setSelectedFile(acceptedFiles[0]);
            setErrorDropzone(null);
        },

    });


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Veuillez sélectionner un fichier PDF.');
            setMessage(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Convertir le fichier sélectionné en base64
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile); // Cela va lire le fichier en tant que Data URL (base64
            reader.onload = async () => {

                // Extraire la chaîne base64
                const base64String = reader.result as string;
                // Créer un objet JSON avec la chaîne base64
                const jsonPayload = {
                    fileName: selectedFile.name,
                    file: base64String
                };
                console.log("***************************************************");
                console.log("JSON Payload: ");
                console.log(jsonPayload);
                try {

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },

                        body: JSON.stringify(jsonPayload)
                    });

                    // Vérification de la réussite de la requête
                    if (response.ok) {
                        //afficher la reponse de server
                        const data = await response.json();
                        console.log("***************************************************");
                        console.log("Response from API: ");
                        console.log(data);
                        setMessage(data.body);
                        setError(null);
                    } else {
                        // En cas d'erreur, afficher le message d'erreur de la réponse
                        const errorMessage = await response.text();
                        setError(`Une erreur s’est produite lors du téléversement du fichier. Erreur : ${errorMessage}`);
                        setMessage(null);
                    }
                } catch (error) {
                    console.log("***************************************************");
                    console.log("Error from API: ");
                    console.log(error);
                    setError('Une erreur s’est produite lors du téléversement du fichier.\t '+error);
                    setMessage(null);
                }
            };
        } catch (error) {
            console.log("***************************************************");
            console.log(error);
            setError('Une erreur s’est produite lors du traitement de la demande.');
            setMessage(null);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="mt-4 container">

                <div className='row '>
                    <div className='col-10 mx-auto' >
                        <h2>
                            Téléversement de fichiers PDF
                        </h2>
                        {errorDropzone && <div className='alert alert-danger mt-2' role='alert'>{errorDropzone}</div>}
                        <form onSubmit={handleSubmit} method='post' id='pdf-upload-form' encType='multipart/form-data' className='mt-4'>
                            <div {...getRootProps({ className: 'dropzone' })} style={
                                {
                                    border: '1px dashed #000',
                                    borderRadius: '5px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#f0f0f0'
                                }

                            }>
                                <input {...getInputProps()}  id='fileInput'/>
                                <p>Faites glisser un fichier PDF ici ou cliquez pour en sélectionner un</p>
                            </div>
                            {/* <button className='btn btn-success' type="submit">
                                Téléverser
                            </button> */}
                            <button className='btn btn-success' type="submit" disabled={loading}>
                                {loading ? 'Téléversement en cours...' : 'Téléverser'}
                            </button>
                        </form>
                        {selectedFile && (
                            <div className='mt-2'>
                                <p>Nom du fichier : {selectedFile.name}</p>
                                <p>Taille du fichier : {selectedFile.size} octets</p>
                                <p>Type du fichier : {selectedFile.type}</p>
                            </div>
                        )}
                        {error && <div className='alert alert-danger mt-2' role='alert'>{error}</div>}
                        {message && <div className='alert alert-success mt-2' role='alert'>{message}</div>}
                    </div>
                </div>
            </div>
        </>
    );
};
export default FileUpload;
