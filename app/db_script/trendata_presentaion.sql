-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Nov 07, 2016 at 01:30 PM
-- Server version: 5.5.42
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trendata_presentaion`
--

-- --------------------------------------------------------

--
-- Table structure for table `trendata_chart_type`
--

CREATE TABLE `trendata_chart_type` (
  `trendata_chart_type_id` int(10) unsigned NOT NULL,
  `trendata_chart_type_created_by` int(10) unsigned NOT NULL,
  `trendata_chart_type_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_chart_type_created_on` datetime NOT NULL,
  `trendata_chart_type_last_modified_on` datetime NOT NULL,
  `trendata_chart_type_key` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_type_title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_chart_type_description` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `trendata_chart_type`
--

INSERT INTO `trendata_chart_type` (`trendata_chart_type_id`, `trendata_chart_type_created_by`, `trendata_chart_type_last_modified_by`, `trendata_chart_type_created_on`, `trendata_chart_type_last_modified_on`, `trendata_chart_type_key`, `trendata_chart_type_title`, `trendata_chart_type_description`) VALUES
(1, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'scrollline2d', 'scrollline2d', 'multiline chart'),
(2, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'doughnut2d', 'doughnut2d', 'doughnut chart'),
(3, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'scrollstackedcolumn2d', 'scrollstackedcolumn2d', 'stacked column chart'),
(4, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'scrollarea2d', 'scrollarea2d', 'multi-series area chart'),
(5, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'mssplinearea', 'mssplinearea', 'multi-series spine chart'),
(6, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'scrollcolumn2d', 'scrollcolumn2d', 'multi-series column chart'),
(7, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'mscolumn2d', 'mscolumn2d', 'multi-series 4 column chart'),
(8, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'table', 'table', 'table'),
(9, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'value_box', 'value_box', 'value_box');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_dashboard`
--

CREATE TABLE `trendata_dashboard` (
  `trendata_dashboard_id` int(10) unsigned NOT NULL,
  `trendata_dashboard_created_by` int(10) unsigned NOT NULL,
  `trendata_dashboard_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_dashboard_created_on` datetime NOT NULL,
  `trendata_dashboard_last_modified_0n` datetime NOT NULL,
  `trendata_dashboard_title_token` varchar(36) NOT NULL,
  `trendata_dashboard_description_token` varchar(36) NOT NULL,
  `trendata_dashboard_status` enum('0','1','2') NOT NULL DEFAULT '1' COMMENT '0: Inavtive; 1 : Active; 2 : Deleted',
  `trendata_dashboard_is_default` tinyint(10) unsigned NOT NULL DEFAULT '0',
  `trendata_dashboard_icon` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_dashboard`
--

INSERT INTO `trendata_dashboard` (`trendata_dashboard_id`, `trendata_dashboard_created_by`, `trendata_dashboard_last_modified_by`, `trendata_dashboard_created_on`, `trendata_dashboard_last_modified_0n`, `trendata_dashboard_title_token`, `trendata_dashboard_description_token`, `trendata_dashboard_status`, `trendata_dashboard_is_default`, `trendata_dashboard_icon`) VALUES
(1, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406', '', '1', 0, 'fa fa-tachometer');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_dashboard_chart`
--

CREATE TABLE `trendata_dashboard_chart` (
  `trendata_dashboard_chart_id` int(10) unsigned NOT NULL,
  `trendata_dashboard_chart_created_by` int(10) unsigned NOT NULL,
  `trendata_dashboard_chart_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_dashboard_chart_created_on` datetime NOT NULL,
  `trendata_dashboard_chart_last_modified_on` datetime NOT NULL,
  `trendata_dashboard_id` int(10) unsigned NOT NULL,
  `trendata_chart_id` int(10) unsigned NOT NULL,
  `trendata_dashboard_chart_order` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_dashboard_chart`
--

INSERT INTO `trendata_dashboard_chart` (`trendata_dashboard_chart_id`, `trendata_dashboard_chart_created_by`, `trendata_dashboard_chart_last_modified_by`, `trendata_dashboard_chart_created_on`, `trendata_dashboard_chart_last_modified_on`, `trendata_dashboard_id`, `trendata_chart_id`, `trendata_dashboard_chart_order`) VALUES
(1, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 7, 0),
(2, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 9, 0),
(3, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 30, 0),
(4, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 29, 0),
(5, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 16, 0),
(6, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 17, 0),
(7, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 32, 0),
(8, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 57, 0),
(9, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 58, 0),
(10, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 59, 0),
(11, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 60, 0);

-- --------------------------------------------------------

--
-- Table structure for table `trendata_event`
--

CREATE TABLE `trendata_event` (
  `trendata_event_id` int(10) unsigned NOT NULL,
  `trendata_event_created_by` int(11) NOT NULL,
  `trendata_event_modified_by` int(11) NOT NULL,
  `trendata_event_created_on` datetime NOT NULL,
  `trendata_event_last_modified_on` datetime NOT NULL,
  `trendata_event_category_id` int(10) unsigned NOT NULL,
  `trendata_event_title_token` varchar(36) NOT NULL,
  `trendata_event_description_token` varchar(36) NOT NULL,
  `trendata_event_start_on` datetime NOT NULL,
  `trendata_event_end_on` datetime NOT NULL,
  `trendata_event_is_public` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: Private ; 1: Public'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_event_category`
--

CREATE TABLE `trendata_event_category` (
  `trendata_event_category_id` int(10) unsigned NOT NULL,
  `trendata_event_category_created_by` int(10) unsigned NOT NULL,
  `trendata_event_category_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_event_category_created_on` datetime NOT NULL,
  `trendata_event_category_last_modified_on` datetime NOT NULL,
  `trendata_event_category_title_token` varchar(255) NOT NULL,
  `trendata_event_category_description_token` text NOT NULL,
  `trendata_event_category_order` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_language`
--

CREATE TABLE `trendata_language` (
  `trendata_language_id` int(10) unsigned NOT NULL,
  `trendata_language_created_by` int(10) unsigned NOT NULL,
  `trendata_language_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_language_created_on` datetime NOT NULL,
  `trendata_language_last_modified_on` datetime NOT NULL,
  `trendata_language_key` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_language_title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `trendata_language_description` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `trendata_language`
--

INSERT INTO `trendata_language` (`trendata_language_id`, `trendata_language_created_by`, `trendata_language_last_modified_by`, `trendata_language_created_on`, `trendata_language_last_modified_on`, `trendata_language_key`, `trendata_language_title`, `trendata_language_description`) VALUES
(1, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'en', 'english', ''),
(2, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'fr', 'french', ''),
(3, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'es', 'spanish', '');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_login_details`
--

CREATE TABLE `trendata_login_details` (
  `trendata_login_details_id` int(10) unsigned NOT NULL,
  `trendata_login_details_user_id` int(10) unsigned NOT NULL,
  `trendata_login_details_auth_token` text NOT NULL,
  `trendata_login_details_ip_address` varchar(50) NOT NULL,
  `trendata_login_details_login_time` datetime NOT NULL,
  `trendata_login_details_logout_time` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_login_details`
--

INSERT INTO `trendata_login_details` (`trendata_login_details_id`, `trendata_login_details_user_id`, `trendata_login_details_auth_token`, `trendata_login_details_ip_address`, `trendata_login_details_login_time`, `trendata_login_details_logout_time`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', '127.0.0.1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', '127.0.0.1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', '127.0.0.2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTE5NTA3LCJpYXQiOjE0NzczMTQ3MDd9.LEOmsraUMxE4KePtMhuHvb5K0pOFcvt0smvt8sNJb1c', '127.0.0.2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTE5NjU2LCJpYXQiOjE0NzczMTQ4NTZ9.UbCe_JJhCH6iIE-yRJNDBuLN_rUQM4y40P64zVyTtuY', '127.0.0.2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTE5Njc2LCJpYXQiOjE0NzczMTQ4NzZ9.q1jr2K5El1oiVz0eWhweL-WHjdsobL-RUBrN8PBECzM', '127.0.0.2', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTkxNjE5LCJpYXQiOjE0NzczODY4MTl9.L4Zxk6pk61K8mBVAxPTEVMq_pwc66VwkbhzFTEduSV8', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTkyNTA1LCJpYXQiOjE0NzczODc3MDV9.6iM1QRmrF3iGADGm0BNmoHAGiBO-EKrBe5FfoGOZF9Y', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTkyNTk0LCJpYXQiOjE0NzczODc3OTR9.DsbIiS6CM4COTgsmnJ1WmI6PzAxFXWn5edZeG1QpBwE', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTk4NTkwLCJpYXQiOjE0NzczOTM3OTB9.4zL_qyt5jk3G9zFuZxreu3qsqFUldbPbnxk7fL7GYfo', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTk4NzQxLCJpYXQiOjE0NzczOTM5NDF9.J8ahsDXYbWYjvR3ayDPUlVAkFAZdc_JiegibD-CKa5w', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTk4ODA2LCJpYXQiOjE0NzczOTQwMDZ9.cQXKvEnErnhny6TbgKHQB6J1xSdp69e2uEbgDkEcB8g', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTk4ODE4LCJpYXQiOjE0NzczOTQwMTh9.dGS54AvSQH_e9g9rv8S-TZt2fHmum3bWDRxxBAFoMuA', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTk4ODE5LCJpYXQiOjE0NzczOTQwMTl9.yrrS6LhBGW7YRrV5Uin9jn9bHzDuR_q0HmPNWXMveag', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc3OTk5NDYzLCJpYXQiOjE0NzczOTQ2NjN9.-uIlUtV7SYBMe6i0buH_o2RUNifc0V0kuyNVsjQFrtI', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwMDk4LCJpYXQiOjE0NzczOTUyOTh9.dTBATktqHt0sscMIvPkzUngIHM7MyRoyQRuCSpvNhXk', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwNTI5LCJpYXQiOjE0NzczOTU3Mjl9.zCvkHLk8ajVBal9EI5miqHcaqGNvW3RhZYYzu5uOfQk', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwNjM2LCJpYXQiOjE0NzczOTU4MzZ9.s0tYTQIkTCvWSdKJ_UX0428xmVYsn-58tcsOHV7YMNM', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTY1LCJpYXQiOjE0NzczOTYxNjV9.IsA3gQSX7q3RRGdRAfJk6eCJA_Y75P0C1eoW6m0yv68', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTcwLCJpYXQiOjE0NzczOTYxNzB9.dInAfDMKnQVJlOnNrRv_hC6LS4CXh2xoh7d_347kvaY', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTcyLCJpYXQiOjE0NzczOTYxNzJ9.xuoILi9jx-OvxZVOrfzj61uu_l-u6woT5yo3VbOWWOw', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTczLCJpYXQiOjE0NzczOTYxNzN9.IND5OxWawXAh-aFr0vHtpE9zGqBFIyMS9G_g1klva5s', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTc0LCJpYXQiOjE0NzczOTYxNzR9.HEcvNy6H7hN6tE5_EL9D-qVuZMcfZ5lSKJEIxAcNSG4', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTc0LCJpYXQiOjE0NzczOTYxNzR9.HEcvNy6H7hN6tE5_EL9D-qVuZMcfZ5lSKJEIxAcNSG4', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwiZXhwIjoxNDc4MDAwOTc1LCJpYXQiOjE0NzczOTYxNzV9.SmrW6KYf9cYBCOW0VbfbZJY-Ge7fHlTpnc54w3rwggo', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjEsImV4cCI6MTQ3ODE2Mzk5MSwiaWF0IjoxNDc3NTU5MTkxfQ.a8NMU0CsMQrcRK8R4-qGohQ2kUtd_819JQKdkdE28ig', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODE4NDYwNywiaWF0IjoxNDc3NTc5ODA3fQ.FnKwnnao8Ic83cSCqAB492PZpoNG188Jzjq82KAYUH4', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODI0MzQ1MiwiaWF0IjoxNDc3NjM4NjUyfQ.Az9M8nOWvVOqmIPs_AAhtAxwlFUWD4oHfF9f-Uzv03U', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODU5MzIxMSwiaWF0IjoxNDc3OTg4NDExfQ.XMJYAvb-kuUVZbKJz8cMCzMpTf8uvoeUqW1hItwb9h8', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODY2NzQwNCwiaWF0IjoxNDc4MDYyNjA0fQ.5LQ_TrqzcFvXVh-B-tTXAThOD8rHR217Ng3YmfUu4V0', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODc3ODA3MCwiaWF0IjoxNDc4MTczMjcwfQ.D8EtzJyq60ItWvNnNT5xHkM8ONmSooV9-fnAJ2f78-g', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODg2MTI1MCwiaWF0IjoxNDc4MjU2NDUwfQ.1Mr0ybLmgYhUh-46Ff8TnXSszuWXPLwZheWrYvH1IAI', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoidHJlbmRhdGFAbWFpbGluYXRvci5jb20iLCJmaXJzdG5hbWUiOiJqb2huIiwibGFzdG5hbWUiOiJrYXVmIiwibGFuZ3VhZ2UiOjMsImV4cCI6MTQ3ODkzODgzNiwiaWF0IjoxNDc4MzM0MDM2fQ.LQkaznw0eaa7UgwZFa8MJoMhKe9EW9m51zwVzZR5ByM', '::1', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_menu`
--

CREATE TABLE `trendata_menu` (
  `trendata_menu_id` int(10) unsigned NOT NULL,
  `trendata_menu_pid` int(10) unsigned NOT NULL,
  `trendata_menu_created_by` int(10) unsigned NOT NULL,
  `trendata_menu_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_menu_created_on` datetime NOT NULL,
  `trendata_menu_last_modified_on` datetime NOT NULL,
  `trendata_menu_title_token` varchar(36) NOT NULL,
  `trendata_menu_description_token` varchar(36) NOT NULL,
  `trendata_menu_redirect_path` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_menu_permission`
--

CREATE TABLE `trendata_menu_permission` (
  `trendata_menu_permission_id` int(10) unsigned NOT NULL,
  `trendata_menu_permission_created_by` int(11) NOT NULL,
  `trendata_menu_permission_last_modified_by` int(11) NOT NULL,
  `trendata_menu_permission_created_on` datetime NOT NULL,
  `trendata_menu_permission_last_modified_on` datetime NOT NULL,
  `trendata_role_id` int(10) unsigned NOT NULL,
  `trendata_menu_id` int(10) unsigned NOT NULL,
  `trendata_permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_metric`
--

CREATE TABLE `trendata_metric` (
  `trendata_metric_id` int(10) unsigned NOT NULL,
  `trendata_metric_created_on` datetime NOT NULL,
  `trendata_metric_last_modified_on` datetime NOT NULL,
  `trendata_metric_created_by` int(10) unsigned NOT NULL,
  `trendata_metric_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_metric_title_token` varchar(36) NOT NULL,
  `trendata_metric_description_token` varchar(36) NOT NULL,
  `trendata_metric_status` enum('0','1','2') NOT NULL DEFAULT '1',
  `trendata_metric_icon` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_metric`
--

INSERT INTO `trendata_metric` (`trendata_metric_id`, `trendata_metric_created_on`, `trendata_metric_last_modified_on`, `trendata_metric_created_by`, `trendata_metric_last_modified_by`, `trendata_metric_title_token`, `trendata_metric_description_token`, `trendata_metric_status`, `trendata_metric_icon`) VALUES
(1, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '59271b3ab2df41e3bb885eb5ec9e174b', 'c1b6ce2dd2cb4fd1b4b34838bd2e328c', '1', 'fa fa-usd'),
(2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '599610e09cf84f7da452f8afaefaeab3', '4822b7576f1f47e6b9502af8663baa20', '1', 'fa fa-rocket'),
(3, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'c93c95bf14f44c5aa3685dabedd9f460', 'a49c256e98e245b3a645199a237916f4', '1', 'fa fa-question'),
(4, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '3d346ad2f051496aac8cd606f115b92d', 'c90d9811673246af81a80811a09fd234', '1', 'fa fa-binoculars'),
(5, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '7327f74bbbdf415086f4c862b2eb19ac', '7fab0c9e9c8044348395e8c58a0170a8', '1', 'fa fa-line-chart'),
(6, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'df548600dc7e41a7be8fe0c31b498b83', '5faee1a557184db58b0a6a325d98a86c', '1', 'fa fa-tachometer'),
(7, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '0b7d216ab7784640b91d66837b741ad0', 'f16ce19bbf174065a42ca2a5a2fba498', '1', 'fa fa-money'),
(8, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'd3b1562d119a4acf876e61c50b6be4eb', 'eada056534574da5b9a128e6aa0e9580', '1', 'fa fa-key'),
(9, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '94b4b2e146574607a25e0ffe30cf3a8c', '00f769accd24437b876c90913ef78cd8', '1', 'fa fa-arrows-h'),
(10, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '961608e4cb7d4b4584a6d5f5188218a9', '857c3b208b1a4dc781bc8fd51ab76a47', '1', 'fa fa-bullhorn'),
(11, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, 'e93aed9c68824740b582e5e8f1e2f74f', 'a0549138e3f2458ba41dec79814353a0', '1', 'fa fa-thumbs-o-up'),
(12, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '324471e6853f4d049bfbf82308cf66da', 'c0ac6d1176a0443e9d365d369ef0d4bc', '1', 'fa fa-street-view');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_metric_chart`
--

CREATE TABLE `trendata_metric_chart` (
  `trendata_metric_chart_id` int(10) unsigned NOT NULL,
  `trendata_metric_chart_created_by` int(10) unsigned NOT NULL,
  `trendata_metric_chart_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_metric_chart_created_on` datetime NOT NULL,
  `trendata_metric_chart_last_modified_on` datetime NOT NULL,
  `trendata_metric_id` int(10) unsigned NOT NULL,
  `trendata_chart_id` int(10) unsigned NOT NULL,
  `trendata_metric_chart_order` int(10) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `trendata_metric_chart`
--

INSERT INTO `trendata_metric_chart` (`trendata_metric_chart_id`, `trendata_metric_chart_created_by`, `trendata_metric_chart_last_modified_by`, `trendata_metric_chart_created_on`, `trendata_metric_chart_last_modified_on`, `trendata_metric_id`, `trendata_chart_id`, `trendata_metric_chart_order`) VALUES
(2, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 1, 0),
(3, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 2, 0),
(4, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 3, 0),
(5, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 4, 0),
(6, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 5, 0),
(7, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 6, 0),
(8, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 7, 0),
(9, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 8, 0),
(10, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 9, 0),
(11, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 10, 0),
(12, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 11, 0),
(13, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 12, 0),
(14, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 13, 0),
(15, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 14, 0),
(16, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 15, 0),
(17, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 16, 0),
(18, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 17, 0),
(19, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 18, 0),
(20, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 19, 0),
(21, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 20, 0),
(22, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 21, 0),
(23, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 22, 0),
(24, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 23, 0),
(25, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 24, 0),
(26, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 25, 0),
(27, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 26, 0),
(28, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 27, 0),
(29, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 28, 0),
(30, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 29, 0),
(31, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 30, 0),
(32, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 31, 0),
(33, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 32, 0),
(34, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 33, 0),
(35, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 34, 0),
(36, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 35, 0),
(37, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 36, 0),
(38, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 12, 37, 0),
(39, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 12, 38, 0),
(40, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 12, 39, 0),
(41, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 40, 0),
(42, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 41, 0),
(43, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 42, 0),
(44, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 43, 0),
(45, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 44, 0),
(46, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 45, 0),
(47, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 46, 0),
(48, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 47, 0),
(49, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 48, 0),
(50, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 49, 0),
(51, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 50, 0),
(52, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 51, 0),
(53, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 52, 0),
(54, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 53, 0),
(55, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 54, 0),
(56, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 55, 0),
(57, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 56, 0);

-- --------------------------------------------------------

--
-- Table structure for table `trendata_permission`
--

CREATE TABLE `trendata_permission` (
  `trendata_permission_id` int(11) NOT NULL,
  `trendata_permission_created_by` int(10) unsigned NOT NULL,
  `trendata_permission_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_permission_created_on` datetime NOT NULL,
  `trendata_permission_last_modified_on` datetime NOT NULL,
  `trendata_permission_title` int(11) NOT NULL,
  `trendata_permission_description` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_role`
--

CREATE TABLE `trendata_role` (
  `trendata_role_id` int(10) unsigned NOT NULL,
  `trendata_role_created_on` datetime NOT NULL,
  `trendata_role_last_modified_on` datetime NOT NULL,
  `trendata_role_created_by` int(11) NOT NULL,
  `trendata_role_last_modified_by` int(11) NOT NULL,
  `trendata_role_name` varchar(100) NOT NULL,
  `trendata_role_status` enum('0','1','2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_role_metric`
--

CREATE TABLE `trendata_role_metric` (
  `trendata_role_metric_created_by` int(10) unsigned NOT NULL,
  `trendata_role_metric_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_role_metric_created_on` datetime NOT NULL,
  `trendata_role_metric_last_modified_on` datetime NOT NULL,
  `trendata_role_id` int(10) unsigned NOT NULL,
  `trendata_metric_id` int(10) unsigned NOT NULL,
  `trendata_role_metric_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_tag`
--

CREATE TABLE `trendata_tag` (
  `trendata_tag_id` int(10) unsigned NOT NULL,
  `trendata_tag_title` varchar(255) NOT NULL,
  `trendata_tag_description` text NOT NULL,
  `trendata_tag_status` enum('0','1','2') NOT NULL DEFAULT '1' COMMENT '0: Inavtive; 1 : Active; 2 : Deleted'
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_tag`
--

INSERT INTO `trendata_tag` (`trendata_tag_id`, `trendata_tag_title`, `trendata_tag_description`, `trendata_tag_status`) VALUES
(1, 'headcount', '', '1'),
(2, 'location', '', '1'),
(3, 'departments', '', '1'),
(4, 'designations', '', '1'),
(5, 'talent', '', '1'),
(6, 'productivity', '', '1'),
(7, 'manager', '', '1'),
(8, 'profit', '', '1'),
(9, 'employee', '', '1'),
(10, 'turnover', '', '1'),
(11, 'attrition', '', '1'),
(12, 'tenure', '', '1'),
(13, 'opportunity', '', '1'),
(14, 'salary', '', '1'),
(16, 'holiday', '', '1'),
(17, 'sickness', '', '1'),
(18, 'expenses', '', '1'),
(19, 'absence', '', '1'),
(20, 'compa', '', '1'),
(21, 'equivalents', '', '1'),
(22, 'health_care', '', '1'),
(23, 'interview_', '', '1'),
(24, 'satisfaction', '', '1'),
(25, 'gender', '', '1'),
(26, 'equality', '', '1'),
(27, 'job', '', '1'),
(28, 'empowerment', '', '1'),
(29, 'deviation', '', '1'),
(30, 'work_life', '', '1'),
(31, 'presence', '', '1'),
(32, 'global', '', '1'),
(33, 'worker', '', '1'),
(34, 'compensation', '', '1'),
(35, 'severity', '', '1'),
(36, 'training', '', '1'),
(37, 'recruiting', '', '1'),
(38, 'quality', '', '1'),
(39, 'boarding', '', '1'),
(40, 'nationality', '', '1'),
(41, 'hr', '', '1'),
(42, 'roi', '', '1'),
(43, 'source', '', '1'),
(44, 'Cost', '', '1'),
(45, 'revenue', '', '1'),
(46, 'joining', '', '1'),
(47, 'registration', '', '1');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_chart`
--

CREATE TABLE `trendata_chart` (
  `trendata_chart_id` int(10) unsigned NOT NULL,
  `trendata_chart_key` varchar(100) NOT NULL,
  `trendata_chart_created_by` int(10) unsigned NOT NULL,
  `trendata_chart_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_chart_created_on` datetime NOT NULL,
  `trendata_chart_last_modified_on` datetime NOT NULL,
  `trendata_chart_title_token` varchar(36) NOT NULL,
  `trendata_chart_description_token` varchar(36) NOT NULL,
  `trendata_chart_default_chart_type` int(10) unsigned NOT NULL DEFAULT '4',
  `trendata_chart_status` enum('0','1','2') NOT NULL DEFAULT '1',
  `trendata_chart_position_x` int(10) unsigned NOT NULL DEFAULT '0',
  `trendata_chart_position_y` int(10) unsigned NOT NULL DEFAULT '0',
  `trendata_chart_width` int(10) unsigned NOT NULL DEFAULT '3',
  `trendata_chart_height` int(10) unsigned NOT NULL DEFAULT '4',
  `trendata_chart_type` enum('1','2','3') NOT NULL DEFAULT '1' COMMENT '1: Chart Type, 2: value box, 3:  Table'
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_chart`
--

INSERT INTO `trendata_chart` (`trendata_chart_id`, `trendata_chart_key`, `trendata_chart_created_by`, `trendata_chart_last_modified_by`, `trendata_chart_created_on`, `trendata_chart_last_modified_on`, `trendata_chart_title_token`, `trendata_chart_description_token`, `trendata_chart_default_chart_type`, `trendata_chart_status`, `trendata_chart_position_x`, `trendata_chart_position_y`, `trendata_chart_width`, `trendata_chart_height`, `trendata_chart_type`) VALUES
(1, 'headcount_vs_location', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'db546fdc-b7f4-458f-b19c-6aa8af1ac0de', '086a2280-1e87-40e5-9e60-6de3c4cbcec7', 6, '1', 0, 0, 3, 4, '1'),
(2, 'headcount_vs_departments', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '717ad7ed-b8eb-46e2-a6fd-cfb288d71408', '8eb827e5-5c09-4071-b4d8-77f85c6d7871', 6, '1', 0, 0, 3, 4, '1'),
(3, 'headcount_vs_designations', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'fc166853-115d-4a95-a0aa-6e9a9603064f', '07663e4a-cf66-4d1e-9d79-bb04d6bb8dcb', 4, '1', 0, 0, 3, 4, '1'),
(4, 'headcount_vs_Time', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'c9b1629d-e78e-4362-8100-4e97346e279c', '145d1c36-b8c8-4a69-b64f-06e32530aeea', 6, '1', 0, 0, 3, 4, '1'),
(5, 'talent_vs_potential', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '1dccc3ab-2bcd-4cae-b88f-cdfd1c0508fc', '69a69115-3ce3-4d0d-9493-a4d8c2143c64', 6, '1', 0, 0, 3, 4, '1'),
(6, 'performance_rating', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'e5aacd6c-e3dc-4dc3-9e4c-18d4833d6a41', '3ba782d6-8b1d-4913-a4a4-0fe59421f862', 2, '1', 0, 0, 3, 4, '1'),
(7, 'manager_performance', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '16395b33-b1c7-413a-9d60-16b59119c0e7', '8f3c7058-fd70-4cdf-84a8-622eba2450f5', 2, '1', 0, 0, 3, 4, '1'),
(8, 'above_average_performer_yield_ratio', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '94063e63-fc20-4869-9f48-f5f3c4290cce', '5f827ade-bd06-4cc2-90ae-8cd6648ce733', 2, '1', 0, 0, 3, 4, '1'),
(9, 'profit_per_employee', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '1189b79e-856b-4e77-bd1c-f63144ba1bc0', '4a5a8d74-cacb-40fb-8d4f-8d3a7a87d8ac', 6, '1', 0, 0, 3, 4, '1'),
(10, 'employee_turnover_overall', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'ca4a84d1-33d8-4cee-afbc-a44e02b53c63', 'd5414e1b-82f5-49a1-b3a5-97b9a1df7633', 6, '1', 0, 0, 3, 4, '1'),
(11, 'employee_turnover_by_department', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'e7f16e32-4bf2-4e40-8f3e-fc97bd126068', '90c13d2e-92b8-447f-a698-672112a95b41', 6, '1', 0, 0, 3, 4, '1'),
(12, 'employee_turnover_by_manager', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'f08b35e2-27f8-451b-966d-79d42f304fe9', '60f7bbdc-7ebf-4dcd-a087-dbf7d4140b1a', 6, '1', 0, 0, 3, 4, '1'),
(13, 'attrition_rate_vs_reasons', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2c511354-a824-4012-a022-fccef152af77', '996d58af-0ddb-4035-9081-189375e6bcbf', 2, '1', 0, 0, 3, 4, '1'),
(14, 'average_tenure_vs_department', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '6aa9bda3-e8ef-4975-9040-b79630c2d18b', '9d5ea324-5fe5-40d6-8280-8325693d8897', 6, '1', 0, 0, 3, 4, '1'),
(15, 'average_tenure', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '9d682fb3-dd78-466d-8a11-7508d46805b8', '8183f572-c1da-4b8a-ac3f-82ff4e5afc45', 6, '1', 0, 0, 3, 4, '1'),
(16, 'equal_opportunities', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '87440058-bb5f-4fb6-ae71-0a7c114875bb', 'a6067e33-8b30-4ef3-b8d3-bbda404f80a1', 2, '1', 0, 0, 3, 4, '1'),
(17, 'salary_deviation', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7', '0a3c5546-7e7b-4ec9-b98c-0444bdf1b13b', 6, '1', 0, 0, 3, 4, '1'),
(18, 'profit_per_employee', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'a4eb79d9-9406-44d6-9eb1-7df0cd797e0c', '9d3b3751-2783-471a-9082-33671bb1c618', 6, '1', 0, 0, 3, 4, '1'),
(19, 'holiday_by_departments', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'dd8a6840-d022-4f15-b7aa-5b34c50fc853', '8a04f332-7fd2-4a8b-9876-c4bdcf937dc1', 6, '1', 0, 0, 3, 4, '1'),
(20, 'sickness_by_departments', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0dbeaa22-aab2-40c1-932e-e1288da41c4e', '450066d7-0c6f-49b8-b3ad-153760c9e7d7', 6, '1', 0, 0, 3, 4, '1'),
(21, 'department_expenses', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '07695ea0-89e8-4334-9e02-c501935d7451', '046c5676-87d3-4262-b9f4-a6319949b6fc', 2, '1', 0, 0, 3, 4, '1'),
(22, 'absence_rate', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'aa3ea071-5203-4b19-80b4-d9daaf3fca37', 'f0032877-6c4d-4acf-a1c5-94390ae97827', 2, '1', 0, 0, 3, 4, '1'),
(23, 'compa_ratio_calculation', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '9da1f3b3-8ab9-414d-8313-237fa54b5bdd', 'dd2abfb0-d12f-403f-910b-b8b025c2ad87', 2, '1', 0, 0, 3, 4, '1'),
(24, 'full_time_equivalents ', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'de1c19cf-f7f0-407e-92b1-d5644d0cac74', '2c2a4149-f0fb-42a8-b8f7-141edafffde8', 6, '1', 0, 0, 3, 4, '1'),
(25, 'health_care_costs', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '6159d62c-19ad-4f6c-9a8a-58871454fbd6', 'cc70b9f7-ea49-426f-b220-cf0447de59f5', 2, '1', 0, 0, 3, 4, '1'),
(26, 'interview_accept_yield_ratio', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '999b66d5-82f8-45e3-a7eb-c714f91322f1', '7e13319f-6c68-425e-ace2-3ec8618601a8', 2, '1', 0, 0, 3, 4, '1'),
(27, 'interview_offer_yield_ratio', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '89e835d6-5e56-4d53-8187-43ad08064ca9', 'ddf6cac5-c034-4d48-ae2f-ae550f78f4ba', 2, '1', 0, 0, 3, 4, '1'),
(28, 'employee_satisfaction', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'f3aead0c-ac9b-4d74-a973-1be5f3620424', 'bf668eef-a8b4-4c91-8875-f219245a8267', 2, '1', 0, 0, 3, 4, '1'),
(29, 'gender_equality', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3583300f-1899-4643-8b6d-6a12e28da956', '1345a761-2ba1-4745-b18c-dbf87be2f8d0', 6, '1', 0, 0, 3, 4, '1'),
(30, 'job_empowerment', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'b550e591-c278-42fe-aff3-8594888605c8', '1e6f4711-5195-4d97-9d12-523c826b1775', 6, '1', 0, 0, 3, 4, '1'),
(31, 'work_life_balance', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '56481e3c-aa73-4f0e-a477-a33212415c4f', 'd66ac665-5d5d-4633-bf18-7bc2a98c2b2e', 2, '1', 0, 0, 3, 4, '1'),
(32, 'global_presence', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'ac918054-beb2-4de4-b3e4-87be1691f675', '0ebf4549-5bc7-419b-8c8c-9ea107e787ab', 6, '1', 0, 0, 3, 4, '1'),
(33, 'employee_engagement_score', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '22373c87-98ea-48fa-b8f6-270ea1c46d1d', '876c8361-7459-43b6-b49e-e4c7ee59418b', 2, '1', 0, 0, 3, 4, '1'),
(34, 'workers_compensation_cost_per_employee ', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '9fca591c-07da-49d1-bd18-d6c9c4c01cdc', 'a7913bee-1d9f-494e-84fb-d4bfd74d6a4f', 6, '1', 0, 0, 3, 4, '1'),
(35, 'workers_compensation_incident_rate', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '3efa59d3-8e0b-4be2-98a7-ccec581c85d4', '4bb54b64-a56f-46f2-8ae5-ca79bb198a77', 6, '1', 0, 0, 3, 4, '1'),
(36, 'workers_compensation_severity_rate', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'f0fee89d-d445-4c9f-ac16-a2e52a52bda1', '99d6ab5b-154d-47e9-acb0-5a502ade9306', 6, '1', 0, 0, 3, 4, '1'),
(37, 'training_cost_per_employee_vs_time', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '45c0107e-a062-43cd-8ad0-64fee2e9b905', 'c2257672-3019-4baf-9c47-7ac7fccb95f2', 6, '1', 0, 0, 3, 4, '1'),
(38, 'training_cost_vs_departments', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'b8bd4acc-4f42-44c7-ac24-d2ab44ae29d1', '455cec57-551b-4f56-9b78-2e8de25c9e30', 6, '1', 0, 0, 3, 4, '1'),
(39, 'employees_training_factor', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '4b5ab9e9-939e-4833-b8bb-809ba81d5430', 'cf864f54-8e27-4578-ad20-56aea90040a9', 2, '1', 0, 0, 3, 4, '1'),
(40, 'recruiting_expenses', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '766ea7e7-ce54-4f02-8dad-e69654a6d1d2', 'ab4e98e7-f528-45b1-a559-f8935f10db0f', 2, '1', 0, 0, 3, 4, '1'),
(41, 'quality_of_new_hires', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '6266b8c2-fddd-4353-a26e-01ffb84c2792', '71cc7487-8063-4011-aa0d-9faad7043e06', 2, '1', 0, 0, 3, 4, '1'),
(42, 'time_to_fill_open_positions', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '1bc6a4ba-c931-466d-8f8f-1547452c740e', 'fb16bc43-0ed8-4f25-9590-cd88e2fa2476', 6, '1', 0, 0, 3, 4, '1'),
(43, 'on_boarding_cost', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '6b6e7dbf-94e6-49d1-9474-ab815da07088', '915e4b0e-66c0-401d-8429-1484aacf89d4', 6, '1', 0, 0, 3, 4, '1'),
(44, 'on_boarding_time', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '26722b1e-f590-41dd-88a8-dd3ed75bf1fd', '2f919468-171c-4621-8de0-0825f243bfd0', 6, '1', 0, 0, 3, 4, '1'),
(45, 'employee_vs_monthly_salary_slab', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'e57a302c-11a3-4d6c-88d0-fd9a16b76a31', '67099a19-56de-4790-b4d7-d450f44b0004', 6, '1', 0, 0, 3, 4, '1'),
(46, 'employee_vs_nationality', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '74ab88fb-90ec-4202-b020-9edb8ae0c5bf', '76a09bcf-43c9-431d-84e2-8227cc138dcf', 2, '1', 0, 0, 3, 4, '1'),
(47, 'new_joining_vs_resignation', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '458cf396-a6a8-4862-9525-44e4c127cfba', '16a8b2ca-18f7-4c10-ba34-29e698878252', 2, '1', 0, 0, 3, 4, '1'),
(48, 'human_resource_ratio', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '33d68c6f-be9b-4398-9aa3-573f21eadda7', '9ba926af-0a9a-4a21-ad5a-c49eb2ee7455', 4, '1', 0, 0, 3, 4, '1'),
(49, 'hiring_process', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'd995d16f-791f-48e8-9937-e11fec240598', 'c25a705e-406c-4e7b-aef2-f519911a9314', 6, '1', 0, 0, 3, 4, '1'),
(50, 'roi', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'dbeeda96-4111-4d04-9b30-4f221146e85a', 'f9a1bcf3-74a0-4c3b-bd27-0707d61ae9ee', 2, '1', 0, 0, 3, 4, '1'),
(51, 'cost_vs_revenue', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'fb549a75-3de3-48ce-ab97-f9fbef0def19', '77238613-3f6c-4a93-9a0c-59b02b2f1d62', 2, '1', 0, 0, 3, 4, '1'),
(52, 'hr_expenses', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '7e34a459-2320-43bf-9146-30f9e483b89a', '7afaa113-8fad-4b6b-93d3-1cd6e954a253', 6, '1', 0, 0, 3, 4, '1'),
(53, 'labor_cost_as_percent_of_revenue', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '050c3e7b-52c7-47e4-beb1-3b1e376c0a1b', '4ad51192-d357-48e9-ace3-98ad5552c5fe', 2, '1', 0, 0, 3, 4, '1'),
(54, 'progress_of_objectives', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'fe5d58d5-60f9-4439-97bc-640bfa4f4743', 'c30217b2-9a56-4559-b504-ac29343f1b71', 6, '1', 0, 0, 3, 4, '1'),
(55, 'source_of_hire', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '8736c65c-f63a-463b-a1d3-8769bd869555', '657b1d6a-880a-4cc6-90a8-68fcab4f8e80', 6, '1', 0, 0, 3, 4, '1'),
(56, 'job_offer_yield_ratio', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'a9d34123-db81-4edc-8c2b-6e3226b8eb03', 'd7d190cc-91db-4e95-967f-5b334e05d66e', 6, '1', 0, 0, 3, 4, '1'),
(57, 'employees_cost_with_revenue_details', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'd0b851a1c75a48ca9543fca0497625aa', '7a66069d0afe4a5aaa8b5befa2b2f5c2', 8, '1', 0, 0, 3, 4, '3'),
(58, 'hiring_cycle_time', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'd3ae9c70801a4560a810628f3b3f660a', '', 9, '1', 0, 0, 3, 4, '2'),
(59, 'acceptance_rate', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '6a508904e34446978168a63ea50d8adf', '', 9, '1', 0, 0, 3, 4, '2'),
(60, 'average_salary', 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '602ceaec98474415b8e8efe9b485b53d', '', 9, '1', 0, 0, 3, 4, '2');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_chart_tag`
--

CREATE TABLE `trendata_chart_tag` (
  `trendata_chart_tag_id` int(11) unsigned NOT NULL,
  `trendata_chart_tag_created_by` int(10) unsigned NOT NULL,
  `trendata_chart_tag_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_chart_tag_created_on` datetime NOT NULL,
  `trendata_chart_tag_last_modified_on` datetime NOT NULL,
  `trendata_chart_id` int(11) unsigned NOT NULL,
  `trendata_tag_id` int(11) unsigned NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `trendata_chart_tag`
--

INSERT INTO `trendata_chart_tag` (`trendata_chart_tag_id`, `trendata_chart_tag_created_by`, `trendata_chart_tag_last_modified_by`, `trendata_chart_tag_created_on`, `trendata_chart_tag_last_modified_on`, `trendata_chart_id`, `trendata_tag_id`) VALUES
(1, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 1),
(2, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 1, 2),
(3, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 1),
(4, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2, 3),
(5, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 3, 1),
(6, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 3, 4),
(7, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 4, 1),
(8, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 5),
(9, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 5, 6),
(10, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 6, 6),
(11, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, 6),
(12, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 7, 7),
(13, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 8, 6),
(14, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 9),
(15, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 9, 8),
(16, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 10, 9),
(17, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 10, 10),
(18, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 9),
(19, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 11, 3),
(20, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 12, 9),
(21, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 12, 7),
(22, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 13, 11),
(23, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 14, 3),
(24, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 14, 12),
(25, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 15, 12),
(26, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 16, 13),
(27, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 17, 14),
(28, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 17, 29),
(29, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 18, 9),
(30, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 19, 3),
(31, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 19, 16),
(32, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 20, 3),
(33, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 20, 17),
(34, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 21, 3),
(35, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 21, 18),
(36, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 22, 19),
(37, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 23, 20),
(38, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 24, 21),
(39, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 25, 22),
(40, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 26, 23),
(41, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 27, 23),
(42, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 28, 9),
(43, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 28, 24),
(44, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 29, 25),
(45, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 29, 26),
(46, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 30, 27),
(47, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 25, 28),
(48, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 31, 30),
(49, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 32, 32),
(50, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 32, 31),
(51, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 33, 9),
(52, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 34, 33),
(53, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 33, 34),
(54, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 35, 33),
(55, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 36, 33),
(56, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 36, 35),
(57, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 37, 36),
(58, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 37, 9),
(59, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 38, 36),
(60, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 38, 3),
(61, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 39, 9),
(62, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 39, 36),
(63, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 40, 37),
(64, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 40, 18),
(65, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 41, 38),
(66, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 43, 41),
(67, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 44, 39),
(68, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 45, 9),
(69, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 45, 14),
(70, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 46, 9),
(71, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 46, 40),
(72, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 48, 41),
(73, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 50, 42),
(74, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 52, 41),
(75, 0, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 52, 18);

-- --------------------------------------------------------

--
-- Table structure for table `trendata_translation`
--

CREATE TABLE `trendata_translation` (
  `trendata_translation_id` int(11) unsigned NOT NULL,
  `trendata_language_id` int(11) NOT NULL DEFAULT '1',
  `trendata_translation_text` text COLLATE utf8_unicode_ci NOT NULL,
  `trendata_translation_token` varchar(36) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `trendata_translation`
--

INSERT INTO `trendata_translation` (`trendata_translation_id`, `trendata_language_id`, `trendata_translation_text`, `trendata_translation_token`) VALUES
(1, 1, 'HR Cost', '59271b3ab2df41e3bb885eb5ec9e174b'),
(2, 1, 'HR Responsiveness', '599610e09cf84f7da452f8afaefaeab3'),
(3, 1, 'Issue Management', 'c93c95bf14f44c5aa3685dabedd9f460'),
(4, 1, 'Recruiting', '3d346ad2f051496aac8cd606f115b92d'),
(5, 1, 'Productivity', '7327f74bbbdf415086f4c862b2eb19ac'),
(6, 1, 'Performance Management', 'df548600dc7e41a7be8fe0c31b498b83'),
(7, 1, 'Costs/Salary', '0b7d216ab7784640b91d66837b741ad0'),
(8, 1, 'Key Employees and Star Performers', 'd3b1562d119a4acf876e61c50b6be4eb'),
(9, 1, 'HR Pipeline', '94b4b2e146574607a25e0ffe30cf3a8c'),
(10, 1, 'Employee Retention', '961608e4cb7d4b4584a6d5f5188218a9'),
(11, 1, 'Employee Satisfaction', 'e93aed9c68824740b582e5e8f1e2f74f'),
(12, 1, 'Training and Development', '324471e6853f4d049bfbf82308cf66da'),
(13, 2, 'HR Cost (FR)', '59271b3ab2df41e3bb885eb5ec9e174b'),
(14, 2, 'HR Responsiveness (FR)', '599610e09cf84f7da452f8afaefaeab3'),
(15, 2, 'Issue Management (FR)', 'c93c95bf14f44c5aa3685dabedd9f460'),
(16, 2, 'Recruiting (FR)', '3d346ad2f051496aac8cd606f115b92d'),
(17, 2, 'Productivity (FR)', '7327f74bbbdf415086f4c862b2eb19ac'),
(18, 2, 'Performance Management (FR)', 'df548600dc7e41a7be8fe0c31b498b83'),
(19, 2, 'Costs/Salary (FR)', '0b7d216ab7784640b91d66837b741ad0'),
(20, 2, 'Key Employees and Star Performers (FR)', 'd3b1562d119a4acf876e61c50b6be4eb'),
(21, 2, 'HR Pipeline (FR)', '94b4b2e146574607a25e0ffe30cf3a8c'),
(22, 2, 'Employee Retention (FR)', '961608e4cb7d4b4584a6d5f5188218a9'),
(23, 2, 'Employee Satisfaction (FR)', 'e93aed9c68824740b582e5e8f1e2f74f'),
(24, 2, 'Training and Development (FR)', '324471e6853f4d049bfbf82308cf66da'),
(25, 3, 'HR Cost (es)', '59271b3ab2df41e3bb885eb5ec9e174b'),
(26, 3, 'HR Responsiveness (es)', '599610e09cf84f7da452f8afaefaeab3'),
(27, 3, 'Issue Management (es)', 'c93c95bf14f44c5aa3685dabedd9f460'),
(28, 3, 'Recruiting (es)', '3d346ad2f051496aac8cd606f115b92d'),
(29, 3, 'Productivity (es)', '7327f74bbbdf415086f4c862b2eb19ac'),
(30, 3, 'Performance Management (es)', 'df548600dc7e41a7be8fe0c31b498b83'),
(31, 3, 'Costs/Salary (es)', '0b7d216ab7784640b91d66837b741ad0'),
(32, 3, 'Key Employees and Star Performers (es)', 'd3b1562d119a4acf876e61c50b6be4eb'),
(33, 3, 'HR Pipeline (es)', '94b4b2e146574607a25e0ffe30cf3a8c'),
(34, 3, 'Employee Retention (es)', '961608e4cb7d4b4584a6d5f5188218a9'),
(35, 3, 'Employee Satisfaction (es)', 'e93aed9c68824740b582e5e8f1e2f74f'),
(36, 3, 'Training and Development (es)', '324471e6853f4d049bfbf82308cf66da'),
(37, 1, 'Headcount vs location', 'db546fdc-b7f4-458f-b19c-6aa8af1ac0de'),
(38, 1, 'Headcount vs departments', '717ad7ed-b8eb-46e2-a6fd-cfb288d71408'),
(39, 1, 'Headcount vs designations', 'fc166853-115d-4a95-a0aa-6e9a9603064f'),
(40, 1, 'Headcount vs Time', 'c9b1629d-e78e-4362-8100-4e97346e279c'),
(41, 1, 'Talent vs potential\r\n', '1dccc3ab-2bcd-4cae-b88f-cdfd1c0508fc'),
(42, 1, 'Performance Rating\r\n', 'e5aacd6c-e3dc-4dc3-9e4c-18d4833d6a41'),
(43, 1, 'Manager performance\r\n', '16395b33-b1c7-413a-9d60-16b59119c0e7'),
(44, 1, 'Above Average Performer Yield Ratio\r\n', '94063e63-fc20-4869-9f48-f5f3c4290cce'),
(45, 1, 'Profit Per Employee', '1189b79e-856b-4e77-bd1c-f63144ba1bc0'),
(46, 1, 'Employee turnover - overall\r\n', 'ca4a84d1-33d8-4cee-afbc-a44e02b53c63'),
(47, 1, 'Employee turnover by department\r\n', 'e7f16e32-4bf2-4e40-8f3e-fc97bd126068'),
(48, 1, 'Employee turnover by manager\r\n', 'f08b35e2-27f8-451b-966d-79d42f304fe9'),
(49, 1, 'Attrition rate vs reasons', '2c511354-a824-4012-a022-fccef152af77'),
(50, 1, 'Average tenure vs department\r\n', '6aa9bda3-e8ef-4975-9040-b79630c2d18b'),
(51, 1, 'Average tenure vs years\r\n', '9d682fb3-dd78-466d-8a11-7508d46805b8'),
(52, 1, 'Equal opportunities', '87440058-bb5f-4fb6-ae71-0a7c114875bb'),
(53, 1, 'Salary deviation', '5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7'),
(54, 1, 'Profit per employee vs year\r\n', 'a4eb79d9-9406-44d6-9eb1-7df0cd797e0c'),
(55, 1, 'Holiday by departments', 'dd8a6840-d022-4f15-b7aa-5b34c50fc853'),
(56, 1, 'Sickness by departments\r\n', '0dbeaa22-aab2-40c1-932e-e1288da41c4e'),
(57, 1, 'Department Expenses\r\n', '07695ea0-89e8-4334-9e02-c501935d7451'),
(58, 1, 'Absence Rate\r\n', 'aa3ea071-5203-4b19-80b4-d9daaf3fca37'),
(59, 1, 'Compa Ratio Calculation\r\n', '9da1f3b3-8ab9-414d-8313-237fa54b5bdd'),
(60, 1, 'Full-Time Equivalents (FTE) Calculations\r\n', 'de1c19cf-f7f0-407e-92b1-d5644d0cac74'),
(61, 1, 'Health Care Costs\r\n', '6159d62c-19ad-4f6c-9a8a-58871454fbd6'),
(62, 1, 'Interview Accept Yield Ratio\r\n', '999b66d5-82f8-45e3-a7eb-c714f91322f1'),
(63, 1, 'Interview Offer Yield Ratio\r\n', '89e835d6-5e56-4d53-8187-43ad08064ca9'),
(64, 1, 'Employee satisfaction\r\n', 'f3aead0c-ac9b-4d74-a973-1be5f3620424'),
(65, 1, 'Gender equality\r\n', '3583300f-1899-4643-8b6d-6a12e28da956'),
(66, 1, 'Job empowerment', 'b550e591-c278-42fe-aff3-8594888605c8'),
(67, 1, 'Work/Life Balance', '56481e3c-aa73-4f0e-a477-a33212415c4f'),
(68, 1, 'Global presence\r\n', 'ac918054-beb2-4de4-b3e4-87be1691f675'),
(69, 1, 'Employee engagement score\r\n', '22373c87-98ea-48fa-b8f6-270ea1c46d1d'),
(70, 1, 'Workers'' Compensation Cost per Employee (Cumulative)\r\n', '9fca591c-07da-49d1-bd18-d6c9c4c01cdc'),
(71, 1, 'Workers'' Compensation Incident Rate\r\n', '3efa59d3-8e0b-4be2-98a7-ccec581c85d4'),
(72, 1, 'Workers'' Compensation Severity Rate\r\n', 'f0fee89d-d445-4c9f-ac16-a2e52a52bda1'),
(73, 1, 'Training cost per employee vs time\r\n', '45c0107e-a062-43cd-8ad0-64fee2e9b905'),
(74, 1, 'Training cost vs departments\r\n', 'b8bd4acc-4f42-44c7-ac24-d2ab44ae29d1'),
(75, 1, 'Employees Training Factor\r\n', '4b5ab9e9-939e-4833-b8bb-809ba81d5430'),
(76, 1, 'Recruiting expenses\r\n', '766ea7e7-ce54-4f02-8dad-e69654a6d1d2'),
(77, 1, 'Quality of new hires\r\n', '6266b8c2-fddd-4353-a26e-01ffb84c2792'),
(78, 1, 'Time to fill open positions\r\n', 'Time to fill open positions'),
(79, 1, 'On-boarding cost', '6b6e7dbf-94e6-49d1-9474-ab815da07088'),
(80, 1, 'On-boarding time', '26722b1e-f590-41dd-88a8-dd3ed75bf1fd'),
(81, 1, 'No. of employee vs monthly salary slab\r\n', 'e57a302c-11a3-4d6c-88d0-fd9a16b76a31'),
(82, 1, 'No of employee vs nationality\r\n', '74ab88fb-90ec-4202-b020-9edb8ae0c5bf'),
(83, 1, 'New Joining vs Resignation\r\n', '458cf396-a6a8-4862-9525-44e4c127cfba'),
(84, 1, 'Human Resource Ratio\r\n', '33d68c6f-be9b-4398-9aa3-573f21eadda7'),
(85, 1, 'Hiring Process', 'd995d16f-791f-48e8-9937-e11fec240598'),
(86, 1, 'ROI', 'dbeeda96-4111-4d04-9b30-4f221146e85a'),
(87, 1, 'Cost vs revenue\r\n', 'fb549a75-3de3-48ce-ab97-f9fbef0def19'),
(88, 1, 'Human Resource Expenses \r\n', '7e34a459-2320-43bf-9146-30f9e483b89a'),
(89, 1, 'Labor Cost as Percent of Revenue\r\n', '050c3e7b-52c7-47e4-beb1-3b1e376c0a1b'),
(90, 1, 'Progress of objectives', 'fe5d58d5-60f9-4439-97bc-640bfa4f4743'),
(91, 1, 'Source of hire', '8736c65c-f63a-463b-a1d3-8769bd869555'),
(92, 1, 'Job Offer Yield Ratio', 'a9d34123-db81-4edc-8c2b-6e3226b8eb03'),
(93, 2, 'Headcount vs location (fr)', 'db546fdc-b7f4-458f-b19c-6aa8af1ac0de'),
(94, 2, 'Headcount vs departments (fr)', '717ad7ed-b8eb-46e2-a6fd-cfb288d71408'),
(95, 2, 'Headcount vs designations (fr)', 'fc166853-115d-4a95-a0aa-6e9a9603064f'),
(96, 2, 'Headcount vs Time (fr)', 'c9b1629d-e78e-4362-8100-4e97346e279c'),
(97, 2, 'Talent vs potential (fr)', '1dccc3ab-2bcd-4cae-b88f-cdfd1c0508fc'),
(98, 2, 'Performance Rating (fr)', 'e5aacd6c-e3dc-4dc3-9e4c-18d4833d6a41'),
(99, 2, 'Manager performance (fr)', '16395b33-b1c7-413a-9d60-16b59119c0e7'),
(100, 2, 'Above Average Performer Yield Ratio (fr)', '94063e63-fc20-4869-9f48-f5f3c4290cce'),
(101, 2, 'Profit Per Employee (fr)', '1189b79e-856b-4e77-bd1c-f63144ba1bc0'),
(102, 2, 'Employee turnover - overall (fr)', 'ca4a84d1-33d8-4cee-afbc-a44e02b53c63'),
(103, 2, 'Employee turnover by department (fr)', 'e7f16e32-4bf2-4e40-8f3e-fc97bd126068'),
(104, 2, 'Employee turnover by manager (fr)', 'f08b35e2-27f8-451b-966d-79d42f304fe9'),
(105, 2, 'Attrition rate vs reasons (fr)', '2c511354-a824-4012-a022-fccef152af77'),
(106, 2, 'Average tenure vs department (fr)', '6aa9bda3-e8ef-4975-9040-b79630c2d18b'),
(107, 2, 'Average tenure vs years (fr)', '9d682fb3-dd78-466d-8a11-7508d46805b8'),
(108, 2, 'Equal opportunities (fr)', '87440058-bb5f-4fb6-ae71-0a7c114875bb'),
(109, 2, 'Salary deviation (fr)', '5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7'),
(110, 2, 'Profit per employee vs year (fr)', 'a4eb79d9-9406-44d6-9eb1-7df0cd797e0c'),
(111, 2, 'Holiday by departments (fr)', 'dd8a6840-d022-4f15-b7aa-5b34c50fc853'),
(112, 2, 'Sickness by departments (fr)', '0dbeaa22-aab2-40c1-932e-e1288da41c4e'),
(113, 2, 'Department Expenses (fr)', '07695ea0-89e8-4334-9e02-c501935d7451'),
(114, 2, 'Absence Rate (fr)', 'aa3ea071-5203-4b19-80b4-d9daaf3fca37'),
(115, 2, 'Compa Ratio Calculation (fr)', '9da1f3b3-8ab9-414d-8313-237fa54b5bdd'),
(116, 2, 'Full-Time Equivalents (FTE) Calculations (fr)', 'de1c19cf-f7f0-407e-92b1-d5644d0cac74'),
(117, 2, 'Health Care Costs (fr)', '6159d62c-19ad-4f6c-9a8a-58871454fbd6'),
(118, 2, 'Interview Accept Yield Ratio (fr)', '999b66d5-82f8-45e3-a7eb-c714f91322f1'),
(119, 2, 'Interview Offer Yield Ratio (fr)', '89e835d6-5e56-4d53-8187-43ad08064ca9'),
(120, 2, 'Employee satisfaction (fr)', 'f3aead0c-ac9b-4d74-a973-1be5f3620424'),
(121, 2, 'Gender equality (fr)', '3583300f-1899-4643-8b6d-6a12e28da956'),
(122, 2, 'Job empowerment (fr)', 'b550e591-c278-42fe-aff3-8594888605c8'),
(123, 2, 'Work/Life Balance (fr)', '56481e3c-aa73-4f0e-a477-a33212415c4f'),
(124, 2, 'Global presence (fr)', 'ac918054-beb2-4de4-b3e4-87be1691f675'),
(125, 2, 'Employee engagement score (fr)', '22373c87-98ea-48fa-b8f6-270ea1c46d1d'),
(126, 2, 'Workers'' Compensation Cost per Employee (Cumulative) (fr)', '9fca591c-07da-49d1-bd18-d6c9c4c01cdc'),
(127, 2, 'Workers'' Compensation Incident Rate (fr)', '3efa59d3-8e0b-4be2-98a7-ccec581c85d4'),
(128, 2, 'Workers'' Compensation Severity Rate (fr)', 'f0fee89d-d445-4c9f-ac16-a2e52a52bda1'),
(129, 2, 'Training cost per employee vs time (fr)', '45c0107e-a062-43cd-8ad0-64fee2e9b905'),
(130, 2, 'Training cost vs departments (fr)', 'b8bd4acc-4f42-44c7-ac24-d2ab44ae29d1'),
(131, 2, 'Employees Training Factor (fr)', '4b5ab9e9-939e-4833-b8bb-809ba81d5430'),
(132, 2, 'Recruiting expenses (fr)', '766ea7e7-ce54-4f02-8dad-e69654a6d1d2'),
(133, 2, 'Quality of new hires (fr)', '6266b8c2-fddd-4353-a26e-01ffb84c2792'),
(134, 2, 'Time to fill open positions (fr)', 'Time to fill open positions'),
(135, 2, 'On-boarding cost (fr)', '6b6e7dbf-94e6-49d1-9474-ab815da07088'),
(136, 2, 'On-boarding time (fr)', '26722b1e-f590-41dd-88a8-dd3ed75bf1fd'),
(137, 2, 'No. of employee vs monthly salary slab (fr)', 'e57a302c-11a3-4d6c-88d0-fd9a16b76a31'),
(138, 2, 'No of employee vs nationality (fr)', '74ab88fb-90ec-4202-b020-9edb8ae0c5bf'),
(139, 2, 'New Joining vs Resignation (fr)', '458cf396-a6a8-4862-9525-44e4c127cfba'),
(140, 2, 'Human Resource Ratio (fr)', '33d68c6f-be9b-4398-9aa3-573f21eadda7'),
(141, 2, 'Hiring Process (fr)', 'd995d16f-791f-48e8-9937-e11fec240598'),
(142, 2, 'ROI (fr)', 'dbeeda96-4111-4d04-9b30-4f221146e85a'),
(143, 2, 'Cost vs revenue (fr)', 'fb549a75-3de3-48ce-ab97-f9fbef0def19'),
(144, 2, 'Human Resource Expenses  (fr)', '7e34a459-2320-43bf-9146-30f9e483b89a'),
(145, 2, 'Labor Cost as Percent of Revenue (fr)', '050c3e7b-52c7-47e4-beb1-3b1e376c0a1b'),
(146, 2, 'Progress of objectives (fr)', 'fe5d58d5-60f9-4439-97bc-640bfa4f4743'),
(147, 2, 'Source of hire (fr)', '8736c65c-f63a-463b-a1d3-8769bd869555'),
(148, 2, 'Job Offer Yield Ratio (fr)', 'a9d34123-db81-4edc-8c2b-6e3226b8eb03'),
(149, 3, 'Headcount vs location (es)', 'db546fdc-b7f4-458f-b19c-6aa8af1ac0de'),
(150, 3, 'Headcount vs departments (es)', '717ad7ed-b8eb-46e2-a6fd-cfb288d71408'),
(151, 3, 'Headcount vs designations (es)', 'fc166853-115d-4a95-a0aa-6e9a9603064f'),
(152, 3, 'Headcount vs Time (es)', 'c9b1629d-e78e-4362-8100-4e97346e279c'),
(153, 3, 'Talent vs potential (es)', '1dccc3ab-2bcd-4cae-b88f-cdfd1c0508fc'),
(154, 3, 'Performance Rating (es)', 'e5aacd6c-e3dc-4dc3-9e4c-18d4833d6a41'),
(155, 3, 'Manager performance (es)', '16395b33-b1c7-413a-9d60-16b59119c0e7'),
(156, 3, 'Above Average Performer Yield Ratio (es)', '94063e63-fc20-4869-9f48-f5f3c4290cce'),
(157, 3, 'Profit Per Employee (es)', '1189b79e-856b-4e77-bd1c-f63144ba1bc0'),
(158, 3, 'Employee turnover - overall (es)', 'ca4a84d1-33d8-4cee-afbc-a44e02b53c63'),
(159, 3, 'Employee turnover by department (es)', 'e7f16e32-4bf2-4e40-8f3e-fc97bd126068'),
(160, 3, 'Employee turnover by manager (es)', 'f08b35e2-27f8-451b-966d-79d42f304fe9'),
(161, 3, 'Attrition rate vs reasons (es)', '2c511354-a824-4012-a022-fccef152af77'),
(162, 3, 'Average tenure vs department (es)', '6aa9bda3-e8ef-4975-9040-b79630c2d18b'),
(163, 3, 'Average tenure vs years (es)', '9d682fb3-dd78-466d-8a11-7508d46805b8'),
(164, 3, 'Equal opportunities (es)', '87440058-bb5f-4fb6-ae71-0a7c114875bb'),
(165, 3, 'Salary deviation (es)', '5bde7342-bfc9-45a3-b4d8-4e4e3156b7d7'),
(166, 3, 'Profit per employee vs year (es)', 'a4eb79d9-9406-44d6-9eb1-7df0cd797e0c'),
(167, 3, 'Holiday by departments (es)', 'dd8a6840-d022-4f15-b7aa-5b34c50fc853'),
(168, 3, 'Sickness by departments (es)', '0dbeaa22-aab2-40c1-932e-e1288da41c4e'),
(169, 3, 'Department Expenses (es)', '07695ea0-89e8-4334-9e02-c501935d7451'),
(170, 3, 'Absence Rate (es)', 'aa3ea071-5203-4b19-80b4-d9daaf3fca37'),
(171, 3, 'Compa Ratio Calculation (es)', '9da1f3b3-8ab9-414d-8313-237fa54b5bdd'),
(172, 3, 'Full-Time Equivalents (FTE) Calculations (es)', 'de1c19cf-f7f0-407e-92b1-d5644d0cac74'),
(173, 3, 'Health Care Costs (es)', '6159d62c-19ad-4f6c-9a8a-58871454fbd6'),
(174, 3, 'Interview Accept Yield Ratio (es)', '999b66d5-82f8-45e3-a7eb-c714f91322f1'),
(175, 3, 'Interview Offer Yield Ratio (es)', '89e835d6-5e56-4d53-8187-43ad08064ca9'),
(176, 3, 'Employee satisfaction (es)', 'f3aead0c-ac9b-4d74-a973-1be5f3620424'),
(177, 3, 'Gender equality (es)', '3583300f-1899-4643-8b6d-6a12e28da956'),
(178, 3, 'Job empowerment (es)', 'b550e591-c278-42fe-aff3-8594888605c8'),
(179, 3, 'Work/Life Balance (es)', '56481e3c-aa73-4f0e-a477-a33212415c4f'),
(180, 3, 'Global presence (es)', 'ac918054-beb2-4de4-b3e4-87be1691f675'),
(181, 3, 'Employee engagement score (es)', '22373c87-98ea-48fa-b8f6-270ea1c46d1d'),
(182, 3, 'Workers'' Compensation Cost per Employee (Cumulative) (es)', '9fca591c-07da-49d1-bd18-d6c9c4c01cdc'),
(183, 3, 'Workers'' Compensation Incident Rate (es)', '3efa59d3-8e0b-4be2-98a7-ccec581c85d4'),
(184, 3, 'Workers'' Compensation Severity Rate (es)', 'f0fee89d-d445-4c9f-ac16-a2e52a52bda1'),
(185, 3, 'Training cost per employee vs time (es)', '45c0107e-a062-43cd-8ad0-64fee2e9b905'),
(186, 3, 'Training cost vs departments (es)', 'b8bd4acc-4f42-44c7-ac24-d2ab44ae29d1'),
(187, 3, 'Employees Training Factor (es)', '4b5ab9e9-939e-4833-b8bb-809ba81d5430'),
(188, 3, 'Recruiting expenses (es)', '766ea7e7-ce54-4f02-8dad-e69654a6d1d2'),
(189, 3, 'Quality of new hires (es)', '6266b8c2-fddd-4353-a26e-01ffb84c2792'),
(190, 3, 'Time to fill open positions (es)', 'Time to fill open positions'),
(191, 3, 'On-boarding cost (es)', '6b6e7dbf-94e6-49d1-9474-ab815da07088'),
(192, 3, 'On-boarding time (es)', '26722b1e-f590-41dd-88a8-dd3ed75bf1fd'),
(193, 3, 'No. of employee vs monthly salary slab (es)', 'e57a302c-11a3-4d6c-88d0-fd9a16b76a31'),
(194, 3, 'No of employee vs nationality (es)', '74ab88fb-90ec-4202-b020-9edb8ae0c5bf'),
(195, 3, 'New Joining vs Resignation (es)', '458cf396-a6a8-4862-9525-44e4c127cfba'),
(196, 3, 'Human Resource Ratio (es)', '33d68c6f-be9b-4398-9aa3-573f21eadda7'),
(197, 3, 'Hiring Process (es)', 'd995d16f-791f-48e8-9937-e11fec240598'),
(198, 3, 'ROI (es)', 'dbeeda96-4111-4d04-9b30-4f221146e85a'),
(199, 3, 'Cost vs revenue (es)', 'fb549a75-3de3-48ce-ab97-f9fbef0def19'),
(200, 3, 'Human Resource Expenses  (es)', '7e34a459-2320-43bf-9146-30f9e483b89a'),
(201, 3, 'Labor Cost as Percent of Revenue (es)', '050c3e7b-52c7-47e4-beb1-3b1e376c0a1b'),
(202, 3, 'Progress of objectives (es)', 'fe5d58d5-60f9-4439-97bc-640bfa4f4743'),
(203, 3, 'Source of hire (es)', '8736c65c-f63a-463b-a1d3-8769bd869555'),
(204, 3, 'Job Offer Yield Ratio (es)', 'a9d34123-db81-4edc-8c2b-6e3226b8eb03'),
(205, 1, 'Dashboard', 'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406'),
(206, 2, 'Dashboard (fr)', 'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406'),
(207, 3, 'Dashboard (es)', 'c0eadd82-4bff-4e2f-bbf2-c6ad630f6406'),
(208, 1, 'Employees cost with revenue details', 'd0b851a1c75a48ca9543fca0497625aa'),
(209, 2, 'Employees cost with revenue details (FR)', 'd0b851a1c75a48ca9543fca0497625aa'),
(210, 3, 'Employees cost with revenue details (ES)', 'd0b851a1c75a48ca9543fca0497625aa'),
(211, 1, 'Isquidunt late eum, sum quassunt faceribus, as de nimpor am as as apienim ilique voluptibus mo cus modiorp orendio denda exceatqui num es quistia dem untin cuptur, volore rernatio quias aut volorero te vel exceaquis et accum labor audae nonseque ent odi aut ent.', '7a66069d0afe4a5aaa8b5befa2b2f5c2'),
(212, 2, 'Isquidunt late eum, sum quassunt faceribus, as de nimpor am as as apienim ilique voluptibus mo cus modiorp orendio denda exceatqui num es quistia dem untin cuptur, volore rernatio quias aut volorero te vel exceaquis et accum labor audae nonseque ent odi aut ent. (fr)', '7a66069d0afe4a5aaa8b5befa2b2f5c2'),
(213, 3, 'Isquidunt late eum, sum quassunt faceribus, as de nimpor am as as apienim ilique voluptibus mo cus modiorp orendio denda exceatqui num es quistia dem untin cuptur, volore rernatio quias aut volorero te vel exceaquis et accum labor audae nonseque ent odi aut ent.(es)', '7a66069d0afe4a5aaa8b5befa2b2f5c2'),
(214, 1, 'Acceptance Rate', '6a508904e34446978168a63ea50d8adf'),
(215, 2, 'Acceptance Rate (FR)', '6a508904e34446978168a63ea50d8adf'),
(216, 3, 'Acceptance Rate (ES)', '6a508904e34446978168a63ea50d8adf'),
(218, 1, 'Hiring Cycle Time', 'd3ae9c70801a4560a810628f3b3f660a'),
(219, 2, 'Hiring Cycle Time (FR)', 'd3ae9c70801a4560a810628f3b3f660a'),
(220, 3, 'Hiring Cycle Time (ES)', 'd3ae9c70801a4560a810628f3b3f660a'),
(221, 1, 'Average Salary', '602ceaec98474415b8e8efe9b485b53d'),
(222, 2, 'Average Salary (FR)', '602ceaec98474415b8e8efe9b485b53d'),
(223, 3, 'Average Salary (ES)', '602ceaec98474415b8e8efe9b485b53d');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_user`
--

CREATE TABLE `trendata_user` (
  `trendata_user_id` int(10) unsigned NOT NULL,
  `trendata_user_language_id` int(10) unsigned NOT NULL DEFAULT '1',
  `trendata_user_firstname` varchar(100) NOT NULL,
  `trendata_user_middlename` varchar(100) NOT NULL,
  `trendata_user_lastname` varchar(100) NOT NULL,
  `trendata_user_email` varchar(100) NOT NULL,
  `trendata_user_dob` date NOT NULL,
  `trendata_user_status` enum('0','1','2') NOT NULL,
  `trendata_user_created_on` datetime NOT NULL,
  `trendata_user_last_modified_on` datetime NOT NULL,
  `trendata_user_created_by` int(10) unsigned NOT NULL,
  `trendata_user_last_modified_by` int(10) unsigned NOT NULL,
  `trendata_user_salt` varchar(100) NOT NULL,
  `trendata_user_password` text NOT NULL,
  `trendata_user_reset_password_token` varchar(50) NOT NULL,
  `trendata_user_reset_password_expiry` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trendata_user`
--

INSERT INTO `trendata_user` (`trendata_user_id`, `trendata_user_language_id`, `trendata_user_firstname`, `trendata_user_middlename`, `trendata_user_lastname`, `trendata_user_email`, `trendata_user_dob`, `trendata_user_status`, `trendata_user_created_on`, `trendata_user_last_modified_on`, `trendata_user_created_by`, `trendata_user_last_modified_by`, `trendata_user_salt`, `trendata_user_password`, `trendata_user_reset_password_token`, `trendata_user_reset_password_expiry`) VALUES
(1, 3, 'john', '', 'kauf', 'trendata@mailinator.com', '2016-04-19', '1', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0, '4e8ac6516021035f55e3ac5967236e5d', 'bfe15b328a714d8724f08c126520c53ca443af9cc5e28b3e17aad18e04cec795a0237667ea1d050906563b34c2aacb6c4b88eca9f5e643f914671ce157446d5a', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `trendata_user_address`
--

CREATE TABLE `trendata_user_address` (
  `trendata_user_address_id` int(10) unsigned NOT NULL,
  `trendata_user_id` int(10) unsigned NOT NULL,
  `trendata_user_address_city` varchar(100) NOT NULL,
  `trendata_user_address_state` varchar(100) NOT NULL,
  `trendata_user_address_one` varchar(255) NOT NULL,
  `trendata_user_address_two` varchar(255) NOT NULL,
  `trendata_user_address_zipcode` varchar(10) NOT NULL,
  `trendata_country_id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trendata_user_role`
--

CREATE TABLE `trendata_user_role` (
  `trendata_user_role_id` int(10) unsigned NOT NULL,
  `trendata_user_role_created_by` int(11) NOT NULL,
  `trendata_user_role_last_modified_by` int(11) NOT NULL,
  `trendata_user_role_created_on` datetime NOT NULL,
  `trendata_user_role_last_modified_on` datetime NOT NULL,
  `trendata_user_id` int(10) unsigned NOT NULL,
  `trendata_role_id` int(10) unsigned NOT NULL,
  `trendata_user_role_status` enum('0','1','2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `trendata_chart_type`
--
ALTER TABLE `trendata_chart_type`
  ADD PRIMARY KEY (`trendata_chart_type_id`);

--
-- Indexes for table `trendata_dashboard`
--
ALTER TABLE `trendata_dashboard`
  ADD PRIMARY KEY (`trendata_dashboard_id`);

--
-- Indexes for table `trendata_dashboard_chart`
--
ALTER TABLE `trendata_dashboard_chart`
  ADD PRIMARY KEY (`trendata_dashboard_chart_id`),
  ADD KEY `trendata_dashboard_id` (`trendata_dashboard_id`),
  ADD KEY `trendata_chart_id` (`trendata_chart_id`);

--
-- Indexes for table `trendata_event`
--
ALTER TABLE `trendata_event`
  ADD PRIMARY KEY (`trendata_event_id`),
  ADD KEY `trendata_event_category_id` (`trendata_event_category_id`);

--
-- Indexes for table `trendata_event_category`
--
ALTER TABLE `trendata_event_category`
  ADD PRIMARY KEY (`trendata_event_category_id`);

--
-- Indexes for table `trendata_language`
--
ALTER TABLE `trendata_language`
  ADD PRIMARY KEY (`trendata_language_id`);

--
-- Indexes for table `trendata_login_details`
--
ALTER TABLE `trendata_login_details`
  ADD PRIMARY KEY (`trendata_login_details_id`),
  ADD KEY `trendata_login_details_user_id` (`trendata_login_details_user_id`);

--
-- Indexes for table `trendata_menu`
--
ALTER TABLE `trendata_menu`
  ADD PRIMARY KEY (`trendata_menu_id`);

--
-- Indexes for table `trendata_metric`
--
ALTER TABLE `trendata_metric`
  ADD PRIMARY KEY (`trendata_metric_id`);

--
-- Indexes for table `trendata_metric_chart`
--
ALTER TABLE `trendata_metric_chart`
  ADD PRIMARY KEY (`trendata_metric_chart_id`),
  ADD KEY `trendata_metric_chart_ chart_id` (`trendata_chart_id`),
  ADD KEY `trendata_metric_chart_ metric_id` (`trendata_metric_id`),
  ADD KEY `trendata_metric_id` (`trendata_metric_id`),
  ADD KEY `trendata_chart_id` (`trendata_chart_id`);

--
-- Indexes for table `trendata_permission`
--
ALTER TABLE `trendata_permission`
  ADD PRIMARY KEY (`trendata_permission_id`);

--
-- Indexes for table `trendata_role`
--
ALTER TABLE `trendata_role`
  ADD PRIMARY KEY (`trendata_role_id`);

--
-- Indexes for table `trendata_role_metric`
--
ALTER TABLE `trendata_role_metric`
  ADD PRIMARY KEY (`trendata_role_metric_id`),
  ADD KEY `trendata_role_id` (`trendata_role_id`),
  ADD KEY `trendata_metric_id` (`trendata_metric_id`);

--
-- Indexes for table `trendata_tag`
--
ALTER TABLE `trendata_tag`
  ADD PRIMARY KEY (`trendata_tag_id`);

--
-- Indexes for table `trendata_chart`
--
ALTER TABLE `trendata_chart`
  ADD PRIMARY KEY (`trendata_chart_id`);

--
-- Indexes for table `trendata_chart_tag`
--
ALTER TABLE `trendata_chart_tag`
  ADD PRIMARY KEY (`trendata_chart_tag_id`),
  ADD KEY `trendata_tag_id` (`trendata_tag_id`),
  ADD KEY `trendata_chart_id` (`trendata_chart_id`);

--
-- Indexes for table `trendata_translation`
--
ALTER TABLE `trendata_translation`
  ADD PRIMARY KEY (`trendata_translation_id`),
  ADD KEY `trendata_translation_token` (`trendata_translation_token`),
  ADD KEY `trendata_language_id` (`trendata_language_id`);

--
-- Indexes for table `trendata_user`
--
ALTER TABLE `trendata_user`
  ADD PRIMARY KEY (`trendata_user_id`);

--
-- Indexes for table `trendata_user_address`
--
ALTER TABLE `trendata_user_address`
  ADD PRIMARY KEY (`trendata_user_address_id`);

--
-- Indexes for table `trendata_user_role`
--
ALTER TABLE `trendata_user_role`
  ADD PRIMARY KEY (`trendata_user_role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `trendata_chart_type`
--
ALTER TABLE `trendata_chart_type`
  MODIFY `trendata_chart_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `trendata_dashboard`
--
ALTER TABLE `trendata_dashboard`
  MODIFY `trendata_dashboard_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `trendata_dashboard_chart`
--
ALTER TABLE `trendata_dashboard_chart`
  MODIFY `trendata_dashboard_chart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `trendata_event`
--
ALTER TABLE `trendata_event`
  MODIFY `trendata_event_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_event_category`
--
ALTER TABLE `trendata_event_category`
  MODIFY `trendata_event_category_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_language`
--
ALTER TABLE `trendata_language`
  MODIFY `trendata_language_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `trendata_login_details`
--
ALTER TABLE `trendata_login_details`
  MODIFY `trendata_login_details_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `trendata_menu`
--
ALTER TABLE `trendata_menu`
  MODIFY `trendata_menu_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_metric`
--
ALTER TABLE `trendata_metric`
  MODIFY `trendata_metric_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `trendata_metric_chart`
--
ALTER TABLE `trendata_metric_chart`
  MODIFY `trendata_metric_chart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=58;
--
-- AUTO_INCREMENT for table `trendata_permission`
--
ALTER TABLE `trendata_permission`
  MODIFY `trendata_permission_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_role`
--
ALTER TABLE `trendata_role`
  MODIFY `trendata_role_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_role_metric`
--
ALTER TABLE `trendata_role_metric`
  MODIFY `trendata_role_metric_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_tag`
--
ALTER TABLE `trendata_tag`
  MODIFY `trendata_tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `trendata_chart`
--
ALTER TABLE `trendata_chart`
  MODIFY `trendata_chart_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=61;
--
-- AUTO_INCREMENT for table `trendata_chart_tag`
--
ALTER TABLE `trendata_chart_tag`
  MODIFY `trendata_chart_tag_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=76;
--
-- AUTO_INCREMENT for table `trendata_translation`
--
ALTER TABLE `trendata_translation`
  MODIFY `trendata_translation_id` int(11) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=224;
--
-- AUTO_INCREMENT for table `trendata_user`
--
ALTER TABLE `trendata_user`
  MODIFY `trendata_user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `trendata_user_address`
--
ALTER TABLE `trendata_user_address`
  MODIFY `trendata_user_address_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `trendata_user_role`
--
ALTER TABLE `trendata_user_role`
  MODIFY `trendata_user_role_id` int(10) unsigned NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `trendata_dashboard_chart`
--
ALTER TABLE `trendata_dashboard_chart`
  ADD CONSTRAINT `trendata_dashboard_chart_ibfk_1` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_chart` (`trendata_chart_id`),
  ADD CONSTRAINT `trendata_dashboard_chart_ibfk_2` FOREIGN KEY (`trendata_dashboard_id`) REFERENCES `trendata_dashboard` (`trendata_dashboard_id`);

--
-- Constraints for table `trendata_login_details`
--
ALTER TABLE `trendata_login_details`
  ADD CONSTRAINT `trendata_login_details_ibfk_1` FOREIGN KEY (`trendata_login_details_user_id`) REFERENCES `trendata_user` (`trendata_user_id`);

--
-- Constraints for table `trendata_metric_chart`
--
ALTER TABLE `trendata_metric_chart`
  ADD CONSTRAINT `trendata_metric_chart_ibfk_1` FOREIGN KEY (`trendata_metric_id`) REFERENCES `trendata_metric` (`trendata_metric_id`),
  ADD CONSTRAINT `trendata_metric_chart_ibfk_2` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_metric_chart` (`trendata_chart_id`);

--
-- Constraints for table `trendata_role_metric`
--
ALTER TABLE `trendata_role_metric`
  ADD CONSTRAINT `trendata_role_metric_ibfk_1` FOREIGN KEY (`trendata_role_id`) REFERENCES `trendata_role` (`trendata_role_id`),
  ADD CONSTRAINT `trendata_role_metric_ibfk_2` FOREIGN KEY (`trendata_metric_id`) REFERENCES `trendata_metric` (`trendata_metric_id`);

--
-- Constraints for table `trendata_chart_tag`
--
ALTER TABLE `trendata_chart_tag`
  ADD CONSTRAINT `trendata_chart_tag_ibfk_1` FOREIGN KEY (`trendata_chart_id`) REFERENCES `trendata_chart` (`trendata_chart_id`),
  ADD CONSTRAINT `trendata_chart_tag_ibfk_2` FOREIGN KEY (`trendata_tag_id`) REFERENCES `trendata_tag` (`trendata_tag_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
