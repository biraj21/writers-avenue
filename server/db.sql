DROP DATABASE IF EXISTS `blogs`;

CREATE DATABASE `blogs`;

USE `blogs`;


-- blogs.`User` definition

CREATE TABLE `User` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(512) DEFAULT NULL,
  `avatarPath` varchar(255) NOT NULL,
  `authMethod` enum('email','google') NOT NULL DEFAULT 'email',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_UN` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- blogs.Post definition

CREATE TABLE `Post` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `body` text DEFAULT NULL,
  `coverPath` varchar(255) DEFAULT NULL,
  `category` enum('art','business','cinema','food','science','technology') DEFAULT NULL,
  `publishDate` datetime DEFAULT current_timestamp(),
  `editDate` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('pub','pvt','draft') NOT NULL DEFAULT 'pub',
  `userId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Post_FK` (`userId`),
  CONSTRAINT `Post_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- blogs.PostChanges definition

CREATE TABLE `PostChanges` (
  `title` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `coverPath` varchar(255) DEFAULT NULL,
  `category` enum('art','business','cinema','food','science','technology') DEFAULT NULL,
  `postId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  KEY `PostChange_Post_FK` (`postId`),
  KEY `PostChange_User_FK` (`userId`),
  CONSTRAINT `PostChange_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PostChange_User_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- blogs.Comment definition

CREATE TABLE `Comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `body` text NOT NULL,
  `postId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `Comment_Post_FK` (`postId`),
  KEY `Comment_User_FK` (`userId`),
  CONSTRAINT `Comment_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_User_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- blogs.`Like` definition

CREATE TABLE `Like` (
  `liked` tinyint(1) NOT NULL DEFAULT 1,
  `postId` int(10) unsigned NOT NULL,
  `userId` int(10) unsigned NOT NULL,
  KEY `Like_Post_FK` (`postId`),
  KEY `Like_FK` (`userId`),
  CONSTRAINT `Like_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Like_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;