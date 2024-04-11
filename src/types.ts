export interface Receipt {
    id?: string; // Identifiant unique du reçu (optionnel)
    BPF_CFA: string; // Code unique de l'établissement
    Recue: string; // Numéro du reçu
    Recue_de_M: string; // Nom de la personne qui a effectué le paiement
    La_somme_de: number; // Montant payé, en tant que nombre pour les calculs
    Representant?: string; // Nom du représentant (optionnel)
    inscription?: number; // Frais d'inscription (optionnel)
    scolarite?: number; // Frais de scolarité (optionnel)
    Paiement: string; // Méthode de paiement
    paiement_libelle: string; // Détails sur le paiement
    date: Date; // La date du paiement, en tant qu'objet Date
    signature?: string; // Signature (optionnel)
    tags?: string[]; // Tags pour la classification ou la recherche (optionnel)
}




export interface Receipt {
    "receipts_Id": "Recu_Oumar.pdf",
    "DocumentKey": "Recu_Oumar.pdf"
    "KeyValuePairs": {
    BPF_CFA: string; //LE montant payé
    Recue: "No 36677",// Numéro du reçu
    Recue_de_M: string; // Nom de la personne qui a effectué le paiement
    La_somme_de: number; // Montant paye ent toute lettre
    Representant?: string; // Nom du représentant (optionnel)parfois c'est vide
    inscription?: number; // exemple Frais d'inscription (optionnel)
    scolarite?: number; // annee de scolarite exemple 2019-2020
    Paiement: string; // Méthode de paiement chéaueou paiement
    paiement_libelle: string; // Détails sur le paiement juste en dessous du paiement
    date: Date; // La date du paiement, en tant qu'objet Date
    autre: string; // Autre information
    },

}