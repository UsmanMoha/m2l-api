CREATE DATABASE ppe3;
USE ppe3;
-- MySQL dump 10.13  Distrib 8.0.24, for Win64 (x86_64)
--
-- Host: localhost    Database: ppe3
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bordereau`
--

DROP TABLE IF EXISTS `bordereau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bordereau` (
  `id_bordereau` int NOT NULL AUTO_INCREMENT,
  `src_bordereau` varchar(300) DEFAULT NULL,
  `adherent_id` int NOT NULL,
  `valide` tinyint NOT NULL DEFAULT '0',
  `frais` float DEFAULT '0',
  `annee` int NOT NULL,
  `cerfa` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_bordereau`),
  KEY `cle_bordereau_adherent_idx` (`adherent_id`),
  CONSTRAINT `cle_bordereau_adherent` FOREIGN KEY (`adherent_id`) REFERENCES `demandeur` (`id_demandeur`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bordereau`
--

LOCK TABLES `bordereau` WRITE;
/*!40000 ALTER TABLE `bordereau` DISABLE KEYS */;
INSERT INTO `bordereau` VALUES (3,'bordereau_2022_1.pdf',1,0,46,2022,'document_cerfa_2022_1.pdf'),(4,'bordereau_2022_5.pdf',5,1,34,2022,'document_cerfa_2022_5.pdf');
/*!40000 ALTER TABLE `bordereau` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demandeur`
--

DROP TABLE IF EXISTS `demandeur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandeur` (
  `id_demandeur` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) DEFAULT NULL,
  `prenom` varchar(50) DEFAULT NULL,
  `rue` varchar(100) DEFAULT NULL,
  `cp` int DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `num_licence` int DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `id_utilisateur` int NOT NULL,
  `ligue_id` int NOT NULL,
  `estAdherent` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_demandeur`),
  UNIQUE KEY `id_utilisateur` (`id_utilisateur`),
  KEY `cle_adherent_ligue_idx` (`ligue_id`),
  CONSTRAINT `cle_adherent_ligue` FOREIGN KEY (`ligue_id`) REFERENCES `ligues` (`id_ligues`),
  CONSTRAINT `demandeur_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demandeur`
--

LOCK TABLES `demandeur` WRITE;
/*!40000 ALTER TABLE `demandeur` DISABLE KEYS */;
INSERT INTO `demandeur` VALUES (1,'JEAN','Pierre','Rue du chat',91049,'EVRY',123456789,NULL,15,1,1),(2,'YO','Marc','Rue du chien',911167,'Chateau',123456786,NULL,16,1,1),(4,'DERNIER','Mystere','10 Rue du mystère',47710,'Mystério',123456787,'2022-02-04',21,1,0),(5,'John','ho','129 Allée des Champs Elysées',911228,'Evry - Courcouronnes',123456789,'2022-03-03',23,1,1),(7,'Nouvel','Adherent','10 Rue du mystère',91049,'EVRY',123456789,'2022-03-30',25,2,1),(8,'John','Yo','10 Rue du mystère',91049,'EVRY',123456789,'2022-04-01',26,1,0),(9,'dodd','autre','129 Allée des Champs Elysées',91170,'Viry Châtillon - (91170)',123456789,'2022-04-02',27,2,0);
/*!40000 ALTER TABLE `demandeur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domaine`
--

DROP TABLE IF EXISTS `domaine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domaine` (
  `id_domaine` int NOT NULL,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_domaine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domaine`
--

LOCK TABLES `domaine` WRITE;
/*!40000 ALTER TABLE `domaine` DISABLE KEYS */;
/*!40000 ALTER TABLE `domaine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_frais`
--

DROP TABLE IF EXISTS `ligne_frais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_frais` (
  `id_ligne_frais` int NOT NULL AUTO_INCREMENT,
  `date_ligne_frais` date NOT NULL,
  `trajet` varchar(100) NOT NULL,
  `km` float NOT NULL,
  `km_valide` int NOT NULL,
  `cout_peage` float DEFAULT NULL,
  `peage_valide` int DEFAULT NULL,
  `peage_justificatif` varchar(200) DEFAULT NULL,
  `cout_repas` float DEFAULT NULL,
  `repas_valide` int DEFAULT NULL,
  `repas_justificatif` varchar(200) DEFAULT NULL,
  `cout_hebergement` float DEFAULT NULL,
  `hebergement_valide` int DEFAULT NULL,
  `hebergement_justificatif` varchar(200) DEFAULT NULL,
  `id_motif` int NOT NULL,
  `id_adherent` int NOT NULL,
  PRIMARY KEY (`id_ligne_frais`),
  KEY `id_motif` (`id_motif`),
  KEY `cle_adherent_ligne_frais_idx` (`id_adherent`),
  CONSTRAINT `cle_adherent_ligne_frais` FOREIGN KEY (`id_adherent`) REFERENCES `demandeur` (`id_demandeur`),
  CONSTRAINT `ligne_frais_ibfk_1` FOREIGN KEY (`id_motif`) REFERENCES `motif` (`id_motif`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_frais`
--

LOCK TABLES `ligne_frais` WRITE;
/*!40000 ALTER TABLE `ligne_frais` DISABLE KEYS */;
INSERT INTO `ligne_frais` VALUES (19,'2022-03-21','Paris - Lyon',34,2,12,3,NULL,0,0,NULL,0,0,NULL,2,2),(21,'2022-03-01','Evry - Créteil',27,2,0,0,'',7,2,NULL,0,0,'',5,1),(22,'2021-12-30','Ivry-Sur-Seine - Grigny',32,1,0,0,'',9,1,NULL,0,0,'',2,1),(25,'2022-03-01','Nice - Draveil',100,1,0,0,'',3,2,NULL,0,0,'',3,5);
/*!40000 ALTER TABLE `ligne_frais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligues`
--

DROP TABLE IF EXISTS `ligues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligues` (
  `id_ligues` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `sigle` varchar(50) NOT NULL,
  `president` varchar(100) NOT NULL,
  `reservation_an_hors_amphi` int NOT NULL,
  `reservation_amphi` tinyint(1) NOT NULL,
  `reservation_convivialite` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_ligues`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligues`
--

LOCK TABLES `ligues` WRITE;
/*!40000 ALTER TABLE `ligues` DISABLE KEYS */;
INSERT INTO `ligues` VALUES (1,'Ligue des champions','CHAMPIONS LEAGUE','Président 1',0,0,0),(2,'Ligue 1','LIGUE 1','Président 2',0,0,0);
/*!40000 ALTER TABLE `ligues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `motif`
--

DROP TABLE IF EXISTS `motif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `motif` (
  `id_motif` int NOT NULL,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id_motif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `motif`
--

LOCK TABLES `motif` WRITE;
/*!40000 ALTER TABLE `motif` DISABLE KEYS */;
INSERT INTO `motif` VALUES (1,'Réunion'),(2,'Compétition régionale'),(3,'Compétition nationale'),(4,'Compétition internationale'),(5,'Stage');
/*!40000 ALTER TABLE `motif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `breve_description` varchar(100) NOT NULL,
  `description_complete` varchar(500) NOT NULL,
  `etat_confirmation` varchar(50) NOT NULL,
  `date_heure_debut` datetime NOT NULL,
  `date_heure_update` datetime NOT NULL,
  `date_heure_fin` datetime NOT NULL,
  `id_utilisateur` int NOT NULL,
  `id_tarif_reservation` int NOT NULL,
  `id_salle` int NOT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `id_tarif_reservation` (`id_tarif_reservation`),
  KEY `id_salle` (`id_salle`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`id_tarif_reservation`) REFERENCES `tarif_reservation` (`id_tarif_reservation`),
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`id_salle`) REFERENCES `salle` (`id_salle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salle`
--

DROP TABLE IF EXISTS `salle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salle` (
  `id_salle` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `capacite` varchar(50) DEFAULT NULL,
  `id_domaine` int NOT NULL,
  PRIMARY KEY (`id_salle`),
  KEY `id_domaine` (`id_domaine`),
  CONSTRAINT `salle_ibfk_1` FOREIGN KEY (`id_domaine`) REFERENCES `domaine` (`id_domaine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle`
--

LOCK TABLES `salle` WRITE;
/*!40000 ALTER TABLE `salle` DISABLE KEYS */;
/*!40000 ALTER TABLE `salle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarif_reservation`
--

DROP TABLE IF EXISTS `tarif_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarif_reservation` (
  `id_tarif_reservation` int NOT NULL AUTO_INCREMENT,
  `tarif` double NOT NULL,
  PRIMARY KEY (`id_tarif_reservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarif_reservation`
--

LOCK TABLES `tarif_reservation` WRITE;
/*!40000 ALTER TABLE `tarif_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `tarif_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id_utilisateur` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `statut` varchar(50) NOT NULL,
  `droitReservation` tinyint NOT NULL,
  `niveauTarif` int NOT NULL,
  PRIMARY KEY (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'moi@gmail.com','moi','admin',1,0),(2,'jean@gmail.com','jean','tresorier',0,1),(3,'luc@gmail.com','luc','tresorier',1,1),(15,'pierre@gmail.com','pierre','adherent',1,1),(16,'marc@gmail.com','marc','adherent',1,3),(17,'monsieur@gmail.com','monsieur','admin',1,4),(21,'mystere@gmail.com','mystere','demandeur',1,4),(22,'salut@gmail.com','salut','tresorier',1,3),(23,'ho@yahoo.fr','ho','adherent',0,3),(25,'adherent@gmail.com','adhrent','adherent',0,3),(26,'yo@gmail.com','yo','demandeur',0,3),(27,'jharold613@gmail.com','autre','demandeur',0,3);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-08 14:29:21
