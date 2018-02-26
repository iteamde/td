-- Adminer 4.3.0 MySQL dump

SET NAMES utf8;;;;;
SET time_zone = '+00:00';;;;;
SET foreign_key_checks = 0;;;;;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';;;;;

DROP TABLE IF EXISTS `trendata_bigdata_country`;;;;;
CREATE TABLE `trendata_bigdata_country` (
  `trendata_bigdata_country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_country_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_country`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_employee_type`;;;;;
CREATE TABLE `trendata_bigdata_employee_type` (
  `trendata_bigdata_employee_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_employee_type_name_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_bigdata_employee_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_employee_type`;;;;;
INSERT INTO `trendata_bigdata_employee_type` (`trendata_bigdata_employee_type_id`, `trendata_bigdata_employee_type_name_token`, `created_at`, `updated_at`) VALUES
(1,	'full_time',	'2017-03-17 15:16:40',	'2017-03-17 15:16:40'),
(2,	'part_time',	'2017-03-17 15:16:53',	'2017-03-17 15:16:53'),
(3,	'contractor',	'2017-03-17 15:17:01',	'2017-03-17 15:17:01');;;;;

DROP TABLE IF EXISTS `trendata_bigdata_gender`;;;;;
CREATE TABLE `trendata_bigdata_gender` (
  `trendata_bigdata_gender_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_gender_name_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_bigdata_gender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_gender`;;;;;
INSERT INTO `trendata_bigdata_gender` (`trendata_bigdata_gender_id`, `trendata_bigdata_gender_name_token`, `created_at`, `updated_at`) VALUES
(1,	'male',	'2017-03-17 15:16:07',	'2017-03-17 15:16:07'),
(2,	'female',	'2017-03-17 15:16:15',	'2017-03-17 15:16:15');;;;;

DROP TABLE IF EXISTS `trendata_bigdata_hire_source`;;;;;
CREATE TABLE `trendata_bigdata_hire_source` (
  `trendata_bigdata_hire_source_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_hire_source_name_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_bigdata_hire_source_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_hire_source`;;;;;
INSERT INTO `trendata_bigdata_hire_source` (`trendata_bigdata_hire_source_id`, `trendata_bigdata_hire_source_name_token`, `created_at`, `updated_at`) VALUES
(1,	'job_fair',	'2017-03-17 15:32:04',	'2017-03-17 15:32:04'),
(2,	'linkedin',	'2017-03-17 15:32:15',	'2017-03-17 15:32:15'),
(3,	'word_of_mouth',	'2017-03-17 15:32:34',	'2017-03-17 15:32:34'),
(4,	'facebook',	'2017-03-17 15:32:44',	'2017-03-17 15:32:44'),
(5,	'employee_referral',	'2017-03-17 15:33:02',	'2017-03-17 15:33:02'),
(6,	'empty',	'2017-05-31 14:49:59',	'2017-05-31 14:49:59');;;;;

DROP TABLE IF EXISTS `trendata_bigdata_job`;;;;;
CREATE TABLE `trendata_bigdata_job` (
  `trendata_bigdata_job_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_job_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_job_description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_job_requirements` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_job_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_organizational_level_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_jobtype_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_jobfamily_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_salary_range_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_job_active` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_job_hourly` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_job_level_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_job_id`),
  KEY `trendata_bigdata_organizational_level_id` (`trendata_bigdata_organizational_level_id`),
  KEY `trendata_bigdata_jobtype_id` (`trendata_bigdata_jobtype_id`),
  KEY `trendata_bigdata_salary_range_id` (`trendata_bigdata_salary_range_id`),
  CONSTRAINT `trendata_bigdata_job_ibfk_4` FOREIGN KEY (`trendata_bigdata_organizational_level_id`) REFERENCES `trendata_bigdata_organizational_level` (`trendata_bigdata_organizational_level_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_bigdata_job_ibfk_5` FOREIGN KEY (`trendata_bigdata_jobtype_id`) REFERENCES `trendata_bigdata_jobtype` (`trendata_bigdata_jobtype_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_bigdata_job_ibfk_6` FOREIGN KEY (`trendata_bigdata_salary_range_id`) REFERENCES `trendata_bigdata_salary_range` (`trendata_bigdata_salary_range_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_job`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_jobtype`;;;;;
CREATE TABLE `trendata_bigdata_jobtype` (
  `trendata_bigdata_jobtype_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_jobtype_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_jobtype_active` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_jobtype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_jobtype`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_job_country`;;;;;
CREATE TABLE `trendata_bigdata_job_country` (
  `trendata_bigdata_job_country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_job_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_country_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_job_country_id`),
  UNIQUE KEY `trendata_bigdata_job_id_trendata_bigdata_country_id` (`trendata_bigdata_job_id`,`trendata_bigdata_country_id`),
  KEY `trendata_bigdata_country_id` (`trendata_bigdata_country_id`),
  CONSTRAINT `trendata_bigdata_job_country_ibfk_3` FOREIGN KEY (`trendata_bigdata_job_id`) REFERENCES `trendata_bigdata_job` (`trendata_bigdata_job_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_bigdata_job_country_ibfk_4` FOREIGN KEY (`trendata_bigdata_country_id`) REFERENCES `trendata_bigdata_country` (`trendata_bigdata_country_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_job_country`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_organizational_level`;;;;;
CREATE TABLE `trendata_bigdata_organizational_level` (
  `trendata_bigdata_organizational_level_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_organizational_level_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_organizational_level_parent_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_organizational_level_active` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_organizational_level_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_organizational_level_manager_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_organizational_level_notes` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_organizational_level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_organizational_level`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_salary_range`;;;;;
CREATE TABLE `trendata_bigdata_salary_range` (
  `trendata_bigdata_salary_range_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_salary_range_min` int(11) DEFAULT NULL,
  `trendata_bigdata_salary_range_max` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_salary_range_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_salary_range`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_user`;;;;;
CREATE TABLE `trendata_bigdata_user` (
  `trendata_bigdata_user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_user_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_middle_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_last_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_dob` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_department` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_rehire_date` date DEFAULT NULL,
  `trendata_bigdata_user_position_start_date` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_previous_position_start_date` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_country_personal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_job_level` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_current_job_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_industry_salary` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_salary` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_salary_1_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_salary_2_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_salary_3_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_salary_4_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_performance_percentage_this_year` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_performance_percentage_1_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_performance_percentage_2_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_performance_percentage_3_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_performance_percentage_4_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_remote_employee` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_voluntary_termination` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_prof_development` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_posting_date` date DEFAULT NULL,
  `trendata_bigdata_user_absences` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_successor` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_benefit_costs` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_benefit_costs_1_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_benefit_costs_2_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_benefit_costs_3_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_benefit_costs_4_year_ago` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_user_employee_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_manager_employee_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_employee_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_gender_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_nationality_country_id` int(10) unsigned DEFAULT NULL,
  `trendata_bigdata_hire_source_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_user_id`),
  KEY `trendata_bigdata_nationality_country_id` (`trendata_bigdata_nationality_country_id`),
  KEY `trendata_bigdata_hire_source_id` (`trendata_bigdata_hire_source_id`),
  KEY `trendata_bigdata_employee_type_id` (`trendata_bigdata_employee_type`),
  KEY `trendata_bigdata_gender_id` (`trendata_bigdata_gender_id`),
  KEY `trendata_bigdata_user_employee_id` (`trendata_bigdata_user_employee_id`),
  KEY `trendata_user_id` (`trendata_user_id`),
  CONSTRAINT `trendata_bigdata_user_ibfk_10` FOREIGN KEY (`trendata_bigdata_gender_id`) REFERENCES `trendata_bigdata_gender` (`trendata_bigdata_gender_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_bigdata_user_ibfk_7` FOREIGN KEY (`trendata_bigdata_nationality_country_id`) REFERENCES `trendata_bigdata_country` (`trendata_bigdata_country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_bigdata_user_ibfk_8` FOREIGN KEY (`trendata_bigdata_hire_source_id`) REFERENCES `trendata_bigdata_hire_source` (`trendata_bigdata_hire_source_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_user`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_user_address`;;;;;
CREATE TABLE `trendata_bigdata_user_address` (
  `trendata_bigdata_user_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_user_id` int(10) unsigned NOT NULL,
  `trendata_bigdata_user_address_address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_address_personal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_city_personal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_state` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_state_personal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_zipcode` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `trendata_bigdata_user_address_zipcode_personal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_user_address_id`),
  KEY `trendata_bigdata_user_id` (`trendata_bigdata_user_id`),
  CONSTRAINT `trendata_bigdata_user_address_ibfk_2` FOREIGN KEY (`trendata_bigdata_user_id`) REFERENCES `trendata_bigdata_user` (`trendata_bigdata_user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_user_address`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_user_education_history`;;;;;
CREATE TABLE `trendata_bigdata_user_education_history` (
  `trendata_bigdata_user_education_history_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_user_id` int(10) unsigned NOT NULL,
  `trendata_bigdata_user_education_history_level` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_user_education_history_id`),
  KEY `trendata_bigdata_user_id` (`trendata_bigdata_user_id`),
  CONSTRAINT `trendata_bigdata_user_education_history_ibfk_2` FOREIGN KEY (`trendata_bigdata_user_id`) REFERENCES `trendata_bigdata_user` (`trendata_bigdata_user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_user_education_history`;;;;;

DROP TABLE IF EXISTS `trendata_bigdata_user_position`;;;;;
CREATE TABLE `trendata_bigdata_user_position` (
  `trendata_bigdata_user_position_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_bigdata_user_id` int(10) unsigned NOT NULL,
  `trendata_bigdata_user_position_hire_date` date DEFAULT NULL,
  `trendata_bigdata_user_position_termination_date` date DEFAULT NULL,
  `trendata_bigdata_user_position_current_job_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`trendata_bigdata_user_position_id`),
  KEY `trendata_bigdata_user_id` (`trendata_bigdata_user_id`),
  CONSTRAINT `trendata_bigdata_user_position_ibfk_2` FOREIGN KEY (`trendata_bigdata_user_id`) REFERENCES `trendata_bigdata_user` (`trendata_bigdata_user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_bigdata_user_position`;;;;;

DROP TABLE IF EXISTS `trendata_chart`;;;;;
CREATE TABLE `trendata_chart` (
  `trendata_chart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_chart_key` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_chart_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_chart_title_token` varchar(127) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_description_token` varchar(127) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `trendata_chart_position_x` int(10) unsigned NOT NULL DEFAULT '0',
  `trendata_chart_position_y` int(10) unsigned NOT NULL DEFAULT '0',
  `trendata_chart_width` int(10) unsigned NOT NULL DEFAULT '3',
  `trendata_chart_height` int(10) unsigned NOT NULL DEFAULT '4',
  `trendata_chart_type` enum('1','2','3') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `trendata_chart_default_chart_display_type` int(10) unsigned NOT NULL DEFAULT '4',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_chart_type_id` int(10) unsigned DEFAULT NULL,
  `trendata_chart_id_parent` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_chart_id`),
  KEY `trendata_chart_default_chart_display_type` (`trendata_chart_default_chart_display_type`),
  KEY `trendata_chart_type_id` (`trendata_chart_type_id`),
  KEY `trendata_chart_id_parent` (`trendata_chart_id_parent`),
  CONSTRAINT `trendata_chart_ibfk_1` FOREIGN KEY (`trendata_chart_default_chart_display_type`) REFERENCES `trendata_chart_display_type` (`trendata_chart_display_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_chart_ibfk_2` FOREIGN KEY (`trendata_chart_type_id`) REFERENCES `trendata_chart_type` (`trendata_chart_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_chart_ibfk_3` FOREIGN KEY (`trendata_chart_id_parent`) REFERENCES `trendata_chart` (`trendata_chart_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_chart`;;;;;
INSERT INTO `trendata_chart` (`trendata_chart_id`, `trendata_chart_key`, `trendata_chart_created_by`, `trendata_chart_last_modified_by`, `trendata_chart_title_token`, `trendata_chart_description_token`, `trendata_chart_status`, `trendata_chart_position_x`, `trendata_chart_position_y`, `trendata_chart_width`, `trendata_chart_height`, `trendata_chart_type`, `trendata_chart_default_chart_display_type`, `created_at`, `updated_at`, `trendata_chart_type_id`, `trendata_chart_id_parent`) VALUES
(1,	'headcount_vs_location',	0,	0,	'db546fdc-b7f4-458f-b19c-6aa8af1ac0de',	'086a2280-1e87-40e5-9e60-6de3c4cbcec7',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(2,	'headcount_vs_departments',	0,	0,	'717ad7ed-b8eb-46e2-a6fd-cfb288d71408',	'8eb827e5-5c09-4071-b4d8-77f85c6d7871',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(3,	'headcount_vs_designations',	0,	0,	'fc166853-115d-4a95-a0aa-6e9a9603064f',	'07663e4a-cf66-4d1e-9d79-bb04d6bb8dcb',	'1',	0,	0,	3,	4,	'1',	4,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(4,	'headcount_vs_Time',	0,	0,	'c9b1629d-e78e-4362-8100-4e97346e279c',	'145d1c36-b8c8-4a69-b64f-06e32530aeea',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(5,	'talent_vs_potential',	0,	0,	'1dccc3ab-2bcd-4cae-b88f-cdfd1c0508fc',	'69a69115-3ce3-4d0d-9493-a4d8c2143c64',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(6,	'performance_rating',	0,	0,	'e5aacd6c-e3dc-4dc3-9e4c-18d4833d6a41',	'3ba782d6-8b1d-4913-a4a4-0fe59421f862',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(7,	'manager_performance',	0,	0,	'16395b33-b1c7-413a-9d60-16b59119c0e7',	'turnover_metric_description',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(8,	'above_average_performer_yield_ratio',	0,	0,	'94063e63-fc20-4869-9f48-f5f3c4290cce',	'5f827ade-bd06-4cc2-90ae-8cd6648ce733',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(9,	'profit_per_employee',	0,	0,	'1189b79e-856b-4e77-bd1c-f63144ba1bc0',	'4a5a8d74-cacb-40fb-8d4f-8d3a7a87d8ac',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(10,	'employee_turnover_overall',	0,	0,	'ca4a84d1-33d8-4cee-afbc-a44e02b53c63',	'd5414e1b-82f5-49a1-b3a5-97b9a1df7633',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(11,	'employee_turnover_by_department',	0,	0,	'e7f16e32-4bf2-4e40-8f3e-fc97bd126068',	'90c13d2e-92b8-447f-a698-672112a95b41',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(12,	'employee_turnover_by_manager',	0,	0,	'f08b35e2-27f8-451b-966d-79d42f304fe9',	'60f7bbdc-7ebf-4dcd-a087-dbf7d4140b1a',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(13,	'attrition_rate_vs_reasons',	0,	0,	'2c511354-a824-4012-a022-fccef152af77',	'996d58af-0ddb-4035-9081-189375e6bcbf',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(14,	'average_tenure_vs_department',	0,	0,	'6aa9bda3-e8ef-4975-9040-b79630c2d18b',	'9d5ea324-5fe5-40d6-8280-8325693d8897',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(15,	'average_tenure',	0,	0,	'9d682fb3-dd78-466d-8a11-7508d46805b8',	'8183f572-c1da-4b8a-ac3f-82ff4e5afc45',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(16,	'equal_opportunities',	0,	0,	'87440058-bb5f-4fb6-ae71-0a7c114875bb',	'a6067e33-8b30-4ef3-b8d3-bbda404f80a1',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(17,	'salary_deviation',	0,	0,	'5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7',	'benefit_costs_metric_description',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(18,	'profit_per_employee',	0,	0,	'a4eb79d9-9406-44d6-9eb1-7df0cd797e0c',	'9d3b3751-2783-471a-9082-33671bb1c618',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(19,	'holiday_by_departments',	0,	0,	'dd8a6840-d022-4f15-b7aa-5b34c50fc853',	'8a04f332-7fd2-4a8b-9876-c4bdcf937dc1',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(20,	'sickness_by_departments',	0,	0,	'0dbeaa22-aab2-40c1-932e-e1288da41c4e',	'450066d7-0c6f-49b8-b3ad-153760c9e7d7',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(21,	'department_expenses',	0,	0,	'07695ea0-89e8-4334-9e02-c501935d7451',	'046c5676-87d3-4262-b9f4-a6319949b6fc',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(22,	'absence_rate',	0,	0,	'aa3ea071-5203-4b19-80b4-d9daaf3fca37',	'f0032877-6c4d-4acf-a1c5-94390ae97827',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(23,	'compa_ratio_calculation',	0,	0,	'9da1f3b3-8ab9-414d-8313-237fa54b5bdd',	'dd2abfb0-d12f-403f-910b-b8b025c2ad87',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(24,	'full_time_equivalents',	0,	0,	'de1c19cf-f7f0-407e-92b1-d5644d0cac74',	'2c2a4149-f0fb-42a8-b8f7-141edafffde8',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(25,	'health_care_costs',	0,	0,	'6159d62c-19ad-4f6c-9a8a-58871454fbd6',	'cc70b9f7-ea49-426f-b220-cf0447de59f5',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(26,	'interview_accept_yield_ratio',	0,	0,	'999b66d5-82f8-45e3-a7eb-c714f91322f1',	'7e13319f-6c68-425e-ace2-3ec8618601a8',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(27,	'interview_offer_yield_ratio',	0,	0,	'89e835d6-5e56-4d53-8187-43ad08064ca9',	'ddf6cac5-c034-4d48-ae2f-ae550f78f4ba',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(28,	'employee_satisfaction',	0,	0,	'f3aead0c-ac9b-4d74-a973-1be5f3620424',	'bf668eef-a8b4-4c91-8875-f219245a8267',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(29,	'gender_equality',	0,	0,	'3583300f-1899-4643-8b6d-6a12e28da956',	'performance_scores_metric_description',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(30,	'job_empowerment',	0,	0,	'b550e591-c278-42fe-aff3-8594888605c8',	'tenure_metric_description',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(31,	'work_life_balance',	0,	0,	'56481e3c-aa73-4f0e-a477-a33212415c4f',	'd66ac665-5d5d-4633-bf18-7bc2a98c2b2e',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(32,	'global_presence',	0,	0,	'ac918054-beb2-4de4-b3e4-87be1691f675',	'0ebf4549-5bc7-419b-8c8c-9ea107e787ab',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(33,	'employee_engagement_score',	0,	0,	'22373c87-98ea-48fa-b8f6-270ea1c46d1d',	'876c8361-7459-43b6-b49e-e4c7ee59418b',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(34,	'workers_compensation_cost_per_employee',	0,	0,	'9fca591c-07da-49d1-bd18-d6c9c4c01cdc',	'a7913bee-1d9f-494e-84fb-d4bfd74d6a4f',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(35,	'workers_compensation_incident_rate',	0,	0,	'3efa59d3-8e0b-4be2-98a7-ccec581c85d4',	'4bb54b64-a56f-46f2-8ae5-ca79bb198a77',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(36,	'workers_compensation_severity_rate',	0,	0,	'f0fee89d-d445-4c9f-ac16-a2e52a52bda1',	'99d6ab5b-154d-47e9-acb0-5a502ade9306',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(37,	'training_cost_per_employee_vs_time',	0,	0,	'45c0107e-a062-43cd-8ad0-64fee2e9b905',	'c2257672-3019-4baf-9c47-7ac7fccb95f2',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(38,	'training_cost_vs_departments',	0,	0,	'b8bd4acc-4f42-44c7-ac24-d2ab44ae29d1',	'455cec57-551b-4f56-9b78-2e8de25c9e30',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(39,	'employees_training_factor',	0,	0,	'4b5ab9e9-939e-4833-b8bb-809ba81d5430',	'cf864f54-8e27-4578-ad20-56aea90040a9',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(40,	'recruiting_expenses',	0,	0,	'766ea7e7-ce54-4f02-8dad-e69654a6d1d2',	'ab4e98e7-f528-45b1-a559-f8935f10db0f',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(41,	'quality_of_new_hires',	0,	0,	'6266b8c2-fddd-4353-a26e-01ffb84c2792',	'71cc7487-8063-4011-aa0d-9faad7043e06',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(42,	'time_to_fill_open_positions',	0,	0,	'1bc6a4ba-c931-466d-8f8f-1547452c740e',	'fb16bc43-0ed8-4f25-9590-cd88e2fa2476',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(43,	'on_boarding_cost',	0,	0,	'6b6e7dbf-94e6-49d1-9474-ab815da07088',	'915e4b0e-66c0-401d-8429-1484aacf89d4',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(44,	'on_boarding_time',	0,	0,	'26722b1e-f590-41dd-88a8-dd3ed75bf1fd',	'2f919468-171c-4621-8de0-0825f243bfd0',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(45,	'employee_vs_monthly_salary_slab',	0,	0,	'e57a302c-11a3-4d6c-88d0-fd9a16b76a31',	'67099a19-56de-4790-b4d7-d450f44b0004',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(46,	'employee_vs_nationality',	0,	0,	'74ab88fb-90ec-4202-b020-9edb8ae0c5bf',	'76a09bcf-43c9-431d-84e2-8227cc138dcf',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(47,	'new_joining_vs_resignation',	0,	0,	'458cf396-a6a8-4862-9525-44e4c127cfba',	'16a8b2ca-18f7-4c10-ba34-29e698878252',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(48,	'human_resource_ratio',	0,	0,	'33d68c6f-be9b-4398-9aa3-573f21eadda7',	'9ba926af-0a9a-4a21-ad5a-c49eb2ee7455',	'1',	0,	0,	3,	4,	'1',	4,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(49,	'hiring_process',	0,	0,	'd995d16f-791f-48e8-9937-e11fec240598',	'c25a705e-406c-4e7b-aef2-f519911a9314',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(50,	'roi',	0,	0,	'dbeeda96-4111-4d04-9b30-4f221146e85a',	'f9a1bcf3-74a0-4c3b-bd27-0707d61ae9ee',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(51,	'cost_vs_revenue',	0,	0,	'fb549a75-3de3-48ce-ab97-f9fbef0def19',	'77238613-3f6c-4a93-9a0c-59b02b2f1d62',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(52,	'hr_expenses',	0,	0,	'7e34a459-2320-43bf-9146-30f9e483b89a',	'7afaa113-8fad-4b6b-93d3-1cd6e954a253',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(53,	'labor_cost_as_percent_of_revenue',	0,	0,	'050c3e7b-52c7-47e4-beb1-3b1e376c0a1b',	'4ad51192-d357-48e9-ace3-98ad5552c5fe',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(54,	'progress_of_objectives',	0,	0,	'fe5d58d5-60f9-4439-97bc-640bfa4f4743',	'c30217b2-9a56-4559-b504-ac29343f1b71',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(55,	'source_of_hire',	0,	0,	'8736c65c-f63a-463b-a1d3-8769bd869555',	'source_of_hire_metric_description',	'1',	0,	0,	3,	4,	'1',	2,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(56,	'job_offer_yield_ratio',	0,	0,	'a9d34123-db81-4edc-8c2b-6e3226b8eb03',	'd7d190cc-91db-4e95-967f-5b334e05d66e',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(57,	'employees_cost_with_revenue_details',	0,	0,	'd0b851a1c75a48ca9543fca0497625aa',	'7a66069d0afe4a5aaa8b5befa2b2f5c2',	'1',	0,	0,	3,	4,	'3',	8,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(58,	'hiring_cycle_time',	0,	0,	'd3ae9c70801a4560a810628f3b3f660a',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(59,	'acceptance_rate',	0,	0,	'6a508904e34446978168a63ea50d8adf',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(60,	'average_salary',	0,	0,	'602ceaec98474415b8e8efe9b485b53d',	'',	'1',	0,	0,	3,	4,	'1',	6,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	NULL,	NULL),
(61,	'salary_deviation',	0,	0,	'number_of_employee',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-10 10:47:14',	'2017-03-10 10:47:14',	1,	NULL),
(62,	'salary_deviation',	0,	0,	'number_of_employee_2',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-14 14:57:40',	'2017-03-14 14:57:40',	2,	61),
(63,	'salary_deviation',	0,	0,	'number_of_employee_3',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-15 18:36:17',	'2017-03-15 18:36:17',	3,	61),
(64,	'salary_deviation',	0,	0,	'number_of_employee_4',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-22 14:59:13',	'2017-03-22 14:59:13',	4,	61),
(65,	'manager_performance',	0,	0,	'16395b33-b1c7-413a-9d60-16b59119c0e7',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-27 16:31:53',	'2017-03-27 16:31:53',	3,	7),
(66,	'manager_performance',	0,	0,	'16395b33-b1c7-413a-9d60-16b59119c0e7',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-27 16:31:56',	'2017-03-27 16:31:56',	4,	7),
(67,	'headcount_vs_location',	0,	0,	'headcount_vs_location',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-29 15:17:08',	'2017-03-29 15:17:08',	3,	1),
(68,	'headcount_vs_location',	0,	0,	'headcount_vs_location',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-03-29 15:17:46',	'2017-03-29 15:17:46',	4,	1),
(69,	'gender_equality',	0,	0,	'3583300f-1899-4643-8b6d-6a12e28da956',	'1345a761-2ba1-4745-b18c-dbf87be2f8d0',	'1',	0,	0,	3,	4,	'2',	10,	'2017-04-07 15:47:03',	'2017-04-07 15:47:03',	2,	29),
(70,	'qweqweqweqweqweqwe',	0,	0,	'16395b33-b1c7-413a-9d60-16b59119c0e7',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-04-12 15:37:57',	'2017-04-12 15:37:57',	2,	7),
(71,	'revenue_per_employee',	0,	0,	'revenue_per_employee',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-04-18 12:51:46',	'2017-04-18 12:51:46',	1,	NULL),
(72,	'revenue_per_employee',	0,	0,	'revenue_per_employee',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-04-18 15:24:51',	'2017-04-18 15:24:51',	2,	71),
(73,	'absences_average',	0,	0,	'absences_average',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-04-19 17:20:02',	'2017-04-19 17:20:02',	1,	NULL),
(74,	'professional_development',	0,	0,	'professional_development',	'professional_development_metric_description',	'1',	0,	0,	3,	4,	'1',	6,	'2017-04-21 18:30:17',	'2017-04-21 18:30:17',	1,	NULL),
(75,	'successors_identified',	0,	0,	'successors_identified',	'successors_identified_metric_description',	'1',	0,	0,	3,	4,	'1',	2,	'2017-04-25 16:01:39',	'2017-04-25 16:01:39',	1,	NULL),
(76,	'',	0,	0,	'',	'',	'1',	0,	0,	3,	4,	'2',	9,	'2017-05-05 11:00:56',	'2017-05-05 11:00:56',	2,	59),
(77,	'rtghfvgbszdfsgdfg',	0,	0,	'qweqweqwe',	'qweqweqwe',	'1',	0,	0,	3,	4,	'2',	9,	'2017-05-31 14:25:32',	'2017-05-31 14:25:32',	3,	71),
(78,	'fgdfgdfgsdfg',	0,	0,	'qweqweqwe',	'qweqweqwe',	'1',	0,	0,	3,	4,	'2',	9,	'2017-05-31 14:25:41',	'2017-05-31 14:25:41',	3,	59);;;;;

DROP TABLE IF EXISTS `trendata_chart_display_type`;;;;;
CREATE TABLE `trendata_chart_display_type` (
  `trendata_chart_display_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_chart_display_type_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_chart_display_type_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_chart_display_type_key` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_display_type_title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_display_type_description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_chart_display_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_chart_display_type`;;;;;
INSERT INTO `trendata_chart_display_type` (`trendata_chart_display_type_id`, `trendata_chart_display_type_created_by`, `trendata_chart_display_type_last_modified_by`, `trendata_chart_display_type_key`, `trendata_chart_display_type_title`, `trendata_chart_display_type_description`, `created_at`, `updated_at`) VALUES
(1,	0,	0,	'scrollline2d',	'scrollline2d',	'multiline chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(2,	0,	0,	'doughnut2d',	'doughnut2d',	'doughnut chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(3,	0,	0,	'scrollstackedcolumn2d',	'scrollstackedcolumn2d',	'stacked column chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(4,	0,	0,	'scrollarea2d',	'scrollarea2d',	'multi-series area chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(5,	0,	0,	'mssplinearea',	'mssplinearea',	'multi-series spine chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(6,	0,	0,	'scrollcolumn2d',	'scrollcolumn2d',	'multi-series column chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(7,	0,	0,	'mscolumn2d',	'mscolumn2d',	'multi-series 4 column chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(8,	0,	0,	'table',	'table',	'table',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(9,	0,	0,	'value_box',	'value_box',	'value_box',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(10,	0,	0,	'column2d',	'column2d',	'column2d',	'2017-04-07 14:21:40',	'2017-04-07 14:21:40');;;;;

DROP TABLE IF EXISTS `trendata_chart_tag`;;;;;
CREATE TABLE `trendata_chart_tag` (
  `trendata_chart_tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_chart_tag_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_chart_tag_last_modified_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_chart_id` int(10) unsigned DEFAULT NULL,
  `trendata_tag_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_chart_tag_id`),
  KEY `trendata_chart_id` (`trendata_chart_id`),
  KEY `trendata_tag_id` (`trendata_tag_id`),
  CONSTRAINT `trendata_chart_tag_ibfk_1` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_chart` (`trendata_chart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_chart_tag_ibfk_2` FOREIGN KEY (`trendata_tag_id`) REFERENCES `trendata_tag` (`trendata_tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_chart_tag`;;;;;
INSERT INTO `trendata_chart_tag` (`trendata_chart_tag_id`, `trendata_chart_tag_created_by`, `trendata_chart_tag_last_modified_by`, `created_at`, `updated_at`, `trendata_chart_id`, `trendata_tag_id`) VALUES
(1,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1,	1),
(2,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1,	2),
(3,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	2,	1),
(4,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	2,	3),
(5,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	3,	1),
(6,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	3,	4),
(7,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	4,	1),
(8,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	5,	5),
(9,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	5,	6),
(10,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	6,	6),
(11,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	7,	6),
(12,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	7,	7),
(13,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	8,	6),
(14,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	9,	9),
(15,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	9,	8),
(16,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	10,	9),
(17,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	10,	10),
(18,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	11,	9),
(19,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	11,	3),
(20,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	12,	9),
(21,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	12,	7),
(22,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	13,	11),
(23,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	14,	3),
(24,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	14,	12),
(25,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	15,	12),
(26,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	16,	13),
(27,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	17,	14),
(28,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	17,	29),
(29,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	18,	9),
(30,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	19,	3),
(31,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	19,	16),
(32,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	20,	3),
(33,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	20,	17),
(34,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	21,	3),
(35,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	21,	18),
(36,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	22,	19),
(37,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	23,	20),
(38,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	24,	21),
(39,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	25,	22),
(40,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	26,	23),
(41,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	27,	23),
(42,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	28,	9),
(43,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	28,	24),
(44,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	29,	25),
(45,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	29,	26),
(46,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	30,	27),
(47,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	25,	28),
(48,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	31,	30),
(49,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	32,	32),
(50,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	32,	31),
(51,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	33,	9),
(52,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	34,	33),
(53,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	33,	34),
(54,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	35,	33),
(55,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	36,	33),
(56,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	36,	35),
(57,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	37,	36),
(58,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	37,	9),
(59,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	38,	36),
(60,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	38,	3),
(61,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	39,	9),
(62,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	39,	36),
(63,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	40,	37),
(64,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	40,	18),
(65,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	41,	38),
(66,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	43,	41),
(67,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	44,	39),
(68,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	45,	9),
(69,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	45,	14),
(70,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	46,	9),
(71,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	46,	40),
(72,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	48,	41),
(73,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	50,	42),
(74,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	52,	41),
(75,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	52,	18);;;;;

DROP TABLE IF EXISTS `trendata_chart_type`;;;;;
CREATE TABLE `trendata_chart_type` (
  `trendata_chart_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_chart_type_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_chart_type_id`),
  UNIQUE KEY `trendata_chart_type_trendata_chart_type_name` (`trendata_chart_type_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_chart_type`;;;;;
INSERT INTO `trendata_chart_type` (`trendata_chart_type_id`, `trendata_chart_type_name`, `created_at`, `updated_at`) VALUES
(1,	'metric',	'2017-03-13 17:05:53',	'2017-03-13 17:05:53'),
(2,	'drilldown',	'2017-03-13 17:06:13',	'2017-03-13 17:06:13'),
(3,	'analytics',	'2017-03-13 17:06:25',	'2017-03-13 17:06:25'),
(4,	'predictive',	'2017-03-13 17:06:50',	'2017-03-13 17:06:50');;;;;

DROP TABLE IF EXISTS `trendata_connector_csv`;;;;;
CREATE TABLE `trendata_connector_csv` (
  `trendata_connector_csv_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_connector_csv_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_connector_csv_file_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_connector_csv_filename` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_user_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_connector_csv_id`),
  KEY `trendata_user_id` (`trendata_user_id`),
  CONSTRAINT `trendata_connector_csv_ibfk_1` FOREIGN KEY (`trendata_user_id`) REFERENCES `trendata_user` (`trendata_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_connector_csv`;;;;;

DROP TABLE IF EXISTS `trendata_country`;;;;;
CREATE TABLE `trendata_country` (
  `trendata_country_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_country_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_country`;;;;;

DROP TABLE IF EXISTS `trendata_dashboard`;;;;;
CREATE TABLE `trendata_dashboard` (
  `trendata_dashboard_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_dashboard_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_dashboard_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_dashboard_title_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_dashboard_description_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_dashboard_status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `trendata_dashboard_is_default` tinyint(1) NOT NULL DEFAULT '0',
  `trendata_dashboard_icon` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_dashboard_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_dashboard`;;;;;
INSERT INTO `trendata_dashboard` (`trendata_dashboard_id`, `trendata_dashboard_created_by`, `trendata_dashboard_last_modified_by`, `trendata_dashboard_title_token`, `trendata_dashboard_description_token`, `trendata_dashboard_status`, `trendata_dashboard_is_default`, `trendata_dashboard_icon`, `created_at`, `updated_at`) VALUES
(1,	0,	0,	'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406',	'',	'1',	0,	'fa fa-tachometer',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00');;;;;

DROP TABLE IF EXISTS `trendata_dashboard_chart`;;;;;
CREATE TABLE `trendata_dashboard_chart` (
  `trendata_dashboard_chart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_dashboard_chart_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_dashboard_chart_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_dashboard_chart_order` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_dashboard_id` int(10) unsigned DEFAULT NULL,
  `trendata_chart_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_dashboard_chart_id`),
  KEY `trendata_dashboard_id` (`trendata_dashboard_id`),
  KEY `trendata_chart_id` (`trendata_chart_id`),
  CONSTRAINT `trendata_dashboard_chart_ibfk_1` FOREIGN KEY (`trendata_dashboard_id`) REFERENCES `trendata_dashboard` (`trendata_dashboard_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_dashboard_chart_ibfk_2` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_chart` (`trendata_chart_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_dashboard_chart`;;;;;
INSERT INTO `trendata_dashboard_chart` (`trendata_dashboard_chart_id`, `trendata_dashboard_chart_created_by`, `trendata_dashboard_chart_last_modified_by`, `trendata_dashboard_chart_order`, `created_at`, `updated_at`, `trendata_dashboard_id`, `trendata_chart_id`) VALUES
(1,	0,	0,	1,	'2017-01-01 00:00:00',	'2017-05-30 07:21:15',	1,	7),
(3,	0,	0,	2,	'2017-01-01 00:00:00',	'2017-05-30 07:21:15',	1,	30),
(4,	0,	0,	5,	'2017-01-01 00:00:00',	'2017-05-30 07:21:15',	1,	29),
(6,	0,	0,	6,	'2017-01-01 00:00:00',	'2017-05-30 07:21:15',	1,	17),
(9,	0,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1,	58),
(10,	0,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1,	59),
(11,	0,	0,	0,	'2017-01-01 00:00:00',	'2017-05-30 07:21:15',	1,	60),
(13,	0,	0,	0,	'2017-03-10 10:59:50',	'2017-03-10 12:59:46',	1,	61),
(14,	0,	0,	4,	'2017-04-19 15:53:26',	'2017-05-30 07:21:15',	1,	55),
(15,	0,	0,	0,	'2017-04-18 12:58:15',	'2017-04-18 12:58:15',	1,	71),
(16,	0,	0,	0,	'2017-04-19 17:41:05',	'2017-04-19 17:41:05',	1,	73),
(18,	0,	0,	3,	'2017-04-21 18:37:10',	'2017-05-30 07:21:15',	1,	74),
(19,	0,	0,	7,	'2017-04-25 16:05:54',	'2017-05-30 07:21:15',	1,	75);;;;;

DROP TABLE IF EXISTS `trendata_email_template`;;;;;
CREATE TABLE `trendata_email_template` (
  `trendata_email_template_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_email_template_key` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_email_subject_token` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_email_msg_token` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_email_template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_email_template`;;;;;
INSERT INTO `trendata_email_template` (`trendata_email_template_id`, `trendata_email_template_key`, `trendata_email_subject_token`, `trendata_email_msg_token`, `created_at`, `updated_at`) VALUES
(1,	'delete_user',	'0861a054-bc57-11e6-a4a6-cec0c932ce01',	'0861a2f2-bc57-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(2,	'suspend_user',	'0861a3ec-bc57-11e6-a4a6-cec0c932ce01',	'0861a4d2-bc57-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(3,	'update_user_profile',	'ad40d75e-bc7d-11e6-a4a6-cec0c932ce01',	'ad40db8c-bc7d-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(4,	'welcome_email',	'930a5278-bc89-11e6-a4a6-cec0c932ce01',	'930a6240-bc89-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00');;;;;

TRUNCATE `trendata_language`;;;;;
INSERT INTO `trendata_language` (`trendata_language_id`, `trendata_language_created_by`, `trendata_language_last_modified_by`, `trendata_language_key`, `trendata_language_title`, `trendata_language_description`, `created_at`, `updated_at`) VALUES
(1,	0,	0,	'en',	'english',	'',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(2,	0,	0,	'fr',	'french',	'',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(3,	0,	0,	'es',	'spanish',	'',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00');;;;;

DROP TABLE IF EXISTS `trendata_menu`;;;;;
CREATE TABLE `trendata_menu` (
  `trendata_menu_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_menu_pid` int(10) unsigned NOT NULL,
  `trendata_menu_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_menu_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_menu_title_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_menu_description_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_menu_redirect_path` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_menu`;;;;;

DROP TABLE IF EXISTS `trendata_menu_permission`;;;;;
CREATE TABLE `trendata_menu_permission` (
  `trendata_menu_permission_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_menu_permission_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_menu_permission_last_modified_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_role_id` int(10) unsigned DEFAULT NULL,
  `trendata_menu_id` int(10) unsigned DEFAULT NULL,
  `trendata_permission_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_menu_permission_id`),
  KEY `trendata_role_id` (`trendata_role_id`),
  KEY `trendata_menu_id` (`trendata_menu_id`),
  KEY `trendata_permission_id` (`trendata_permission_id`),
  CONSTRAINT `trendata_menu_permission_ibfk_1` FOREIGN KEY (`trendata_role_id`) REFERENCES `trendata_role` (`trendata_role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_menu_permission_ibfk_2` FOREIGN KEY (`trendata_menu_id`) REFERENCES `trendata_menu` (`trendata_menu_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_menu_permission_ibfk_3` FOREIGN KEY (`trendata_permission_id`) REFERENCES `trendata_permission` (`trendata_permission_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_menu_permission`;;;;;

DROP TABLE IF EXISTS `trendata_metric`;;;;;
CREATE TABLE `trendata_metric` (
  `trendata_metric_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_metric_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_metric_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_metric_title_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_metric_description_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_metric_status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `trendata_metric_icon` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_metric_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_metric`;;;;;
INSERT INTO `trendata_metric` (`trendata_metric_id`, `trendata_metric_created_by`, `trendata_metric_last_modified_by`, `trendata_metric_title_token`, `trendata_metric_description_token`, `trendata_metric_status`, `trendata_metric_icon`, `created_at`, `updated_at`) VALUES
(1,	0,	0,	'59271b3ab2df41e3bb885eb5ec9e174b',	'c1b6ce2dd2cb4fd1b4b34838bd2e328c',	'1',	'fa fa-usd',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(2,	0,	0,	'599610e09cf84f7da452f8afaefaeab3',	'4822b7576f1f47e6b9502af8663baa20',	'1',	'fa fa-rocket',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(3,	0,	0,	'c93c95bf14f44c5aa3685dabedd9f460',	'a49c256e98e245b3a645199a237916f4',	'1',	'fa fa-question',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(4,	0,	0,	'3d346ad2f051496aac8cd606f115b92d',	'c90d9811673246af81a80811a09fd234',	'1',	'fa fa-binoculars',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(5,	0,	0,	'7327f74bbbdf415086f4c862b2eb19ac',	'7fab0c9e9c8044348395e8c58a0170a8',	'1',	'fa fa-line-chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(6,	0,	0,	'df548600dc7e41a7be8fe0c31b498b83',	'5faee1a557184db58b0a6a325d98a86c',	'1',	'fa fa-tachometer',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(7,	0,	0,	'0b7d216ab7784640b91d66837b741ad0',	'f16ce19bbf174065a42ca2a5a2fba498',	'1',	'fa fa-money',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(8,	0,	0,	'd3b1562d119a4acf876e61c50b6be4eb',	'eada056534574da5b9a128e6aa0e9580',	'1',	'fa fa-key',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(9,	0,	0,	'94b4b2e146574607a25e0ffe30cf3a8c',	'00f769accd24437b876c90913ef78cd8',	'1',	'fa fa-arrows-h',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(10,	0,	0,	'961608e4cb7d4b4584a6d5f5188218a9',	'857c3b208b1a4dc781bc8fd51ab76a47',	'1',	'fa fa-bullhorn',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(12,	0,	0,	'324471e6853f4d049bfbf82308cf66da',	'c0ac6d1176a0443e9d365d369ef0d4bc',	'1',	'fa fa-street-view',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(13,	NULL,	NULL,	'succession_planning',	'succession_planning',	'1',	'fa fa-key',	'2017-05-23 15:05:17',	'2017-05-23 15:05:17');;;;;

DROP TABLE IF EXISTS `trendata_metric_chart`;;;;;
CREATE TABLE `trendata_metric_chart` (
  `trendata_metric_chart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_metric_chart_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_metric_chart_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_metric_chart_order` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_metric_id` int(10) unsigned DEFAULT NULL,
  `trendata_chart_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_metric_chart_id`),
  KEY `trendata_metric_id` (`trendata_metric_id`),
  KEY `trendata_chart_id` (`trendata_chart_id`),
  CONSTRAINT `trendata_metric_chart_ibfk_1` FOREIGN KEY (`trendata_metric_id`) REFERENCES `trendata_metric` (`trendata_metric_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_metric_chart_ibfk_2` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_chart` (`trendata_chart_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_metric_chart`;;;;;
INSERT INTO `trendata_metric_chart` (`trendata_metric_chart_id`, `trendata_metric_chart_created_by`, `trendata_metric_chart_last_modified_by`, `trendata_metric_chart_order`, `created_at`, `updated_at`, `trendata_metric_id`, `trendata_chart_id`) VALUES
(2,	0,	0,	0,	'2017-02-01 11:38:13',	'2017-02-01 11:38:13',	6,	30),
(8,	0,	0,	0,	'2017-02-01 11:45:05',	'2017-05-25 05:17:16',	1,	7),
(17,	0,	0,	0,	'2017-02-01 12:24:01',	'2017-02-01 12:24:01',	8,	17),
(18,	0,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	9,	73),
(19,	0,	0,	0,	'2017-02-01 12:24:36',	'2017-02-01 12:24:36',	5,	71),
(24,	0,	0,	0,	'2017-02-01 12:26:03',	'2017-02-01 12:26:03',	10,	60),
(30,	0,	0,	0,	'2017-02-01 12:46:33',	'2017-02-01 12:46:33',	7,	29),
(38,	0,	0,	0,	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	12,	74),
(42,	0,	0,	0,	'2017-02-01 10:47:36',	'2017-03-28 11:59:35',	3,	41),
(56,	0,	0,	1,	'2017-02-01 11:27:54',	'2017-03-28 11:59:35',	3,	55),
(68,	0,	0,	0,	'2017-02-01 10:30:11',	'2017-02-01 10:30:11',	4,	58),
(69,	0,	0,	0,	'2017-02-01 10:40:43',	'2017-02-01 10:40:43',	2,	59),
(70,	NULL,	NULL,	0,	'2017-05-23 15:06:35',	'2017-05-25 05:16:06',	13,	75);;;;;

DROP TABLE IF EXISTS `trendata_permission`;;;;;
CREATE TABLE `trendata_permission` (
  `trendata_permission_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_permission_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_permission_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_permission_title` int(10) unsigned NOT NULL,
  `trendata_permission_description` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_permission`;;;;;

DROP TABLE IF EXISTS `trendata_role`;;;;;
CREATE TABLE `trendata_role` (
  `trendata_role_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_role_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_role_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_role_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_role_status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_role`;;;;;

DROP TABLE IF EXISTS `trendata_role_metric`;;;;;
CREATE TABLE `trendata_role_metric` (
  `trendata_role_metric_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_role_metric_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_role_metric_last_modified_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_role_id` int(10) unsigned DEFAULT NULL,
  `trendata_metric_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_role_metric_id`),
  KEY `trendata_role_id` (`trendata_role_id`),
  KEY `trendata_metric_id` (`trendata_metric_id`),
  CONSTRAINT `trendata_role_metric_ibfk_1` FOREIGN KEY (`trendata_role_id`) REFERENCES `trendata_role` (`trendata_role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_role_metric_ibfk_2` FOREIGN KEY (`trendata_metric_id`) REFERENCES `trendata_metric` (`trendata_metric_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_role_metric`;;;;;

DROP TABLE IF EXISTS `trendata_sql_query`;;;;;
CREATE TABLE `trendata_sql_query` (
  `trendata_sql_query_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_sql_query_template` text COLLATE utf8_unicode_ci,
  `trendata_sql_query_custom_source` text COLLATE utf8_unicode_ci,
  `trendata_sql_query_module_path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_chart_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_sql_query_id`),
  KEY `trendata_chart_id` (`trendata_chart_id`),
  CONSTRAINT `trendata_sql_query_ibfk_1` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_chart` (`trendata_chart_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_sql_query`;;;;;
INSERT INTO `trendata_sql_query` (`trendata_sql_query_id`, `trendata_sql_query_template`, `trendata_sql_query_custom_source`, `trendata_sql_query_module_path`, `created_at`, `updated_at`, `trendata_chart_id`) VALUES
  (1,	NULL,	NULL,	'number-of-employee/metric',	'2017-03-10 15:38:53',	'2017-03-10 10:58:30',	61),
  (2,	NULL,	NULL,	'number-of-employee/drilldown',	'2017-03-14 15:37:18',	'2017-03-14 15:37:18',	62),
  (3,	NULL,	NULL,	'number-of-employee/analytics',	'2017-03-16 11:08:23',	'2017-03-16 11:08:23',	63),
  (4,	NULL,	NULL,	'average-salary/metric',	'2017-03-22 12:42:58',	'2017-03-22 12:42:58',	60),
  (5,	NULL,	NULL,	'number-of-employee/predictive',	'2017-03-22 15:00:49',	'2017-03-22 15:00:49',	64),
  (6,	NULL,	NULL,	'turnover/metric',	'2017-03-27 13:28:10',	'2017-03-27 13:28:10',	7),
  (7,	NULL,	NULL,	'turnover/analytics',	'2017-03-27 16:44:38',	'2017-03-27 16:44:38',	65),
  (8,	NULL,	NULL,	'turnover/predictive',	'2017-03-27 16:45:35',	'2017-03-27 16:45:35',	66),
  (9,	NULL,	NULL,	'source-of-hire/metric',	'2017-03-28 15:06:45',	'2017-03-28 15:06:45',	55),
  (10,	'SELECT\r\n    COUNT(*) AS `count`, `tbu`.`trendata_bigdata_user_country` AS `country`\r\nFROM\r\n    `trendata_bigdata_user` AS `tbu`\r\nGROUP BY\r\n    `tbu`.`trendata_bigdata_user_country`',	'orm.query(\r\n        \'SELECT \' +\r\n        \'COUNT(*) AS `count`, \' +\r\n        \'`tbu`.`trendata_bigdata_user_country` AS `country` \' +\r\n        \'FROM \' +\r\n        \'`trendata_bigdata_user` AS `tbu` \' +\r\n        \'WHERE `\' +\r\n        \'tbu`.`trendata_user_id`=? \' +\r\n        \'GROUP BY \' +\r\n        \'`tbu`.`trendata_bigdata_user_country`\'\r\n    , {\r\n        type: ORM.QueryTypes.SELECT,\r\n        replacements: [\r\n            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n        ]\r\n    }).reduce(function (accum, item) {\r\n        accum.categories[0].category.push({\r\n            label: item.country\r\n        });\r\n        accum.dataset[0].data.push({\r\n            value: item.count\r\n        });\r\n        return accum;\r\n    }, {\r\n        categories: [\r\n            {\r\n                category: []\r\n            }\r\n        ],\r\n        dataset: [\r\n            {\r\n                seriesname: \'count\',\r\n                data: []\r\n            }\r\n        ]\r\n    }).then(_resolve).catch(_reject);',	NULL,	'2017-03-29 14:10:32',	'2017-03-29 14:10:32',	1),
  (11,	NULL,	'/**\r\n     * @return {Array.<String>}\r\n     */\r\n    function getMonthRange() {\r\n        var current = new Date;\r\n        var min = new Date(current.getFullYear(), current.getMonth() - 1, 1, 23);\r\n        var between = [];\r\n        for(var i = 0; i < 12; ++i) {\r\n            between.push(min.getFullYear() + \'-\' + ((min.getMonth() + 1) < 10 ? \'0\' + (min.getMonth() + 1).toString() : (min.getMonth() + 1)) + \'-01\');\r\n            min.setMonth(min.getMonth() - 1);\r\n        }\r\n        return between.reverse();\r\n    }\r\n\r\n    /**\r\n     * @param date\r\n     * @return {String}\r\n     */\r\n    function getMonthNameByDate(date) {\r\n        var monthNumber = date.split(\'-\')[1];\r\n        return {\r\n            \'01\': \'January\',\r\n            \'02\': \'February\',\r\n            \'03\': \'March\',\r\n            \'04\': \'April\',\r\n            \'05\': \'May\',\r\n            \'06\': \'June\',\r\n            \'07\': \'July\',\r\n            \'08\': \'August\',\r\n            \'09\': \'September\',\r\n            \'10\': \'October\',\r\n            \'11\': \'November\',\r\n            \'12\': \'December\'\r\n        }[monthNumber];\r\n    }\r\n\r\n    Promise.props({\r\n        /**\r\n         * Users\r\n         */\r\n        users: commonChartData.getUsersList(req),\r\n\r\n        /**\r\n         *\r\n         */\r\n        termAndActive: (function () {\r\n            var current = new Date;\r\n            var old = new Date(current.getFullYear(), current.getMonth() - 1, 1, 23);\r\n            var current = new Date(current.getFullYear(), current.getMonth(), 1, 23);\r\n            current = current.getUTCFullYear() + \'-\' + ((current.getUTCMonth() + 1) < 10 ? (\'0\' + (current.getUTCMonth() + 1).toString()) : (current.getUTCMonth() + 1)) + \'-01\';\r\n            old = old.getUTCFullYear() + \'-\' + ((old.getUTCMonth() + 1) < 10 ? (\'0\' + (old.getUTCMonth() + 1).toString()) : (old.getUTCMonth() + 1)) + \'-01\';\r\n\r\n            return Promise.props({\r\n                /**\r\n                 *\r\n                 */\r\n                term: orm.query(\r\n                    \'SELECT \' +\r\n                    \'COUNT(*) AS `count` \' +\r\n                    \'FROM \' +\r\n                    \'`trendata_bigdata_user` AS `tbu` \' +\r\n                    \'INNER JOIN \' +\r\n                    \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                    \'ON \' +\r\n                    \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                    \'WHERE \' +\r\n                    \'`tbup`.`trendata_bigdata_user_position_termination_date` >= ? \' +\r\n                    \'AND \' +\r\n                    \'`tbup`.`trendata_bigdata_user_position_termination_date` <= ? \' +\r\n                    \'AND \' +\r\n                    \'`tbu`.`trendata_user_id`=?\'\r\n                    , {\r\n                        type: ORM.QueryTypes.SELECT,\r\n                        replacements: [\r\n                            old,\r\n                            current,\r\n                            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                        ]\r\n                    }\r\n                ).then(function (rows) {\r\n                    return rows[0].count;\r\n                }),\r\n\r\n                /**\r\n                 *\r\n                 */\r\n                total: Promise.resolve().then(function() {\r\n                    return orm.query(\r\n                        \'SELECT \' +\r\n                        \'COUNT(*) AS `count` \' +\r\n                        \'FROM \' +\r\n                        \'`trendata_bigdata_user` AS `tbu` \' +\r\n                        \'INNER JOIN \' +\r\n                        \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                        \'ON \' +\r\n                        \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                        \'WHERE \' +\r\n                        \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                        \'OR \' +\r\n                        \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                        \'AND \' +\r\n                        \'`tbu`.`trendata_user_id`=?\'\r\n                        , {\r\n                            type: ORM.QueryTypes.SELECT,\r\n                            replacements: [\r\n                                current,\r\n                                current,\r\n                                current,\r\n                                req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                            ]\r\n                        }\r\n                    ).then(function (rows) {\r\n                        return rows[0].count;\r\n                    });\r\n                })\r\n            }).then(function (data) {\r\n                return {\r\n                    \"data\": [\r\n                        {\r\n                            \"label\": \"Rest of Population\",\r\n                            \"value\": data.total\r\n                        },\r\n                        {\r\n                            \"label\": \"Termination\",\r\n                            \"value\": data.term\r\n                        }\r\n                    ]\r\n                };\r\n            });\r\n        })(),\r\n\r\n        /**\r\n         * Summary tab\r\n         */\r\n        summary: Promise.all([\r\n            /**\r\n             * Avg. Salary\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                return orm.query(\r\n                    \'SELECT \' +\r\n                    \'AVG(`tbu`.`trendata_bigdata_user_salary`) AS `avg` \' +\r\n                    \'FROM \' +\r\n                    \'`trendata_bigdata_user` AS `tbu` \' +\r\n                    \'INNER JOIN \' +\r\n                    \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                    \'ON \' +\r\n                    \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                    \'WHERE \' +\r\n                    \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                    \'OR \' +\r\n                    \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                    \'AND \' +\r\n                    \'`tbu`.`trendata_user_id`=?\'\r\n                    , {\r\n                        type: ORM.QueryTypes.SELECT,\r\n                        replacements: [\r\n                            item,\r\n                            item,\r\n                            item,\r\n                            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                        ]\r\n                    }\r\n                ).then(function (rows) {\r\n                    return {\r\n                        month: item.substr(0, 7),\r\n                        avgSalary: parseInt(rows[0].avg) || 0\r\n                    };\r\n                });\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = item.avgSalary;\r\n                return accum;\r\n            }, {\r\n                name: \'Avg. Salary\'\r\n            }),\r\n\r\n            /**\r\n             * Number of Employees\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                return orm.query(\r\n                    \'SELECT \' +\r\n                    \'COUNT(*) AS `count` \' +\r\n                    \'FROM \' +\r\n                    \'`trendata_bigdata_user` AS `tbu` \' +\r\n                    \'INNER JOIN \' +\r\n                    \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                    \'ON \' +\r\n                    \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                    \'WHERE \' +\r\n                    \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                    \'OR \' +\r\n                    \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                    \'AND \' +\r\n                    \'`tbu`.`trendata_user_id`=?\'\r\n                    , {\r\n                        type: ORM.QueryTypes.SELECT,\r\n                        replacements: [\r\n                            item,\r\n                            item,\r\n                            item,\r\n                            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                        ]\r\n                    }\r\n                ).then(function (rows) {\r\n                    return {\r\n                        month: item.substr(0, 7),\r\n                        count: parseInt(rows[0].count) || 0\r\n                    };\r\n                });\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = item.count;\r\n                return accum;\r\n            }, {\r\n                name: \'Number of Employees\'\r\n            }),\r\n\r\n            /**\r\n             * Remote Employees\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                return Promise.props({\r\n                    month: item,\r\n                    value: Promise.props({\r\n                        remote: orm.query(\r\n                            \'SELECT \' +\r\n                            \'COUNT(*) AS `count` \' +\r\n                            \'FROM \' +\r\n                            \'`trendata_bigdata_user` AS `tbu` \' +\r\n                            \'INNER JOIN \' +\r\n                            \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                            \'ON \' +\r\n                            \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                            \'WHERE \' +\r\n                            \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                            \'OR \' +\r\n                            \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_bigdata_user_remote_employee` = \\\'yes\\\' \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_user_id`=?\'\r\n                            , {\r\n                                type: ORM.QueryTypes.SELECT,\r\n                                replacements: [\r\n                                    item,\r\n                                    item,\r\n                                    item,\r\n                                    req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                                ]\r\n                            }).then(function (rows) {\r\n                            return rows[0].count;\r\n                        }),\r\n                        total: orm.query(\r\n                            \'SELECT \' +\r\n                            \'COUNT(*) AS `count` \' +\r\n                            \'FROM \' +\r\n                            \'`trendata_bigdata_user` AS `tbu` \' +\r\n                            \'INNER JOIN \' +\r\n                            \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                            \'ON \' +\r\n                            \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                            \'WHERE \' +\r\n                            \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                            \'OR \' +\r\n                            \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_user_id`=?\'\r\n                            , {\r\n                                type: ORM.QueryTypes.SELECT,\r\n                                replacements: [\r\n                                    item,\r\n                                    item,\r\n                                    item,\r\n                                    req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                                ]\r\n                            }).then(function (rows) {\r\n                            return rows[0].count;\r\n                        })\r\n                    })\r\n                });\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = ! item.value.total ? 0 : (Math.round((item.value.remote / item.value.total) * 10000) / 10000);\r\n                return accum;\r\n            }, {\r\n                name: \'Remote Employees\'\r\n            }),\r\n\r\n            /**\r\n             * Total Turnover\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                item = item.split(\'-\');\r\n                var current = new Date(item[0], item[1]);\r\n                var old = new Date(current.getFullYear(), current.getMonth() - 1, 1, 23);\r\n                var current = new Date(current.getFullYear(), current.getMonth(), 1, 23);\r\n                return {\r\n                    old: old.getUTCFullYear() + \'-\' + ((old.getUTCMonth() + 1) < 10 ? (\'0\' + (old.getUTCMonth() + 1).toString()) : (old.getUTCMonth() + 1)) + \'-01\',\r\n                    current: current.getUTCFullYear() + \'-\' + ((current.getUTCMonth() + 1) < 10 ? (\'0\' + (current.getUTCMonth() + 1).toString()) : (current.getUTCMonth() + 1)) + \'-01\'\r\n                };\r\n            }).map(function (item) {\r\n                return Promise.props({\r\n                    term: Promise.resolve().then(function() {\r\n                        return orm.query(\r\n                            \'SELECT \' +\r\n                            \'COUNT(*) AS `count` \' +\r\n                            \'FROM \' +\r\n                            \'`trendata_bigdata_user` AS `tbu` \' +\r\n                            \'INNER JOIN \' +\r\n                            \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                            \'ON \' +\r\n                            \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                            \'WHERE \' +\r\n                            \'`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL \' +\r\n                            \'AND\' +\r\n                            \'`tbup`.`trendata_bigdata_user_position_termination_date` >= ? \' +\r\n                            \'AND \' +\r\n                            \'`tbup`.`trendata_bigdata_user_position_termination_date` < ? \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_user_id`=?\'\r\n                            , {\r\n                                type: ORM.QueryTypes.SELECT,\r\n                                replacements: [\r\n                                    item.old,\r\n                                    item.current,\r\n                                    req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                                ]\r\n                            }).then(function (rows) {\r\n                            return rows[0].count;\r\n                        });\r\n                    }),\r\n\r\n                    total: orm.query(\r\n                        \'SELECT \' +\r\n                        \'COUNT(*) AS `count` \' +\r\n                        \'FROM \' +\r\n                        \'`trendata_bigdata_user` AS `tbu` \' +\r\n                        \'INNER JOIN \' +\r\n                        \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                        \'ON \' +\r\n                        \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                        \'WHERE \' +\r\n                        \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                        \'OR \' +\r\n                        \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                        \'AND \' +\r\n                        \'`tbu`.`trendata_user_id`=?\'\r\n                        , {\r\n                            type: ORM.QueryTypes.SELECT,\r\n                            replacements: [\r\n                                item.old,\r\n                                item.old,\r\n                                item.old,\r\n                                req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                            ]\r\n                        }).then(function (rows) {\r\n                        return rows[0].count;\r\n                    }),\r\n\r\n                    month: item.old\r\n                });\r\n            }).map(function (item) {\r\n                item.total += item.term;\r\n                return item;\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = ! item.total ? 0 : (Math.round((item.term / item.total) * 10000) / 10000);\r\n                return accum;\r\n            }, {\r\n                name: \'Total Turnover\'\r\n            })\r\n        ]),\r\n\r\n        /**\r\n         *\r\n         */\r\n        trendLine: \'POST\' === req.method ? commonChartData.getTrendlineCurvePython(req.body) : [\r\n            [1, 0],\r\n            [2, 0],\r\n            [3, 0],\r\n            [4, 0],\r\n            [5, 0],\r\n            [6, 0],\r\n            [7, 0],\r\n            [8, 0],\r\n            [9, 0],\r\n            [10, 0],\r\n            [11, 0],\r\n            [12, 0]\r\n        ]\r\n    }).then(_resolve).catch(_reject);',	NULL,	'2017-03-29 15:21:03',	'2017-03-29 15:21:03',	67),
  (12,	NULL,	'/**\r\n     * @return {Array.<String>}\r\n     */\r\n    function getMonthRange() {\r\n        var current = new Date;\r\n        var min = new Date(current.getFullYear(), current.getMonth() - 1, 1, 23);\r\n        var between = [];\r\n        for(var i = 0; i < 6; ++i) {\r\n            between.push(min.getFullYear() + \'-\' + ((min.getMonth() + 1) < 10 ? \'0\' + (min.getMonth() + 1).toString() : (min.getMonth() + 1)) + \'-01\');\r\n            min.setMonth(min.getMonth() - 1);\r\n        }\r\n        return between.reverse();\r\n    }\r\n\r\n    /**\r\n     * @param date\r\n     * @return {String}\r\n     */\r\n    function getMonthNameByDate(date) {\r\n        var monthNumber = date.split(\'-\')[1];\r\n        return {\r\n            \'01\': \'January\',\r\n            \'02\': \'February\',\r\n            \'03\': \'March\',\r\n            \'04\': \'April\',\r\n            \'05\': \'May\',\r\n            \'06\': \'June\',\r\n            \'07\': \'July\',\r\n            \'08\': \'August\',\r\n            \'09\': \'September\',\r\n            \'10\': \'October\',\r\n            \'11\': \'November\',\r\n            \'12\': \'December\'\r\n        }[monthNumber];\r\n    }\r\n\r\n    Promise.props({\r\n        /**\r\n         * Users\r\n         */\r\n        users: commonChartData.getUsersList(req),\r\n\r\n        /**\r\n         *\r\n         */\r\n        termAndActive: (function () {\r\n            var current = new Date;\r\n            var old = new Date(current.getFullYear(), current.getMonth() - 1, 1, 23);\r\n            var current = new Date(current.getFullYear(), current.getMonth(), 1, 23);\r\n            current = current.getUTCFullYear() + \'-\' + ((current.getUTCMonth() + 1) < 10 ? (\'0\' + (current.getUTCMonth() + 1).toString()) : (current.getUTCMonth() + 1)) + \'-01\';\r\n            old = old.getUTCFullYear() + \'-\' + ((old.getUTCMonth() + 1) < 10 ? (\'0\' + (old.getUTCMonth() + 1).toString()) : (old.getUTCMonth() + 1)) + \'-01\';\r\n\r\n            return Promise.props({\r\n                /**\r\n                 *\r\n                 */\r\n                term: orm.query(\r\n                    \'SELECT \' +\r\n                    \'COUNT(*) AS `count` \' +\r\n                    \'FROM \' +\r\n                    \'`trendata_bigdata_user` AS `tbu` \' +\r\n                    \'INNER JOIN \' +\r\n                    \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                    \'ON \' +\r\n                    \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                    \'WHERE \' +\r\n                    \'`tbup`.`trendata_bigdata_user_position_termination_date` >= ? \' +\r\n                    \'AND \' +\r\n                    \'`tbup`.`trendata_bigdata_user_position_termination_date` <= ? \' +\r\n                    \'AND \' +\r\n                    \'`tbu`.`trendata_user_id`=?\'\r\n                    , {\r\n                        type: ORM.QueryTypes.SELECT,\r\n                        replacements: [\r\n                            old,\r\n                            current,\r\n                            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                        ]\r\n                    }\r\n                ).then(function (rows) {\r\n                    return rows[0].count;\r\n                }),\r\n\r\n                /**\r\n                 *\r\n                 */\r\n                total: Promise.resolve().then(function() {\r\n                    return orm.query(\r\n                        \'SELECT \' +\r\n                        \'COUNT(*) AS `count` \' +\r\n                        \'FROM \' +\r\n                        \'`trendata_bigdata_user` AS `tbu` \' +\r\n                        \'INNER JOIN \' +\r\n                        \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                        \'ON \' +\r\n                        \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                        \'WHERE \' +\r\n                        \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                        \'OR \' +\r\n                        \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                        \'AND \' +\r\n                        \'`tbu`.`trendata_user_id`=?\'\r\n                        , {\r\n                            type: ORM.QueryTypes.SELECT,\r\n                            replacements: [\r\n                                current,\r\n                                current,\r\n                                current,\r\n                                req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                            ]\r\n                        }\r\n                    ).then(function (rows) {\r\n                        return rows[0].count;\r\n                    });\r\n                })\r\n            }).then(function (data) {\r\n                return {\r\n                    \"data\": [\r\n                        {\r\n                            \"label\": \"Rest of Population\",\r\n                            \"value\": data.total\r\n                        },\r\n                        {\r\n                            \"label\": \"Termination\",\r\n                            \"value\": data.term\r\n                        }\r\n                    ]\r\n                };\r\n            });\r\n        })(),\r\n\r\n        /**\r\n         * Summary tab\r\n         */\r\n        summary: Promise.all([\r\n            /**\r\n             * Avg. Salary\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                return orm.query(\r\n                    \'SELECT \' +\r\n                    \'AVG(`tbu`.`trendata_bigdata_user_salary`) AS `avg` \' +\r\n                    \'FROM \' +\r\n                    \'`trendata_bigdata_user` AS `tbu` \' +\r\n                    \'INNER JOIN \' +\r\n                    \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                    \'ON \' +\r\n                    \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                    \'WHERE \' +\r\n                    \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                    \'OR \' +\r\n                    \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                    \'AND \' +\r\n                    \'`tbu`.`trendata_user_id`=?\'\r\n                    , {\r\n                        type: ORM.QueryTypes.SELECT,\r\n                        replacements: [\r\n                            item,\r\n                            item,\r\n                            item,\r\n                            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                        ]\r\n                    }\r\n                ).then(function (rows) {\r\n                    return {\r\n                        month: item.substr(0, 7),\r\n                        avgSalary: parseInt(rows[0].avg) || 0\r\n                    };\r\n                });\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = item.avgSalary;\r\n                return accum;\r\n            }, {\r\n                name: \'Avg. Salary\'\r\n            }),\r\n\r\n            /**\r\n             * Number of Employees\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                return orm.query(\r\n                    \'SELECT \' +\r\n                    \'COUNT(*) AS `count` \' +\r\n                    \'FROM \' +\r\n                    \'`trendata_bigdata_user` AS `tbu` \' +\r\n                    \'INNER JOIN \' +\r\n                    \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                    \'ON \' +\r\n                    \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                    \'WHERE \' +\r\n                    \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                    \'OR \' +\r\n                    \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                    \'AND \' +\r\n                    \'`tbu`.`trendata_user_id`=?\'\r\n                    , {\r\n                        type: ORM.QueryTypes.SELECT,\r\n                        replacements: [\r\n                            item,\r\n                            item,\r\n                            item,\r\n                            req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                        ]\r\n                    }\r\n                ).then(function (rows) {\r\n                    return {\r\n                        month: item.substr(0, 7),\r\n                        count: parseInt(rows[0].count) || 0\r\n                    };\r\n                });\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = item.count;\r\n                return accum;\r\n            }, {\r\n                name: \'Number of Employees\'\r\n            }),\r\n\r\n            /**\r\n             * Remote Employees\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                return Promise.props({\r\n                    month: item,\r\n                    value: Promise.props({\r\n                        remote: orm.query(\r\n                            \'SELECT \' +\r\n                            \'COUNT(*) AS `count` \' +\r\n                            \'FROM \' +\r\n                            \'`trendata_bigdata_user` AS `tbu` \' +\r\n                            \'INNER JOIN \' +\r\n                            \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                            \'ON \' +\r\n                            \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                            \'WHERE \' +\r\n                            \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                            \'OR \' +\r\n                            \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_bigdata_user_remote_employee` = \\\'yes\\\' \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_user_id`=?\'\r\n                            , {\r\n                                type: ORM.QueryTypes.SELECT,\r\n                                replacements: [\r\n                                    item,\r\n                                    item,\r\n                                    item,\r\n                                    req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                                ]\r\n                            }).then(function (rows) {\r\n                            return rows[0].count;\r\n                        }),\r\n                        total: orm.query(\r\n                            \'SELECT \' +\r\n                            \'COUNT(*) AS `count` \' +\r\n                            \'FROM \' +\r\n                            \'`trendata_bigdata_user` AS `tbu` \' +\r\n                            \'INNER JOIN \' +\r\n                            \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                            \'ON \' +\r\n                            \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                            \'WHERE \' +\r\n                            \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                            \'OR \' +\r\n                            \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_user_id`=?\'\r\n                            , {\r\n                                type: ORM.QueryTypes.SELECT,\r\n                                replacements: [\r\n                                    item,\r\n                                    item,\r\n                                    item,\r\n                                    req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                                ]\r\n                            }).then(function (rows) {\r\n                            return rows[0].count;\r\n                        })\r\n                    })\r\n                });\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = ! item.value.total ? 0 : (Math.round((item.value.remote / item.value.total) * 10000) / 10000);\r\n                return accum;\r\n            }, {\r\n                name: \'Remote Employees\'\r\n            }),\r\n\r\n            /**\r\n             * Total Turnover\r\n             */\r\n            Promise.map(getMonthRange(), function (item) {\r\n                item = item.split(\'-\');\r\n                var current = new Date(item[0], item[1]);\r\n                var old = new Date(current.getFullYear(), current.getMonth() - 1, 1, 23);\r\n                var current = new Date(current.getFullYear(), current.getMonth(), 1, 23);\r\n                return {\r\n                    old: old.getUTCFullYear() + \'-\' + ((old.getUTCMonth() + 1) < 10 ? (\'0\' + (old.getUTCMonth() + 1).toString()) : (old.getUTCMonth() + 1)) + \'-01\',\r\n                    current: current.getUTCFullYear() + \'-\' + ((current.getUTCMonth() + 1) < 10 ? (\'0\' + (current.getUTCMonth() + 1).toString()) : (current.getUTCMonth() + 1)) + \'-01\'\r\n                };\r\n            }).map(function (item) {\r\n                return Promise.props({\r\n                    term: Promise.resolve().then(function() {\r\n                        return orm.query(\r\n                            \'SELECT \' +\r\n                            \'COUNT(*) AS `count` \' +\r\n                            \'FROM \' +\r\n                            \'`trendata_bigdata_user` AS `tbu` \' +\r\n                            \'INNER JOIN \' +\r\n                            \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                            \'ON \' +\r\n                            \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                            \'WHERE \' +\r\n                            \'`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL \' +\r\n                            \'AND\' +\r\n                            \'`tbup`.`trendata_bigdata_user_position_termination_date` >= ? \' +\r\n                            \'AND \' +\r\n                            \'`tbup`.`trendata_bigdata_user_position_termination_date` < ? \' +\r\n                            \'AND \' +\r\n                            \'`tbu`.`trendata_user_id`=?\'\r\n                            , {\r\n                                type: ORM.QueryTypes.SELECT,\r\n                                replacements: [\r\n                                    item.old,\r\n                                    item.current,\r\n                                    req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                                ]\r\n                            }).then(function (rows) {\r\n                            return rows[0].count;\r\n                        });\r\n                    }),\r\n\r\n                    total: orm.query(\r\n                        \'SELECT \' +\r\n                        \'COUNT(*) AS `count` \' +\r\n                        \'FROM \' +\r\n                        \'`trendata_bigdata_user` AS `tbu` \' +\r\n                        \'INNER JOIN \' +\r\n                        \'`trendata_bigdata_user_position` AS `tbup` \' +\r\n                        \'ON \' +\r\n                        \'`tbu`.`trendata_bigdata_user_id` = `tbup`.`trendata_bigdata_user_id` \' +\r\n                        \'WHERE \' +\r\n                        \'((`tbup`.`trendata_bigdata_user_position_termination_date` IS NOT NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ? AND `tbup`.`trendata_bigdata_user_position_termination_date` >= ?) \' +\r\n                        \'OR \' +\r\n                        \'(`tbup`.`trendata_bigdata_user_position_termination_date` IS NULL AND `tbup`.`trendata_bigdata_user_position_hire_date` <= ?)) \' +\r\n                        \'AND \' +\r\n                        \'`tbu`.`trendata_user_id`=?\'\r\n                        , {\r\n                            type: ORM.QueryTypes.SELECT,\r\n                            replacements: [\r\n                                item.old,\r\n                                item.old,\r\n                                item.old,\r\n                                req && req.parentUser && req.parentUser.trendata_user_id || 0\r\n                            ]\r\n                        }).then(function (rows) {\r\n                        return rows[0].count;\r\n                    }),\r\n\r\n                    month: item.old\r\n                });\r\n            }).map(function (item) {\r\n                item.total += item.term;\r\n                return item;\r\n            }).reduce(function (accum, item) {\r\n                accum[getMonthNameByDate(item.month)] = ! item.total ? 0 : (Math.round((item.term / item.total) * 10000) / 10000);\r\n                return accum;\r\n            }, {\r\n                name: \'Total Turnover\'\r\n            })\r\n        ]),\r\n\r\n        /**\r\n         *\r\n         */\r\n        trendLine: \'POST\' === req.method ? commonChartData.getTrendlineCurvePython(req.body) : [\r\n            [1, 0],\r\n            [2, 0],\r\n            [3, 0],\r\n            [4, 0],\r\n            [5, 0],\r\n            [6, 0],\r\n            [7, 0],\r\n            [8, 0],\r\n            [9, 0],\r\n            [10, 0],\r\n            [11, 0],\r\n            [12, 0]\r\n        ]\r\n    }).then(_resolve).catch(_reject);',	NULL,	'2017-03-29 15:21:46',	'2017-03-29 15:21:46',	68),
  (13,	NULL,	NULL,	'performance-scores/metric',	'2017-04-06 18:23:39',	'2017-04-06 18:23:39',	29),
  (14,	NULL,	NULL,	'performance-scores/drilldown',	'2017-04-07 15:49:08',	'2017-04-07 15:49:08',	69),
  (15,	NULL,	NULL,	'turnover/drilldown',	'2017-04-12 18:36:52',	'2017-04-12 18:36:52',	70),
  (16,	NULL,	NULL,	'revenue-per-employee/metric',	'2017-04-18 12:57:11',	'2017-04-18 12:57:11',	71),
  (17,	NULL,	NULL,	'revenue-per-employee/drilldown',	'2017-04-18 15:45:42',	'2017-04-18 15:45:42',	72),
  (18,	NULL,	NULL,	'tenure/metric',	'2017-04-19 12:59:56',	'2017-04-19 12:59:56',	30),
  (19,	NULL,	NULL,	'absences-average/metric',	'2017-04-19 17:39:39',	'2017-04-19 17:39:39',	73),
  (20,	NULL,	NULL,	'time-to-fill/metric',	'2017-04-21 15:32:32',	'2017-04-21 15:32:32',	58),
  (21,	NULL,	NULL,	'benefit-costs/metric',	'2017-04-21 17:33:18',	'2017-04-21 17:33:18',	17),
  (22,	NULL,	NULL,	'professional-development/metric',	'2017-04-21 18:36:31',	'2017-04-21 18:36:31',	74),
  (23,	NULL,	NULL,	'cost-per-hire/metric',	'2017-04-25 13:29:12',	'2017-04-25 13:29:12',	59),
  (24,	NULL,	NULL,	'successors-identified/metric',	'2017-04-25 16:05:22',	'2017-04-25 16:05:22',	75),
  (25,	NULL,	NULL,	'cost-per-hire/drilldown',	'2017-05-05 11:13:27',	'2017-05-05 11:13:27',	76),
  (26,	NULL,	NULL,	'revenue-per-employee/analytics',	'2017-05-31 14:27:33',	'2017-05-31 14:27:33',	77),
  (27,	NULL,	NULL,	'cost-per-hire/analytics',	'2017-05-31 14:28:30',	'2017-05-31 14:28:30',	78);;;;;

DROP TABLE IF EXISTS `trendata_tag`;;;;;
CREATE TABLE `trendata_tag` (
  `trendata_tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_tag_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_tag_description` text COLLATE utf8_unicode_ci NOT NULL,
  `trendata_tag_status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`trendata_tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_tag`;;;;;
INSERT INTO `trendata_tag` (`trendata_tag_id`, `trendata_tag_title`, `trendata_tag_description`, `trendata_tag_status`, `created_at`, `updated_at`) VALUES
(1,	'headcount',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(2,	'location',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(3,	'departments',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(4,	'designations',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(5,	'talent',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(6,	'productivity',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(7,	'manager',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(8,	'profit',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(9,	'employee',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(10,	'turnover',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(11,	'attrition',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(12,	'tenure',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(13,	'opportunity',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(14,	'salary',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(16,	'holiday',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(17,	'sickness',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(18,	'expenses',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(19,	'absence',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(20,	'compa',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(21,	'equivalents',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(22,	'health_care',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(23,	'interview_',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(24,	'satisfaction',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(25,	'gender',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(26,	'equality',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(27,	'job',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(28,	'empowerment',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(29,	'deviation',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(30,	'work_life',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(31,	'presence',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(32,	'global',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(33,	'worker',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(34,	'compensation',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(35,	'severity',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(36,	'training',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(37,	'recruiting',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(38,	'quality',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(39,	'boarding',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(40,	'nationality',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(41,	'hr',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(42,	'roi',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(43,	'source',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(44,	'Cost',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(45,	'revenue',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(46,	'joining',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00'),
(47,	'registration',	'',	'1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00');;;;;

DROP TABLE IF EXISTS `trendata_translation`;;;;;
CREATE TABLE `trendata_translation` (
  `trendata_translation_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_translation_text` text COLLATE utf8_unicode_ci,
  `trendata_translation_token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_language_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_translation_id`),
  KEY `trendata_language_id` (`trendata_language_id`),
  KEY `trendata_translation_trendata_translation_token` (`trendata_translation_token`),
  CONSTRAINT `trendata_translation_ibfk_1` FOREIGN KEY (`trendata_language_id`) REFERENCES `trendata_language` (`trendata_language_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_translation`;;;;;
INSERT INTO `trendata_translation` (`trendata_translation_id`, `trendata_translation_text`, `trendata_translation_token`, `created_at`, `updated_at`, `trendata_language_id`) VALUES
(1,	'Turnover',	'59271b3ab2df41e3bb885eb5ec9e174b',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(2,	'Cost per Hire',	'599610e09cf84f7da452f8afaefaeab3',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(3,	'Source of Hire',	'c93c95bf14f44c5aa3685dabedd9f460',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(4,	'Time to Fill',	'3d346ad2f051496aac8cd606f115b92d',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(5,	'Revenues',	'7327f74bbbdf415086f4c862b2eb19ac',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(6,	'Tenure',	'df548600dc7e41a7be8fe0c31b498b83',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(7,	'Performance Goals',	'0b7d216ab7784640b91d66837b741ad0',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(8,	'Benefit Costs per Employee',	'd3b1562d119a4acf876e61c50b6be4eb',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(9,	'Absence Rate',	'94b4b2e146574607a25e0ffe30cf3a8c',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(10,	'Average Compensation',	'961608e4cb7d4b4584a6d5f5188218a9',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(11,	'Employee Satisfaction',	'e93aed9c68824740b582e5e8f1e2f74f',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(12,	'Training and Development',	'324471e6853f4d049bfbf82308cf66da',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(37,	'Headcount vs location',	'db546fdc-b7f4-458f-b19c-6aa8af1ac0de',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(38,	'Headcount vs departments',	'717ad7ed-b8eb-46e2-a6fd-cfb288d71408',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(39,	'Headcount vs designations',	'fc166853-115d-4a95-a0aa-6e9a9603064f',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(40,	'Headcount vs Time',	'c9b1629d-e78e-4362-8100-4e97346e279c',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(41,	'Talent vs potential\r\n',	'1dccc3ab-2bcd-4cae-b88f-cdfd1c0508fc',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(42,	'Performance Rating\r\n',	'e5aacd6c-e3dc-4dc3-9e4c-18d4833d6a41',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(43,	'Turnover',	'16395b33-b1c7-413a-9d60-16b59119c0e7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(44,	'Above Average Performer Yield Ratio\r\n',	'94063e63-fc20-4869-9f48-f5f3c4290cce',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(45,	'Revenue per Employee',	'1189b79e-856b-4e77-bd1c-f63144ba1bc0',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(46,	'Turnover Cost by Location',	'ca4a84d1-33d8-4cee-afbc-a44e02b53c63',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(47,	'Turnover Cost by Department\r\n',	'e7f16e32-4bf2-4e40-8f3e-fc97bd126068',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(48,	'Turnover Cost by Job Level',	'f08b35e2-27f8-451b-966d-79d42f304fe9',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(49,	'High Potential Turover',	'2c511354-a824-4012-a022-fccef152af77',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(50,	'Average tenure vs department\r\n',	'6aa9bda3-e8ef-4975-9040-b79630c2d18b',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(51,	'Average tenure vs years\r\n',	'9d682fb3-dd78-466d-8a11-7508d46805b8',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(52,	'Absence Rate',	'87440058-bb5f-4fb6-ae71-0a7c114875bb',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(53,	'Benefit Costs',	'5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(54,	'Profit per employee vs year\r\n',	'a4eb79d9-9406-44d6-9eb1-7df0cd797e0c',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(55,	'Holiday by departments',	'dd8a6840-d022-4f15-b7aa-5b34c50fc853',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(56,	'Sickness by departments\r\n',	'0dbeaa22-aab2-40c1-932e-e1288da41c4e',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(57,	'Department Expenses\r\n',	'07695ea0-89e8-4334-9e02-c501935d7451',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(58,	'Absence Rate\r\n',	'aa3ea071-5203-4b19-80b4-d9daaf3fca37',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(59,	'Compa Ratio Calculation\r\n',	'9da1f3b3-8ab9-414d-8313-237fa54b5bdd',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(60,	'Full-Time Equivalents (FTE) Calculations\r\n',	'de1c19cf-f7f0-407e-92b1-d5644d0cac74',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(61,	'Health Care Costs\r\n',	'6159d62c-19ad-4f6c-9a8a-58871454fbd6',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(62,	'Interview Accept Yield Ratio\r\n',	'999b66d5-82f8-45e3-a7eb-c714f91322f1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(63,	'Interview Offer Yield Ratio\r\n',	'89e835d6-5e56-4d53-8187-43ad08064ca9',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(64,	'Employee satisfaction\r\n',	'f3aead0c-ac9b-4d74-a973-1be5f3620424',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(65,	'Performance Scores',	'3583300f-1899-4643-8b6d-6a12e28da956',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(66,	'Tenure',	'b550e591-c278-42fe-aff3-8594888605c8',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(67,	'Work/Life Balance',	'56481e3c-aa73-4f0e-a477-a33212415c4f',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(68,	'Global presence\r\n',	'ac918054-beb2-4de4-b3e4-87be1691f675',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(69,	'Employee engagement score\r\n',	'22373c87-98ea-48fa-b8f6-270ea1c46d1d',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(70,	'Workers\' Compensation Cost per Employee (Cumulative)\r\n',	'9fca591c-07da-49d1-bd18-d6c9c4c01cdc',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(71,	'Workers\' Compensation Incident Rate\r\n',	'3efa59d3-8e0b-4be2-98a7-ccec581c85d4',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(72,	'Workers\' Compensation Severity Rate\r\n',	'f0fee89d-d445-4c9f-ac16-a2e52a52bda1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(73,	'Training cost per employee vs time\r\n',	'45c0107e-a062-43cd-8ad0-64fee2e9b905',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(74,	'Training cost vs departments\r\n',	'b8bd4acc-4f42-44c7-ac24-d2ab44ae29d1',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(75,	'Employees Training Factor\r\n',	'4b5ab9e9-939e-4833-b8bb-809ba81d5430',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(76,	'Recruiting expenses\r\n',	'766ea7e7-ce54-4f02-8dad-e69654a6d1d2',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(77,	'Quality of new hires\r\n',	'6266b8c2-fddd-4353-a26e-01ffb84c2792',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(78,	'Time to fill open positions\r\n',	'Time to fill open positions',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(79,	'On-boarding cost',	'6b6e7dbf-94e6-49d1-9474-ab815da07088',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(80,	'On-boarding time',	'26722b1e-f590-41dd-88a8-dd3ed75bf1fd',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(81,	'No. of employee vs monthly salary slab\r\n',	'e57a302c-11a3-4d6c-88d0-fd9a16b76a31',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(82,	'No of employee vs nationality\r\n',	'74ab88fb-90ec-4202-b020-9edb8ae0c5bf',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(83,	'New Joining vs Resignation\r\n',	'458cf396-a6a8-4862-9525-44e4c127cfba',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(84,	'Human Resource Ratio\r\n',	'33d68c6f-be9b-4398-9aa3-573f21eadda7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(85,	'Hiring Process',	'd995d16f-791f-48e8-9937-e11fec240598',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(86,	'ROI',	'dbeeda96-4111-4d04-9b30-4f221146e85a',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(87,	'Cost vs revenue\r\n',	'fb549a75-3de3-48ce-ab97-f9fbef0def19',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(88,	'Human Resource Expenses \r\n',	'7e34a459-2320-43bf-9146-30f9e483b89a',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(89,	'Labor Cost as Percent of Revenue\r\n',	'050c3e7b-52c7-47e4-beb1-3b1e376c0a1b',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(90,	'Progress of objectives',	'fe5d58d5-60f9-4439-97bc-640bfa4f4743',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(91,	'Source of hire',	'8736c65c-f63a-463b-a1d3-8769bd869555',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(92,	'Job Offer Yield Ratio',	'a9d34123-db81-4edc-8c2b-6e3226b8eb03',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(205,	'Dashboard',	'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(208,	'Employees cost with revenue details',	'd0b851a1c75a48ca9543fca0497625aa',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(211,	'Isquidunt late eum, sum quassunt faceribus, as de nimpor am as as apienim ilique voluptibus mo cus modiorp orendio denda exceatqui num es quistia dem untin cuptur, volore rernatio quias aut volorero te vel exceaquis et accum labor audae nonseque ent odi aut ent.',	'7a66069d0afe4a5aaa8b5befa2b2f5c2',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(214,	'Cost per Hire',	'6a508904e34446978168a63ea50d8adf',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(218,	'Time to Fill',	'd3ae9c70801a4560a810628f3b3f660a',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(221,	'Average Salary',	'602ceaec98474415b8e8efe9b485b53d',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(224,	'Social',	'ab2371a8-b6f5-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(225,	'Marketing',	'ab2374b4-b6f5-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(226,	'Recruitment',	'ab2375d6-b6f5-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(227,	'Social Event 1',	'28e254cc-b6f8-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(228,	'Event description goes here just below the heading and next to date.',	'28e2571a-b6f8-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(229,	'Social Event 2',	'28e25828-b6f8-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(230,	'Event 2 description goes here just below the heading and next to date.',	'28e25904-b6f8-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(231,	'Marketing',	'2eaee260-b7bd-11e6-80f5-76304dec7eb7',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(232,	'Test Event 1',	'aedeb5c0-baef-11e6-9843-5dfce1e66ee0',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(233,	'Testing Event Description',	'aedeb5c1-baef-11e6-9843-5dfce1e66ee0',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(234,	'Test Event 2',	'2248de50-bafa-11e6-8814-ddf39ce2e418',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(235,	'Testing Event 2 Description',	'22490560-bafa-11e6-8814-ddf39ce2e418',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(236,	'Test Event 2',	'a7db0d40-bafa-11e6-91be-83db83e767e4',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(237,	'Testing Event 2 Description',	'a7db0d41-bafa-11e6-91be-83db83e767e4',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(238,	'Test Event 3',	'cd7c8920-bafa-11e6-91be-83db83e767e4',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(239,	'Testing Event 3 Description',	'cd7c8921-bafa-11e6-91be-83db83e767e4',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(240,	'Trendata - User Deleted',	'0861a054-bc57-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(241,	'You are deleted from Trendata. Please contact if you have any issues.',	'0861a2f2-bc57-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(242,	'Trendata - User Suspended',	'0861a3ec-bc57-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(243,	'You are suspended from Trendata. Please contact if you have any issues.',	'0861a4d2-bc57-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(244,	'Trendata - Administrator updated your profile',	'ad40d75e-bc7d-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(245,	'You profile is updated by Administrator. You can also update your profile after login.',	'ad40db8c-bc7d-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(246,	'Trendata - Welcome',	'930a5278-bc89-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(247,	'You are added to Trendata. Please use the following credential for login.',	'930a6240-bc89-11e6-a4a6-cec0c932ce01',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(252,	'Organization',	'15331f40-bd3f-11e6-a994-33f704ba913f',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(253,	'Testing Event cat Description',	'15331f41-bd3f-11e6-a994-33f704ba913f',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(298,	'Social Event 3',	'2290c470-c358-11e6-8841-29b28f75a071',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(299,	'Social Event 3 Desc',	'2290c471-c358-11e6-8841-29b28f75a071',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(300,	'Social Event 4',	'2ea14c80-c358-11e6-8841-29b28f75a071',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(301,	'Social Event 4 Desc',	'2ea14c81-c358-11e6-8841-29b28f75a071',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(302,	'About',	'about',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(303,	'Support',	'support',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(304,	'Terms of Service',	'terms_of_service',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(305,	'Legal',	'legal',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(306,	'Help',	'help',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(307,	'Contact Us',	'contact_us',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(308,	'My Profile',	'my_profile',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(309,	'Event Manager',	'event_manager',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(310,	'Logout',	'logout',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(311,	'Didn\'t recieved password?',	'didnt_recieved_password?',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(312,	'Sign In Here',	'sign_in_here',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(313,	'Resend',	'resend',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(314,	'Email',	'email',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(315,	'Enter your email below to recieve temp password',	'enter_your_email_below_to_recieve_te',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(316,	'Send',	'send',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(317,	'Username/Email',	'username_or_email',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(318,	'Password',	'password',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(319,	'Sign In',	'sign_in',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(320,	'Forgot your password?',	'forgot_your_password?',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(321,	'Step 1: Select Metrics',	'step1_select_metrics',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(322,	'Step 2: Chart Type',	'step2_chart_type',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(323,	'Step 3: Review',	'step3_review',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(324,	'Male',	'male',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(325,	'Female',	'female',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(326,	'Years',	'years',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(327,	'Months',	'months',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(328,	'Choose dimension',	'choose_dimension',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(329,	'Select person',	'select_person',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(330,	'From',	'from',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(331,	'To',	'to',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(332,	'Close',	'close',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(333,	'Cancel',	'cancel',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(334,	'Continue',	'continue',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(335,	'Create New Chart',	'create_new_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(336,	'Bar Chart',	'bar_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(337,	'Line Chart',	'line_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(338,	'Stack Chart',	'stack_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(339,	'Pie Chart',	'pie_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(340,	'Add Chart',	'add_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(341,	'Keep me signed in',	'keep_me_signed_in',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(342,	'Configure KPI',	'configure_kpi',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(343,	'Drilldown',	'drilldown',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(344,	'Trending View',	'trending_view',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(345,	'Analytical View',	'analytical_view',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(346,	'Manager Performance Drilldown View',	'manager_performance_drilldown_view',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(347,	'Manager Performances in 2016',	'manager_performances_in_2016',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(348,	'Recommended Charts',	'recommended_charts',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(349,	'Administrator Settings',	'administrator_settings',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(350,	'Manage Users',	'manage_users',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(351,	'Manage Roles',	'manage_roles',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(352,	'Financial Inputs',	'financial_inputs',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(353,	'Data Sources',	'data_sources',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(354,	'Revenue Analysis for Aug\'16',	'revenue_analysis_for_aug_16',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(355,	'Save',	'save',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(356,	'Share',	'share',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(357,	'Description',	'description',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(358,	'Event Title',	'event_title',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(359,	'Add',	'add',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(360,	'Add Event',	'add_event',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(361,	'Add Event Category',	'add_event_category',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(362,	'Financial Data Input',	'financial_data_input',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(363,	'Choose Status',	'choose_status',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(364,	'Name',	'name',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(365,	'Add Profile Picture',	'add_profile_picture',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(366,	'Users List',	'users_list',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(367,	'Employees cost with revenue details',	'employees_cost_with_revenue_details',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(368,	'Add New User',	'add_new_user',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(370,	'Choose Designation',	'choose_designation',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(371,	'Choose Role',	'choose_role',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(372,	'Reset My Password',	'reset_my_password',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(373,	'Starting Date',	'starting_date',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(374,	'Private',	'private',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(375,	'Public',	'public',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(376,	'Showing Results For',	'showing_results_for',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(378,	'Chart Options',	'chart_options',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(379,	'Download Chart',	'download_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(380,	'Add To Dashboard',	'add_to_dashboard',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(381,	'Analytics',	'analytics',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(382,	'Predictive',	'predictive',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(383,	'Notify on Failure',	'notify_on_failure',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(384,	'Test Connection',	'test_connection',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(385,	'Configure',	'configure',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(386,	'Chart Description',	'chart_description',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(387,	'Chart Title',	'chart_title',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(388,	'Settings',	'settings',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(392,	'Filters',	'filters',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(393,	'Time Span',	'time_span',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(394,	'Comparison',	'comparison',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(395,	'Events Overlay',	'events_overlay',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(396,	'Regression Analysis',	'regression_analysis',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(397,	'Filter by Label',	'filter_by_label',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(398,	'Group by',	'group_by',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(399,	'Enter your NLP query',	'enter_your_nlp_query',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(400,	'Search',	'search',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(401,	'Category',	'category',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(402,	'Add on',	'add_on',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(403,	'Last Update',	'last_update',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(404,	'Edit Profile',	'edit_profile',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(405,	'First Name',	'first_name',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(406,	'Please Enter',	'please_enter',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(407,	'Last Name',	'last_name',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(408,	'Phone Number',	'phone_number',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(409,	'Additional Number',	'additional_number',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(410,	'Date of Birth',	'date_of_birth',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(411,	'Department',	'department',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(412,	'Country',	'country',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(413,	'Title',	'title',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(414,	'Toggle Menu',	'toggle_menu',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(415,	'Create Custom Chart',	'create_custom_chart',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(416,	'Languages',	'languages',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(417,	'Search for Token',	'search_for_token',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(418,	'Token Name',	'token_name',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(419,	'Token Translation',	'token_translation',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(420,	'English',	'english',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(421,	'Select Language',	'select_language',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(422,	'TUFF',	'tuff',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(423,	'Trendata Universal File Format',	'trendata_universal_file_format',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(424,	'File',	'file',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(425,	'Actions',	'actions',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(426,	'Type',	'type',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(427,	'Edit User',	'edit_user',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(428,	'Upload File',	'upload_file',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(429,	'Download Sample File',	'download_sample_file',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(431,	'Individual',	'individual',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(432,	'Summary',	'summary',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(433,	'Start modeling',	'start_modeling',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(434,	'123',	'4cdf43c0-ff47-11e6-95d3-71be4ab223da',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(435,	'123',	'4cdf6ad0-ff47-11e6-95d3-71be4ab223da',	'2017-01-01 00:00:00',	'2017-01-01 00:00:00',	1),
(436,	'Number of Employees',	'number_of_employee',	'2017-03-10 10:35:45',	'2017-03-10 10:35:45',	1),
(437,	'Chart View',	'chart_view',	'2017-03-13 00:00:00',	'2017-03-13 00:00:00',	1),
(438,	'Search the system in natural language',	'search_the_system_in_natural_languag',	'2017-03-22 13:40:44',	'2017-03-22 13:40:44',	1),
(439,	'Search the system in natural language',	'search_the_system_in_natural_language',	'2017-03-23 16:43:38',	'2017-03-23 16:43:38',	1),
(440,	'Test event title',	'f1d3e1f0-0fe2-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:08:25',	'2017-03-23 16:08:25',	1),
(441,	'Test event description',	'f1d40900-0fe2-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:08:25',	'2017-03-23 16:08:25',	1),
(442,	'Test event title',	'050388c0-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:08:57',	'2017-03-23 16:08:57',	1),
(443,	'Test event description',	'050388c1-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:08:57',	'2017-03-23 16:08:57',	1),
(444,	'qwe',	'487ec5b0-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:10:50',	'2017-03-23 16:10:50',	1),
(445,	'rty',	'487ec5b1-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:10:50',	'2017-03-23 16:10:50',	1),
(446,	'qwe',	'4f2c8500-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:11:01',	'2017-03-23 16:11:01',	1),
(447,	'rty',	'4f2c8501-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:11:01',	'2017-03-23 16:11:01',	1),
(448,	'qwe',	'9dbd4830-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:13:13',	'2017-03-23 16:13:13',	1),
(449,	'rty',	'9dbd4831-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:13:13',	'2017-03-23 16:13:13',	1),
(450,	'qwe',	'bae6f320-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:14:02',	'2017-03-23 16:14:02',	1),
(451,	'rty',	'bae6f321-0fe3-11e7-bfe8-7b7d1ba1c327',	'2017-03-23 16:14:02',	'2017-03-23 16:14:02',	1),
(452,	'LinkedIn',	'linkedin',	'2017-03-28 16:18:26',	'2017-03-28 16:18:26',	1),
(453,	'Job Fair',	'job_fair',	'2017-03-28 16:20:35',	'2017-03-28 16:20:35',	1),
(454,	'Word of Mouth',	'word_of_mouth',	'2017-03-28 16:21:11',	'2017-03-28 16:21:11',	1),
(455,	'Facebook',	'facebook',	'2017-03-28 16:21:45',	'2017-03-28 16:21:45',	1),
(456,	'Employee Referral',	'employee_referral',	'2017-03-28 16:22:27',	'2017-03-28 16:22:27',	1),
(457,	'Male',	'male',	'2017-03-28 16:22:48',	'2017-03-28 16:22:48',	1),
(458,	'Female',	'female',	'2017-03-28 16:23:01',	'2017-03-28 16:23:01',	1),
(459,	'Full-Time',	'full_time',	'2017-03-28 16:23:26',	'2017-03-28 16:23:26',	1),
(460,	'Part-Time',	'part_time',	'2017-03-28 16:23:47',	'2017-03-28 16:23:47',	1),
(461,	'Contractor',	'contractor',	'2017-03-28 16:24:10',	'2017-03-28 16:24:10',	1),
(462,	'qwe',	'ed32d490-155e-11e7-a3cd-791ce988be73',	'2017-03-30 15:38:31',	'2017-03-30 15:38:31',	1),
(463,	'qwe',	'ed32fba0-155e-11e7-a3cd-791ce988be73',	'2017-03-30 15:38:31',	'2017-03-30 15:38:31',	1),
(464,	'ffffff',	'de83de70-155f-11e7-a3cd-791ce988be73',	'2017-03-30 15:45:16',	'2017-03-30 15:45:16',	1),
(465,	'',	'de83de71-155f-11e7-a3cd-791ce988be73',	'2017-03-30 15:45:16',	'2017-03-30 15:45:16',	1),
(466,	'Acquisition',	'fe78a890-1565-11e7-aee0-3deddf5aaf09',	'2017-03-30 16:29:06',	'2017-03-30 16:29:06',	1),
(467,	'Acquisition event.',	'fe78cfa0-1565-11e7-aee0-3deddf5aaf09',	'2017-03-30 16:29:06',	'2017-03-30 16:29:06',	1),
(468,	'Layoffs',	'0ddd1690-1566-11e7-aee0-3deddf5aaf09',	'2017-03-30 16:29:32',	'2017-03-30 16:29:32',	1),
(469,	'Layoffs event.',	'0ddd1691-1566-11e7-aee0-3deddf5aaf09',	'2017-03-30 16:29:32',	'2017-03-30 16:29:32',	1),
(470,	'New Benefits Program',	'213246c0-1566-11e7-aee0-3deddf5aaf09',	'2017-03-30 16:30:04',	'2017-03-30 16:30:04',	1),
(471,	'New Benefits Program event.',	'213246c1-1566-11e7-aee0-3deddf5aaf09',	'2017-03-30 16:30:04',	'2017-03-30 16:30:04',	1),
(472,	'Surveys',	'surveys',	'2017-04-05 17:18:52',	'2017-04-05 17:18:52',	1),
(473,	'Recipients',	'recipients',	'2017-04-05 17:25:43',	'2017-04-05 17:25:43',	1),
(474,	'Send Survey',	'send_survey',	'2017-04-05 17:26:10',	'2017-04-05 17:26:10',	1),
(475,	'Add Question',	'add_question',	'2017-04-05 17:26:30',	'2017-04-05 17:26:30',	1),
(476,	'Remove Question',	'remove_question',	'2017-04-05 17:28:20',	'2017-04-05 17:28:20',	1),
(477,	'Question',	'question',	'2017-04-05 17:28:52',	'2017-04-05 17:28:52',	1),
(478,	'No existing events',	'no_existing_events',	'2017-04-05 17:29:14',	'2017-04-05 17:29:14',	1),
(479,	'Job Fair',	'b092f740-1ecd-11e7-895a-957ca309c045',	'2017-04-11 15:44:03',	'2017-04-11 15:44:03',	1),
(480,	'',	'b0931e50-1ecd-11e7-895a-957ca309c045',	'2017-04-11 15:44:03',	'2017-04-11 15:44:03',	1),
(481,	'Test event',	'4ea130e0-1f79-11e7-86e8-97e08866bbf7',	'2017-04-12 12:12:32',	'2017-04-12 12:12:32',	1),
(482,	'',	'4ea130e1-1f79-11e7-86e8-97e08866bbf7',	'2017-04-12 12:12:32',	'2017-04-12 12:12:32',	1),
(483,	'Ending Date',	'ending_date',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(484,	'Test July',	'1f71a730-1f7b-11e7-9e20-01b5637c8d38',	'2017-04-12 12:25:32',	'2017-04-12 12:25:32',	1),
(485,	'',	'1f71a731-1f7b-11e7-9e20-01b5637c8d38',	'2017-04-12 12:25:32',	'2017-04-12 12:25:32',	1),
(486,	'August - September event',	'cf8110a0-1fa0-11e7-853f-fdb96de25ebc',	'2017-04-12 16:55:19',	'2017-04-12 16:55:19',	1),
(487,	'',	'cf8137b0-1fa0-11e7-853f-fdb96de25ebc',	'2017-04-12 16:55:19',	'2017-04-12 16:55:19',	1),
(488,	'Event August 1st - September 30th',	'75c20ca0-2030-11e7-b001-63058b911ede',	'2017-04-13 10:03:36',	'2017-04-13 10:03:36',	1),
(489,	'',	'75c20ca1-2030-11e7-b001-63058b911ede',	'2017-04-13 10:03:36',	'2017-04-13 10:03:36',	1),
(490,	'Event August 1st - September 30th 222',	'df0f9540-2037-11e7-851d-01a57adf6917',	'2017-04-13 10:56:39',	'2017-04-13 10:56:39',	1),
(491,	'',	'df0fbc50-2037-11e7-851d-01a57adf6917',	'2017-04-13 10:56:39',	'2017-04-13 10:56:39',	1),
(492,	'Revenue per Employee',	'revenue_per_employee',	'2017-04-18 12:25:11',	'2017-04-18 12:25:11',	1),
(493,	'Absences Average',	'absences_average',	'2017-04-19 17:05:51',	'2017-04-19 17:05:51',	1),
(494,	'Professional Development',	'professional_development',	'2017-04-21 18:27:52',	'2017-04-21 18:27:52',	1),
(495,	'Successors Identified',	'successors_identified',	'2017-04-25 15:59:58',	'2017-04-25 15:59:58',	1),
(496,	'TUFF Data Dictionary',	'tuff_data_dictionary',	'2017-05-05 17:56:02',	'2017-05-05 17:56:02',	1),
(497,	'User Login',	'user_login_data_dictionary_field_name',	'2017-05-05 17:55:40',	'2017-05-05 17:55:40',	1),
(498,	'Some Description for User Login Field',	'user_login_data_dictionary_field_description',	'2017-05-05 17:55:23',	'2017-05-05 17:55:23',	1),
(500,	'First Name',	'first_name_data_dictionary_field_name',	'2017-05-05 17:54:40',	'2017-05-05 17:54:40',	1),
(501,	'Middle Name',	'middle_name_data_dictionary_field_name',	'2017-05-05 17:54:22',	'2017-05-05 17:54:22',	1),
(503,	'Last Name',	'last_name_data_dictionary_field_name',	'2017-05-05 17:53:08',	'2017-05-05 17:53:08',	1),
(505,	'Employee ID',	'employee_id_data_dictionary_field_name',	'2017-05-05 17:52:18',	'2017-05-05 17:52:18',	1),
(507,	'Last Uploaded File',	'last_uploaded_file',	'2017-05-05 17:51:05',	'2017-05-05 17:51:05',	1),
(509,	'View Last Uploaded File',	'view_last_uploaded_file',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(510,	'This metric for turnover is calculated by taking the number of terminations, voluntary and involuntary, during a month divided by the number of employees on the payroll for that month.',	'turnover_metric_description',	'2017-05-16 17:40:08',	'2017-05-16 17:40:08',	1),
(511,	'This metric shows the average percent breakdown of cash compensation versus benefits provided by the organization. ',	'benefit_costs_metric_description',	'2017-05-16 14:48:28',	'2017-05-16 14:48:28',	1),
(512,	'This metric shows possible performance scores on the horizontal axis and percent of population who achieved that score on the vertical axis.',	'performance_scores_metric_description',	'2017-05-16 17:53:35',	'2017-05-16 17:53:35',	1),
(513,	'This metric shows possible performance scores on the horizontal axis and percent of individuals who achieved that score who are in professional development on the vertical axis.',	'professional_development_metric_description',	'2017-05-16 17:57:46',	'2017-05-16 17:57:46',	1),
(514,	'This metric shows the percent of employees hired during the month that came as a result of the respective named job source.',	'source_of_hire_metric_description',	'2017-05-16 15:57:10',	'2017-05-16 15:57:10',	1),
(515,	'This metric shows the percent of the total employee population where the employee in that position has a successor identified if they were to leave the company.',	'successors_identified_metric_description',	'2017-05-16 16:01:09',	'2017-05-16 16:01:09',	1),
(516,	'This metric shows employee tenure with the company on the horizontal axis and percent of employees who fall into that tenure range on the vertical axis.',	'tenure_metric_description',	'2017-05-16 16:02:51',	'2017-05-16 16:02:51',	1),
(517,	'Succession Planning',	'succession_planning',	'2017-05-23 15:03:51',	'2017-05-23 15:03:51',	1),
(518,	'Test Event',	'1c6efa60-403c-11e7-b4e7-854293a1a1ef',	'2017-05-24 04:47:37',	'2017-05-24 04:47:37',	1),
(519,	'This is added by Shadi',	'1c6efa61-403c-11e7-b4e7-854293a1a1ef',	'2017-05-24 04:47:37',	'2017-05-24 04:47:37',	1),
(520,	'Company Layoff',	'9c5e8940-40bc-11e7-8de3-618ae53f3932',	'2017-05-24 20:07:27',	'2017-05-24 20:07:27',	1),
(521,	'',	'9c5eb050-40bc-11e7-8de3-618ae53f3932',	'2017-05-24 20:07:27',	'2017-05-24 20:07:27',	1),
(522,	'Email',	'email_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(523,	'Business email address',	'email_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(524,	'DOB',	'dob_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(525,	'Date of Birth (mm/dd/yyyy)',	'dob_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(526,	'Address (Business)',	'address_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(527,	'Address (Business)',	'address_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(528,	'City of the employee\'s workplace',	'city_business_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(529,	'State (Business)',	'state_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(530,	'State of the employee\'s workplace',	'state_business_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(531,	'Country (Business)',	'country_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(532,	'Country of the employee\'s workplace',	'country_business_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(533,	'Zip (Business)',	'zip_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(534,	'Zip Code of the employee\'s workplace',	'zip_code_business_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(535,	'Zip Code (Business)',	'zip_code_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(536,	'Address (Personal)',	'address_personal_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(538,	'Address of the employee\'s residance',	'address_personal_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(539,	'Address (Personal)',	'address_personal_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(540,	'City (Personal)',	'city_personal_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(541,	'City of the employee\'s residance',	'city_personal_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(542,	'State (Personal)',	'state_personal_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(543,	'State of the employee\'s residance',	'state_personal_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(544,	'Education Level',	'education_level_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(545,	'Highest education level completed by the employee (such as BS, Masters, PhD)',	'education_level_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(546,	'Hire Date',	'hire_date_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(547,	'The date when the employee joined the company (mm/dd/yyyy)',	'hire_date_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(548,	'Termination Date',	'termination_date_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(549,	'The date when the employee left the company, whether voluntary or involuntary (mm/dd/yyyy)',	'termination_date_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(550,	'Job Level',	'job_level_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(551,	'The level of career development assigned to the employee (such as junior, senior, manager, executive)',	'job_level_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(552,	'Current Job Code',	'current_job_code_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(553,	'Unique identifier (code or name) for the position the employee currently occupies',	'current_job_code_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(554,	'Manager Employee ID',	'manager_employee_id_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(555,	'The Employee ID (unique identifier) of the employee\'s manager. Should match a value in the \"Employee ID\" field for this employee\'s manager .',	'manager_employee_id_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(556,	'Employee Type',	'employee_type_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(557,	'The type of employment (such as full-time, part-time, contract)',	'employee_type_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(558,	'Gender',	'gender_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(559,	'The gender of the employee',	'gender_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(560,	'Department',	'department_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(561,	'The name of the department to which the employee currently belongs',	'department_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(562,	'Rehire Date',	'rehire_date_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(563,	'The date when the employee joined the 2nd time after separation (mm/dd/yyyy)',	'rehire_date_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(564,	'Position Start Date',	'position_start_date_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(565,	'The date when the employee occupied the current position at your organization (mm/dd/yyyy)',	'position_start_date_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(566,	'Previous Position Start Date',	'previous_position_start_date_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(567,	'The date when the employee occupied the previous position at your organization (mm/dd/yyyy)',	'previous_position_start_date_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(568,	'Nationality Country',	'nationality_country_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(569,	'The employee\'s country of origin',	'nationality_country_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(570,	'Hire Source',	'hire_source_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(571,	'The channel the employee heard about the job through (such as job fair, LinkedIn, Word of Mouth)',	'hire_source_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(572,	'Industry Salary',	'industry_salary_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(573,	'Market average salary for this position',	'industry_salary_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(574,	'Employee Salary',	'employee_salary_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(575,	'Employee\'s current annual salary in USD',	'employee_salary_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(576,	'Employee Salary (1 year ago)',	'employee_salary_1_year_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(577,	'Employee\'s annual salary of last year in USD',	'employee_salary_1_year_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(578,	'Employee Salary (2 years ago)',	'employee_salary_2_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(579,	'Employee\'s annual salary of 2 years in USD',	'employee_salary_2_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(580,	'Employee Salary (3 years ago)',	'employee_salary_3_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(581,	'Employee\'s annual salary of 3 years in USD',	'employee_salary_3_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(582,	'Employee Salary (4 years ago)',	'employee_salary_4_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(583,	'Performance Rating (this year)',	'performance_rating_this_year_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(584,	'Annual performance rating for this year out of 5 (5 being the best, and 1 the worst)',	'performance_rating_this_year_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(585,	'Performance Rating (1 year ago)',	'performance_rating_1_year_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(586,	'Annual performance rating for last year out of 5 (5 being the best, and 1 the worst)',	'performance_rating_1_year_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(587,	'Annual performance rating for 2 years ago out of 5 (5 being the best, and 1 the worst)',	'performance_rating_2_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(588,	'Performance Rating (2 years ago)',	'performance_rating_2_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(589,	'Performance Rating (3 years ago)',	'performance_rating_3_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(590,	'Annual performance rating for 3 years ago out of 5 (5 being the best, and 1 the worst)',	'performance_rating_3_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(591,	'Performance Rating (4 years ago)',	'performance_rating_4_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(592,	'Annual performance rating for 4 years ago out of 5 (5 being the best, and 1 the worst)',	'performance_rating_4_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(593,	'Remote Employee',	'remote_employee_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(594,	'Yes/No field indicates whether the employee works remotely or not. Blank value corresponds to No.',	'remote_employee_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(595,	'Voluntary Termination',	'voluntary_termination_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(596,	'Yes/No field to be used for terminated employees. Yes means voluntary termination, No means involuntary.',	'_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(597,	'Prof. Development',	'prof_development_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(598,	'Yes/No field to be used for terminated employees. Yes means voluntary termination, No means involuntary.',	'voluntary_termination_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(599,	'Yes/No field indicates whether the employee is engaged in a learning opportunity. Blank value corresponds to No.',	'prof_development_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(600,	'Posting Date',	'posting_date_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(601,	'Date when the search process started to hire this employee (mm/dd/yyyy)',	'posting_date_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(602,	'Absences',	'absences_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(603,	'Number of absences taken during the year',	'absences_data_dictionary_field_dictionary',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(604,	'Successor Employee ID',	'successor_employee_id_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(605,	'Employee ID (unique identifier) of the employee\'s planned successor. Should match a value in the \"Employee ID\" field for this employee\'s successor.',	'successor_employee_id_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(606,	'Employee Benefit Costs',	'employee_benefit_costs_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(607,	'The matching cash value (in USD) of the annual benefits provided to the employee for this year.',	'employee_benefit_costs_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(608,	'The matching cash value (in USD) of the annual benefits provided to the employee for last year.',	'employee_benefit_cost_1_year_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(609,	'Employee Benefit Cost (1 year ago)',	'employee_benefit_cost_1_year_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(610,	'Employee Benefit Cost (2 years ago)',	'employee_benefit_cost_2_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(611,	'The matching cash value (in USD) of the annual benefits provided to the employee for 2 years ago.',	'employee_benefit_cost_2_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(612,	'The matching cash value (in USD) of the annual benefits provided to the employee for 3 years ago.',	'employee_benefit_cost_3_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(613,	'Employee Benefit Cost (3 years ago)',	'employee_benefit_cost_3_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(614,	'Employee Benefit Cost (4 years ago)',	'employee_benefit_cost_4_years_ago_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(615,	'The matching cash value (in USD) of the annual benefits provided to the employee for 4 years ago.',	'employee_benefit_cost_4_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(616,	'Current Job Code',	'current_job_code_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(617,	'Unique identifier (code or name) for the position the employee currently occupies',	'current_job_code_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(618,	'Number of absences taken during the year',	'absences_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(619,	'Employees annual salary of 4 years ago in USD',	'employee_salary_4_years_ago_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(620,	'Address of the employee\'s workplace',	'address_business_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(621,	'City (Business)',	'city_business_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(622,	'Country (Personal)',	'country_personal_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(623,	'Country of the employee\'s residence',	'country_personal_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(625,	'Employee\'s first name',	'first_name_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(626,	'Employee\'s middle name',	'middle_name_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(627,	'Employee\'s last name',	'last_name_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(628,	'Unique identifier that is different for each employee',	'employee_id_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(629,	'Zip Code of the employee\'s residence',	'zip_code_personal_data_dictionary_field_description',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(630,	'Zip Code (Personal)',	'zip_code_personal_data_dictionary_field_name',	'0000-00-00 00:00:00',	'0000-00-00 00:00:00',	1),
(631,	'Empty',	'empty',	'2017-05-31 14:50:31',	'2017-05-31 14:50:31',	1);;;;;

DROP TABLE IF EXISTS `trendata_user_address`;;;;;
CREATE TABLE `trendata_user_address` (
  `trendata_user_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_user_address_city` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_user_address_state` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_user_address_one` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_user_address_two` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_user_address_zipcode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_user_id` int(10) unsigned DEFAULT NULL,
  `trendata_country_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_user_address_id`),
  KEY `trendata_user_id` (`trendata_user_id`),
  KEY `trendata_country_id` (`trendata_country_id`),
  CONSTRAINT `trendata_user_address_ibfk_1` FOREIGN KEY (`trendata_user_id`) REFERENCES `trendata_user` (`trendata_user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_user_address_ibfk_2` FOREIGN KEY (`trendata_country_id`) REFERENCES `trendata_country` (`trendata_country_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_user_address`;;;;;

DROP TABLE IF EXISTS `trendata_user_role`;;;;;
CREATE TABLE `trendata_user_role` (
  `trendata_user_role_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trendata_user_role_created_by` int(10) unsigned DEFAULT NULL,
  `trendata_user_role_last_modified_by` int(10) unsigned DEFAULT NULL,
  `trendata_user_role_status` enum('0','1','2') COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `trendata_user_id` int(10) unsigned DEFAULT NULL,
  `trendata_role_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`trendata_user_role_id`),
  KEY `trendata_user_id` (`trendata_user_id`),
  KEY `trendata_role_id` (`trendata_role_id`),
  CONSTRAINT `trendata_user_role_ibfk_1` FOREIGN KEY (`trendata_user_id`) REFERENCES `trendata_user` (`trendata_user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trendata_user_role_ibfk_2` FOREIGN KEY (`trendata_role_id`) REFERENCES `trendata_role` (`trendata_role_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;;;;;

TRUNCATE `trendata_user_role`;;;;;

-- 2017-06-01 14:15:35
