'use strict';

var Promise = require('bluebird');

module.exports = {
    /**
     * @param queryInterface
     * @param Sequelize
     */
    up: function (queryInterface, Sequelize) {
        return Promise.each([
            'SET NAMES utf8',
            'SET time_zone = \'+00:00\'',
            'SET foreign_key_checks = 0',
            'SET sql_mode = \'NO_AUTO_VALUE_ON_ZERO\'',
            'DELETE FROM `trendata_chart` WHERE `trendata_chart_id` NOT IN (7,17,29,30,55,58,59,60,61,62,63,64,65,66,69,70,71,72,73,74,75,76,77,78)',
            'TRUNCATE TABLE `trendata_chart_tag`',
            'TRUNCATE TABLE `trendata_tag`',

            `INSERT INTO \`trendata_tag\` (\`trendata_tag_id\`, \`trendata_tag_title\`, \`trendata_tag_description\`, \`trendata_tag_status\`, \`created_at\`, \`updated_at\`) VALUES
                (1,	'turnover',	'',	'1',	'2017-06-13 14:13:21',	'2017-06-13 14:13:21'),
                (2,	'attrition',	'',	'1',	'2017-06-13 14:13:43',	'2017-06-13 14:13:43'),
                (3,	'termination',	'',	'1',	'2017-06-13 14:14:02',	'2017-06-13 14:14:02'),
                (4,	'layoff',	'',	'1',	'2017-06-13 14:14:20',	'2017-06-13 14:14:20'),
                (5,	'quit',	'',	'1',	'2017-06-13 14:14:33',	'2017-06-13 14:14:33'),
                (6,	'retire',	'',	'1',	'2017-06-13 14:14:50',	'2017-06-13 14:14:50'),
                (7,	'leave',	'',	'1',	'2017-06-13 14:15:02',	'2017-06-13 14:15:02'),
                (8,	'resignate',	'',	'1',	'2017-06-13 14:15:13',	'2017-06-13 14:15:13'),
                (9,	'resignation',	'',	'1',	'2017-06-13 14:15:41',	'2017-06-13 14:15:41'),
                (10,	'revenue',	'',	'1',	'2017-06-13 14:26:55',	'2017-06-13 14:26:55'),
                (11,	'profit',	'',	'1',	'2017-06-13 14:27:20',	'2017-06-13 14:27:20'),
                (12,	'expense',	'',	'1',	'2017-06-13 14:27:37',	'2017-06-13 14:27:37'),
                (13,	'cost',	'',	'1',	'2017-06-13 14:27:47',	'2017-06-13 14:27:47'),
                (14,	'financial',	'',	'1',	'2017-06-13 14:28:03',	'2017-06-13 14:28:03'),
                (15,	'budget',	'',	'1',	'2017-06-13 14:28:22',	'2017-06-13 14:28:22'),
                (16,	'benefit',	'',	'1',	'2017-06-13 14:28:35',	'2017-06-13 14:28:35'),
                (17,	'health care',	'',	'1',	'2017-06-13 14:28:49',	'2017-06-13 14:28:49'),
                (18,	'cash',	'',	'1',	'2017-06-13 14:29:34',	'2017-06-13 14:29:34'),
                (19,	'salary',	'',	'1',	'2017-06-13 14:29:47',	'2017-06-13 14:29:47'),
                (20,	'performance',	'',	'1',	'2017-06-13 14:35:07',	'2017-06-13 14:35:07'),
                (21,	'productivity',	'',	'1',	'2017-06-13 14:35:31',	'2017-06-13 14:35:31'),
                (22,	'talent',	'',	'1',	'2017-06-13 14:35:43',	'2017-06-13 14:35:43'),
                (23,	'potential',	'',	'1',	'2017-06-13 14:35:58',	'2017-06-13 14:35:58'),
                (24,	'score',	'',	'1',	'2017-06-13 14:37:30',	'2017-06-13 14:37:30'),
                (25,	'tenure',	'',	'1',	'2017-06-13 14:39:47',	'2017-06-13 14:39:47'),
                (26,	'job',	'',	'1',	'2017-06-13 14:40:04',	'2017-06-13 14:40:04'),
                (27,	'designation',	'',	'1',	'2017-06-13 14:40:21',	'2017-06-13 14:40:21'),
                (28,	'years',	'',	'1',	'2017-06-13 14:40:38',	'2017-06-13 14:40:38'),
                (29,	'duration',	'',	'1',	'2017-06-13 14:41:01',	'2017-06-13 14:41:01'),
                (30,	'position',	'',	'1',	'2017-06-13 14:41:22',	'2017-06-13 14:41:22'),
                (31,	'employee',	'',	'1',	'2017-06-13 14:41:45',	'2017-06-13 14:41:45'),
                (32,	'source',	'',	'1',	'2017-06-13 14:45:30',	'2017-06-13 14:45:30'),
                (33,	'hire',	'',	'1',	'2017-06-13 14:46:05',	'2017-06-13 14:46:05'),
                (34,	'recruit',	'',	'1',	'2017-06-13 14:46:21',	'2017-06-13 14:46:21'),
                (35,	'onboard',	'',	'1',	'2017-06-13 14:46:31',	'2017-06-13 14:46:31'),
                (36,	'recruitement',	'',	'1',	'2017-06-13 14:46:43',	'2017-06-13 14:46:43'),
                (37,	'acquisition',	'',	'1',	'2017-06-13 14:46:53',	'2017-06-13 14:46:53'),
                (38,	'linkedin',	'',	'1',	'2017-06-13 14:47:09',	'2017-06-13 14:47:09'),
                (39,	'facebook',	'',	'1',	'2017-06-13 14:47:25',	'2017-06-13 14:47:25'),
                (40,	'time',	'',	'1',	'2017-06-13 14:49:25',	'2017-06-13 14:49:25'),
                (41,	'fill',	'',	'1',	'2017-06-13 14:49:37',	'2017-06-13 14:49:37'),
                (42,	'money',	'',	'1',	'2017-06-13 14:57:18',	'2017-06-13 14:57:18'),
                (43,	'compensation',	'',	'1',	'2017-06-13 14:58:05',	'2017-06-13 14:58:05'),
                (44,	'number',	'',	'1',	'2017-06-13 15:04:39',	'2017-06-13 15:04:39'),
                (45,	'employees',	'',	'1',	'2017-06-13 15:05:00',	'2017-06-13 15:05:00'),
                (46,	'population',	'',	'1',	'2017-06-13 15:05:10',	'2017-06-13 15:05:10'),
                (47,	'department',	'',	'1',	'2017-06-13 15:05:19',	'2017-06-13 15:05:19'),
                (48,	'statistics',	'',	'1',	'2017-06-13 15:05:34',	'2017-06-13 15:05:34'),
                (49,	'demography',	'',	'1',	'2017-06-13 15:05:45',	'2017-06-13 15:05:45'),
                (50,	'race',	'',	'1',	'2017-06-13 15:06:00',	'2017-06-13 15:06:00'),
                (51,	'gender',	'',	'1',	'2017-06-13 15:06:13',	'2017-06-13 15:06:13'),
                (52,	'background',	'',	'1',	'2017-06-13 15:06:27',	'2017-06-13 15:06:27'),
                (53,	'ethnicity',	'',	'1',	'2017-06-13 15:06:38',	'2017-06-13 15:06:38'),
                (54,	'absence',	'',	'1',	'2017-06-13 15:17:07',	'2017-06-13 15:17:07'),
                (55,	'vacation',	'',	'1',	'2017-06-13 15:17:24',	'2017-06-13 15:17:24'),
                (56,	'day off',	'',	'1',	'2017-06-13 15:17:43',	'2017-06-13 15:17:43'),
                (57,	'holiday',	'',	'1',	'2017-06-13 15:17:59',	'2017-06-13 15:17:59'),
                (58,	'sickness',	'',	'1',	'2017-06-13 15:18:15',	'2017-06-13 15:18:15'),
                (59,	'attendance',	'',	'1',	'2017-06-13 15:18:25',	'2017-06-13 15:18:25'),
                (60,	'training',	'',	'1',	'2017-06-13 15:20:34',	'2017-06-13 15:20:34'),
                (61,	'development',	'',	'1',	'2017-06-13 15:20:43',	'2017-06-13 15:20:43'),
                (62,	'professional',	'',	'1',	'2017-06-13 15:20:55',	'2017-06-13 15:20:55'),
                (63,	'successor',	'',	'1',	'2017-06-13 15:21:09',	'2017-06-13 15:21:09'),
                (64,	'identified',	'',	'1',	'2017-06-13 15:21:20',	'2017-06-13 15:21:20'),
                (65,	'succeed',	'',	'1',	'2017-06-13 15:21:31',	'2017-06-13 15:21:31'),
                (66,	'key',	'',	'1',	'2017-06-13 15:21:55',	'2017-06-13 15:21:55'),
                (67,	'executive',	'',	'1',	'2017-06-13 15:22:08',	'2017-06-13 15:22:08'),
                (68,	'retirement',	'',	'1',	'2017-06-13 15:22:24',	'2017-06-13 15:22:24')
                ON DUPLICATE KEY UPDATE \`trendata_tag_id\` = VALUES(\`trendata_tag_id\`), \`trendata_tag_title\` = VALUES(\`trendata_tag_title\`), \`trendata_tag_description\` = VALUES(\`trendata_tag_description\`), \`trendata_tag_status\` = VALUES(\`trendata_tag_status\`), \`created_at\` = VALUES(\`created_at\`), \`updated_at\` = VALUES(\`updated_at\`)`,

            `INSERT INTO \`trendata_chart_tag\` (\`trendata_chart_tag_id\`, \`trendata_chart_tag_created_by\`, \`trendata_chart_tag_last_modified_by\`, \`created_at\`, \`updated_at\`, \`trendata_chart_id\`, \`trendata_tag_id\`) VALUES
                (3,	NULL,	NULL,	'2017-06-13 14:17:31',	'2017-06-13 14:17:31',	7,	1),
                (4,	NULL,	NULL,	'2017-06-13 14:17:47',	'2017-06-13 14:17:47',	7,	2),
                (5,	NULL,	NULL,	'2017-06-13 14:17:53',	'2017-06-13 14:17:53',	7,	3),
                (6,	NULL,	NULL,	'2017-06-13 14:18:00',	'2017-06-13 14:18:00',	7,	4),
                (8,	NULL,	NULL,	'2017-06-13 14:18:20',	'2017-06-13 14:18:20',	7,	5),
                (9,	NULL,	NULL,	'2017-06-13 14:18:25',	'2017-06-13 14:18:25',	7,	6),
                (10,	NULL,	NULL,	'2017-06-13 14:18:29',	'2017-06-13 14:18:29',	7,	7),
                (11,	NULL,	NULL,	'2017-06-13 14:18:34',	'2017-06-13 14:18:34',	7,	8),
                (12,	NULL,	NULL,	'2017-06-13 14:18:43',	'2017-06-13 14:18:43',	7,	9),
                (13,	NULL,	NULL,	'2017-06-13 14:31:36',	'2017-06-13 14:31:36',	17,	10),
                (14,	NULL,	NULL,	'2017-06-13 14:31:45',	'2017-06-13 14:31:45',	17,	11),
                (15,	NULL,	NULL,	'2017-06-13 14:32:12',	'2017-06-13 14:32:12',	17,	12),
                (16,	NULL,	NULL,	'2017-06-13 14:32:19',	'2017-06-13 14:32:19',	17,	13),
                (17,	NULL,	NULL,	'2017-06-13 14:32:25',	'2017-06-13 14:32:25',	17,	14),
                (18,	NULL,	NULL,	'2017-06-13 14:32:36',	'2017-06-13 14:32:36',	17,	15),
                (19,	NULL,	NULL,	'2017-06-13 14:32:42',	'2017-06-13 14:32:42',	17,	16),
                (20,	NULL,	NULL,	'2017-06-13 14:32:47',	'2017-06-13 14:32:47',	17,	17),
                (21,	NULL,	NULL,	'2017-06-13 14:32:52',	'2017-06-13 14:32:52',	17,	18),
                (22,	NULL,	NULL,	'2017-06-13 14:32:57',	'2017-06-13 14:32:57',	17,	19),
                (23,	NULL,	NULL,	'2017-06-13 14:38:45',	'2017-06-13 14:38:45',	29,	20),
                (24,	NULL,	NULL,	'2017-06-13 14:38:50',	'2017-06-13 14:38:50',	29,	21),
                (25,	NULL,	NULL,	'2017-06-13 14:38:56',	'2017-06-13 14:38:56',	29,	22),
                (26,	NULL,	NULL,	'2017-06-13 14:39:03',	'2017-06-13 14:39:03',	29,	23),
                (27,	NULL,	NULL,	'2017-06-13 14:39:08',	'2017-06-13 14:39:08',	29,	24),
                (28,	NULL,	NULL,	'2017-06-13 14:42:40',	'2017-06-13 14:42:40',	30,	25),
                (29,	NULL,	NULL,	'2017-06-13 14:42:46',	'2017-06-13 14:42:46',	30,	26),
                (30,	NULL,	NULL,	'2017-06-13 14:42:51',	'2017-06-13 14:42:51',	30,	27),
                (31,	NULL,	NULL,	'2017-06-13 14:43:01',	'2017-06-13 14:43:01',	30,	28),
                (32,	NULL,	NULL,	'2017-06-13 14:43:06',	'2017-06-13 14:43:06',	30,	29),
                (33,	NULL,	NULL,	'2017-06-13 14:43:11',	'2017-06-13 14:43:11',	30,	30),
                (34,	NULL,	NULL,	'2017-06-13 14:43:18',	'2017-06-13 14:43:18',	30,	31),
                (35,	NULL,	NULL,	'2017-06-13 14:47:56',	'2017-06-13 14:47:56',	55,	32),
                (36,	NULL,	NULL,	'2017-06-13 14:48:05',	'2017-06-13 14:48:05',	55,	33),
                (37,	NULL,	NULL,	'2017-06-13 14:48:14',	'2017-06-13 14:48:14',	55,	34),
                (38,	NULL,	NULL,	'2017-06-13 14:48:19',	'2017-06-13 14:48:19',	55,	35),
                (39,	NULL,	NULL,	'2017-06-13 14:48:26',	'2017-06-13 14:48:26',	55,	36),
                (40,	NULL,	NULL,	'2017-06-13 14:48:32',	'2017-06-13 14:48:32',	55,	37),
                (41,	NULL,	NULL,	'2017-06-13 14:48:38',	'2017-06-13 14:48:38',	55,	38),
                (42,	NULL,	NULL,	'2017-06-13 14:48:44',	'2017-06-13 14:48:44',	55,	39),
                (43,	NULL,	NULL,	'2017-06-13 14:51:22',	'2017-06-13 14:51:22',	58,	40),
                (44,	NULL,	NULL,	'2017-06-13 14:51:39',	'2017-06-13 14:51:39',	58,	41),
                (45,	NULL,	NULL,	'2017-06-13 14:51:56',	'2017-06-13 14:51:56',	58,	34),
                (46,	NULL,	NULL,	'2017-06-13 14:52:14',	'2017-06-13 14:52:14',	58,	33),
                (47,	NULL,	NULL,	'2017-06-13 14:55:44',	'2017-06-13 14:55:44',	58,	36),
                (48,	NULL,	NULL,	'2017-06-13 14:55:59',	'2017-06-13 14:55:59',	58,	37),
                (49,	NULL,	NULL,	'2017-06-13 14:58:52',	'2017-06-13 14:58:52',	59,	10),
                (50,	NULL,	NULL,	'2017-06-13 14:59:06',	'2017-06-13 14:59:06',	59,	11),
                (51,	NULL,	NULL,	'2017-06-13 14:59:24',	'2017-06-13 14:59:24',	59,	12),
                (52,	NULL,	NULL,	'2017-06-13 14:59:50',	'2017-06-13 14:59:50',	59,	13),
                (53,	NULL,	NULL,	'2017-06-13 15:00:04',	'2017-06-13 15:00:04',	59,	14),
                (54,	NULL,	NULL,	'2017-06-13 15:00:31',	'2017-06-13 15:00:31',	59,	15),
                (55,	NULL,	NULL,	'2017-06-13 15:00:53',	'2017-06-13 15:00:53',	59,	34),
                (56,	NULL,	NULL,	'2017-06-13 15:01:08',	'2017-06-13 15:01:08',	59,	33),
                (57,	NULL,	NULL,	'2017-06-13 15:01:23',	'2017-06-13 15:01:23',	59,	36),
                (58,	NULL,	NULL,	'2017-06-13 15:01:36',	'2017-06-13 15:01:36',	59,	37),
                (59,	NULL,	NULL,	'2017-06-13 15:01:50',	'2017-06-13 15:01:50',	59,	42),
                (60,	NULL,	NULL,	'2017-06-13 15:02:08',	'2017-06-13 15:02:08',	60,	10),
                (61,	NULL,	NULL,	'2017-06-13 15:02:20',	'2017-06-13 15:02:20',	60,	11),
                (62,	NULL,	NULL,	'2017-06-13 15:02:31',	'2017-06-13 15:02:31',	60,	12),
                (63,	NULL,	NULL,	'2017-06-13 15:02:45',	'2017-06-13 15:02:45',	60,	13),
                (64,	NULL,	NULL,	'2017-06-13 15:03:02',	'2017-06-13 15:03:02',	60,	14),
                (65,	NULL,	NULL,	'2017-06-13 15:03:18',	'2017-06-13 15:03:18',	60,	15),
                (66,	NULL,	NULL,	'2017-06-13 15:03:30',	'2017-06-13 15:03:30',	60,	19),
                (67,	NULL,	NULL,	'2017-06-13 15:03:45',	'2017-06-13 15:03:45',	60,	18),
                (68,	NULL,	NULL,	'2017-06-13 15:03:59',	'2017-06-13 15:03:59',	60,	42),
                (69,	NULL,	NULL,	'2017-06-13 15:04:20',	'2017-06-13 15:04:20',	60,	43),
                (70,	NULL,	NULL,	'2017-06-13 15:09:29',	'2017-06-13 15:09:29',	61,	44),
                (71,	NULL,	NULL,	'2017-06-13 15:09:36',	'2017-06-13 15:09:36',	61,	45),
                (72,	NULL,	NULL,	'2017-06-13 15:09:44',	'2017-06-13 15:09:44',	61,	46),
                (73,	NULL,	NULL,	'2017-06-13 15:09:57',	'2017-06-13 15:09:57',	61,	47),
                (74,	NULL,	NULL,	'2017-06-13 15:10:09',	'2017-06-13 15:10:09',	61,	48),
                (75,	NULL,	NULL,	'2017-06-13 15:10:17',	'2017-06-13 15:10:17',	61,	49),
                (76,	NULL,	NULL,	'2017-06-13 15:10:30',	'2017-06-13 15:10:30',	61,	50),
                (77,	NULL,	NULL,	'2017-06-13 15:10:38',	'2017-06-13 15:10:38',	61,	51),
                (78,	NULL,	NULL,	'2017-06-13 15:10:43',	'2017-06-13 15:10:43',	61,	52),
                (79,	NULL,	NULL,	'2017-06-13 15:10:49',	'2017-06-13 15:10:49',	61,	53),
                (80,	NULL,	NULL,	'2017-06-13 15:15:07',	'2017-06-13 15:15:07',	71,	10),
                (81,	NULL,	NULL,	'2017-06-13 15:15:21',	'2017-06-13 15:15:21',	71,	11),
                (82,	NULL,	NULL,	'2017-06-13 15:15:39',	'2017-06-13 15:15:39',	71,	12),
                (83,	NULL,	NULL,	'2017-06-13 15:15:52',	'2017-06-13 15:15:52',	71,	13),
                (84,	NULL,	NULL,	'2017-06-13 15:16:10',	'2017-06-13 15:16:10',	71,	14),
                (85,	NULL,	NULL,	'2017-06-13 15:16:26',	'2017-06-13 15:16:26',	71,	15),
                (86,	NULL,	NULL,	'2017-06-13 15:16:54',	'2017-06-13 15:16:54',	71,	31),
                (87,	NULL,	NULL,	'2017-06-13 15:19:05',	'2017-06-13 15:19:05',	73,	54),
                (88,	NULL,	NULL,	'2017-06-13 15:19:22',	'2017-06-13 15:19:22',	73,	55),
                (89,	NULL,	NULL,	'2017-06-13 15:19:32',	'2017-06-13 15:19:32',	73,	56),
                (90,	NULL,	NULL,	'2017-06-13 15:19:39',	'2017-06-13 15:19:39',	73,	57),
                (91,	NULL,	NULL,	'2017-06-13 15:20:00',	'2017-06-13 15:20:00',	73,	58),
                (92,	NULL,	NULL,	'2017-06-13 15:20:11',	'2017-06-13 15:20:11',	73,	59),
                (93,	NULL,	NULL,	'2017-06-13 15:22:53',	'2017-06-13 15:22:53',	74,	31),
                (94,	NULL,	NULL,	'2017-06-13 15:23:06',	'2017-06-13 15:23:06',	74,	60),
                (95,	NULL,	NULL,	'2017-06-13 15:23:21',	'2017-06-13 15:23:21',	74,	61),
                (96,	NULL,	NULL,	'2017-06-13 15:23:39',	'2017-06-13 15:23:39',	74,	62),
                (97,	NULL,	NULL,	'2017-06-13 15:24:22',	'2017-06-13 15:24:22',	75,	63),
                (98,	NULL,	NULL,	'2017-06-13 15:24:35',	'2017-06-13 15:24:35',	75,	64),
                (99,	NULL,	NULL,	'2017-06-13 15:24:48',	'2017-06-13 15:24:48',	75,	65),
                (100,	NULL,	NULL,	'2017-06-13 15:25:07',	'2017-06-13 15:25:07',	75,	30),
                (101,	NULL,	NULL,	'2017-06-13 15:25:30',	'2017-06-13 15:25:30',	75,	26),
                (102,	NULL,	NULL,	'2017-06-13 15:25:46',	'2017-06-13 15:25:46',	75,	66),
                (103,	NULL,	NULL,	'2017-06-13 15:26:00',	'2017-06-13 15:26:00',	75,	67),
                (104,	NULL,	NULL,	'2017-06-13 15:26:12',	'2017-06-13 15:26:12',	75,	68)
                ON DUPLICATE KEY UPDATE \`trendata_chart_tag_id\` = VALUES(\`trendata_chart_tag_id\`), \`trendata_chart_tag_created_by\` = VALUES(\`trendata_chart_tag_created_by\`), \`trendata_chart_tag_last_modified_by\` = VALUES(\`trendata_chart_tag_last_modified_by\`), \`created_at\` = VALUES(\`created_at\`), \`updated_at\` = VALUES(\`updated_at\`), \`trendata_chart_id\` = VALUES(\`trendata_chart_id\`), \`trendata_tag_id\` = VALUES(\`trendata_tag_id\`)`
        ], function (item) {
            return queryInterface.sequelize.query(item);
        });
    },

    /**
     * @param queryInterface
     * @param Sequelize
     */
    down: function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};
