-- DDL

CREATE DATABASE IF NOT EXISTS `druidia`;

CREATE TABLE IF NOT EXISTS `user_profile` (
	id bigint unsigned auto_increment NOT NULL,
	firstName varchar(40) DEFAULT NULL,
    middleName varchar(40) DEFAULT NULL,
	lastName varchar(40) DEFAULT NULL,
	createdTime datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	createdBy bigint unsigned NOT NULL,
	modifiedTime datetime NULL,
	modifiedBy bigint unsigned DEFAULT NULL,
	inactivatedTime datetime NULL,
	inactivatedBy bigint unsigned DEFAULT NULL,
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
  createdBy bigint unsigned NOT NULL,
  modifiedTime datetime DEFAULT NULL,
  modifiedBy bigint unsigned DEFAULT NULL,
  inactivatedTime datetime DEFAULT NULL,
  inactivatedBy bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT user_profile_FK FOREIGN KEY (userProfileId) REFERENCES `user_profile`(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_role_ref` (
	id bigint unsigned auto_increment NOT NULL,
	roleName varchar(32) CHARACTER SET utf8mb4 NOT NULL,
	roleLabel varchar(32) CHARACTER SET utf8mb4 NOT NULL,
	roleDescription varchar(128) CHARACTER SET utf8mb4 NULL,
	createdTime datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	createdBy bigint unsigned NOT NULL,
	modifiedTime datetime NULL,
	modifiedBy bigint unsigned DEFAULT NULL,
	inactivatedTime datetime NULL,
	inactivatedBy bigint unsigned DEFAULT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_role` (
	id bigint unsigned auto_increment NOT NULL,
	userId bigint unsigned NOT NULL,
	userRoleRefId bigint unsigned NOT NULL,
	createdTime datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	createdBy bigint unsigned NOT NULL,
	modifiedTime datetime NULL,
	modifiedBy bigint unsigned DEFAULT NULL,
	inactivatedTime datetime NULL,
	inactivatedBy bigint unsigned DEFAULT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	KEY `user_role_userid_FK` (`userId`),
	KEY `user_role_userrolerefid_FK` (`userRoleRefId`),
	CONSTRAINT `user_role_userid_FK` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
	CONSTRAINT `user_role_userrolerefid_FK` FOREIGN KEY (`userRoleRefId`) REFERENCES `user_role_ref` (`id`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_role_ref_endpoint` (
	id bigint unsigned auto_increment NOT NULL,
	userRoleRefId bigint unsigned NOT NULL,
	endpoint varchar(128) NOT NULL,
	createdTime datetime DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	createdBy bigint unsigned NOT NULL,
	modifiedTime datetime NULL,
	modifiedBy bigint unsigned DEFAULT NULL,
	inactivatedTime datetime NULL,
	inactivatedBy bigint unsigned DEFAULT NULL,
	CONSTRAINT `PRIMARY` PRIMARY KEY (id),
	KEY `user_role_ref_endpoint_roleid_FK` (`userRoleRefId`),
	CONSTRAINT `user_role_ref_endpoint_roleid_FK` FOREIGN KEY (`userRoleRefId`) REFERENCES `user_role_ref` (`id`)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;