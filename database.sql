-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.4.14-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- nagongfinance 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `nagongfinance` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `nagongfinance`;

-- 테이블 nagongfinance.account 구조 내보내기
CREATE TABLE IF NOT EXISTS `account` (
  `unqnum` int(11) NOT NULL AUTO_INCREMENT,
  `id` char(50) DEFAULT NULL,
  `name` char(50) DEFAULT NULL,
  `star` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`star`)),
  `default_finance` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '["032640.KS", "000660.KS", "005930.KS", "096040.KQ", "004140.KS", "035720.KS", "208640.KQ", "093230.KS", "053030.KQ", "105560.KS"]',
  `view` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`unqnum`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- 테이블 데이터 nagongfinance.account:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` (`unqnum`, `id`, `name`, `star`, `default_finance`, `view`) VALUES
	(1, '01040389960', '오명훈', NULL, '["032640.KS", "000660.KS", "005930.KS", "096040.KQ", "004140.KS", "035720.KS", "208640.KQ", "093230.KS", "053030.KQ", "105560.KS"]', NULL),
	(2, '01098780523', '김미정', NULL, '["032640.KS", "000660.KS", "005930.KS", "096040.KQ", "004140.KS", "035720.KS", "208640.KQ", "093230.KS", "053030.KQ", "105560.KS"]', NULL),
	(3, '01039349960', '오장석', NULL, '["032640.KS", "000660.KS", "005930.KS", "096040.KQ", "004140.KS", "035720.KS", "208640.KQ", "093230.KS", "053030.KQ", "105560.KS"]', NULL),
	(4, '01023992128', '오현승', NULL, '["032640.KS", "000660.KS", "005930.KS", "096040.KQ", "004140.KS", "035720.KS", "208640.KQ", "093230.KS", "053030.KQ", "105560.KS"]', NULL);
/*!40000 ALTER TABLE `account` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
