-- DML

insert into user_role_ref (roleName,roleLabel,roleDescription,createdTime,createdBy)
values
("ROLE_ADMIN","Admin", "Can do whatevs.", CURRENT_TIMESTAMP,"druidia"),
("ROLE_NOOB", "Noob", "Can't do shit.", CURRENT_TIMESTAMP, "druidia"),
("ROLE_USER_ADMIN", "User Admin", "Can manipulate user settings.", CURRENT_TIMESTAMP,"druidia"),
("ROLE_CHAT", "Chat User", "Can access the chat-related pages.", CURRENT_TIMESTAMP,"druidia");