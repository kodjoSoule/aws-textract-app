import React, { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import { Body } from 'react-bootstrap/lib/Media';
export const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<any | null>(null);
    const[fileData, setFileData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorDropzone, setErrorDropzone] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [ dataBody, setDataBody] = useState<any | null>(null);




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
        setLoading(true);
        e.preventDefault();
        if (!selectedFile) {
            setError('Veuillez sélectionner un fichier PDF.');
            setMessage(null);
            setLoading(false);
            return;
        }
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
                        if(data.message !== undefined){
                            setMessage(data.message);
                            const data_json = JSON.parse(data.body);
                            setDataBody(data_json);
                        }
                        if(data.body !== undefined){
                            const data_body = JSON.parse(data.body);
                            console.info("fileData: \n" + data_body);
                        //show all items of data_body object
                        for (const key in data_body) {
                            console.log(key, data_body[key]);
                        }
                        console.log("**********************HK*****************************");
                        for (const key in data_body) {
                            if (typeof data_body[key] === 'object') {
                                console.log(key + ": ");
                                for (const nestedKey in data_body[key]) {
                                    if (typeof data_body[key][nestedKey] === 'object') {
                                    console.log(`- ${nestedKey}: `);
                                    for (const nestedKey2 in data_body[key][nestedKey]) {
                                        console.log(`-- ${nestedKey2}: ${data_body[key][nestedKey][nestedKey2]}`);
                                    }
                                }
                                else {
                                    console.log(`- ${nestedKey}: ${data_body[key][nestedKey]}`);
                                }
                                }
                            } else {
                                console.log(`${key}: ${data_body[key]}`);
                            }
                        }


                        setFileData(data.body);

                        }else{
                            console.info("No fileData");
                        }
                        setError(null);
                        setLoading(false);

                    } else {
                        // En cas d'erreur, afficher le message d'erreur de la réponse
                        const errorMessage = await response.text();
                        setError(`Une erreur s’est produite lors du téléversement du fichier. Erreur : ${errorMessage}`);
                        setMessage(null);
                        setLoading(false);
                    }
                } catch (error) {
                    console.log("***************************************************");
                    console.log("Error from API: ");
                    console.log(error);
                    setError('Une erreur s’est produite lors du téléversement du fichier.\t '+error);
                    setMessage(null);
                    setLoading(false);
                }
            };
        } catch (error) {
            console.log("***************************************************");
            console.log(error);
            setError('Une erreur s’est produite lors du traitement de la demande.');
            setMessage(null);
            setLoading(false);
        }
    };
    return (
        <>
            <div className="mt-4 container">
                <div className="row">
                    <h1>
                        Extraction de données de fichiers PDF
                    </h1>
                    <p>
                        Application d'extraction de données de fichiers PDF à l'aide de React, TypeScript et AWS Lambda.
                    </p>
                </div>
                <div className='row '>
                    <div className='col-10 mx-auto' >
                        {/* <h2>
                            Téléversement de fichiers PDF
                        </h2> */}
                        {errorDropzone && <div className='alert alert-danger mt-2' role='alert'>{errorDropzone}</div>}
                        {error && <div className='alert alert-danger mt-2' role='alert'>{error}</div>}

                        <form onSubmit={handleSubmit}  id='pdf-upload-form' className='mt-4'>
                            <div {...getRootProps({ className: 'dropzone' })}
                                style={
                                    {
                                        border: '1px dashed #000',
                                        borderRadius: '5px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#f0f0f0',
                                        height : '200px'
                                    }

                                }
                            >
                                <input {...getInputProps()}  id='fileInput'
                                className='form-control'
                                />
                                <p>Faites glisser un fichier PDF ici ou cliquez pour en sélectionner un</p>
                            </div>
                            {/* <button className='btn btn-success' type="submit">
                                Téléverser
                            </button> */}
                            {selectedFile && (
                            <div className='mt-2'>
                                <p>Nom du fichier : {selectedFile.name}</p>
                                <p>Taille du fichier :
                                    {selectedFile.size} octets</p>
                                <p>Type du fichier : {selectedFile.type}</p>
                            </div>
                            )}
                            <hr className='mt-4'/>
                            <button className='btn btn-success' type="submit" disabled={loading}>
                                {loading ? 'Téléversement en cours...' :
                                'Extraire les données'}
                            </button>
                        </form>
                        {/* loader spinner */}
                        {loading && (
                            <div className='d-flex justify-content-center mt-4'>
                                <div className='spinner-border' role='status'>
                                    <span className='visually-hidden'>Chargement...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row mt-2">
                    {message && <div className="alert alert-success" role="alert">
                        {message};
                    </div>}
                </div>
                {/* extrait de fichier */}
                { fileData && (
                <div className="row">
                    {/* LE FICHIER A ETE EXTRAIT AVEC SUCCEESS */}
                    <div className="col-10 mx-auto">
                        <div className="card mt-4">
                            <div className="card-body">
                                <h5 className="card-title">Extraction de données</h5>
                                <p className="card-text">
                                    Les données ont été extraites avec succès.
                                </p>
                            </div>
                        </div>
                </div>
                </div>
                )}
                <div className="row">
                    <div className="col-10 mx-auto">
                        <div className="card mt-4">
                            <div className="card-body">
                                <h5 className="card-title">Instructions</h5>
                                <p className="card-text">
                                    Pour extraire les données d'un fichier PDF, veuillez suivre les étapes suivantes :
                                </p>
                                <ul>
                                    <li>
                                        Faites glisser un fichier PDF dans la zone de dépôt ou cliquez pour sélectionner un fichier.
                                    </li>
                                    <li>
                                        Cliquez sur le bouton "Extraire les données" pour lancer le processus d'extraction.
                                    </li>
                                    <li>
                                        Attendez la confirmation de l'extraction des données.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FileUpload;
