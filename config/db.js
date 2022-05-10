// Importation de la dépendance mysql
const mysql = require('mysql')

// Initialisation de la connexion
const connexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Usman91*',
    database: 'ppe3'
})

// Lancement de la connexion
connexion.connect()

// Exportation de la connexion
module.exports = connexion
