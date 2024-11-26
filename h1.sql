-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 26-11-2024 a las 14:28:46
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `h1`
--
CREATE DATABASE IF NOT EXISTS `h1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `h1`;

-- --------------------------------------------------------

-- Crear la tabla `users` primero
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email_status` varchar(20) NOT NULL,
  `role` enum('admin','doctor','receptionist','pharmacist','patient','nurse') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Crear la tabla `patients` después de `users`
DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `document` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `date_of_birth` date NOT NULL,
  PRIMARY KEY (`document`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Crear la tabla `doctors` después de `users`
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE IF NOT EXISTS `doctors` (
  `document` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `image` text NOT NULL,
  `department` varchar(50) NOT NULL,
  `biography` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`document`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Crear la tabla `appointment` después de `patients` y `doctors`
DROP TABLE IF EXISTS `appointment`;
CREATE TABLE IF NOT EXISTS `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_document` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `doctor_document` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`patient_document`) REFERENCES `patients`(`document`),
  FOREIGN KEY (`doctor_document`) REFERENCES `doctors`(`document`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para las tablas
--
INSERT INTO `users` (`id`, `username`, `email`, `password`, `email_status`, `role`) VALUES
(1, 'zihad', 'zihad.1d@yopmail.com', '123', 'verified', 'admin'),
(2, 'test', 'test555@yopmail.com', '123', 'verified', 'doctor'),
(3, 'abc', 'gmhs13@yopmail.com', '12345', 'not_verified', 'receptionist'),
(4, 'alamin', 'te555@yopmail.com', 'abc', 'verified', 'pharmacist'),
(5, 'jei', 'cerpajeison8@gmail.com', '123', 'Verificado', 'admin'),
(23, 'Pedro', 'test@test.com', 'patient123', 'not_verified', 'patient'),
(112233, 'Pedro', 'test@test.com', 'patient123', 'not_verified', 'patient'),
(123123, 'Jei Test', 'test@test.com', 'doctor123', 'not_verified', 'doctor');

INSERT INTO `patients` (`document`, `name`, `email`, `phone`, `gender`, `address`, `user_id`, `date_of_birth`) VALUES
('111', 'Isabella', 'test@test.com', '3001112233', 'female', 'calle 23#23-53', 5, '1990-01-01'),
('112233', 'Pedro', 'test@test.com', '30000000', 'male', 'calle 23#23-56', 112233, '2004-02-11');

INSERT INTO `doctors` (`document`, `name`, `email`, `date_of_birth`, `gender`, `address`, `phone`, `image`, `department`, `biography`, `user_id`) VALUES
('123123', 'Jei Test', 'test@test.com', '1998-09-08', 'male', 'Calle Test # Test', '300000000', 'OIP.jpg', 'Intensive Care Unit (ICU)', 'Hola1', 123123);

INSERT INTO `appointment` (`id`, `patient_document`, `department`, `doctor_document`, `date`, `time`) VALUES
(1, '111', 'Dentists', '123123', '2020-03-18', '01:41:00'),
(2, '112233', 'Neurology', '123123', '2024-11-13', '09:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `complain`
--

DROP TABLE IF EXISTS `complain`;
CREATE TABLE IF NOT EXISTS `complain` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(500) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `complain`
--

INSERT INTO `complain` (`id`, `message`, `name`, `email`, `subject`) VALUES
(1, 'wdawdws', 'awdawd', 'awdw', 'adwwd'),
(2, 'Definition of complain. intransitive verb. 1 : to express grief, pain, or discontent complaining about the weather. 2 : to make a formal accusation or charge He threatened to complain of him to the captain.', 'Isaiah L. Smith', 'gmhs13@yopmail.com', 'dafsgd'),
(3, 'redtfyguhijo', 'simanto', 'gmhs13@yopmail.com', 'ytguijopk['),
(4, 'abcabcbacbacbabc', 'Isaiah L. Smith', 'gmhs13@yopmail.com', 'dadsvfbgfng');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) NOT NULL,
  `department_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `department_desc`) VALUES
(1, 'Intensive Care Unit (ICU)', 'What is an intensive care unit (ICU)? Intensive care refers to the specialised treatment given to patients who are acutely unwell and require critical medical care. An intensive care unit (ICU) provides the critical care and life support for acutely ill a'),
(2, 'Neurology', 'Neurology is a branch of medicine dealing with disorders of the nervous system. Neurology deals with the diagnosis and treatment of all categories of conditions and disease involving the central and peripheral nervous systems, including their coverings'),
(3, 'Opthalmology', 'Ojos'),
(4, 'Orthopedics', 'dfyuyuo'),
(5, 'Cancer Department', 'asyckuauhcioa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employee`
--

DROP TABLE IF EXISTS `employee`;
CREATE TABLE IF NOT EXISTS `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `role` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `employee`
--

INSERT INTO `employee` (`id`, `name`, `email`, `contact`, `date_of_birth`, `role`, `user_id`) VALUES
(1, 'Abc', 'gmhs13@yopmail.com', '0159653', '1990-01-01', 'Pharmacist', 4),
(2, 'Jeison Cerpa', 'test@test.com', '300111222333', '1990-01-01', 'Receptionist', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leaves`
--

DROP TABLE IF EXISTS `leaves`;
CREATE TABLE IF NOT EXISTS `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee` varchar(255) NOT NULL,
  `emp_id` int NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `date_from` varchar(255) NOT NULL,
  `date_to` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `leaves`
--

INSERT INTO `leaves` (`id`, `employee`, `emp_id`, `leave_type`, `date_from`, `date_to`, `reason`) VALUES
(1, 'Isaiah L. Smith', 4, 'Medical Leave', '26/03/2020', '31/03/2020', 'acdsvfbgnh');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id`, `username`, `password`, `email`) VALUES
(1, 'test', 'test', 'gmhs13@yopmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `store`
--

DROP TABLE IF EXISTS `store`;
CREATE TABLE IF NOT EXISTS `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `p_date` varchar(255) NOT NULL,
  `expire` varchar(255) NOT NULL,
  `expire_end` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `store`
--

INSERT INTO `store` (`id`, `name`, `p_date`, `expire`, `expire_end`, `price`, `quantity`) VALUES
(1, 'Napa', '20/03/2020', '2', '19/03/2020', '8', '100'),
(2, 'Seclo', '24/03/2020', '2', '24/03/2020', '5', '200'),
(3, 'Napa', '24/03/2020', '1 ', '19/03/2020', '10', '20'),
(4, 'max', '11/03/2020', '1 ', '12/03/2020', '10', '100');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temp`
--

DROP TABLE IF EXISTS `temp`;
CREATE TABLE IF NOT EXISTS `temp` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `temp`
--

INSERT INTO `temp` (`id`, `email`, `token`) VALUES
(19, 'test555@yopmail.com', '46fn0pl3'),
(19, 'test555@yopmail.com', 'w6pvf2oq'),
(21, 'te555@yopmail.com', '9sfs6gu8'),
(23, 'cerpajeison9@gmail.com', 'mwwtkjzp'),
(23, 'cerpajeison9@gmail.com', '1u6dyeas'),
(23, 'cerpajeison9@gmail.com', '2eqhaxg6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verify`
--

DROP TABLE IF EXISTS `verify`;
CREATE TABLE IF NOT EXISTS `verify` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `verify`
--

INSERT INTO `verify` (`id`, `username`, `email`, `token`) VALUES
(1, 'zihad', 'zihad.1d@yopmail.com', 'lp5ux5ik'),
(2, 'test', 'test555@yopmail.com', '3udlo9v6'),
(3, 'abc', 'gmhs13@yopmail.com', 'w2px024k'),
(4, 'alamin', 'te555@yopmail.com', 'ix8enxdh'),
(5, 'Jei', 'cerpajeison9@gmail.com', '89c3x22e'),
(6, 'Prueba', 'cerpajeison8@gmail.com', 'uxpvlw0c'),
(7, 'jei', 'cerpajeison8@gmail.com', '980cayf9');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `fk_doctors_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `fk_employee_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `fk_patients_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
