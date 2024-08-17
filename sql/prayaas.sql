CREATE DATABASE  IF NOT EXISTS `prayaas` ;
USE `prayaas`;


DROP TABLE IF EXISTS `devent`;

CREATE TABLE `devent` (
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `proposal` varchar(500) NOT NULL,
  PRIMARY KEY (`email`)
) ;

LOCK TABLES `devent` WRITE;

INSERT INTO `devent` VALUES ('Saikat SadhuKhan','iit2021261@iiita.ac.in','kjbjhbjh'),('Shubhendra Gautam','iit202142@iiita.ac.in','Food serving');

UNLOCK TABLES;



DROP TABLE IF EXISTS `event`;

CREATE TABLE `event` (
  `date` varchar(30) NOT NULL,
  `time` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `loc` varchar(30) NOT NULL,
  `descr` varchar(500) NOT NULL,
  PRIMARY KEY (`date`)
);

LOCK TABLES `event` WRITE;

INSERT INTO `event` VALUES ('26 April 2023','8 am to 10 am','voiceup','IIITA Jhalwa','ishfkahfuhiulshyfiulyaiuyfiulyiusfhkjh'),('28 April 2023','8 am to 10 am','voiceup','IIITA Jhalwa','ishfkahfuhiulshyfiulyaiuyfiulyiusfhkjh'),('29 April 2023','8 am to 10 am','voiceup','IIITA Jhalwa','ishfkahfuhiulshyfiulyaiuyfiulyiusfhkjh'),('32 April 2023','9:30 to 10:30','Donation Drive','AAA section','We got selected in GFG');

UNLOCK TABLES;

DROP TABLE IF EXISTS `gallery`;

CREATE TABLE `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` longblob NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ;




DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ;


LOCK TABLES `sessions` WRITE;

UNLOCK TABLES;



DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
  `username` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(80) NOT NULL,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`email`)
) ;

LOCK TABLES `student` WRITE;

INSERT INTO `student` VALUES ('Hemant','iit2021220@iiita.ac.in','$2a$08$3M2q0tqLubsMd71O3Bf2VuSDr/34RIHwY/H.OPKY0rwYuaJLeW7FO','member'),('Shubham','iit202142@iiita.ac.in','$2a$08$3BDWOAw7fJIBU1BIe2Xg/eozznx1BISPmx99Py8SgJHf9yxejSJi.','coordinator'),('ram','rav@iiita.ac.in','$2a$08$dyKCkdnmPQ164URyb9vtuud.XUZYjRa9RRbH7zzCvdGV7K9BvH/sa','coordinator');

UNLOCK TABLES;



DROP TABLE IF EXISTS `testimonial`;

CREATE TABLE `testimonial` (
  `name` varchar(30) NOT NULL,
  `profession` varchar(30) NOT NULL,
  `testimonial` varchar(500) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ;

LOCK TABLES `testimonial` WRITE;

INSERT INTO `testimonial` VALUES ('Chandan','GATE CSE','hello everyone','chan@gmail.com'),('Chandan Kumar','Googler','May God bless everyone','chandan@gmail.com'),('Luv Kumar','Youtuber','This is one of the best service anyone can provide to society','luv@gmail.com'),('Shubham Panda','ML Expert','I want to thank everyone who started Prayaas','panda@gmail.com'),('Rajesh','IAS','I love my India','rajesh@gmail.com'),('Saikat SadhuKhan','GATE CSE','I was very happy and pleases to serve our nation','saikat@gmail.com');

UNLOCK TABLES;

