// Importation de la class mère
import './user.js'

// Class User
class Demandeur extends User
{
    // Déclaration des attributs
    num_licence = date_naissance = ligue = null

    // Fonction d'enregistrement de l'adhérent
    static createDemandeur(num_licence, date_naissance, ligue)
    {
        // id de l'utlisateur
        let idData
        
        // Requête d'enregistrement des données du demandeur
        connexion.query('INSERT INTO demandeur VALUES num_licence, date_naissance', [num_licence, date_naissance], (erreur, resultat) => {
            // Traitement de l'erreur
            if (erreur) throw erreur
            // Récupération de l'id
        })

        // Requête d'enregistrement des données
        connexion.query('INSERT INTO adherent VALUES id_ligue, id_utilisateur', [ligue, idData], (erreur, resultat) => {
            // Traitement de l'erreur
            if (erreur) throw erreur
        })
    }

    // Constructeur
    constructor(num_licence, date_naissance, ligue)
    {
        // Récupérat+ion de l'id de l'utilisateur
        dataUser.getDataUser()
        // Initialisation des données propres aux adhérents
        this.num_licence = num_licence
        this.date_naissance = date_naissance
    }
}