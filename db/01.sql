CREATE DATABASE IF NOT EXISTS `druidia`;

-- druidia.`user` definition

CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(128) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `createdTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` varchar(32) NOT NULL,
  `modifiedTime` datetime DEFAULT NULL,
  `modifiedBy` varchar(32) DEFAULT NULL,
  `inactivatedTime` datetime DEFAULT NULL,
  `inactivatedBy` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userName` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;