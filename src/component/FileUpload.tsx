import React, { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import axios from 'axios';
import Header from './Header';
export const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorDropzone, setErrorDropzone] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Set API endpoint URL
    const apiUrl = 'https://q591dyr3zl.execute-api.us-east-1.amazonaws.com/v1/receipts';

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
            reader.readAsDataURL(selectedFile); // Cela va lire le fichier en tant que Data URL (base64)

            reader.onload = async () => {
                // Extraire la chaîne base64
                const base64String = reader.result as string;
                // Créer un objet JSON avec la chaîne base64
                const jsonPayload = {
                    file: base64String
                };
                console.log("***************************************************");
                console.log("JSON Payload: ");
                console.log(jsonPayload);

                try {
                    // Envoi de la requête POST avec l'objet JSON dans le corps
                    const response = await axios.post(apiUrl, jsonPayload, {
                        headers: {
                            'Content-Type': 'application/json',
                           'Access-Control-Allow-Origin': '*',

                        }
                    });
                    console.log("***************************************************");
                    console.log("Response from API: ");
                    console.log(response);
                    setMessage('Le fichier PDF a été téléversé avec succès.');
                    setError(null);
                } catch (error) {
                    console.log("***************************************************");
                    console.log("Error from API: ");
                    console.log(error);
                    setError('Une erreur s’est produite lors du téléversement du fichier.\t '+error);
                    setMessage(null);
                }
            };

            reader.onerror = (error) => {
                console.log("***************************************************");
                console.log("Error converting file to base64: ");
                console.log(error);
                setError('Une erreur s’est produite lors de la conversion du fichier en base64.');
                setMessage(null);
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
            <Header />
            <div className="mt-4 container">

                <div className='row '>
                    <div className='col-10 mx-auto' >
                        <h2>Upload de fichier PDF</h2>
                        {errorDropzone && <div className='alert alert-danger mt-2' role='alert'>{errorDropzone}</div>}
                        <form onSubmit={handleSubmit} method='post' id='pdf-upload-form' encType='multipart/form-data' className='mt-4'>
                            <div {...getRootProps({ className: 'dropzone' })}>
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
