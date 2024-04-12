import React from 'react'

export default function About() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', fontFamily: 'Arial', border: '1px solid #ccc' }}>
      <h1 style={{ color: '#333', fontWeight: 'bold' }}>About</h1>
      <p style={{ color: '#666', lineHeight: '1.6' }}>
        Bienvenue sur notre application de traitement automatique des reçus de caisse ! Notre application utilise les dernières avancées en matière d'intelligence artificielle et de traitement des données pour simplifier la gestion de vos reçus de caisse.
      </p>

      <h5 style={{ color: '#333', marginTop: '20px' }}>Notre mission</h5>
      <p style={{ color: '#666', lineHeight: '1.6' }}>
        Notre mission est de simplifier et d'automatiser le processus fastidieux de collecte et de gestion des données présentes sur les reçus de caisse. Grâce à notre technologie innovante, nous visons à rendre cette tâche plus efficace et moins chronophage pour nos utilisateurs.
      </p>

      <h5 style={{ color: '#333', marginTop: '20px' }}>Comment ça marche</h5>
      <p style={{ color: '#666', lineHeight: '1.6' }}>
        Notre application utilise Amazon Textract pour extraire automatiquement les informations clés à partir des images des reçus de caisse. Une fois les données extraites, elles sont stockées en toute sécurité dans notre base de données DynamoDB. Les utilisateurs peuvent ensuite accéder facilement à ces données via notre interface utilisateur conviviale.
      </p>
    </div>
  )
}