-- DML

insert into user_role_ref (roleName,roleLabel,roleDescription,createdTime,createdBy)
values
("ROLE_ADMIN","Admin", "Can do whatevs.", CURRENT_TIMESTAMP,0),
("ROLE_NOOB", "Noob", "Can't do shit.", CURRENT_TIMESTAMP, 0),
("ROLE_USER_ADMIN", "User Admin", "Can manipulate user settings.", CURRENT_TIMESTAMP,0),
("ROLE_USER_VERIFIED", "Verified", "Can access the site.", CURRENT_TIMESTAMP,0);

insert into user_role_ref_endpoint(userRoleRefId,endPoint,createdTime,createdBy)
values
((select id from user_role_ref where roleName='ROLE_NOOB'), '/validate-token', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_NOOB'), '/find-user-role-refs-for-user', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_ADMIN'), '/find-all-cached-user-role-refs', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_ADMIN'), '/find-all-cached-user-role-ref-endpoints', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_USER_ADMIN'), '/find-all-user-roles-heavy-by-search-params', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_USER_ADMIN'), '/create-user-role', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_USER_ADMIN'), '/remove-user-role', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_NOOB'), '/find-user-profile-photo-for-user', CURRENT_TIMESTAMP, 0),
((select id from user_role_ref where roleName='ROLE_USER_VERIFIED'), '/find-teams', CURRENT_TIMESTAMP, 0);

-- give yourself all user roles. replace 2 with your user id
insert into user_role(userId,createdTime,createdBy,userRoleRefId)
values 
(1,CURRENT_TIMESTAMP,1, (select id from user_role_ref where roleName='ROLE_ADMIN')),
(1,CURRENT_TIMESTAMP,1, (select id from user_role_ref where roleName='ROLE_USER_ADMIN')),
(1,CURRENT_TIMESTAMP,1, (select id from user_role_ref where roleName='ROLE_USER_VERIFIED'));