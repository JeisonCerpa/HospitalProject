-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 28-11-2024 a las 15:58:14
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
DROP DATABASE IF EXISTS `h1`;
CREATE DATABASE IF NOT EXISTS `h1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `h1`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointment`
--

DROP TABLE IF EXISTS `appointment`;
CREATE TABLE IF NOT EXISTS `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_document` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `doctor_document` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_document` (`patient_document`),
  KEY `doctor_document` (`doctor_document`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `appointment`
--

INSERT INTO `appointment` (`id`, `patient_document`, `department`, `doctor_document`, `date`, `time`) VALUES
(1, '112233', 'Opthalmology', '25262441', '2002-12-24', '11:00:00'),
(2, '111', 'Cardiología', '123123', '2023-01-01', '09:00:00'),
(3, '112233', 'Neurología', '25262441', '2023-01-02', '10:00:00'),
(4, '111', 'Pediatría', '123123', '2023-01-03', '11:00:00'),
(5, '112233', 'Ginecología', '25262441', '2023-01-04', '12:00:00'),
(6, '111', 'Dermatología', '123123', '2023-01-05', '13:00:00'),
(7, '112233', 'Psiquiatría', '25262441', '2023-01-06', '14:00:00'),
(8, '111', 'Ortopedia', '123123', '2023-01-07', '15:00:00'),
(9, '112233', 'Oftalmología', '25262441', '2023-01-08', '16:00:00'),
(10, '111', 'Departamento de Cáncer', '123123', '2023-01-09', '17:00:00');

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `departments`
--

INSERT INTO `departments` (`id`, `department_name`) VALUES
(1, 'Unidad de Cuidados Intensivos (UCI)'),
(2, 'Neurología'),
(3, 'Oftalmología'),
(4, 'Ortopedia'),
(5, 'Departamento de Cáncer'),
(6, 'Pediatría'),
(7, 'Cardiología'),
(8, 'Ginecología'),
(9, 'Dermatología'),
(10, 'Psiquiatría');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctors`
--

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
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `doctors`
--

INSERT INTO `doctors` (`document`, `name`, `email`, `date_of_birth`, `gender`, `address`, `phone`, `image`, `department`, `biography`, `user_id`) VALUES
('123123', 'Jei Test', 'test@test.com', '1998-09-08', 'male', 'Calle Test # Test', '300000000', 'OIP.jpg', 'Intensive Care Unit (ICU)', 'Hola1', 123123),
('25262441', 'Isabella Lerma', 'test@test.com', '2012-11-11', 'male', 'calle 23#23-56', '3001112233', 'OIP (1).jfif', 'Opthalmology', '123', 25262441);

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
-- Estructura de tabla para la tabla `patients`
--

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
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `patients`
--

INSERT INTO `patients` (`document`, `name`, `email`, `phone`, `gender`, `address`, `user_id`, `date_of_birth`) VALUES
('111', 'Isabella', 'test@test.com', '3001112233', 'female', 'calle 23#23-53', 5, '1990-01-01'),
('112233', 'Pedro', 'test@test.com', '30000000', 'male', 'calle 23#23-56', 112233, '2004-02-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `store`
--

DROP TABLE IF EXISTS `store`;
CREATE TABLE IF NOT EXISTS `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `p_date` date NOT NULL,
  `expire_end` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `store`
--

INSERT INTO `store` (`id`, `name`, `p_date`, `expire_end`, `price`, `quantity`) VALUES
(1, 'Acetaminofén', '2023-01-01', '2025-01-01', '5000.00', '100'),
(2, 'Ibuprofeno', '2023-02-01', '2025-02-01', '8000.00', '200'),
(3, 'Amoxicilina', '2023-03-01', '2025-03-01', '15000.00', '150'),
(4, 'Loratadina', '2023-04-01', '2025-04-01', '7000.00', '120'),
(5, 'Omeprazol', '2023-05-01', '2025-05-01', '9000.00', '180'),
(6, 'Metformina', '2023-06-01', '2025-06-01', '12000.00', '160'),
(7, 'Losartán', '2023-07-01', '2025-07-01', '11000.00', '140'),
(8, 'Simvastatina', '2023-08-01', '2025-08-01', '13000.00', '130'),
(9, 'Amlodipino', '2023-09-01', '2025-09-01', '10000.00', '170'),
(10, 'Clonazepam', '2023-10-01', '2025-10-01', '14000.00', '90'),
(11, 'Levotiroxina', '2023-11-01', '2025-11-01', '16000.00', '110'),
(12, 'Enalapril', '2023-12-01', '2025-12-01', '15000.00', '100'),
(13, 'Furosemida', '2023-01-15', '2025-01-15', '8000.00', '200'),
(14, 'Prednisona', '2023-02-15', '2025-02-15', '9000.00', '150'),
(15, 'Cetirizina', '2023-03-15', '2025-03-15', '7000.00', '120'),
(16, 'Diclofenaco', '2023-04-15', '2025-04-15', '10000.00', '180'),
(17, 'Tramadol', '2023-05-15', '2025-05-15', '12000.00', '160'),
(18, 'Ciprofloxacina', '2023-06-15', '2025-06-15', '15000.00', '140'),
(19, 'Azitromicina', '2023-07-15', '2025-07-15', '13000.00', '130'),
(20, 'Paracetamol', '2023-08-15', '2025-08-15', '5000.00', '170');

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
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email_status` varchar(20) NOT NULL,
  `role` enum('admin','doctor','receptionist','pharmacist','patient','nurse') NOT NULL,
  `password_changed` boolean NOT NULL DEFAULT false,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25262442 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `email_status`, `role`, `password_changed`) VALUES
(1, 'zihad', 'zihad.1d@yopmail.com', '123', 'Verificado', 'admin', true),
(2, 'test', 'test555@yopmail.com', '123', 'Verificado', 'doctor', true),
(3, 'abc', 'gmhs13@yopmail.com', '12345', 'Verificado', 'receptionist', true),
(4, 'alamin', 'te555@yopmail.com', 'abc', 'Verificado', 'pharmacist', true),
(5, 'jei', 'cerpajeison8@gmail.com', '123', 'Verificado', 'admin', true),
(23, 'Pedro', 'test@test.com', 'patient123', 'Verificado', 'patient', true),
(112233, 'Pedro', 'test@test.com', 'patient123', 'Verificado', 'patient', true),
(123123, 'Jei Test', 'test@test.com', 'doctor123', 'Verificado', 'doctor', true),
(25262441, 'Isabella Lerma', 'test@test.com', 'doctor123', 'Verificado', 'doctor', true);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verify`
--

DROP TABLE IF EXISTS `verify`;
CREATE TABLE IF NOT EXISTS `verify` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'doctor'),
(3, 'receptionist'),
(4, 'pharmacist'),
(5, 'patient'),
(6, 'nurse');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `name`) VALUES
(1, 'view_appointments'),
(2, 'edit_appointments'),
(3, 'delete_appointments'),
(4, 'view_patients'),
(5, 'edit_patients'),
(6, 'delete_patients'),
(7, 'view_doctors'),
(8, 'edit_doctors'),
(9, 'delete_doctors'),
(10, 'view_employees'),
(11, 'edit_employees'),
(12, 'delete_employees'),
(13, 'view_leaves'),
(14, 'edit_leaves'),
(15, 'delete_leaves'),
(16, 'view_departments'),
(17, 'edit_departments'),
(18, 'delete_departments'),
(19, 'view_store'),
(20, 'edit_store'),
(21, 'delete_store'),
(22, 'view_complaints'),
(23, 'edit_complaints'),
(24, 'delete_complaints'),
(25, 'add_appointments'),
(26, 'add_complaints'),
(27, 'add_departments'),
(28, 'add_doctors'),
(29, 'add_employees'),
(30, 'add_leaves'),
(31, 'add_patients'),
(32, 'add_store');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `role_permissions`
--
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
-- Permisos para admin (todos los permisos)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20), (1, 21), (1, 22), (1, 23), (1, 24), (1, 25), (1, 26), (1, 27), (1, 28), (1, 29), (1, 30), (1, 31), (1, 32),
-- Permisos para doctor (ver/editar/agregar pacientes, gestionar citas)
(2, 1), (2, 2), (2, 4), (2, 5), (2, 7), (2, 8), (2, 25), (2, 31),
-- Permisos para receptionist (gestionar citas, ver/agregar pacientes)
(3, 1), (3, 4), (3, 10), (3, 13), (3, 16), (3, 19), (3, 22), (3, 25), (3, 31),
-- Permisos para pharmacist (inventario de medicamentos)
(4, 19), (4, 20), (4, 21), (4, 32),
-- Permisos para patient (ver citas)
(5, 1), (5, 4), (5, 10), (5, 13), (5, 16), (5, 19), (5, 22),
-- Permisos para nurse (ver/agregar pacientes, gestionar citas)
(6, 1), (6, 4), (6, 7), (6, 10), (6, 13), (6, 16), (6, 19), (6, 22), (6, 25), (6, 31);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `user_roles`
--
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 1), (23, 5), (112233, 5), (123123, 2), (25262441, 2);

-- --------------------------------------------------------

--
-- Restricciones para tablas volcadas
--
--
-- Filtros para la tabla `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`patient_document`) REFERENCES `patients` (`document`),
  ADD CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`doctor_document`) REFERENCES `doctors` (`document`);

--
-- Filtros para la tabla `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
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
  ADD CONSTRAINT `fk_patients_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
