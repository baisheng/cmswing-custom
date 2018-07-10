/*
 实验业务表 「1 实验数据, 2 实验报告, 3 实验报告评价」

 Source Server Type    : MySQL
 Source Server Version : 50719
 Source Host           : localhost
 Source Database       : cx

 File Encoding         : utf-8

*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  实验数据
-- ----------------------------
DROP TABLE IF EXISTS `cx_experiment_data`;
CREATE TABLE `cx_experiment_data` (
  `id`       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uid`      INT(10)                         NOT NULL COMMENT '用户 ID',
  `num`      INT(20) DEFAULT '0'             NOT NULL COMMENT '编号',
  `gender`   TINYINT(1) DEFAULT '0'          NOT NULL COMMENT '性别',
  `age`      INT(4) DEFAULT '0'              NOT NULL COMMENT '年龄',
  `c1`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '特征1',
  `c2`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '特征2',
  `r1`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '实验条件1',
  `r2`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '实验条件2',
  `r3`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '实验条件3',
  `t1`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '反映时1',
  `t2`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '反映时2',
  `a1`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '反映行为1',
  `a2`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '反映行为2',
  `a3`       INT(20) UNSIGNED DEFAULT '0'    NOT NULL COMMENT '反映行为3',
  `date`     BIGINT(13) UNSIGNED DEFAULT '0' NOT NULL COMMENT '添加时间',
  `modified` BIGINT(13) UNSIGNED DEFAULT '0' NOT NULL COMMENT '修改时间'
) COMMENT '实验数据' ENGINE = InnoDB DEFAULT CHARSET = utf8;


-- ----------------------------
--  实验报告
-- ----------------------------
DROP TABLE IF EXISTS `cx_experiment_report`;
CREATE TABLE `cx_experiment_report` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `uid` int(11) unsigned NOT NULL COMMENT '用户id',
  `name` char(40) default '' COMMENT '标识',
  `title` char(80) NOT NULL COMMENT '报告标题',
  `category_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '分类',
  `group_id` smallint(3) unsigned NOT NULL DEFAULT '0' COMMENT '所属分组',
  `model_id` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '内容模型ID',
  `editor` varchar(10) default '0' COMMENT '内容解析类型',
  `content` longtext COMMENT '内容',
  `date` bigint(13) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `modified` bigint(13) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `evaluation` tinyint(4) DEFAULT '0' COMMENT '0待评，1已评',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '数据状态0禁用，1启用，-1删除',
  `sort_id` smallint(6) unsigned NOT NULL DEFAULT '0' COMMENT '分类信息关联id',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `group_id` (`group_id`),
  KEY `status` (`status`),
  KEY `sort_id` (`sort_id`)
) COMMENT '实验报告' ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
--  实验报告评价
-- ----------------------------
DROP TABLE IF EXISTS `cx_experiment_report_evaluates`;
CREATE TABLE `cx_experiment_report_evaluates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` int(11) DEFAULT '0',
  `uid` int(11) DEFAULT '0',
  `content` text,
  `date` bigint(13) DEFAULT '0',
  `modified` bigint(13) DEFAULT '0',
  `vote` tinyint(4) NOT NULL COMMENT '4 优秀 3 良好 2中等 1较差',
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
