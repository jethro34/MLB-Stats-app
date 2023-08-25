-- MySQL Workbench Forward Engineering

-- DDL.sql v.4 on 8/13/23

-- Team 13
-- Daniel Murray - Justo Triana

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema YOUR_DATABASE_NAME_HERE
-- -----------------------------------------------------

CREATE SCHEMA `YOUR_DATABASE_NAME_HERE` ;
USE `YOUR_DATABASE_NAME_HERE` ;

-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Locations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Locations` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Locations` (
  `location_id` TINYINT(4) NOT NULL AUTO_INCREMENT,
  `stadium` VARCHAR(45) NULL DEFAULT NULL,
  `city` VARCHAR(45) NULL DEFAULT NULL,
  `state` VARCHAR(2) NULL DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE INDEX `stadium_UNIQUE` (`stadium` ASC) VISIBLE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dumping data for table `Locations`
-- -----------------------------------------------------

INSERT INTO `Locations` (`location_id`, `stadium`, `city`, `state`) VALUES
  (1, 'Truist Park', 'Atlanta', 'GA'),
  (2, 'Fenway Park', 'Boston', 'MA'),
  (3, 'Guaranteed Rate Field', 'Chicago', 'IL'),
  (4, 'Petco Park', 'San Diego', 'CA'),
  (5, 'Globe Life Field', 'Arlington', 'TX');

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Teams`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Teams` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Teams` (
  `team_name` VARCHAR(45) NOT NULL,
  `division` VARCHAR(2) NULL DEFAULT NULL,
  `coach_last_name` VARCHAR(45) NULL DEFAULT NULL COMMENT '		',
  `games_played` TINYINT(4) NULL DEFAULT NULL,
  `games_won` TINYINT(4) NULL DEFAULT NULL,
  `games_lost` TINYINT(4) NULL DEFAULT NULL,
  `home_field` TINYINT(4),
  `standings` TINYINT(4) NULL DEFAULT NULL,
  PRIMARY KEY (`team_name`),
  INDEX `fk_Teams_Locations1_idx` (`home_field` ASC) VISIBLE,
  CONSTRAINT `fk_Teams_Locations1`
    FOREIGN KEY (`home_field`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Locations` (`location_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

--
-- Dumping data for table `Teams`
--

INSERT INTO `Teams` (`team_name`, `division`, `coach_last_name`, `games_played`, `games_won`, `games_lost`, `home_field`, `standings`) VALUES
  ('Atlanta Braves', 'NL', 'Snitker', 4, 4, 0, 1, 1),
  ('Boston Red Sox', 'AL', 'Cora', 4, 3, 1, 2, 2),
  ('Chicago White Sox', 'AL', 'LaRussa', 4, 2, 2, 3, 3),
  ('San Diego Padres', 'NL', 'Melvin', 4, 1, 3, 4, 4),
  ('Texas Rangers', 'AL', 'Bochy', 4, 0, 4, 5, 5);

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Games`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Games` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Games` (
  `game_id` INT(11) NOT NULL AUTO_INCREMENT,
  `date` DATETIME NULL DEFAULT NULL,
  `location_id` TINYINT(4) NULL DEFAULT NULL,
  `away_team` VARCHAR(45) NOT NULL,
  `away_score` TINYINT(4) NULL DEFAULT NULL,
  `home_team` VARCHAR(45) NOT NULL,
  `home_score` TINYINT(4) NULL DEFAULT NULL,
  `is_away_winner` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`game_id`),
  INDEX `fk_Games_Teams1_idx` (`away_team` ASC) VISIBLE,
  INDEX `fk_Games_Teams2_idx` (`home_team` ASC) VISIBLE,
  INDEX `fk_Games_Locations1_idx` (`location_id` ASC) VISIBLE,
  CONSTRAINT `fk_Games_Locations1`
    FOREIGN KEY (`location_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Locations` (`location_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Games_Teams1`
    FOREIGN KEY (`away_team`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Teams` (`team_name`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Games_Teams2`
    FOREIGN KEY (`home_team`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Teams` (`team_name`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 46;

-- -----------------------------------------------------
-- Dumping data for table `Games`
-- -----------------------------------------------------

INSERT INTO `Games` (`game_id`, `date`, `location_id`, `away_team`, `away_score`, `home_team`, `home_score`, `is_away_winner`) VALUES
  (1, '2010-01-25 00:00:00', 1, 'Boston Red Sox', 1, 'Atlanta Braves', 7, 0),
  (2, '2010-01-25 00:00:00', 3, 'San Diego Padres', 0, 'Chicago White Sox', 1, 0),
  (3, '2010-03-25 00:00:00', 5, 'Atlanta Braves', 8, 'Texas Rangers', 7, 1),
  (4, '2010-03-25 00:00:00', 2, 'Chicago White Sox', 2, 'Boston Red Sox', 4, 0),
  (5, '2010-05-25 00:00:00', 4, 'Texas Rangers', 1, 'San Diego Padres', 3, 0),
  (6, '2010-05-25 00:00:00', 3, 'Atlanta Braves', 3, 'Chicago White Sox', 2, 1),
  (7, '2010-07-25 00:00:00', 4, 'Boston Red Sox', 5, 'San Diego Padres', 3, 1),
  (8, '2010-07-25 00:00:00', 5, 'Chicago White Sox', 8, 'Texas Rangers', 2, 1),
  (9, '2010-09-25 00:00:00', 1, 'San Diego Padres', 0, 'Atlanta Braves', 5, 0),
  (10, '2010-09-25 00:00:00', 2, 'Texas Rangers', 3, 'Boston Red Sox', 10, 0);

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Players`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Players` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Players` (
  `player_id` INT(11) NOT NULL AUTO_INCREMENT,
  `last_name` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `dob` DATE NULL DEFAULT NULL,
  `is_pitcher` TINYINT(1) NULL DEFAULT NULL,
  `hand` VARCHAR(12) NULL DEFAULT NULL,
  PRIMARY KEY (`player_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 118;

-- -----------------------------------------------------
-- Dumping data for table `Players`
-- -----------------------------------------------------

INSERT INTO `Players` (`player_id`, `last_name`, `first_name`, `dob`, `is_pitcher`, `hand`) VALUES
  (100, 'Wright', 'Kyle', '1996-03-14', 1, 'Right'),
  (101, 'Giolito', 'Lucas', '1994-12-17', 1, 'Right'),
  (102, 'Smyly', 'Drew', '1991-07-15', 1, 'Left'),
  (103, 'Musgrove', 'Joe', '1992-07-01', 1, 'Right'),
  (104, 'Diekman', 'Jake', '1987-11-11', 1, 'Left'),
  (105, 'Olson', 'Matt', '1994-03-29', 0, 'Left'),
  (106, 'Devers', 'Rafael', '1996-10-02', 0, 'Left'),
  (107, 'Garcia', 'Adolis', '1994-02-27', 0, 'Right'),
  (108, 'Machado', 'Manny', '1992-07-06', 0, 'Right'),
  (109, 'Bogaerts', 'Xander', '1992-10-02', 0, 'Right'),
  (110, 'Anderson', 'Tim', '1993-11-23', 0, 'Right'),
  (111, 'Zaval', 'Seby', '1994-04-20', 0, 'Right');

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores` (
  `bat_boxscore_id` INT(11) NOT NULL AUTO_INCREMENT,
  `game_id` INT(11) NOT NULL,
  `player_id` INT(11) NOT NULL,
  `is_starter` TINYINT(4) NULL DEFAULT NULL,
  `at_bats` TINYINT(4) NULL DEFAULT NULL,
  `hits` TINYINT(4) NULL DEFAULT NULL,
  `runs` TINYINT(4) NULL DEFAULT NULL,
  `errors` TINYINT(4) NULL DEFAULT NULL,
  `strikeouts` TINYINT(4) NULL DEFAULT NULL,
  `walks` TINYINT(4) NULL DEFAULT NULL,
  PRIMARY KEY (`bat_boxscore_id`),
  INDEX `fk_Games_has_Players_Players1_idx` (`player_id` ASC) VISIBLE,
  INDEX `fk_Games_has_Players_Games1_idx` (`game_id` ASC) VISIBLE,
  CONSTRAINT `fk_Games_has_Players_Games1`
    FOREIGN KEY (`game_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Games` (`game_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Games_has_Players_Players1`
    FOREIGN KEY (`player_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Players` (`player_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dumping data for table `Batter_Boxscores`
-- -----------------------------------------------------

INSERT INTO `Batter_Boxscores` (`bat_boxscore_id`, `game_id`, `player_id`, `is_starter`, `at_bats`, `hits`, `runs`, `errors`, `strikeouts`, `walks`) VALUES
  (1, 1, 105, 1, 4, 2, 1, 0, 1, 0),
  (2, 1, 106, 1, 3, 1, 0, 1, 2, 0),
  (3, 1, 109, 1, 3, 1, 0, 0, 1, 0),
  (4, 2, 110, 1, 3, 1, 1, 0, 0, 1),
  (5, 2, 111, 0, 4, 0, 0, 0, 2, 0),
  (6, 2, 108, 1, 3, 0, 0, 0, 1, 0);

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Positions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Positions` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Positions` (
  `position` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`position`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dumping data for table `Positions`
-- -----------------------------------------------------

INSERT INTO `Positions` (`position`) VALUES
  ('P'),
  ('C'),
  ('1B'),
  ('2B'),
  ('3B'),
  ('SS'),
  ('LF'),
  ('CF'),
  ('RF'),
  ('DH'),
  ('Pending');

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores_has_Positions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores_has_Positions` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores_has_Positions` (
  `bat_boxscore_id` INT(11) NOT NULL,
  `position` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`bat_boxscore_id`, `position`),
  INDEX `fk_Batter_Boxscores_has_Positions_Positions2_idx` (`position` ASC) VISIBLE,
  INDEX `fk_Batter_Boxscores_has_Positions_Batter_Boxscores2_idx` (`bat_boxscore_id` ASC) VISIBLE,
  CONSTRAINT `fk_Batter_Boxscores_has_Positions_Batter_Boxscores2_idx`
    FOREIGN KEY (`bat_boxscore_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Batter_Boxscores` (`bat_boxscore_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Batter_Boxscores_has_Positions_Positions2_idx`
    FOREIGN KEY (`position`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Positions` (`position`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dumping data for table `Batter_Boxscores_has_Positions`
-- -----------------------------------------------------

INSERT INTO `Batter_Boxscores_has_Positions` (`bat_boxscore_id`, `position`) VALUES
  (1, 'P'),
  (1, 'C'),
  (2, '1B'),
  (2, '2B'),
  (3, '3B'),
  (3, 'SS'),
  (4, 'LF'),
  (4, 'CF'),
  (5, 'RF'),
  (5, 'DH');

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Contracts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Contracts` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Contracts` (
  `contract_id` INT(11) NOT NULL AUTO_INCREMENT,
  `team_name` VARCHAR(45) NOT NULL,
  `player_id` INT(11) NOT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `length_years` TINYINT(4) NULL DEFAULT NULL,
  `total_value` DECIMAL(5,2) NULL DEFAULT NULL,
  PRIMARY KEY (`contract_id`),
  INDEX `fk_Contracts_Players1_idx` (`player_id` ASC) VISIBLE,
  INDEX `fk_Contracts_Teams1_idx` (`team_name` ASC) VISIBLE,
  CONSTRAINT `fk_Contracts_Players1`
    FOREIGN KEY (`player_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Players` (`player_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Contracts_Teams1`
    FOREIGN KEY (`team_name`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Teams` (`team_name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dumping data for table `Contracts`
-- -----------------------------------------------------

INSERT INTO `Contracts` (`contract_id`, `team_name`, `player_id`, `start_date`, `length_years`, `total_value`) VALUES
  (1000, 'Atlanta Braves', 100, '2023-03-01', 1, 0.75),
  (1001, 'Atlanta Braves', 105, '2022-03-19', 8, 218.00),
  (1002, 'Boston Red Sox', 104, '2023-03-21', 1, 2.25),
  (1003, 'Boston Red Sox', 106, '2022-04-01', 12, 341.00),
  (1004, 'Boston Red Sox', 109, '2021-11-22', 10, 330.00),
  (1005, 'Chicago White Sox', 101, '2023-03-15', 1, 10.40),
  (1006, 'Chicago White Sox', 110, '2022-03-15', 8, 130.00),
  (1007, 'Chicago White Sox', 111, '2022-03-28', 2, 5.50),
  (1010, 'San Diego Padres', 103, '2023-03-17', 5, 20.00),
  (1011, 'San Diego Padres', 108, '2021-11-18', 10, 350.00),
  (1008, 'Texas Rangers', 102, '2023-03-15', 1, 3.00),
  (1009, 'Texas Rangers', 107, '2022-03-25', 7, 110.00);

-- --------------------------------------------------------


-- -----------------------------------------------------
-- Table `YOUR_DATABASE_NAME_HERE`.`Pitcher_Boxscores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `YOUR_DATABASE_NAME_HERE`.`Pitcher_Boxscores` ;

CREATE TABLE `YOUR_DATABASE_NAME_HERE`.`Pitcher_Boxscores` (
  `pitch_boxscore_id` INT(11) NOT NULL AUTO_INCREMENT,
  `game_id` INT(11) NOT NULL,
  `player_id` INT(11) NOT NULL,
  `is_starting_p` TINYINT(4) NULL DEFAULT NULL,
  `innings_pitched` DECIMAL(2,1) NULL DEFAULT NULL,
  `earned_runs` TINYINT(4) NULL DEFAULT NULL,
  `hits_allowed` TINYINT(4) NULL DEFAULT NULL,
  `pitch_count` INT(11) NULL DEFAULT NULL,
  `strike_pitches` INT(11) NULL DEFAULT NULL,
  `ball_pitches` INT(11) NULL DEFAULT NULL,
  `strikeouts_given` TINYINT(4) NULL DEFAULT NULL,
  `walks_given` TINYINT(4) NULL DEFAULT NULL,
  `is_winner` TINYINT(4) NULL DEFAULT NULL,
  `is_loser` TINYINT(4) NULL DEFAULT NULL,
  `is_save` TINYINT(4) NULL DEFAULT NULL,
  PRIMARY KEY (`pitch_boxscore_id`),
  INDEX `fk_Games_has_Players_Players1_idx` (`player_id` ASC) VISIBLE,
  INDEX `fk_Games_has_Players_Games1_idx` (`game_id` ASC) VISIBLE,
  CONSTRAINT `fk_Games_has_Players_Games10`
    FOREIGN KEY (`game_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Games` (`game_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Games_has_Players_Players10`
    FOREIGN KEY (`player_id`)
    REFERENCES `YOUR_DATABASE_NAME_HERE`.`Players` (`player_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dumping data for table `Pitcher_Boxscores`
-- -----------------------------------------------------

INSERT INTO `Pitcher_Boxscores` (`pitch_boxscore_id`, `game_id`, `player_id`, `is_starting_p`, `innings_pitched`, `earned_runs`, `hits_allowed`, `pitch_count`, `strike_pitches`, `ball_pitches`, `strikeouts_given`, `walks_given`, `is_winner`, `is_loser`, `is_save`) VALUES
  (1, 1, 100, 1, 7.2, 2, 7, 98, 65, 25, 9, 2, 1, 0, 0),
  (2, 1, 104, 1, 7.0, 4, 9, 100, 41, 45, 6, 4, 0, 1, 0),
  (3, 2, 101, 1, 8.1, 0, 6, 97, 70, 21, 8, 1, 1, 0, 0),
  (4, 2, 103, 0, 5.0, 1, 5, 56, 27, 20, 3, 4, 0, 1, 0),
  (5, 3, 102, 1, 6.2, 3, 8, 82, 40, 36, 5, 5, 0, 1, 0),
  (6, 3, 100, 0, 1.1, 0, 1, 15, 10, 3, 2, 0, 0, 0, 1);

-- --------------------------------------------------------


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;