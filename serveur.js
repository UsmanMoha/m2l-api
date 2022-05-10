// Importation des dépendances
const express = require ('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const jsPDF = require('jspdf')
// const var_dump = require('var_dump')

// Importation de la bdd et des objets
const User = require('./data/user.js')

// Importation des fonctions de traitements
const traitement = require('./fonctions.js')

// Importation de classes
const Admin = require('./data/admin.js')

// Création de l'application et du port
const app = express()
const port = 3000

// Conversion des données du corps transmis de POST en json
app.use(bodyParser.json())

// Point de rechargement : Test
app.get('/', (req, res) => {
  res.send('Mon test est réussi !')
})

app.get('/api/test', (req, res) => {
  console.log('Demande de test')
  res.send('Test réussi')
})

// Déclaration de la variable d'utilisateur courant
let currentUser

// VERIFICATION DES INFORMATIONS DE CONNEXION
app.post('/api/verif/users', (req, res) => {
  // Données de vérification
  let dataVerif = {
    id: null,
    statut: '',
    info: 'indisponible',
    userData: null
  }
  // Traitement des informations
  traitement.verifUser(resultat => {
    resultat.forEach(user => {
      if (user.email == req.body.mail && user.mdp == req.body.password)
      {
        // Récupération des idenfiants de connexion
        dataVerif.id = user.id_utilisateur
        dataVerif.statut = user.statut
        dataVerif.info = 'correct'
        // Initialisation des données utilisateurs
        let dataUser = {
          statutConnexion: 'connexion',
          id: user.id_utilisateur,
          email: user.email,
          statut: user.statut,
          droit_reservation: user.droit_reservation,
          niveau_tarif: user.niveau_tarif
        }
        // Création de l'objet utilisateur
        currentUser = new User(dataUser)
        switch (dataUser.statut)
        {
          case 'admin':
            currentUser = new Admin(dataUser)
            console.log('Administrateur connecté est à l\'id : ' + currentUser.getId())
            currentUser.selectAllUser(resultat => {
              // Stockage de la liste des utilisateurs
              dataVerif.userData = resultat
              // Réponse du serveur
              res.send(dataVerif)
            })
            break
          case 'adherent':
            currentUser = new User(dataUser)
            console.log('Adhérent connecté est à l\'id : ' + currentUser.getId())
            // Récupération de l'id de d'adhérent lié à sa ses fiches de frais
            currentUser.selectDataAdherent(currentUser.getId(), userData => {
              // Initialisation des données de l'adhérent
              dataVerif.adherentIdFicheFrais = userData.fiche[0].id_demandeur
              console.log(dataVerif.adherentIdFicheFrais)
              // Réponse du serveur
              res.send(dataVerif)
            })
            break
          case 'tresorier':
            // currentUser = new Admin(dataUser)
            console.log('Trésorier connecté est à l\'id : ' + currentUser.getId())
            // Réponse du serveur
            res.send(dataVerif)
            break
          default:
            // Réponse du serveur
            res.send(dataVerif)
            break
        }
      }else if (user.email == req.body.mail && user.mdp != req.body.password)
      {
        // Récupération des idenfiants de connexion
        dataVerif.info = 'incorrect'
        // Réponse du serveur
        res.send(dataVerif)
      }
    })
    // Redirection en cas d'absence en bdd
    if (dataVerif.info === 'indisponible')
    {
      res.send(dataVerif)
    }
  })
})

// SELECTION DES LIGUES
app.get('/api/select/ligues', (req, res) => {
  // Traitement des informations
  traitement.selectLigues(resultat => {
    // Réponse du serveur
    res.send({
      statut: 'disponible',
      ligues: resultat
    })
  })
})

// SELECTION DES MOTIFS
app.get('/api/select/motifs', (req, res) => {
  // Traitement des informations
  traitement.selectMotifs(resultat => {
    // Réponse du serveur
    res.send({
      statut: 'disponible',
      motif: resultat
    })
  })
})

/**
 * GESTION DES UTILISATEURS
 * CRUD User, Demandeur, Adhérent
*/

// LISTE DES UTILISATEURS
app.get('/api/select/users', (req, res)=>{
  // Récupération des informations
  currentUser.selectAllUser(userData => {
    res.send(userData)
  })
})

// DONNEES D'UN UTILISATEUR
app.get('/api/select/user/:id', (req, res)=>{
  // Récupération des informations
  const idUser = parseInt(req.params.id)
  // Traitement de la requête
  currentUser.selectDataUser(idUser, userData => {
    res.send(userData)
  })
})

// CREATION DE NOUVEL UTILISATEUR
app.post('/api/create/user', (req, res) => {
  console.log('Requête de création d\'utilisateur')
  // Enregistrement de l'utilisateur
  currentUser.addUser(req.body.email, req.body.mdp, req.body.statut, req.body.droitReservation, req.body.niveauTarif, (statut, id) => {
    // Vérification et retour du résultat
    if (statut == 'inscrit')
    {
      res.send({
        message: 'inscription',
        id: id
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// MISE A JOUR D'UN UTILISATEUR
app.post('/api/update/user', (req, res) => {
  console.log('Mise à jour d\'utilisateur')
  // Enregistrement de l'utilisateur
  currentUser.updateUser(req.body.id, req.body.email, req.body.statut, req.body.droitReservation, req.body.niveauTarif, (statut) => {
    // Vérification et retour du résultat
    if (statut == 'update')
    {
      res.send({
        message: 'update'
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// SUPRESSION D'UN UTILISATEUR
app.get('/api/delete/user/:id/:statut', (req, res)=>{
  // Récupération des informations
  const idUser = parseInt(req.params.id)
  // Traitement de la requête deleteAdherent
  if (req.params.statut == 'adherent' || req.params.statut == 'demandeur')
  {
    // Supression de l'adhérent ou du demandeur
    currentUser.deleteAdherent(idUser, userData => {
      res.send(userData)
    })
  } else
  {
    // Supression de l'administrateur ou du trésorier
    console.log('Supression autre')
    currentUser.deleteUser(idUser, userData => {
      res.send(userData)
    })
  }
})

// CREATION DE NOUVEL ADHERENT
app.post('/api/create/demandeur', (req, res) => {
  // Log de la création
  console.log('Requête de création d\'un adhérent')
  const dateInscription = new Date(req.body.dateNaissance).toISOString().slice(0, 19).replace('T', ' ')
  // Vérification du statut demandeur/adherent
  let statut = 'demandeur'
  if (req.body.estAdherent == 1)
  {
    statut = 'adherent'
  }
  // Enregistrement de l'utilisateur req.body.statut
  currentUser.addUser(req.body.email, req.body.mdp, statut, req.body.droitReservation, req.body.niveauTarif, (statut, id) => {
    if (statut == 'inscrit')
    {
      // Création du demandeur
      console.log('Requête de création du demandeur')
      currentUser.addDemandeur(req.body.nom, req.body.prenom, req.body.rue, req.body.cp, req.body.ville, req.body.numLicence, dateInscription, id, req.body.idLigue, req.body.estAdherent, validation => {
        // Vérification et retour du résultat
        if (validation == 'inscrit')
        {
          // Inscription valide
          res.send({message: 'inscription'})
        } else
        {
          // Echec de l'inscription de l'adhérent
          res.send({message: 'erreur demandeur'})
        }
      })
    } else
    {
      // Echec de l'inscription de l'utilisateur
      res.send({message: 'erreur utilisateur'})
    }
  })
})

// DONNEES D'UN ADHERENT
app.get('/api/select/data-adherent/:id', (req, res)=>{
  // Récupération des informations
  const idUser = parseInt(req.params.id)
  // Traitement de la requête
  currentUser.selectDataAdherent(idUser, userData => {
    res.send(userData)
  })
})

// LISTE DES ADHERENTS
app.get('/api/select/adherents', (req, res)=>{
  // Récupération des informations
  currentUser.selectAllAdherentBordereau(userData => {
    res.send(userData)
  })
})

/**
 * GESTION DES FICHES DE FRAIS
 * CRUD Fiche de frais
*/

/*/ LISTE DES FICHES DE FRAIS ADHERENT DU BORDEREAU
app.get('/api/select/bordereau', (req, res)=>{
  // Récupération des informations
  currentUser.selectBordereau(lignesFrais => {
    console.log(lignesFrais)
    res.send(lignesFrais)
  })
}) */

// LISTE DES FICHES DE FRAIS ADHERENT DU BORDEREAU
app.get('/api/select/bordereau/:idAdherent/:dateBordereau', (req, res)=>{
  // Récupération des variables
  const id_adherent = parseInt(req.params.idAdherent)
  const date_bordereau = new Date().toISOString().slice(0, 19).replace('T', ' ')
  // Récupération des informations
  currentUser.selectAllFicheFrais(id_adherent, date_bordereau, fichesData => {
    res.send(fichesData)
  })
})

// DONNEES D'UNE FICHE DE FRAIS SELECTIONNEE
app.get('/api/select/fiche-de-frais/:idAdherent/:id', (req, res)=>{
  // Récupération des informations
  const id_adherent = parseInt(req.params.idAdherent)
  const id_fiche_frais = parseInt(req.params.id)
  // Traitement de la requête
  // currentUser.selectFicheFrais(id_fiche_frais, id_adherent)
  // res.send(ficheData)
  currentUser.selectFicheFrais(id_fiche_frais, id_adherent, ficheData => {
    res.send(ficheData)
  })
})

// CREATION D'UNE FICHE DE FRAIS
app.post('/api/create/fiche-de-frais', (req, res) => {
  // Conversion de la date
  const date_fiche_frais = new Date(req.body.dateLigneFrais).toISOString().slice(0, 19).replace('T', ' ')
  // Enregistrement d'une fiche de frais
  currentUser.addFicheFrais(date_fiche_frais, req.body.trajet, req.body.km, req.body.kmValide, req.body.coutPeage, req.body.peageValide, req.body.peageJustificatif, req.body.coutRepas, req.body.repasValide, req.body.coutHebergement, req.body.hebergementValide, req.body.hebergementJustificatif, req.body.idMotif, req.body.idAdherent, (statut, id) => {
    // Vérification et retour du résultat
    if (statut == 'creation')
    {
      res.send({
        message: 'creation',
        id: id
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// MISE A JOUR D'UNE FICHE DE FRAIS
app.post('/api/update/fiche-de-frais', (req, res) => {
  console.log('Requête de mise à jour d\'une fiche de frais')
  // Conversion de la date
  const date_fiche_frais = new Date(req.body.dateLigneFrais).toISOString().slice(0, 19).replace('T', ' ')
  // Mise à jour req.body
  currentUser.updateFicheFrais(req.body.id, date_fiche_frais, req.body.trajet, req.body.km, req.body.kmValide, req.body.coutPeage, req.body.peageValide, req.bodyPeageJustificatif, req.body.coutRepas, req.body.repasValide, req.body.coutHebergement, req.body.hebergementValide, req.body.hebergementJustificatif, req.body.idMotif, (statut) => {
    // Vérification et retour du résultat
    if (statut == 'update')
    {
      res.send({
        message: 'update'
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// SUPRESSION D'UNE FICHE DE FRAIS
app.get('/api/delete/fiche-de-frais/:id', (req, res)=>{
  // Récupération des informations
  const id_fiche_frais = parseInt(req.params.id)
  // Traitement de la requête
  currentUser.deleteFicheFrais(id_fiche_frais, ficheData => {
    console.log('Données supprimées')
    res.send(ficheData)
  })
})

/**
 * GESTION DES BORDEREAUX
 * CRUD Bordereau
*/

// LISTE DES BORDEREAUX d'UNE ANNEE
app.get('/api/select/all-bordereau/:idDate', (req, res)=>{
  // Récupération des informations
  currentUser.selectAllBordereau(req.params.idDate, bordereauData => {
    res.send(bordereauData)
  })
})

// DONNEES D'UN BORDEREAU SELECTIONNEE
app.get('/api/select/bordereau-adherent/:idAdherent/:annee', (req, res)=>{
  // Récupération des informations
  const id_adherent = parseInt(req.params.idAdherent)
  const annee = parseInt(req.params.annee)
  // Traitement de la requête
  currentUser.selectBordereauData(id_adherent, annee, bordereauData => {
    res.send(bordereauData)
  })
})

// CREATION D'UN BORDEREAU
app.post('/api/create/bordereau', (req, res) => {
  console.log('Requête de création d\'un bordereau')
  // Enregistrement des données du nouveau bordereau
  currentUser.addBordereau(req.body.srcBordereau, req.body.idAdherent, req.body.valide, req.body.annee, (statut, id) => {
    // Vérification et retour du résultat
    if (statut == 'creation')
    {
      res.send({
        message: 'creation',
        id: id
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// MISE A JOUR DES DONNEES D'UN BORDEREAU
app.post('/api/update/bordereau', (req, res) => {
  console.log('Requête de mise à jour d\'une fiche de frais')
  // Mise à jour
  currentUser.updateBordereau(req.body.id, req.body.srcBordereau, req.body.valide, req.body.frais, (statut) => {
    // Vérification et notification
    if (statut == 'update')
    {
      res.send({
        message: 'update'
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// SUPRESSION D'UN BORDEREAU
app.get('/api/delete/bordereau/:id', (req, res)=>{
  // Récupération des informations
  const id_bordereau = parseInt(req.params.id)
  // Traitement de la requête
  currentUser.deleteBordereau(id_bordereau, userData => {
    res.send(userData)
  })
})

// AJOUT DE LA SOURCE DU DOCUMENT CERFA AU BORDEREAU
app.get('/api/get/cerfa/:id/:cerfa', (req, res) => {
  // Récupération des informations
  const idBordereau = parseInt(req.params.id)
  // Mise à jour
  currentUser.addDocCerfa(idBordereau, req.params.cerfa, (statut) => {
    // Vérification et retour du résultat
    if (statut == 'update')
    {
      res.send({
        message: 'update'
      })
    } else
    {
      res.send({message: 'erreur'})
    }
  })
})

// Lancement du serveur
app.listen(port, () => {
  console.log('Le serveur réagit sur l\'adresse : http://localhost:' + port)
})