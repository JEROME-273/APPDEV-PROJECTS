-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 27, 2024 at 03:25 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agri_commerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int DEFAULT '1',
  `shopId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  UNIQUE KEY `unique_cart` (`user_id`,`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `product_name`, `price`, `product_image`, `quantity`, `shopId`) VALUES
(60, 1, 8, 'Small sprayer', 100.00, '1734945212215-991679365.jpg', 2, 6),
(56, 2, 10, 'fertilizer', 2000.00, '1735009271673-198285024.jpg', 2, 5),
(54, 2, 6, 'Wheel Borrow', 500.00, '1734882937186-935918675.jpg', 6, 5),
(55, 3, 10, 'fertilizer', 2000.00, '1735009271673-198285024.jpg', 2, 5),
(58, 1, 11, 'Denorado Mindoro Rice', 900.00, '1735009503391-388643015.jpg', 3, 7),
(64, 1, 15, 'Watermelon', 100.00, '1735095825935-63187356.jpg', 2, 6),
(61, 3, 9, 'Bayluscide', 1300.00, '1734970064931-711402161.jpg', 1, 6),
(62, 2, 11, 'Denorado Mindoro Rice', 900.00, '1735009503391-388643015.jpg', 1, 7),
(65, 2, 14, 'Onion-1kg', 30.00, '1735095693908-431639307.jpg', 2, 7),
(66, 2, 13, 'Tomato-1kg', 53.00, '1735095631396-531736395.jpg', 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(33, 1, 'calapan', '09124577314', 'cash_on_delivery', 100.00, 'confirmed', '2024-12-24 14:51:46', '2024-12-24 14:52:17'),
(34, 2, 'baco', '09124577314', 'cash_on_delivery', 900.00, 'confirmed', '2024-12-24 14:53:58', '2024-12-24 14:54:12'),
(35, 1, 'calapan', '09124577314', 'cash_on_delivery', 200.00, 'confirmed', '2024-12-25 04:27:04', '2024-12-25 04:28:29'),
(36, 2, 'malvar', '09124577314', 'cash_on_delivery', 83.00, 'canceled', '2024-12-25 04:34:05', '2024-12-25 04:34:12'),
(37, 1, 'Naujan, Oriental Mindoro', '09124577314', 'cash_on_delivery', 2700.00, 'confirmed', '2024-12-27 01:14:01', '2024-12-27 01:14:48');

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
CREATE TABLE IF NOT EXISTS `order_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`history_id`, `order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(7, 37, 1, 'Naujan, Oriental Mindoro', '09124577314', 'cash_on_delivery', 2700.00, 'confirmed', '2024-12-27 01:14:01', '2024-12-27 01:14:01'),
(6, 35, 1, 'calapan', '09124577314', 'cash_on_delivery', 200.00, 'confirmed', '2024-12-25 04:27:04', '2024-12-25 04:27:04'),
(5, 34, 2, 'baco', '09124577314', 'cash_on_delivery', 900.00, 'confirmed', '2024-12-24 14:53:58', '2024-12-24 14:53:58');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `shopId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_image`, `quantity`, `shopId`) VALUES
(17, 26, 11, 'Denorado Mindoro Rice', '1735009503391-388643015.jpg', 1, 7),
(19, 28, 9, 'Bayluscide', '1734970064931-711402161.jpg', 1, 6),
(20, 29, 8, 'Small sprayer', '1734945212215-991679365.jpg', 1, 6),
(21, 30, 9, 'Bayluscide', '1734970064931-711402161.jpg', 1, 6),
(22, 31, 6, 'Wheel Borrow', '1734882937186-935918675.jpg', 1, 5),
(23, 31, 10, 'fertilizer', '1735009271673-198285024.jpg', 1, 5),
(24, 32, 11, 'Denorado Mindoro Rice', '1735009503391-388643015.jpg', 1, 7),
(25, 33, 8, 'Small sprayer', '1734945212215-991679365.jpg', 1, 6),
(26, 34, 11, 'Denorado Mindoro Rice', '1735009503391-388643015.jpg', 1, 7),
(27, 35, 15, 'Watermelon', '1735095825935-63187356.jpg', 2, 6),
(28, 36, 14, 'Onion-1kg', '1735095693908-431639307.jpg', 1, 7),
(29, 36, 13, 'Tomato-1kg', '1735095631396-531736395.jpg', 1, 7),
(30, 37, 11, 'Denorado Mindoro Rice', '1735009503391-388643015.jpg', 3, 7);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `p_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `p_price` decimal(10,2) NOT NULL,
  `p_quantity` int NOT NULL,
  `p_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `p_description` text COLLATE utf8mb4_general_ci,
  `shopId` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `shopId` (`shopId`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `p_name`, `p_price`, `p_quantity`, `p_image`, `p_description`, `shopId`, `created_at`, `updated_at`) VALUES
(10, 'fertilizer', 2000.00, 200, '1735009271673-198285024.jpg', 'This is the best Fertilizer.', 5, '2024-12-24 03:01:11', '2024-12-25 02:56:17'),
(8, 'Small sprayer', 100.00, 142, '1734945212215-991679365.jpg', 'This small sprayer is high quality. Buy it now!', 6, '2024-12-23 09:13:32', '2024-12-24 14:51:46'),
(6, 'Wheel Borrow', 500.00, 200, '1734882937186-935918675.jpg', 'This is high quality Wheel Borrow.', 5, '2024-12-22 15:55:37', '2024-12-25 02:56:09'),
(9, 'Bayluscide', 1300.00, 114, '1734970064931-711402161.jpg', 'Bayluscide was originally developed as a molluscicide to eliminate snails. Therefore, it is not surprising that mollusks are extremely sensitive to Bayluscide. Oral, dermal, and ocular administration of Bayluscide to mammals resulted in no clinical signs of systemic toxicity.', 6, '2024-12-23 16:07:44', '2024-12-24 14:23:57'),
(11, 'Denorado Mindoro Rice', 900.00, 106, '1735009503391-388643015.jpg', 'This is Denorado Rice From Mindoro Farmers.', 7, '2024-12-24 03:05:03', '2024-12-27 01:14:01'),
(12, 'Glypro', 1500.00, 200, '1735095530989-79694188.jpg', 'Gly-Pro is a dipeptide found in collagen that may have anti-photoaging properties. It is also known as a peptide zwitterion, which is a tautomer of Gly-Pro. ', 5, '2024-12-25 02:58:51', '2024-12-25 02:58:51'),
(17, 'tomato 1kg', 50.00, 100, '1735262566335-166663671.jpg', 'This is fresh.', 8, '2024-12-27 01:22:46', '2024-12-27 01:22:58'),
(14, 'Onion-1kg', 30.00, 200, '1735095693908-431639307.jpg', 'Newly harvest Onion.', 7, '2024-12-25 03:01:34', '2024-12-25 04:34:12'),
(15, 'Watermelon', 100.00, 198, '1735095825935-63187356.jpg', 'This Watermelon is newly harvest and sweet.', 6, '2024-12-25 03:03:45', '2024-12-25 04:27:04'),
(16, 'squash', 70.00, 100, '1735261995015-648183766.jpg', 'This is fresh.\r\n', 5, '2024-12-27 01:13:15', '2024-12-27 01:13:15');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('1PGQ7ljNb-P2nON319x0VPtNZK4XOIj8', 1735187706, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-12-26T04:35:05.522Z\",\"httpOnly\":true,\"path\":\"/\"},\"errorMsg\":null}'),
('g87gL7OSETXcbHIzN8-pSg8sUa3vlTZd', 1735349319, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-12-28T01:28:38.852Z\",\"httpOnly\":true,\"path\":\"/\"},\"errorMsg\":null}');

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

DROP TABLE IF EXISTS `shop`;
CREATE TABLE IF NOT EXISTS `shop` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shopName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `shopProfile` text COLLATE utf8mb4_general_ci,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`id`, `shopName`, `shopProfile`, `userId`) VALUES
(5, 'Carpio, Agri Supply', '1734861415123-911176160.jpg', 1),
(6, 'Wako Agri Supply', '1734945131698-606491639.jpg', 2),
(7, 'JOHNRAY AGRI-SUPPLY', '1735009412809-246212806.jpg', 3),
(8, 'JR agri supply', '1735262522475-718277855.jpg', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_pic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `profile_pic`) VALUES
(1, 'John Ray Carpio', 'johnraycarpio1404@gmail.com', '$2a$10$5xSb9JULG7o63QwKV.5LQ.ubwXyVhbYZQ1787uKaFH72IP59XIdE6', '1734849221864-247414811.jpg'),
(2, 'wako', 'wako@gmail.com', '$2a$10$ZZOZwfKs5OlZyb5o0qRWe.XBBn73turOZVqDkuL8OANHH4aoN6P/u', '1734945234997-967692562.jpg'),
(3, 'john', 'john@gmail.com', '$2a$10$AYeUkRXXzAsKJvf9.Ll.M.9aFhXn94JyGshvrnNJKvEwdg3.sPhTm', '1735009382337-734312182.jpg'),
(4, 'Carl Jancell Ulip', 'ulip@gmail.com', '$2a$10$m.tkg2rLxSiAq0FqecamhOw4fhomGQiYmo5Hzzj5W3twN.7oJ8z6S', '1733665350436-515057077.jpg'),
(5, 'juan', 'juan@gmail.com', '$2a$10$UcJBvu8iI4GfH4x/NhMNzOOCfenblVhiPiG2Bn3.ef.OZJPB39YEC', '1735096038990-132445414.jpg'),
(6, 'jr', 'jr@gmail.com', '$2a$10$iuB.tL366qVt9Ww2uLfrJeTE2XLNJWWyAdLH8r05w4V2S1UkwEk/K', '1735262483947-661300133.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user_message`
--

DROP TABLE IF EXISTS `user_message`;
CREATE TABLE IF NOT EXISTS `user_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userMessage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_message`
--

INSERT INTO `user_message` (`id`, `phoneNumber`, `userMessage`, `user_id`, `created_at`) VALUES
(22, '924577314', 'hello', 2, '2024-12-08 21:56:16');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
