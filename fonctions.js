// Importation de la connexion à la bdd
const connexion = require('./config/db.js')

// FONCTION DE RECUPERATION DES IDENTIFIANTS DE CONNEXION
function verifUser(traitementData)
{
  // Requête de récupération des données utilisateurs
  connexion.query('SELECT * FROM utilisateur', (erreur, resultat) => {
    // Traitement de l'erreur
    if (erreur) throw erreur
    // Traitement de la requête
    traitementData(resultat)
  })
}

// FONCTION DE RECUPERATION DES LIGUES DISPONIBLES
function selectLigues(traitementData)
{
  // Requête de récupération des ligues
  connexion.query('SELECT id_ligues, nom FROM ligues', (erreur, resultat) => {
    // Traitement de l'erreur
    if (erreur) throw erreur
    // Traitement de la requête
    traitementData(resultat)
  })
}

// FONCTION DE RECUPERATION DES MOTIFS DE FICHES DE FRAIS
function selectMotifs(traitementData)
{
  // Requête de récupération des motifs
  connexion.query('SELECT * FROM motif', (erreur, resultat) => {
    // Traitement de l'erreur
    if (erreur) throw erreur
    // Traitement de la requête
    traitementData(resultat)
  })
}

// FONCTION DE RECUPERATION DES ADHERENTS ET LEURS BORDEREAU
// function selectAdherent(traitementData)
// {
//   // Requête de récupération des données utilisateurs
//   connexion.query('SELECT nom, prenom FROM demandeur, utilisateur WHERE demandeur.id_utilisateur = utilisateur.id_utilisateur', (erreur, resultat) => {
//     // Traitement de l'erreur
//     if (erreur) throw erreur
//     // Traitement de la requête
//     traitementData(resultat)
//   })
// }

// Exportations des fonctions
module.exports = {
  verifUser,
  selectLigues,
  selectMotifs
  // selectAdherent
}