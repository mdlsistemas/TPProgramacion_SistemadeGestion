-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-05-2025 a las 03:29:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_de_stock`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `movement_id` varchar(10) NOT NULL,
  `date` datetime NOT NULL,
  `product_id` varchar(10) DEFAULT NULL,
  `movement_type` varchar(30) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` varchar(20) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`movement_id`, `date`, `product_id`, `movement_type`, `quantity`, `order_id`, `notes`) VALUES
('M001', '2025-05-30 19:51:11', 'P001', 'Ingreso', 23, NULL, 'Compra'),
('M002', '2025-05-30 19:51:30', 'P002', 'Ingreso', 40, NULL, 'Compra'),
('M003', '2025-05-30 19:58:36', 'P002', 'Egreso', 5, NULL, 'Venta'),
('M004', '2025-05-30 20:00:50', 'P003', 'Ingreso', 100, NULL, 'Compra'),
('M005', '2025-05-30 20:11:44', 'P004', 'Ingreso', 7, NULL, 'Compra'),
('M006', '2025-05-30 20:25:04', 'P001', 'Egreso', 4, NULL, 'Venta'),
('M007', '2025-05-30 20:28:41', 'P001', 'Ingreso', 9, NULL, 'Compra'),
('M008', '2025-05-30 20:35:22', 'P005', 'Egreso', 5, NULL, 'Compra'),
('M009', '2025-05-30 20:35:40', 'P005', 'Ingreso', 20, NULL, 'Compra');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `product_id` varchar(10) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `unit_of_measure` varchar(20) DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `active` varchar(5) DEFAULT 'Yes',
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`product_id`, `product_name`, `sku`, `unit_of_measure`, `cost`, `sale_price`, `category`, `location`, `active`, `foto`) VALUES
('P001', 'Notebook HP 240 G7', 'HP-240G7', 'unidad', 560.00, 790.00, 'Electrónica', 'Depósito 1', 'Yes', 'media/P001_foto.jpg'),
('P002', 'Mouse Logitech M170', 'LOG-M170', 'unidad', 9.50, 14.99, 'Accesorios', 'Depósito 1', 'Yes', NULL),
('P003', 'Silla ergonómica Black', 'SILLA-BLK', 'unidad', 75.00, 120.00, 'Mobiliario', 'Depósito 2', 'Yes', NULL),
('P004', 'Monitor Samsung 24”', 'SAM-24F', 'unidad', 110.00, 169.99, 'Electrónica', 'Depósito 2', 'Yes', NULL),
('P005', 'Tóner HP 107A', 'TON-HP107A', 'unidad', 18.00, 32.50, 'Insumos', 'Depósito 1', 'Yes', NULL),
('P006', 'Resma Papel A4 500h', 'PAP-A4500', 'paquete', 5.00, 7.80, 'Papelería', 'Depósito 3', 'Yes', NULL),
('P007', 'Cámara de seguridad Dahua', 'DAHUA-CAM', 'unidad', 45.00, 79.00, 'Seguridad', 'Depósito 2', 'Yes', NULL),
('P008', 'Cable UTP Cat6 20m', 'UTP-CAT6-20', 'unidad', 4.50, 8.50, 'Redes', 'Depósito 1', 'Yes', NULL),
('P009', 'Teclado Logitech K120', 'LOG-K120', 'unidad', 12.00, 19.50, 'Accesorios', 'Depósito 1', 'Yes', NULL),
('P010', 'Impresora HP Laser 107a', 'HP-L107A', 'unidad', 120.00, 210.00, 'Electrónica', 'Depósito 2', 'Yes', NULL),
('P011', 'Vasos', 'HP-240G7', 'unidad', 34.00, 79.00, 'Hogar', 'Deposito 3', 'Yes', 'media/P011_foto.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('administrador','operador','analista') DEFAULT 'operador',
  `foto` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `foto`, `fecha_registro`) VALUES
(1, 'Joel Ochoa', 'admin@admin.com', '$2y$10$Rm70eNYaoji4g71plUUzC.mN8I7VQLoin844wDCKURuX.hx25q3jK', 'administrador', 'media/admin_admin.com_foto.jpg', '2025-05-29 18:55:16'),
(2, 'Jose', 'jose@admin.com', '$2b$12$RcYfyGcD.ABI9SStWT0EHe2BJNurGV3FijC8sKazRQVjx4U5tu3NO', 'operador', 'media/jose_admin.com_foto.jpg', '2025-05-29 21:07:19');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`movement_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`product_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `productos` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
