SET @@global.time_zone='+01:00';

DROP DATABASE IF EXISTS `db_matcha`;

CREATE DATABASE IF NOT EXISTS `db_matcha`;

USE `db_matcha`;

-- ------------------------------------------------------------------------------------ --
-- *********************************-- Users table --********************************** --
-- ------------------------------------------------------------------------------------ --

CREATE TABLE IF NOT EXISTS `users` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`firstname`				VARCHAR(255) NOT NULL,
	`lastname`				VARCHAR(255) NOT NULL,
	`email`					VARCHAR(255) NOT NULL,
	`username`				VARCHAR(10) NOT NULL,
	`password`				VARCHAR(255) NOT NULL,
	`gender`				VARCHAR(10) DEFAULT NULL,
	`bio`					VARCHAR(500) DEFAULT NULL,
	`looking`				VARCHAR(10) DEFAULT NULL,
	`birthday`				datetime DEFAULT NULL,
	`age`					INT DEFAULT NULL,
	`lat`					DOUBLE(11,8) DEFAULT NULL,
	`lag`					DOUBLE(11,8) DEFAULT NULL,
	`country`				VARCHAR(255) DEFAULT NULL,
	`city`					VARCHAR(255) DEFAULT NULL,
	`fame`					FLOAT(5,2) DEFAULT 0,
	`verified`				tinyint(1) DEFAULT 0,
	`status`				datetime DEFAULT CURRENT_TIMESTAMP,
	`reports`				INT(2) DEFAULT 0,
	`aToken`				VARCHAR(255) DEFAULT NULL,
	`rToken`				VARCHAR(255) DEFAULT NULL,
	`googleid`				VARCHAR(255) DEFAULT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP,
	`modifiedAt`			datetime DEFAULT NULL
);

-- ------------------------------------------------------------------------------------------ --
-- ***********************************-- Tags table --*************************************** --
-- ------------------------------------------------------------------------------------------ --

CREATE TABLE IF NOT EXISTS `tags` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`name`					VARCHAR(255) NOT NULL
);


-- ------------------------------------------------------------------------------------------ --
-- ********************************-- Users tags table --************************************ --
-- ------------------------------------------------------------------------------------------ --

CREATE TABLE IF NOT EXISTS `users_tags` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`tag_id`				INT NOT NULL,
	`user_id`				INT NOT NULL
);

-- ------------------------------------------------------------------------------------------ --
-- **********************************-- Images table --************************************** --
-- ------------------------------------------------------------------------------------------ --

CREATE TABLE IF NOT EXISTS `images` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`url`					VARCHAR(255) NOT NULL,
	`profile`				tinyint(1) DEFAULT 0,
	`user_id`				INT NOT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP
);


-- ---------------------------------------------------------------------------------------- --
-- **********************************-- Blockers table --********************************** --
-- ---------------------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS `blockers` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`blocker`				INT NOT NULL,
	`blocked`				INT NOT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP
);


-- ---------------------------------------------------------------------------------------- --
-- **********************************-- History table --*********************************** --
-- ---------------------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS `history` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`type`					VARCHAR(5),
	`visitor`				INT NOT NULL,
	`visited`				INT NOT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ck_type		CHECK ( type in ("like", "view") )
);

-- ---------------------------------------------------------------------------------------- --
-- **********************************-- Matchers table --********************************** --
-- ---------------------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS `matchers` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`matcher`				INT NOT NULL,
	`matched`				INT NOT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------------------- --
-- ************************************-- Chat table --************************************ --
-- ---------------------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS `chat` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`user_id1`				INT NOT NULL,
	`user_id2`				INT NOT NULL,
	`created_at`			datetime DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------------------- --
-- **********************************-- Messages table --********************************** --
-- ---------------------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS `messages` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`message`				VARCHAR(255) NOT NULL,
	`seen`					tinyint(1) DEFAULT 0,
	`user_id`				INT NOT NULL,
	`chat_id`				INT NOT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------------------- --
-- ********************************-- Notifications table --******************************* --
-- ---------------------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS `notifications` (
	`id`					INT PRIMARY KEY AUTO_INCREMENT,
	`content`				VARCHAR(255) NOT NULL,
	`seen`					tinyint(1) DEFAULT 0,
	`to_user`				INT NOT NULL,
	`from_user`				INT NOT NULL,
	`chat_id`				INT DEFAULT NULL,
	`createdAt`				datetime DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE `users`
ADD CONSTRAINT uk_email_username UNIQUE ( email, username );

ALTER TABLE `users_tags`
ADD CONSTRAINT fk_user_id FOREIGN KEY ( user_id ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_tag_id FOREIGN KEY ( tag_id ) REFERENCES tags( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `images`
ADD CONSTRAINT fk_imguser_id FOREIGN KEY ( user_id ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `blockers`
ADD CONSTRAINT fk_blocker_id FOREIGN KEY ( blocker ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_blocked_id FOREIGN KEY ( blocked ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `history`
ADD CONSTRAINT fk_visitor_id FOREIGN KEY ( visitor ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_visited_id FOREIGN KEY ( visited ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `matchers`
ADD CONSTRAINT fk_matcher_id FOREIGN KEY ( matcher ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_matched_id FOREIGN KEY ( matched ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `chat`
ADD CONSTRAINT fk_user1_id FOREIGN KEY ( user_id1 ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_user2_id FOREIGN KEY ( user_id2 ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `messages`
ADD CONSTRAINT fk_chat_id_chat FOREIGN KEY ( chat_id ) REFERENCES chat( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_user_id_chat FOREIGN KEY ( user_id ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `notifications`
ADD CONSTRAINT fk_touser_id FOREIGN KEY ( to_user ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_fromuser_id FOREIGN KEY ( from_user ) REFERENCES users( id ) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_chat_id_notif FOREIGN KEY ( chat_id ) REFERENCES chat( id ) ON DELETE CASCADE ON UPDATE CASCADE;

-- INSERT INITIAL TAGS
INSERT INTO `tags` ( name ) VALUES
( "match" ),
( "personal" ),
( "date" ),
( "gfriend" ),
( "bfriend" ),
( "dating" ),
( "single" ),
( "relationship" ),
( "meet" ),
( "onlinedating" ),
( "russiangirls" ),
( "speed dating" ),
( "romance" ),
( "realtalk" ),
( "datenight" ),
( "datingadvice" ),
( "datingcoach" ),
( "datingproblems" );

