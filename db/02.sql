-- DML to wipe all data
use druidia;

-- NOTE. Please clear out Redis cache too.

delete from chat_message;
delete from user_association;
delete from user_role;
delete from user_role_ref;
delete from chat_user;
delete from chat_message;
delete from chat;
delete from user;
delete from user_profile;
delete from user_role_ref_endpoint;

drop table if exists chat_message;
drop table if exists user_association;
drop table if exists user_chat;
drop table if exists user_role;
drop table if exists user_role_ref;
drop table if exists chat_user;
drop table if exists chat_message;
drop table if exists chat;
drop table if exists user;
drop table if exists user_profile;
drop table if exists user_role_ref_endpoint;