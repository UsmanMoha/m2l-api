// Importation de la connexion à la bdd
const connexion = require('../config/db.js');

// Class Utilisateur
class User
{
  // Déclaration des attributs locales
  id = null
  droit_reservation = null
  niveau_tarif = null
  statut = ''
  email = ''

  // Récupération de l'id
  getId()
  {
    return this.id
  }

  // Modification du droit de réservation
  setDroitReservation(new_droit_reservation, id_user)
  {
    // Requête de mise à jour du droit utilisateur
    connexion.query('UPDATE utilisateur SET droit_reservation = ? WHERE id_user = ?', [new_droit_reservation, id_user], (erreur) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Modification locale
      this.droit_reservation = new_droit_reservation
      // Fin de traitement
      return 'reussie'
    })
  }

  // Modification du droit de réservation
  setNiveauTarif(new_niveau_tarif, id_user)
  {
    // Requête de mise à jour du droit utilisateur
    connexion.query('UPDATE utilisateur SET niveau_tarif = ? WHERE id_user = ?', [new_niveau_tarif, id_user], (erreur) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Modification locale
      this.niveau_tarif = new_niveau_tarif
      // Fin de traitement
      return 'reussie'
    })
  }

  // Modification du droit de réservation
  setStatut(new_statut, id_user)
  {
    // Requête de mise à jour du droit utilisateur
    connexion.query('UPDATE utilisateur SET statut = ? WHERE id_user = ?', [new_statut, id_user], (erreur) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Modification locale
      this.statut = new_statut
      // Fin de traitement
      return 'reussie'
    })
  }

  // Modification du droit de réservation
  setEmail(new_email, id_user)
  {
    // Requête de mise à jour du droit utilisateur
    connexion.query('UPDATE utilisateur SET email = ? WHERE id_user = ?', [new_email, id_user], (erreur) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Modification locale
      this.email = new_email
      // Fin de traitement
      return 'reussie'
    })
  }

  /*
    * COMPTE UTILISATEUR
    * CR Utilisateur (admin, demandeur)
  */

  // CREATION D'UN NOUVEL UTILISATEUR
  addUser(email, mdp, statut, droit_reservation, niveau_tarif, traitement)
  {
    // Requête de récupération des données utilisateurs
    connexion.query('INSERT INTO utilisateur (email, mdp, statut, droitReservation, niveauTarif) VALUES (?, ?, ?, ?, ?)', [email, mdp, statut, droit_reservation, niveau_tarif], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Notification de création du nouvel utilisateur
      console.log('Nouvel utilisateur à l\'id : ' + res.insertId)
      // Finalisation de l'inscription
      traitement('inscrit', res.insertId)
    })
  }

  // CREATION D'UN NOUVEL UTILISATEUR
  addDemandeur(nom, prenom, rue, cp, ville, numLicence, dateNaissance, id_user, id_ligue, estAdherent)
  {
    console.log(dateNaissance)
    // Requête de récupération des données utilisateurs
    connexion.query('INSERT INTO demandeur (nom, prenom, rue, cp, ville, num_licence, date_naissance, id_utilisateur, ligue_id, estAdherent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [nom, prenom, rue, cp, ville, numLicence, dateNaissance, id_user, id_ligue, estAdherent], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Fin de traitement
      return 'inscrit'
    })
  }

  // RECUPARATION DES DONNEES D'UN ADHERENT
  selectDataAdherent(id_adherent, traitement)
  {
    // Requête de récupération des données utilisateurs
    connexion.query('SELECT id_demandeur, nom, prenom, rue, cp, ville, num_licence FROM demandeur WHERE id_utilisateur = ?', [id_adherent], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Traitement des données
      traitement({
        statut: 'disponible',
        fiche: res
      })
    })
  }

  // RECUPERATION DE LA LISTE DES ADHERENTS
  selectAllAdherentBordereau(retour)
  {
    // Requête de récupération des données des utilisateurs
    connexion.query('SELECT id_demandeur, nom, prenom, id_utilisateur FROM demandeur WHERE estAdherent = 1', (erreur, resultat) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Fin de traitement
      retour(resultat)
    })
  }

  /* -------------------------------------------------------------------------------------------------------- */


  /*
    * FICHE DE FRAIS
    * CRUD Fiche de frais (admin, adhérent, trésorier)
  */

  // CREATION D'UNE NOUVELLE FICHE DE FRAIS
  addFicheFrais(date_ligne_frais, trajet, km, km_valide, cout_peage, peage_valide, peage_justificatif, cout_repas, repas_valide, cout_hebergement, hebergement_valide, hebergement_justificatif, id_motif, id_adherent, traitement)
  {
    // Requête de récupération des données utilisateurs
    connexion.query('INSERT INTO ligne_frais (date_ligne_frais, trajet, km, km_valide, cout_peage, peage_valide, peage_justificatif, cout_repas, repas_valide, cout_hebergement, hebergement_valide, hebergement_justificatif, id_motif, id_adherent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [date_ligne_frais, trajet, km, km_valide, cout_peage, peage_valide, peage_justificatif, cout_repas, repas_valide, cout_hebergement, hebergement_valide, hebergement_justificatif, id_motif, id_adherent], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Notification de création d'une nouvelle fiche de frais
      console.log('Nouvel fiche de frais à l\'id : ' + res.insertId)
      // Finalisation de l'inscription
      traitement('creation', res.insertId)
    })
  }

  // RECUPERATION DE LA LISTE DES FICHES DE FRAIS D'UN UTILISATEUR
  selectAllFicheFrais(id_adherent, date_bordereau, retour)
  {
    // Vérification de l'année des fiches de frais
    const date_filtre = date_bordereau.substr(0, 4)
    // Traitement
    connexion.query('SELECT *, DATE_FORMAT(date_ligne_frais, "%d/%m/%Y") FROM ligne_frais WHERE id_adherent = ?', [id_adherent], (erreur, resultat) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Fin de traitement
      retour(resultat)
    })
  }

  // RECUPARATION D'UNE FICHE DE FRAIS EN PARTICULIER
  selectFicheFrais(id_ligne_frais, id_adherent, traitement)
  {
    // Requête de récupération des données utilisateurs
    connexion.query('SELECT * FROM ligne_frais WHERE id_ligne_frais = ? AND id_adherent = ?', [id_ligne_frais, id_adherent], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Finalisation de l'inscription
      if (res.length > 0)
      {
        // Traitement des données
        traitement({
          statut: 'disponible',
          fiche: res
        })
      } else
      {
        // Notification d'absence
        traitement({
          statut: 'indisponible'
        })
      }
    })
  }

  // MISE A JOUR D'UNE FICHE DE FRAIS
  updateFicheFrais(id_ligne_frais, date_ligne_frais, trajet, km, km_valide, cout_peage, peage_valide, peage_justificatif, cout_repas, repas_valide, cout_hebergement, hebergement_valide, hebergement_justificatif, id_motif, traitement)
  {
    // // Requête de mise à jour de la fiche de frais
    connexion.query('UPDATE ligne_frais SET date_ligne_frais = ?, trajet = ?, km = ?, km_valide = ?, cout_peage = ?, peage_valide = ?, peage_justificatif = ?, cout_repas = ?, repas_valide = ?, cout_hebergement = ?, hebergement_valide = ?, hebergement_justificatif = ?, id_motif = ? WHERE id_ligne_frais = ?', [date_ligne_frais, trajet, km, km_valide, cout_peage, peage_valide, peage_justificatif, cout_repas, repas_valide, cout_hebergement, hebergement_valide, hebergement_justificatif, id_motif, id_ligne_frais], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Notification de mise à jour de la fiche de frais
      console.log('Mise à jour de la fiche de frais : ' + id_ligne_frais)
      // Finalisation de la mise à jour
      traitement('update')
    })
  }

  // SUPRESSION D'UNE FICHE DE FRAIS
  deleteFicheFrais(id_fiche_frais, traitement)
  {
    // Requête de supression de la fiche de frais
    connexion.query('DELETE FROM ligne_frais WHERE id_ligne_frais = ?', [id_fiche_frais], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Finalisation de la supression
      traitement({
        statut: 'supression'
      })
    })
  }

  /* -------------------------------------------------------------------------------------------------------- */

  /*
    * BORDEREAU
    * CRUD Bordereau (admin, adhérent, trésorier)
  */

  // AJOUT D'UN BORDEREAU
  addBordereau(src_bordereau, id_adherent, valide, annee, traitement)
  {
    // Requête de création d'un bordereau
    connexion.query('INSERT INTO bordereau (src_bordereau, adherent_id, valide, annee) VALUES (?, ?, ?, ?)', [src_bordereau, id_adherent, valide, annee], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Notification de création du nouveau bordereau
      console.log('Nouveau bordereau créé à l\'id : ' + res.insertId)
      // Finalisation de l'inscription
      traitement('creation', res.insertId)
    })
  }

  // RECUPERATION DE LA LISTE DES BORDEREAU
  selectAllBordereau(date_bordereau, retour)
  {
    // Récupération de l'identififiant de date trié
    const tri_bordereau = '\'bordereau_' + date_bordereau + '%\''
    // Requête de récupération des données des utilisateurs
    connexion.query('SELECT nom, prenom, id_demandeur, id_bordereau, src_bordereau, valide FROM utilisateur, demandeur, bordereau WHERE src_bordereau LIKE ' + tri_bordereau + ' AND demandeur.id_utilisateur = utilisateur.id_utilisateur AND demandeur.id_demandeur = adherent_id', (erreur, resultat) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Fin de traitement
      retour(resultat)
    })
  }

  // RECUPARATION DES DONNEES D'UN BORDEREAU EN PARTICULIER
  selectBordereauData(id_adherent, annee, traitement)
  {
    // Requête de récupération des données du bordereau
    connexion.query('SELECT * FROM bordereau WHERE adherent_id = ? AND annee = ?', [id_adherent, annee], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Vérification de la présence
      if (res.length > 0)
      {
        // Traitement des données
        traitement({
          statut: 'disponible',
          bordereau: res
        })
      } else
      {
        // Notification d'absence
        traitement({
          statut: 'indisponible'
        })
      }
    })
  }

  // MISE A JOUR D'UN BORDEREAU
  updateBordereau(id, src_bordereau, valide, frais, traitement)
  {
    // Requête de récupération des données utilisateurs
    connexion.query('UPDATE bordereau SET src_bordereau = ?, valide = ?, frais = ? WHERE id_bordereau = ?', [src_bordereau, valide, frais, id], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Notification de mise à jour du bordereau
      console.log('Mise à jour à l\'id : ' + id)
      // Finalisation de la mise à jour
      traitement('update')
    })
  }

  // MISE A JOUR DU DOCUMENT CERFA DU BORDEREAU
  addDocCerfa(id, cerfa, traitement)
  {
    // Requête de récupération des données utilisateurs
    connexion.query('UPDATE bordereau SET cerfa = ?, valide = 1, WHERE id_bordereau = ?', [cerfa, id], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Notification de mise à jour du bordereau
      console.log('Ajout du document cerfa au bordereau à l\'id : ' + id)
      // Finalisation de la mise à jour
      traitement('update')
    })
  }

  // SUPRESSION D'UN UTILISATEUR
  deleteBordereau(id_bordereau, traitement)
  {
    // Requête de supression d'un bordereau'
    connexion.query('DELETE FROM bordereau WHERE id_bordereau = ?', [id_bordereau], (erreur, res) => {
      // Traitement de l'erreur
      if (erreur) throw erreur
      // Finalisation de la supression
      traitement({
        statut: 'supression',
        user: id_bordereau
      })
    })
  }

  /* -------------------------------------------------------------------------------------------------------- */


  // Constructeur de la class
  constructor(dataUser)
  {
    // INITIALISATION DES DONNEES D'INSCRIPTION
    if (dataUser.statutConnexion === 'inscription')
    {
      // Création de l'utilisateur inscrit
      const resultat = this.addUser(dataUser.email, dataUser.statut, dataUser.droit_reservation, dataUser.niveau_tarif)
      // Initialisation locale des données de l'utilisateur courant
      if (resultat === 'inscrit')
      {
        this.email = dataUser.email
        this.statut = dataUser.statut
        this.droit_reservation = dataUser.droitReservation
        this.niveau_tarif = dataUser.niveauTarif
      }
    // INITIALISATION DES DONNEES DE CONNEXION
    }else if (dataUser.id != null)
    {
      // Initialisation locale des données de l'utilisateur courant
      this.id = dataUser.id
      this.email = dataUser.email
      this.statut = dataUser.statut
      this.droit_reservation = dataUser.droit_reservation
      this.niveau_tarif = dataUser.niveau_tarif
    }
  }
}

// Exportation de la class
module.exports = User