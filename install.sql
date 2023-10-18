create table lucky_users (
	wallet varchar(20) primary key,
	email varchar(60),
	nickname varchar(60),
	is_email_verified bool
);
