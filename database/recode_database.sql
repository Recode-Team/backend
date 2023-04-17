-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.9.3-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- recode 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `recode` /*!40100 DEFAULT CHARACTER SET armscii8 COLLATE armscii8_bin */;
USE `recode`;

-- 테이블 recode.chatting 구조 내보내기
CREATE TABLE IF NOT EXISTS `chatting` (
  `catting_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(20) NOT NULL,
  `email` varchar(50) COLLATE armscii8_bin NOT NULL,
  `group_name` varchar(50) COLLATE armscii8_bin NOT NULL,
  `text` varchar(100) COLLATE armscii8_bin NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`catting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.chatting:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `chatting` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatting` ENABLE KEYS */;

-- 테이블 recode.group 구조 내보내기
CREATE TABLE IF NOT EXISTS `group` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(50) COLLATE armscii8_bin NOT NULL,
  `group_comment` varchar(50) COLLATE armscii8_bin NOT NULL,
  `creator` varchar(50) COLLATE armscii8_bin NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.group:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
/*!40000 ALTER TABLE `group` ENABLE KEYS */;

-- 테이블 recode.groupuser 구조 내보내기
CREATE TABLE IF NOT EXISTS `groupuser` (
  `group_id` int(20) NOT NULL,
  `email` varchar(50) COLLATE armscii8_bin NOT NULL COMMENT 'user-email',
  `name` varchar(50) COLLATE armscii8_bin NOT NULL COMMENT 'use group nickname',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`group_id`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.groupuser:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `groupuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupuser` ENABLE KEYS */;

-- 테이블 recode.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `email` varchar(50) COLLATE armscii8_bin NOT NULL,
  `password` varchar(200) COLLATE armscii8_bin NOT NULL,
  `name` varchar(50) COLLATE armscii8_bin NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.user:~3 rows (대략적) 내보내기
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT IGNORE INTO `user` (`email`, `password`, `name`, `created_at`, `updated_at`) VALUES
	('dfs@df.com', 'd0f05820661a920a9a71238f280861650d000cb52f11489ac394f8ba72e2c35c', 'DF', '2023-04-17 13:42:17', '2023-04-17 13:42:17'),
	('dfsfafwe@df.com', 'd0f05820661a920a9a71238f280861650d000cb52f11489ac394f8ba72e2c35c', 'DF', '2023-04-17 13:41:47', '2023-04-17 13:41:47'),
	('dfsfafwe@hkd.com', 'd0f05820661a920a9a71238f280861650d000cb52f11489ac394f8ba72e2c35c', 'DF', '2023-04-17 13:41:26', '2023-04-17 13:41:26');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
