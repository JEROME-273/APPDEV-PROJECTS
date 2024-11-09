-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 09, 2024 at 08:58 AM
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
  `quantity` int DEFAULT '1',
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `product_name`, `price`, `product_image`) VALUES
(26, 11, 14, 1, 'Bayluscide', 450.00, 'public/uploads/1730621303950-363805333.jpg'),
(25, 11, 10, 1, 'Glypro', 500.00, 'public/uploads/1730614338344-632624055.jpg'),
(24, 11, 13, 1, 'fertilizer', 2000.00, 'public/uploads/1731028399189-131897501.jpg'),
(23, 10, 14, 1, 'Bayluscide', 450.00, 'public/uploads/1730621303950-363805333.jpg'),
(19, 6, 13, 3, 'fertilizer', 2000.00, 'public/uploads/1731028399189-131897501.jpg'),
(20, 6, 10, 1, 'Glypro', 500.00, 'public/uploads/1730614338344-632624055.jpg'),
(22, 6, 15, 3, 'Sprayer', 300.00, 'public/uploads/1730899626185-787106627.jpg'),
(21, 6, 14, 2, 'Bayluscide', 450.00, 'public/uploads/1730621303950-363805333.jpg'),
(27, 11, 15, 1, 'Sprayer', 300.00, 'public/uploads/1730899626185-787106627.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`, `product_name`, `product_image`, `quantity`) VALUES
(23, 11, 'Masipit', '09124577314', 'cash_on_delivery', 5450.00, 'confirmed', '2024-11-09 08:50:41', '2024-11-09 08:51:53', NULL, NULL, NULL),
(22, 6, 'Masipit', '09765432345', 'cash_on_delivery', 750.00, 'pending', '2024-11-09 06:50:48', '2024-11-09 06:50:48', NULL, NULL, NULL),
(21, 6, 'Masipit', '09124577314', 'cash_on_delivery', 2300.00, 'pending', '2024-11-09 06:39:29', '2024-11-09 06:39:29', 'Sprayer', 'public/uploads/1730899626185-787106627.jpg', 1),
(20, 6, 'Masipit', '09124577314', 'cash_on_delivery', 300.00, 'confirmed', '2024-11-09 06:38:22', '2024-11-09 06:38:36', 'Sprayer', 'public/uploads/1730899626185-787106627.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
CREATE TABLE IF NOT EXISTS `order_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_number` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`id`, `order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 17, 6, 'Masipit', '09124577314', 'cash_on_delivery', 2000.00, 'confirmed', '2024-11-09 04:02:34', '2024-11-09 05:46:50'),
(3, 19, 6, 'Masipit', '09124577314', 'cash_on_delivery', 450.00, 'confirmed', '2024-11-09 06:24:30', '2024-11-09 06:24:48'),
(4, 20, 6, 'Masipit', '09124577314', 'cash_on_delivery', 300.00, 'confirmed', '2024-11-09 06:38:22', '2024-11-09 06:38:36'),
(5, 23, 11, 'Masipit', '09124577314', 'cash_on_delivery', 5450.00, 'confirmed', '2024-11-09 08:50:41', '2024-11-09 08:51:53');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `product_name`, `product_image`, `quantity`) VALUES
(31, 23, 14, 'Bayluscide', 'public/uploads/1730621303950-363805333.jpg', 1),
(30, 23, 10, 'Glypro', 'public/uploads/1730614338344-632624055.jpg', 2),
(29, 23, 13, 'fertilizer', 'public/uploads/1731028399189-131897501.jpg', 2),
(28, 22, 14, 'Bayluscide', 'public/uploads/1730621303950-363805333.jpg', 1),
(27, 22, 15, 'Sprayer', 'public/uploads/1730899626185-787106627.jpg', 1),
(26, 21, 15, 'Sprayer', 'public/uploads/1730899626185-787106627.jpg', 1),
(25, 21, 13, 'fertilizer', 'public/uploads/1731028399189-131897501.jpg', 1),
(24, 20, 15, 'Sprayer', 'public/uploads/1730899626185-787106627.jpg', 1),
(23, 19, 14, 'Bayluscide', 'public/uploads/1730621303950-363805333.jpg', 1),
(22, 18, 10, 'Glypro', 'public/uploads/1730614338344-632624055.jpg', 1),
(21, 17, 13, 'fertilizer', 'public/uploads/1731028399189-131897501.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `price`, `quantity`, `product_image`, `created_at`, `updated_at`) VALUES
(16, 'small sprayer', 250.00, 100, 'public/uploads/1731142300876-713086121.jpg', '2024-11-09 08:51:40', '2024-11-09 08:51:40'),
(13, 'fertilizer', 2000.00, 96, 'public/uploads/1731028399189-131897501.jpg', '2024-11-03 08:07:37', '2024-11-09 08:50:41'),
(14, 'Bayluscide', 450.00, 92, 'public/uploads/1730621303950-363805333.jpg', '2024-11-03 08:08:23', '2024-11-09 08:50:41'),
(15, 'Sprayer', 300.00, 84, 'public/uploads/1730899626185-787106627.jpg', '2024-11-06 13:27:06', '2024-11-09 06:50:48'),
(10, 'Glypro', 500.00, 91, 'public/uploads/1730614338344-632624055.jpg', '2024-11-03 06:12:18', '2024-11-09 08:50:41');

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
('qClu1eqSLBoo0IFqBErAg7gwLx0vMy3A', 1731228770, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-11-10T08:52:49.814Z\",\"httpOnly\":true,\"path\":\"/\"},\"errorMsg\":null}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'user',
  `profile_pic` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `role`, `profile_pic`) VALUES
(6, 'johnray', 'johnraycarpio1404@gmail.com', '$2a$10$FljfmIeFn4piR98t3yW0mun9ODqhSc6EXXvnO6kxcEyWo7UjHcD3C', NULL, '1730520367420-764173713.jpg'),
(7, 'john', 'john@gmail.com', '$2a$10$9tGdfCcxBb9QkKLjgCEND.pDUdO4d86Tox2Iv/hME5d/ZXLodDKjG', NULL, NULL),
(8, 'juan', 'juan@gmail.com', '$2a$10$Z1YY0xvgi6poqBLq2qqGjOD3XZRziY5QzZpXS9hO9BvzvkDqR3X.G', NULL, NULL),
(5, 'wako', 'wako@gmail.com', '$2a$10$.LFcdO0omFE9tHx.B9G3YeL0YcEshqm7LsfdPGEsPftcMXD5ODq7S', NULL, '1730516559473-529732665.jpg'),
(9, 'jr', 'jr@gmail.com', '$2a$10$GJXzB5WmTdnl07.0I06WZ.BwKTYeqts03rBLtM1VWTmh5LGZp0jZ2', NULL, NULL),
(10, 'John Ray Carpio', 'johnray14@gmail.com', '$2a$10$bcTfBq4yCTT.5/sB9i5WPOVx76TL9Gb3L0pCuYykaC76S0SOrC2dW', NULL, '1731141730185-750178905.jpg'),
(11, 'Carpio', 'carpio@gmail.com', '$2a$10$T32JddmRJy3WBSKhTr0o4uJY6sURzbl58haf9ldxMxXmSxeoVZQSS', NULL, '1731142173266-573558419.jpg');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
