-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 25, 2022 at 03:11 PM
-- Server version: 8.0.27
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kannur`
--

-- --------------------------------------------------------

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `manager_id` int DEFAULT NULL,
  `manager_type` int DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `area`
--

INSERT INTO `area` (`id`, `name`, `id_number`, `manager_id`, `manager_type`, `deleted`, `created_on`, `modified_on`, `address`, `mobile`, `created_by`, `modified_by`) VALUES
(1, 'Kannur', 'KNR', 1, 1, 0, 1652081609, 1653069881, 'NA', '', NULL, NULL),
(2, 'Thalasery', 'THA', 1, 1, 0, 1652213786, 0, 'NA', '', NULL, NULL),
(3, 'Mottamal', 'MOT', 1, 1, 0, 1652213827, 1652387890, 'NA', '', NULL, NULL),
(4, 'Irutty', 'IRT', NULL, NULL, 0, 1652215204, 0, NULL, NULL, NULL, NULL),
(5, 'Loppal', 'LOK', NULL, NULL, 0, 1654238623, 1654276797, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `area_payout`
--

DROP TABLE IF EXISTS `area_payout`;
CREATE TABLE IF NOT EXISTS `area_payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `area_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `cheque_id` int NOT NULL,
  `created_by` int NOT NULL DEFAULT '0',
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
CREATE TABLE IF NOT EXISTS `bank` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `account_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ifsc_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `branch` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`id`, `name`, `account_number`, `ifsc_code`, `branch`, `details`, `created_on`, `modified_on`, `deleted`, `created_by`, `modified_by`) VALUES
(1, 'SBI', '123123123', NULL, 'KANNUR', NULL, 1653591081, 1653591314, 0, NULL, NULL),
(2, 'IFC', '123123123', '123123sdc', 'KANNUR', ' remark', 1654277922, 1654279299, 0, NULL, NULL),
(3, 'HDFC', '123412018510', NULL, NULL, NULL, 1654279523, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bank_transaction`
--

DROP TABLE IF EXISTS `bank_transaction`;
CREATE TABLE IF NOT EXISTS `bank_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `action` int NOT NULL,
  `bank_id` int NOT NULL,
  `transaction_date` int NOT NULL,
  `remark` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bank_transaction`
--

INSERT INTO `bank_transaction` (`id`, `amount`, `action`, `bank_id`, `transaction_date`, `remark`, `created_on`, `modified_on`, `deleted`, `created_by`, `modified_by`) VALUES
(1, 100, 1, 1, 0, NULL, 1653593642, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `business`
--

DROP TABLE IF EXISTS `business`;
CREATE TABLE IF NOT EXISTS `business` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `latitude` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `longitude` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `gst_number` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `registration_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `member_id` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `business`
--

INSERT INTO `business` (`id`, `name`, `mobile`, `address`, `latitude`, `longitude`, `description`, `gst_number`, `registration_number`, `member_id`, `created_on`, `modified_on`, `created_by`, `modified_by`) VALUES
(7, 'Chicken Stall', '9284736161', 'Kannur', NULL, NULL, '', NULL, NULL, 8, 1652215364, 0, NULL, NULL),
(6, 'Chicken Stall', '9284736163', 'Kannur', NULL, NULL, '', NULL, NULL, 7, 1652103267, 0, NULL, NULL),
(35, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 6, 1656152130, 0, 1, NULL),
(4, 'Chicken Stall', '9284736163', 'Kannur', NULL, NULL, '', NULL, NULL, 5, 1652083234, 0, NULL, NULL),
(8, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 19, 1654109035, 0, NULL, NULL),
(9, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 20, 1654109065, 0, NULL, NULL),
(10, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 21, 1654109102, 0, NULL, NULL),
(11, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 22, 1654109293, 0, NULL, NULL),
(12, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 23, 1654109377, 0, NULL, NULL),
(13, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 24, 1654109395, 0, NULL, NULL),
(14, 'New Bazar', '0', NULL, NULL, NULL, 'shopping', NULL, NULL, 25, 1654109532, 0, NULL, NULL),
(15, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 28, 1654109896, 0, NULL, NULL),
(16, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 29, 1654109955, 0, NULL, NULL),
(17, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 30, 1654109983, 0, NULL, NULL),
(18, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 31, 1654110032, 0, NULL, NULL),
(19, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 32, 1654110211, 0, NULL, NULL),
(20, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 36, 1654110616, 0, NULL, NULL),
(21, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 37, 1654110698, 0, NULL, NULL),
(22, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 38, 1654110729, 0, NULL, NULL),
(23, 'New Bazar', '9032435434', NULL, NULL, NULL, 'shopping', NULL, NULL, 39, 1654110830, 0, NULL, NULL),
(24, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 40, 1655835985, 0, NULL, NULL),
(25, 'Tea Shope', '8889991521', 'Kannure', NULL, NULL, '', NULL, NULL, 41, 1655836110, 0, NULL, NULL),
(26, 'Tea Shope', '8889991521', 'Kannure', NULL, NULL, 'e', NULL, NULL, 0, 0, 0, NULL, NULL),
(27, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(28, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(29, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(30, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(31, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(32, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(33, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL),
(34, 'Tea Shop', '8889991526', 'Kannur', NULL, NULL, '', NULL, NULL, 0, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `charity`
--

DROP TABLE IF EXISTS `charity`;
CREATE TABLE IF NOT EXISTS `charity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `credit_debit` int NOT NULL DEFAULT '0',
  `member_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cheque`
--

DROP TABLE IF EXISTS `cheque`;
CREATE TABLE IF NOT EXISTS `cheque` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reciever_name` int NOT NULL,
  `number` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `amount` float NOT NULL,
  `cheque_date` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `bank_id` int NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collection`
--

DROP TABLE IF EXISTS `collection`;
CREATE TABLE IF NOT EXISTS `collection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dead_member_id` int NOT NULL,
  `member_id` int NOT NULL,
  `collector_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `amount_id` int NOT NULL,
  `paid` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `collection`
--

INSERT INTO `collection` (`id`, `dead_member_id`, `member_id`, `collector_id`, `created_on`, `modified_on`, `deleted`, `amount_id`, `paid`, `created_by`, `modified_by`) VALUES
(1, 1, 1, 1, 0, 0, 0, 1, 1, NULL, NULL),
(2, 1, 1, 1, 0, 0, 0, 2, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `collection_amount`
--

DROP TABLE IF EXISTS `collection_amount`;
CREATE TABLE IF NOT EXISTS `collection_amount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `collection_amount`
--

INSERT INTO `collection_amount` (`id`, `amount`, `created_on`, `deleted`, `deleted_on`, `created_by`, `modified_by`) VALUES
(1, 100, 0, 1, 0, NULL, NULL),
(2, 120, 0, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `collection_partition`
--

DROP TABLE IF EXISTS `collection_partition`;
CREATE TABLE IF NOT EXISTS `collection_partition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `type_id` int NOT NULL,
  `dead_member_id` int NOT NULL,
  `amount` float NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `created_by` int NOT NULL DEFAULT '0',
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collector`
--

DROP TABLE IF EXISTS `collector`;
CREATE TABLE IF NOT EXISTS `collector` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `middle_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `area_id` int NOT NULL DEFAULT '0',
  `unit_id` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL,
  `designation` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `modified_on` int NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `collector`
--

INSERT INTO `collector` (`id`, `first_name`, `middle_name`, `last_name`, `mobile`, `address`, `aadhar`, `area_id`, `unit_id`, `created_on`, `designation`, `details`, `modified_on`, `created_by`, `modified_by`) VALUES
(1, 'momus', '123', 'momus', '9876543211', 'kannur', '62528461938', 1, 1, 1653071395, '0', NULL, 0, NULL, NULL),
(2, 'pokkan', NULL, NULL, '9876212348', 'asd', '123234435678', 5, 4, 1654277696, NULL, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `collector_payout`
--

DROP TABLE IF EXISTS `collector_payout`;
CREATE TABLE IF NOT EXISTS `collector_payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `collector_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `cheque_id` int NOT NULL,
  `created_by` int NOT NULL DEFAULT '0',
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commition`
--

DROP TABLE IF EXISTS `commition`;
CREATE TABLE IF NOT EXISTS `commition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dead_member_id` int NOT NULL,
  `collector_id` int NOT NULL,
  `collector_type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `percentage` float NOT NULL,
  `amount_given` float NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `death`
--

DROP TABLE IF EXISTS `death`;
CREATE TABLE IF NOT EXISTS `death` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `datetime` int NOT NULL,
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `venue` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `last_date` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
CREATE TABLE IF NOT EXISTS `designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `director_board`
--

DROP TABLE IF EXISTS `director_board`;
CREATE TABLE IF NOT EXISTS `director_board` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL DEFAULT '0',
  `member_type` int NOT NULL DEFAULT '0',
  `designation` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `district_payout`
--

DROP TABLE IF EXISTS `district_payout`;
CREATE TABLE IF NOT EXISTS `district_payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `district_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `cheque_id` int NOT NULL,
  `created_by` int NOT NULL DEFAULT '0',
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `manager_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `manager_aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `manager_mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `event_date` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_payout`
--

DROP TABLE IF EXISTS `event_payout`;
CREATE TABLE IF NOT EXISTS `event_payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_amount` float NOT NULL DEFAULT '0',
  `amount_given` float NOT NULL,
  `payout_date` int NOT NULL DEFAULT '0',
  `bill_details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `cheque_id` int NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `external_entity`
--

DROP TABLE IF EXISTS `external_entity`;
CREATE TABLE IF NOT EXISTS `external_entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `external_entity`
--

INSERT INTO `external_entity` (`id`, `full_name`, `aadhar`, `type`, `created_on`, `modified_on`, `deleted`, `created_by`, `modified_by`) VALUES
(1, 'Loot', NULL, 'barbershop', 1654627455, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `external_member`
--

DROP TABLE IF EXISTS `external_member`;
CREATE TABLE IF NOT EXISTS `external_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `middle_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `area_id` int NOT NULL DEFAULT '0',
  `unit_id` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL,
  `active` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0',
  `in_active_reason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `designation` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `modified_on` int NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
CREATE TABLE IF NOT EXISTS `family` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `relation` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `member_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `family`
--

INSERT INTO `family` (`id`, `full_name`, `aadhar`, `relation`, `mobile`, `member_id`, `created_on`, `modified_on`, `created_by`, `modified_by`) VALUES
(2, 'Rajivan', '', 'Father', '', 5, 1652083234, 0, NULL, NULL),
(35, 'Ramani', '', 'Mother', '', 6, 1656152130, 0, 1, NULL),
(5, 'Rajivan', '', 'Father', '', 7, 1652103267, 0, NULL, NULL),
(6, 'Kannan', '', 'Son', '', 8, 1652103267, 0, NULL, NULL),
(7, 'Rajivan', '989898989898', 'Daughter', '', 8, 1652215364, 0, NULL, NULL),
(8, NULL, NULL, NULL, '0', 9, 1654107992, 0, NULL, NULL),
(9, NULL, NULL, '0', '0', 10, 1654108165, 0, NULL, NULL),
(10, NULL, NULL, '0', '0', 11, 1654108437, 0, NULL, NULL),
(11, NULL, NULL, '0', '0', 12, 1654108478, 0, NULL, NULL),
(12, NULL, NULL, '0', '0', 13, 1654108497, 0, NULL, NULL),
(13, NULL, NULL, '0', '0', 14, 1654108554, 0, NULL, NULL),
(14, NULL, NULL, '0', NULL, 15, 1654108621, 0, NULL, NULL),
(15, NULL, NULL, '0', NULL, 17, 1654108718, 0, NULL, NULL),
(16, NULL, NULL, '0', NULL, 18, 1654108747, 0, NULL, NULL),
(17, NULL, NULL, '0', '0', 19, 1654109035, 0, NULL, NULL),
(18, NULL, NULL, '0', '0', 20, 1654109065, 0, NULL, NULL),
(19, NULL, NULL, '0', '0', 21, 1654109102, 0, NULL, NULL),
(20, NULL, NULL, '0', '0', 22, 1654109293, 0, NULL, NULL),
(21, NULL, NULL, NULL, '0', 23, 1654109377, 0, NULL, NULL),
(22, NULL, NULL, NULL, '0', 24, 1654109395, 0, NULL, NULL),
(23, NULL, NULL, NULL, '0', 29, 1654109955, 0, NULL, NULL),
(24, NULL, NULL, NULL, '0', 30, 1654109983, 0, NULL, NULL),
(25, NULL, NULL, NULL, '0', 31, 1654110032, 0, NULL, NULL),
(26, NULL, NULL, NULL, '0', 32, 1654110211, 0, NULL, NULL),
(27, NULL, NULL, NULL, '0', 36, 1654110616, 0, NULL, NULL),
(28, NULL, NULL, NULL, NULL, 37, 1654110698, 0, NULL, NULL),
(29, NULL, NULL, NULL, NULL, 38, 1654110729, 0, NULL, NULL),
(30, NULL, NULL, NULL, '0', 39, 1654110830, 0, NULL, NULL),
(31, 'Ramani', '', 'Mother', '', 40, 1655835985, 0, NULL, NULL),
(32, 'Mukunthan', '', 'Father', '', 40, 1655835985, 0, NULL, NULL),
(33, 'Ramanie', '', 'Wife', '', 41, 1655836110, 0, NULL, NULL),
(34, 'Mukunthane', '', 'Husband', '', 41, 1655836110, 0, NULL, NULL),
(36, 'Mukunthan', '', 'Father', '', 6, 1656152130, 0, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ledger`
--

DROP TABLE IF EXISTS `ledger`;
CREATE TABLE IF NOT EXISTS `ledger` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `credit_debit` int NOT NULL DEFAULT '0',
  `collector_id` int NOT NULL,
  `given_to_type` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `given_to_id` int NOT NULL,
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `maintainance_amount`
--

DROP TABLE IF EXISTS `maintainance_amount`;
CREATE TABLE IF NOT EXISTS `maintainance_amount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE IF NOT EXISTS `member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `middle_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `date_of_birth` int NOT NULL DEFAULT '0',
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `register_number` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `area_id` int NOT NULL DEFAULT '0',
  `unit_id` int NOT NULL DEFAULT '0',
  `designation` int NOT NULL DEFAULT '0',
  `photo` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `form_photo` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL,
  `modified_on` int NOT NULL DEFAULT '0',
  `active` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0',
  `dead` int NOT NULL DEFAULT '0',
  `in_active_reason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `member_id` (`register_number`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `first_name`, `middle_name`, `last_name`, `date_of_birth`, `mobile`, `email`, `address`, `aadhar`, `register_number`, `area_id`, `unit_id`, `designation`, `photo`, `form_photo`, `created_on`, `modified_on`, `active`, `status`, `dead`, `in_active_reason`, `created_by`, `modified_by`) VALUES
(6, 'mayuri e', 'm e', 'k e', 965106000, '8887772121', 'mayuri@yomail.com', 'Kannure', '625284619391', 'KNR/THA/00001', 5, 4, 0, 'uploads/member/7105e1dc-3a5e-44c3-97e0-77def6372d4c.png', 'uploads/member/2d20d22f-7e86-4811-9ef1-685f28e15f67.png', 1652083907, 1656152130, 1, 0, 0, NULL, NULL, 1),
(7, 'saneesh', '', '', -488842200, '9995172244', NULL, 'Kannur', '62528461938', 'KNR/THQ/00005', 1, 2, 0, 'uploads/member/d160f6fd-d4d6-49b4-8e7b-75eca5444384.jpg', 'uploads/member/189ecd36-bf7a-4421-a52b-ccf208f5fd33.png', 1652103267, 0, 1, 0, 0, NULL, NULL, NULL),
(5, 'Amal', '', '', 596872800, '9995112200', NULL, 'Kannur', '62528461938', 'KNR/THA/00003', 1, 1, 0, 'uploads/member/55b40aca-7a56-4b88-bccd-4121c048828a.jpg', 'uploads/member/e264677a-f558-48c4-832c-195661702c1c.png', 1652083234, 0, 1, 0, 0, NULL, NULL, NULL),
(8, 'Nikil', '', '', 852012000, '9878987654', NULL, 'Kannur', '123456789012', 'KNR/THA/00006', 1, 1, 0, 'uploads/member/0ed8c9d1-a71e-4724-8f18-f41a6ff65525.jpg', 'uploads/member/3f932405-03ae-4cc7-bfe8-df7f87dd7e49.png', 1652215364, 0, 1, 0, 0, NULL, NULL, NULL),
(9, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00007', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654107992, 0, 1, 0, 0, NULL, NULL, NULL),
(10, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00008', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108165, 0, 1, 0, 0, NULL, NULL, NULL),
(11, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00009', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108437, 0, 1, 0, 0, NULL, NULL, NULL),
(12, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00010', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108478, 0, 1, 0, 0, NULL, NULL, NULL),
(13, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00011', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108497, 0, 1, 0, 0, NULL, NULL, NULL),
(14, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00012', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108554, 0, 1, 0, 0, NULL, NULL, NULL),
(15, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00013', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108621, 0, 1, 0, 0, NULL, NULL, NULL),
(16, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00014', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108671, 0, 1, 0, 0, NULL, NULL, NULL),
(17, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00015', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108718, 0, 1, 0, 0, NULL, NULL, NULL),
(18, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00016', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654108747, 0, 1, 0, 0, NULL, NULL, NULL),
(19, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00017', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109035, 0, 1, 0, 0, NULL, NULL, NULL),
(20, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00018', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109065, 0, 1, 0, 0, NULL, NULL, NULL),
(21, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00019', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109102, 0, 1, 0, 0, NULL, NULL, NULL),
(22, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00020', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109293, 0, 1, 0, 0, NULL, NULL, NULL),
(23, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00021', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109377, 0, 1, 0, 0, NULL, NULL, NULL),
(24, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00022', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109395, 0, 1, 0, 0, NULL, NULL, NULL),
(25, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00023', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109532, 0, 1, 0, 0, NULL, NULL, NULL),
(26, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00024', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109775, 0, 1, 0, 0, NULL, NULL, NULL),
(27, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00025', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109820, 0, 1, 0, 0, NULL, NULL, NULL),
(28, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00026', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109896, 0, 1, 0, 0, NULL, NULL, NULL),
(29, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00027', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109955, 0, 1, 0, 0, NULL, NULL, NULL),
(30, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00028', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654109983, 0, 1, 0, 0, NULL, NULL, NULL),
(31, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00029', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110032, 0, 1, 0, 0, NULL, NULL, NULL),
(32, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00030', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110211, 0, 1, 0, 0, NULL, NULL, NULL),
(33, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00031', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110256, 0, 1, 0, 0, NULL, NULL, NULL),
(34, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00032', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110417, 0, 1, 0, 0, NULL, NULL, NULL),
(35, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00033', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110507, 0, 1, 0, 0, NULL, NULL, NULL),
(36, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00034', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110616, 0, 1, 0, 0, NULL, NULL, NULL),
(37, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00035', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110698, 0, 1, 0, 0, NULL, NULL, NULL),
(38, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00036', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110729, 0, 1, 0, 0, NULL, NULL, NULL),
(39, 'Johnee', NULL, NULL, 0, '9032435434', NULL, 'avsas', '1231234234', 'KNR/THA/00037', 1, 1, 0, '/temp/photo1', '/temp/form1', 1654110830, 0, 1, 0, 0, NULL, NULL, NULL),
(40, 'mayuri', 'm', 'k', 964933200, '8887772126', NULL, 'Kannur', '625284619396', 'LOK/KOL/00038', 5, 4, 0, 'NA', 'NA', 1655835985, 0, 1, 0, 0, NULL, NULL, NULL),
(41, 'mayuri e', 'm e', 'k e', 965106000, '8887772121', NULL, 'Kannure', '625284619391', 'KNR/THA/00039', 1, 1, 0, 'NA', 'NA', 1655836110, 0, 1, 0, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `member_payout`
--

DROP TABLE IF EXISTS `member_payout`;
CREATE TABLE IF NOT EXISTS `member_payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `collected` float NOT NULL,
  `deduction` float NOT NULL,
  `deduction_reason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `due` float NOT NULL,
  `given` float NOT NULL,
  `payout_date` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `cheque_id` int NOT NULL,
  `created_by` int NOT NULL DEFAULT '0',
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nominee`
--

DROP TABLE IF EXISTS `nominee`;
CREATE TABLE IF NOT EXISTS `nominee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `aadhar` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `relation` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '0',
  `percentage` float DEFAULT NULL,
  `member_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `nominee`
--

INSERT INTO `nominee` (`id`, `full_name`, `aadhar`, `relation`, `mobile`, `percentage`, `member_id`, `created_on`, `modified_on`, `deleted`, `created_by`, `modified_by`) VALUES
(1, 'Father', '876253416274', 'Father', '9992746354', NULL, 5, 1652083234, 0, 0, NULL, NULL),
(13, 'Son', '263748593712', 'Son', '9992746350', NULL, 6, 1656152130, 0, 0, 1, NULL),
(3, 'Son', '876253416274', 'Son', '9992746354', NULL, 7, 1652103267, 0, 0, NULL, NULL),
(4, 'Son', '876253416273', 'Son', '9992746354', NULL, 8, 1652215364, 0, 0, NULL, NULL),
(5, 'Britas', NULL, 'father', '0', NULL, 12, 1654108478, 0, 0, NULL, NULL),
(6, 'Britas', NULL, 'father', '0', NULL, 13, 1654108497, 0, 0, NULL, NULL),
(7, 'Britas', NULL, 'father', '0', NULL, 14, 1654108554, 0, 0, NULL, NULL),
(8, 'Britas', NULL, 'father', '0', NULL, 15, 1654108621, 0, 0, NULL, NULL),
(9, 'Britas', NULL, 'father', '0', NULL, 38, 1654110729, 0, 0, NULL, NULL),
(10, 'Britas', NULL, 'father', '0', NULL, 39, 1654110830, 0, 0, NULL, NULL),
(11, 'Son', '263748593712', 'Son', '9992746350', NULL, 40, 1655835985, 0, 0, NULL, NULL),
(12, 'Father', '263748593711', 'Father', '9992746351', NULL, 41, 1655836110, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
CREATE TABLE IF NOT EXISTS `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `value` float DEFAULT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offer_given`
--

DROP TABLE IF EXISTS `offer_given`;
CREATE TABLE IF NOT EXISTS `offer_given` (
  `id` int NOT NULL AUTO_INCREMENT,
  `offer_id` int NOT NULL,
  `external_entity_id` int NOT NULL DEFAULT '0',
  `event_id` int NOT NULL DEFAULT '0',
  `expiry_date` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE IF NOT EXISTS `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `name`) VALUES
(1, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `registration_fee`
--

DROP TABLE IF EXISTS `registration_fee`;
CREATE TABLE IF NOT EXISTS `registration_fee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `registration_fee`
--

INSERT INTO `registration_fee` (`id`, `amount`, `created_on`, `deleted`, `deleted_on`, `created_by`, `modified_by`) VALUES
(1, 1000, 0, 0, 0, NULL, NULL),
(2, 1200, 1656011567, 0, 0, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `registration_fee_collected`
--

DROP TABLE IF EXISTS `registration_fee_collected`;
CREATE TABLE IF NOT EXISTS `registration_fee_collected` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `registration_fee_id` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reminder_details`
--

DROP TABLE IF EXISTS `reminder_details`;
CREATE TABLE IF NOT EXISTS `reminder_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `member_type` int NOT NULL,
  `sms_call` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sms`
--

DROP TABLE IF EXISTS `sms`;
CREATE TABLE IF NOT EXISTS `sms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `type_data` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sms_charge`
--

DROP TABLE IF EXISTS `sms_charge`;
CREATE TABLE IF NOT EXISTS `sms_charge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `deleted_on` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
CREATE TABLE IF NOT EXISTS `unit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `area_id` int NOT NULL DEFAULT '0',
  `manager_id` int DEFAULT NULL,
  `manager_type` int DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `address` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`id`, `name`, `id_number`, `area_id`, `manager_id`, `manager_type`, `deleted`, `created_on`, `modified_on`, `address`, `mobile`, `created_by`, `modified_by`) VALUES
(1, 'Thavakkara', 'THA', 1, 1, 1, 0, 1652081623, 1654277178, 'NA', '1000000000', NULL, NULL),
(2, 'Payyannur', 'THQ', 1, NULL, NULL, 0, 1652207464, 1652387530, NULL, NULL, NULL, NULL),
(3, 'Thana', 'THN', 1, NULL, NULL, 0, 1652214538, 0, NULL, NULL, NULL, NULL),
(4, 'Kollur', 'KOL', 5, NULL, NULL, 0, 1654277106, 1654278000, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `unit_payout`
--

DROP TABLE IF EXISTS `unit_payout`;
CREATE TABLE IF NOT EXISTS `unit_payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` float NOT NULL,
  `unit_id` int NOT NULL,
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `deleted` int NOT NULL DEFAULT '0',
  `details` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `cheque_id` int NOT NULL,
  `created_by` int NOT NULL DEFAULT '0',
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `middle_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  `blocked` int NOT NULL DEFAULT '0',
  `blocked_on` int NOT NULL DEFAULT '0',
  `created_on` int NOT NULL DEFAULT '0',
  `modified_on` int NOT NULL DEFAULT '0',
  `block_reason` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `deleted` int NOT NULL DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`,`middle_name`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `middle_name`, `last_name`, `username`, `password`, `email`, `mobile`, `type`, `blocked`, `blocked_on`, `created_on`, `modified_on`, `block_reason`, `deleted`, `created_by`, `modified_by`) VALUES
(1, 'admin', 'admin', 'admin', 'admin', '$2a$10$Uu2ofbsZg3Y84y9QYdriIe4F2XUipR9OvX0GCjJ1yaNSM6DSJ8L3i', NULL, NULL, 'admin', 0, 0, 0, 0, '', 0, NULL, NULL),
(2, 'edit', 'edit', 'edit', 'user', '$2b$10$ciS3v7yjrjWxm14mqISLm.eIaglYAfDP70JebjnTJ2P8K9.Tp/sFe', 'sruthy.ksedit@compliancebay.com', '9995300912', 'admin', 0, 0, 1652040424, 1656157221, '', 0, NULL, 1),
(3, 'vyaparimithra', NULL, NULL, 'uiopp', '$2b$10$1KkIDWkCv5LWuzWc5kNe3eM1wE8B0xU25mWBAYk3LjuEdFt05CDca', 'sad', '9995172233', 'admin', 0, 0, 1653073752, 1656157373, NULL, 1, NULL, 1),
(4, 'Kopalan', NULL, NULL, 'kopalan', '$2b$10$NKxEqcXbWDfYvxj.6fSc2ehlPGkUv7GrVqSbK/AQ634JrBS0LuUOe', 'asdasd@asd.asd', '9995172244', 'admin', 0, 0, 1654277797, 0, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
CREATE TABLE IF NOT EXISTS `user_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_on` int NOT NULL,
  `created_by` int DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user_permissions`
--

INSERT INTO `user_permissions` (`id`, `user_id`, `permission_id`, `created_on`, `created_by`, `modified_by`) VALUES
(1, 1, 1, 0, NULL, NULL),
(2, 2, 1, 1652040424, NULL, NULL),
(3, 3, 1, 1653073752, NULL, NULL),
(4, 4, 1, 1654277797, NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
