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
  `email` varchar(50) COLLATE armscii8_bin NOT NULL,
  `group_id` int(20) NOT NULL,
  `nickname` varchar(50) COLLATE armscii8_bin NOT NULL,
  `text` varchar(100) COLLATE armscii8_bin DEFAULT NULL,
  KEY `FK_chatting_user` (`email`),
  CONSTRAINT `FK_chatting_user` FOREIGN KEY (`email`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.chatting:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `chatting` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatting` ENABLE KEYS */;

-- 테이블 recode.group 구조 내보내기
CREATE TABLE IF NOT EXISTS `group` (
  `email` varchar(50) COLLATE armscii8_bin NOT NULL,
  `group_id` int(20) NOT NULL,
  `group` varchar(50) COLLATE armscii8_bin NOT NULL,
  `nickname` varchar(50) COLLATE armscii8_bin DEFAULT NULL,
  `doc` varchar(50) COLLATE armscii8_bin DEFAULT NULL,
  `setting` int(11) NOT NULL COMMENT '해당 10진수를 2진수로 변환해서 설정 0과 1로 할당',
  KEY `FK__user` (`email`),
  CONSTRAINT `FK__user` FOREIGN KEY (`email`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.group:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
/*!40000 ALTER TABLE `group` ENABLE KEYS */;

-- 테이블 recode.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `email` varchar(50) COLLATE armscii8_bin NOT NULL,
  `password` varchar(50) COLLATE armscii8_bin NOT NULL,
  `name` varchar(50) COLLATE armscii8_bin NOT NULL,
  `setting` int(11) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- 테이블 데이터 recode.user:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
