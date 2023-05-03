CREATE DATABASE IF NOT EXISTS `druidia`;

-- druidia.`user` definition

CREATE TABLE IF NOT EXISTS `user_profile` (
	id bigint unsigned auto_increment NOT NULL,
	firstName varchar(40) DEFAULT NULL,
  middleName varchar(40) DEFAULT NULL,
	lastName varchar(40) DEFAULT NULL,
	createdTime datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	createdBy varchar(32) CHARACTER SET utf8mb4 NOT NULL,
	modifiedTime datetime NULL,
	modifiedBy varchar(32) CHARACTER SET utf8mb4 NULL,
	inactivatedTime datetime NULL,
	inactivatedBy varchar(32) CHARACTER SET utf8mb4  NULL,
	profilePhotoPath varchar(64) NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id)
)
ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  username varchar(32) NOT NULL,
  password varchar(128) NOT NULL,
  lastLoginTime datetime DEFAULT NULL,
  userProfileId bigint unsigned NOT NULL,
  createdTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(32) NOT NULL,
  modifiedTime datetime DEFAULT NULL,
  modifiedBy varchar(32) DEFAULT NULL,
  inactivatedTime datetime DEFAULT NULL,
  inactivatedBy varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT user_profile_FK FOREIGN KEY (userProfileId) REFERENCES `user_profile`(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_association` (
	id bigint unsigned auto_increment NOT NULL,
	userId bigint unsigned NOT NULL,
	associateUserId bigint unsigned NOT NULL,
	createdTime datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	createdBy varchar(32) CHARACTER SET utf8mb4 NULL,
	modifiedTime datetime NULL,
	modifiedBy varchar(32) CHARACTER SET utf8mb4 NULL,
	inactivatedTime datetime NULL,
	inactivatedBy varchar(32) CHARACTER SET utf8mb4 NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (`id`),
  KEY `user_association_userId_IDX` (`userId`) USING BTREE,
  KEY `user_association_associateId_IDX` (`associateUserId`) USING BTREE,
  CONSTRAINT `user_association_userid_FK` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `user_association__associateuserid_FK` FOREIGN KEY (`associateUserId`) REFERENCES `user` (`id`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4