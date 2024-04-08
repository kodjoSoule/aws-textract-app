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
    const apiUrl = 'https://file.io';

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
            // File to upload as a binary string
            const formData = new FormData();
            formData.append('file', selectedFile);
            console.log("***************************************************");
            //selectedFile to binary string
            // const reader = new FileReader();
            // const binaryFile =new Blob([selectedFile], {type: 'application/pdf'});
            // reader.readAsBinaryString(selectedFile);
            // // reader.onloadend = () => {
            //     console.log("Binary String: ");
            //     console.log(reader.result);
            // };
            // console.log("selectedFile: ");
            //to binary string
            // console.log(
            //     selectedFile

            // );
            // Envoi de la requête POST avec l'objet JSON dans le corps
            await axios.post(
                apiUrl
                , formData, {
                    headers: {
                        'Content-Type': 'application/pdf'
                    }
                })
                .then((response) => {
                    console.log("***************************************************");
                    console.log("Response from API: ");
                    console.log(response);
                })
                .catch((error) => {
                    console.log("***************************************************");
                    console.log("Error from API: ");
                    console.log(error);
                });
            setMessage('Le fichier PDF a été téléversé avec succès.');
            setError(null);
        } catch (error) {
            console.log("***************************************************");
            console.log(error);
        }
        finally {
            setLoading(false); // Désactiver l'indicateur de chargement une fois le téléversement terminé
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
