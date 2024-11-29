-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 29, 2024 at 11:20 AM
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
-- Table structure for table `admin_message`
--

DROP TABLE IF EXISTS `admin_message`;
CREATE TABLE IF NOT EXISTS `admin_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `contact_id` int NOT NULL,
  `admin_reply` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `contact_id` (`contact_id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_user_id` (`user_id`),
  KEY `fk_cart_product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `product_name`, `price`, `product_image`) VALUES
(1, 1, 1, 1, 'Fertilizer', 2000.00, 'public/uploads/1732712257567-26045073.jpg'),
(2, 1, 3, 1, 'Bayluscide', 500.00, 'public/uploads/1732856862275-925256592.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contacts_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`, `product_name`, `product_image`, `quantity`) VALUES
(1, 1, 'malvar', '09124577314', 'cash_on_delivery', 4000.00, 'pending', '2024-11-27 12:58:27', '2024-11-27 12:58:27', NULL, NULL, NULL),
(2, 1, 'malvar', '09124577314', 'cash_on_delivery', 500.00, 'confirmed', '2024-11-29 05:09:41', '2024-11-29 05:10:07', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

DROP TABLE IF EXISTS `order_history`;
CREATE TABLE IF NOT EXISTS `order_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_history_order_id` (`order_id`),
  KEY `fk_order_history_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`id`, `order_id`, `user_id`, `address`, `contact_number`, `payment_method`, `total_amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'malvar', '09124577314', 'cash_on_delivery', 500.00, 'confirmed', '2024-11-29 05:09:41', '2024-11-29 05:10:07');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_order_items_order_id` (`order_id`),
  KEY `fk_order_items_product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `product_name`, `product_image`, `quantity`) VALUES
(1, 1, 1, 'Fertilizer', 'public/uploads/1732712257567-26045073.jpg', 2),
(2, 2, 3, 'Bayluscide', 'public/uploads/1732856862275-925256592.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `price`, `quantity`, `product_image`, `created_at`, `updated_at`, `description`) VALUES
(1, 'Fertilizer', 2000.00, 98, 'public/uploads/1732712257567-26045073.jpg', '2024-11-27 12:57:37', '2024-11-27 12:58:27', 'Atlas Fertilizer is a high-quality agricultural product designed to enhance soil fertility and promote healthy plant growth. It provides essential nutrients for crops, ensuring better yield and sustainable farming. Ideal for various types of plants, Atlas Fertilizer supports farmers in achieving optimal productivity.'),
(2, 'Wheel Borrow', 1500.00, 100, 'public/uploads/1732856791996-101444353.jpg', '2024-11-29 05:06:32', '2024-11-29 05:06:32', 'A wheelbarrow is a small, one-wheeled cart with handles, designed for easy transportation of materials such as soil, gravel, or plants. It is commonly used in gardening, construction, and landscaping to move heavy or bulky items with less effort. The wheelbarrow’s single wheel allows for easy maneuverability, while the handles enable the user to lift and push it.'),
(3, 'Bayluscide', 500.00, 99, 'public/uploads/1732856862275-925256592.jpg', '2024-11-29 05:07:42', '2024-11-29 05:09:41', 'Bayluscide is a chemical used to control aquatic parasites, particularly snails, that carry diseases like schistosomiasis. It works by disrupting the metabolism of the target organisms, helping to reduce the spread of parasitic infections in water systems.'),
(4, 'Glypro', 500.00, 100, 'public/uploads/1732856949243-843934557.jpg', '2024-11-29 05:09:09', '2024-11-29 05:09:09', 'Glypro (glyphosate) is a broad-spectrum, systemic herbicide that kills weeds by inhibiting essential plant enzymes, with low toxicity to humans and animals when used properly.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_pic` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`, `role`, `profile_pic`) VALUES
(1, 'John Ray Carpio', 'johnraycarpio1404@gmail.com', '$2a$10$5xSb9JULG7o63QwKV.5LQ.ubwXyVhbYZQ1787uKaFH72IP59XIdE6', NULL, '1732712057072-917583201.jpg'),
(2, 'wako', 'wako@gmail.com', '$2a$10$ZZOZwfKs5OlZyb5o0qRWe.XBBn73turOZVqDkuL8OANHH4aoN6P/u', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `fk_cart_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_contacts_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_history`
--
ALTER TABLE `order_history`
  ADD CONSTRAINT `fk_order_history_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_history_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
