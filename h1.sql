-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 25-11-2024 a las 14:36:42
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

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(255) NOT NULL, -- Cambiado a varchar para almacenar la cédula
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT 'doctor123', -- Contraseña predeterminada
  `email_status` varchar(20) NOT NULL,
  `role` ENUM('admin', 'doctor', 'receptionist', 'pharmacist', 'patient', 'nurse') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `email_status`, `role`) VALUES
(1, 'zihad', 'zihad.1d@yopmail.com', '123', 'verified', 'admin'),
(2, 'test', 'test555@yopmail.com', '123', 'verified', 'doctor'),
(3, 'abc', 'gmhs13@yopmail.com', '12345', 'not_verified', 'receptionist'),
(4, 'alamin', 'te555@yopmail.com', 'abc', 'verified', 'pharmacist'),
(5, 'jei', 'cerpajeison8@gmail.com', '123', 'Verificado', 'patient');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointment`
--

CREATE TABLE IF NOT EXISTS `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `appointment`
--

INSERT INTO `appointment` (`id`, `patient_name`, `department`, `doctor_name`, `date`, `time`, `email`, `phone`) VALUES
(1, 'Test123', 'Dentists', 'doc test', '18/03/2020', '1:41 AM', 'gmhs13@yopmail.com', '7865641399'),
(2, 'Isabella Lerma', 'Neurology', 'Isabella Lerma', '13/11/2024', '9:00 AM', 'test@test.com', '3123123123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `complain`
--

CREATE TABLE IF NOT EXISTS `complain` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(500) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL, -- Cambiado de varchar(20) a varchar(255)
  `subject` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) NOT NULL,
  `department_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- Estructura de tabla para la tabla `doctor`
--

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
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `doctor`
--

INSERT INTO `doctors` (`document`, `name`, `email`, `date_of_birth`, `gender`, `address`, `phone`, `image`, `department`, `biography`, `user_id`) VALUES
('1', 'Jeison Cerpa Osorio', 'cerpajeison8@gmail.com', '2024-10-05', 'male', 'calle 23#23-56', '3005921351', 'OIP.jfif', 'Neurology', '', 2),
('2', 'Jhon Cerpa', 'test@test.com', '2024-11-28', 'male', 'calle 23#23-56', '3005921351', 'OIP.jfif', 'Intensive Care Unit (ICU)', 'Hola', 2),
('3', 'Isabella Lerma', 'test@test.com', '2024-11-13', 'female', 'calle 23#23-56', '3005921351', 'OIP.jfif', 'Neurology', 'Hola', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employee`
--

CREATE TABLE IF NOT EXISTS `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `role` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `employee`
--

INSERT INTO `employee` (`id`, `name`, `email`, `contact`, `date_of_birth`, `role`, `user_id`) VALUES
(1, 'Abc', 'gmhs13@yopmail.com', '0159653', '1990-01-01', 'Pharmacist', 4), -- Cambiado `join_date` a `date_of_birth` y eliminado `salary`
(2, 'Jeison Cerpa', 'test@test.com', '300111222333', '1990-01-01', 'Receptionist', 3); -- Cambiado `join_date` a `date_of_birth` y eliminado `salary`

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leaves`
--

CREATE TABLE IF NOT EXISTS `leaves` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee` varchar(255) NOT NULL,
  `emp_id` int NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `date_from` varchar(255) NOT NULL,
  `date_to` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `leaves`
--

INSERT INTO `leaves` (`id`, `employee`, `emp_id`, `leave_type`, `date_from`, `date_to`, `reason`) VALUES
(1, 'Isaiah L. Smith', 4, 'Medical Leave', '26/03/2020', '31/03/2020', 'acdsvfbgnh');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

CREATE TABLE IF NOT EXISTS `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id`, `username`, `password`, `email`) VALUES
(1, 'test', 'test', 'gmhs13@yopmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patients`
--

CREATE TABLE IF NOT EXISTS `patients` (
  `document` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `user_id` int NOT NULL, -- Agregado campo `user_id`
  `date_of_birth` date NOT NULL, -- Agregado campo `date_of_birth`
  PRIMARY KEY (`document`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) -- Llave foránea
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `patients`
--

INSERT INTO `patients` (`document`, `name`, `email`, `phone`, `gender`, `address`, `user_id`, `date_of_birth`) VALUES
('111', 'Isabella', 'test@test.com', '3001112233', 'female', 'calle 23#23-53', 5, '1990-01-01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `store`
--

CREATE TABLE IF NOT EXISTS `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `p_date` varchar(255) NOT NULL,
  `expire` varchar(255) NOT NULL,
  `expire_end` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE IF NOT EXISTS `verify` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
