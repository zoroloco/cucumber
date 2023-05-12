-- DML

insert into user_role_ref (roleName,roleDescription,createdTime,createdBy)
values
("GOD", "Can do whatevs.", CURRENT_TIMESTAMP,"druidia"),
("USER_ADMIN", "Can manipulate user settings.", CURRENT_TIMESTAMP,"druidia"),
("VERIFIED", "A user that has been verified to use more private features of the site.", CURRENT_TIMESTAMP,"druidia");