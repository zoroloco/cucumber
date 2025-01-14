
-- delete a user
delete from user_role where userId = 2;
delete from user where id = 2;
delete from user_profile where id = (select userProfileId from user where id=2);