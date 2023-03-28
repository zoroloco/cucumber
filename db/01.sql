CREATE DATABASE IF NOT EXISTS `test`;

CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;