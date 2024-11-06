-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 06, 2024 at 01:13 PM
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
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `product_name`, `price`, `product_image`) VALUES
(17, 5, 14, 1, 'Bayluscide', 450.00, 'public/uploads/1730621303950-363805333.jpg'),
(16, 6, 13, 1, 'fertilizer', 2000.00, 'public/uploads/1730621257024-159182252.jpg'),
(14, 6, 14, 2, 'Bayluscide', 450.00, 'public/uploads/1730621303950-363805333.jpg'),
(15, 6, 9, 2, 'fertilzer', 2000.00, 'public/uploads/1730614301083-187122246.jpg'),
(12, 6, 10, 6, 'Glypro', 500.00, 'public/uploads/1730614338344-632624055.jpg'),
(13, 5, 13, 1, 'fertilizer', 2000.00, 'public/uploads/1730621257024-159182252.jpg');

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
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 6, 'Masipit', '09124577314', 'cash_on_delivery', 450.00, 'pending', '2024-11-06 12:50:53', '2024-11-06 12:50:53'),
(2, 6, 'Masipit', '09124577314', 'cash_on_delivery', 500.00, 'pending', '2024-11-06 12:54:02', '2024-11-06 12:54:02'),
(3, 6, 'Masipit', '09124577314', 'gcash', 2000.00, 'pending', '2024-11-06 12:54:36', '2024-11-06 12:54:36'),
(4, 6, 'Masipit', '09124577314', 'cash_on_delivery', 2500.00, 'pending', '2024-11-06 12:56:07', '2024-11-06 12:56:07'),
(5, 6, 'Masipit', '09124577314', 'cash_on_delivery', 500.00, 'pending', '2024-11-06 12:56:53', '2024-11-06 12:56:53'),
(6, 5, 'malvar', '09765432345', 'cash_on_delivery', 450.00, 'pending', '2024-11-06 13:11:00', '2024-11-06 13:11:00');

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
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `product_name`, `product_image`, `quantity`) VALUES
(1, 1, 14, 'Bayluscide', 'public/uploads/1730621303950-363805333.jpg', 1),
(2, 2, 10, 'Glypro', 'public/uploads/1730614338344-632624055.jpg', 1),
(3, 3, 13, 'fertilizer', 'public/uploads/1730621257024-159182252.jpg', 1),
(4, 4, 9, 'fertilzer', 'public/uploads/1730614301083-187122246.jpg', 1),
(5, 4, 10, 'Glypro', 'public/uploads/1730614338344-632624055.jpg', 1),
(6, 5, 10, 'Glypro', 'public/uploads/1730614338344-632624055.jpg', 1),
(7, 6, 14, 'Bayluscide', 'public/uploads/1730621303950-363805333.jpg', 1);

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
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `price`, `quantity`, `product_image`, `created_at`, `updated_at`) VALUES
(13, 'fertilizer', 2000.00, 99, 'public/uploads/1730621257024-159182252.jpg', '2024-11-03 08:07:37', '2024-11-06 12:54:36'),
(14, 'Bayluscide', 450.00, 98, 'public/uploads/1730621303950-363805333.jpg', '2024-11-03 08:08:23', '2024-11-06 13:11:00'),
(10, 'Glypro', 500.00, 97, 'public/uploads/1730614338344-632624055.jpg', '2024-11-03 06:12:18', '2024-11-06 12:56:53'),
(9, 'fertilzer', 2000.00, 99, 'public/uploads/1730614301083-187122246.jpg', '2024-11-03 06:11:41', '2024-11-06 12:56:07');

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
('NmpRqIHTbr2LeiHA8yFDfXHe-ATiKkkb', 1730985096, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2024-11-07T13:11:00.218Z\",\"httpOnly\":true,\"path\":\"/\"},\"errorMsg\":null,\"user\":{\"id\":5,\"fullname\":\"wako\",\"email\":\"wako@gmail.com\",\"password\":\"$2a$10$.LFcdO0omFE9tHx.B9G3YeL0YcEshqm7LsfdPGEsPftcMXD5ODq7S\",\"role\":null,\"profile_pic\":\"1730516559473-529732665.jpg\"},\"cart\":[]}');

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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `role`, `profile_pic`) VALUES
(6, 'johnray', 'johnraycarpio1404@gmail.com', '$2a$10$FljfmIeFn4piR98t3yW0mun9ODqhSc6EXXvnO6kxcEyWo7UjHcD3C', NULL, '1730520367420-764173713.jpg'),
(7, 'john', 'john@gmail.com', '$2a$10$9tGdfCcxBb9QkKLjgCEND.pDUdO4d86Tox2Iv/hME5d/ZXLodDKjG', NULL, NULL),
(8, 'juan', 'juan@gmail.com', '$2a$10$Z1YY0xvgi6poqBLq2qqGjOD3XZRziY5QzZpXS9hO9BvzvkDqR3X.G', NULL, NULL),
(5, 'wako', 'wako@gmail.com', '$2a$10$.LFcdO0omFE9tHx.B9G3YeL0YcEshqm7LsfdPGEsPftcMXD5ODq7S', NULL, '1730516559473-529732665.jpg'),
(9, 'jr', 'jr@gmail.com', '$2a$10$GJXzB5WmTdnl07.0I06WZ.BwKTYeqts03rBLtM1VWTmh5LGZp0jZ2', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
