-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 
-- Generation Time: Jul 25, 2026 at 06:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `log_id` int(11) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `action_type` varchar(20) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `action_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`log_id`, `table_name`, `action_type`, `record_id`, `description`, `action_time`) VALUES
(1, 'product', 'UPDATE', 22, 'Updated product camera', '2026-07-12 06:57:44'),
(2, 'inventory', 'DELETE', 3, 'Inventory Deleted', '2026-07-12 06:58:30'),
(3, 'product', 'INSERT', 25, 'Added product Keyboard', '2026-07-12 10:49:04'),
(4, 'product', 'INSERT', 26, 'Added product Printer', '2026-07-12 10:49:34'),
(5, 'product', 'INSERT', 27, 'Added product Mouse-wired', '2026-07-12 10:50:20'),
(6, 'product', 'INSERT', 28, 'Added product Mouse-WireLess', '2026-07-12 10:50:51'),
(7, 'vendor', 'INSERT', 7, 'Added vendor Khawaja Asif', '2026-07-12 10:54:10'),
(8, 'inventory', 'INSERT', 4, 'Added inventory quantity 230', '2026-07-12 10:55:08'),
(9, 'inventory', 'DELETE', 1, 'Inventory Deleted', '2026-07-12 10:55:16'),
(10, 'inventory', 'INSERT', 5, 'Added inventory quantity 230', '2026-07-12 10:55:28'),
(11, 'inventory', 'INSERT', 6, 'Added inventory quantity 70', '2026-07-12 10:55:48'),
(12, 'inventory', 'INSERT', 7, 'Added inventory quantity 200', '2026-07-12 10:56:02'),
(13, 'inventory', 'INSERT', 8, 'Added inventory quantity 170', '2026-07-12 10:56:20'),
(14, 'purchase_order', 'INSERT', 108, 'Created Purchase Order #108', '2026-07-12 10:58:07'),
(15, 'purchase_order', 'INSERT', 109, 'Created Purchase Order #109', '2026-07-12 10:58:33'),
(16, 'purchase_order', 'INSERT', 110, 'Created Purchase Order #110', '2026-07-12 10:58:58'),
(17, 'purchase_order', 'INSERT', 111, 'Created Purchase Order #111', '2026-07-12 10:59:18'),
(18, 'inventory', 'INSERT', 9, 'Added inventory quantity 120', '2026-07-12 11:40:49'),
(19, 'inventory', 'UPDATE', 2, 'Updated inventory quantity 300', '2026-07-12 12:13:39'),
(20, 'product', 'INSERT', 29, 'Added product Chess Board', '2026-07-13 05:14:11'),
(21, 'purchase_order', 'INSERT', 112, 'Created Purchase Order #112', '2026-07-13 05:14:58'),
(22, 'inventory', 'INSERT', 10, 'Added inventory quantity 200', '2026-07-13 05:15:27'),
(23, 'order_detail', 'INSERT', 10, 'Added item to Order #110', '2026-07-13 05:16:15'),
(24, 'order_detail', 'UPDATE', 10, 'Updated item in Order #110', '2026-07-13 05:16:25'),
(25, 'product', 'UPDATE', 22, 'Updated product camera', '2026-07-13 08:52:03'),
(26, 'product', 'DELETE', 22, 'Deleted product camera', '2026-07-15 16:59:28'),
(27, 'purchase_order', 'INSERT', 113, 'Created Purchase Order #113', '2026-07-15 18:23:35'),
(28, 'product', 'INSERT', 30, 'Added product Gimble', '2026-07-18 17:50:31'),
(29, 'product', 'UPDATE', 23, 'Updated product monitor', '2026-07-22 18:49:42');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `username`, `password`) VALUES
(1, 'admin', 'admin123'),
(2, 'user', 'user123');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`inventory_id`, `warehouse_id`, `product_id`, `quantity`) VALUES
(2, 4, 23, 300),
(4, 5, 25, 230),
(5, 5, 25, 230),
(6, 5, 26, 70),
(7, 5, 27, 200),
(8, 4, 28, 170),
(10, 4, 29, 200);

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `detail_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`detail_id`, `order_id`, `product_id`, `quantity`) VALUES
(10, 110, 27, 40);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `category`, `unit_price`) VALUES
(23, 'monitor', 'Electronics', 20000.00),
(25, 'Keyboard', 'Electronics', 900.00),
(26, 'Printer', 'Electronics', 20000.00),
(27, 'Mouse-wired', 'Electronics', 300.00),
(28, 'Mouse-WireLess', 'Bluetooth', 1200.00),
(29, 'Chess Board', 'Wooden', 1200.00),
(30, 'Gimble', 'Electronics', 102.00);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order`
--

CREATE TABLE `purchase_order` (
  `order_id` int(11) NOT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `STATUS` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_order`
--

INSERT INTO `purchase_order` (`order_id`, `vendor_id`, `order_date`, `STATUS`) VALUES
(106, 5, '2026-03-05', 'Shipped'),
(107, 4, '2026-07-11', 'Shipped'),
(108, 6, '2026-07-05', 'Shipped'),
(109, 7, '2026-06-21', 'Delivered'),
(110, 5, '2026-07-12', 'Pending'),
(111, 6, '2026-07-02', 'Delivered'),
(112, 6, '2026-07-06', 'Shipped'),
(113, 4, '2026-07-16', 'Delivered');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Staff') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`) VALUES
(3, 'admin', 'admin', 'Admin'),
(4, 'user', 'user1234', 'Staff');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `vendor_id` int(11) NOT NULL,
  `vendor_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`vendor_id`, `vendor_name`, `phone`, `email`) VALUES
(4, 'Hammad', '00987656781', 'qbd@gamil.com'),
(5, 'Sheikh Rashid', '0020030420', 'sdf@gmail.com'),
(6, 'Sunil Manj', '03218474020', 'sunil420@gamil.com'),
(7, 'Khawaja Asif', '030242012012', 'Kaf13@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `warehouse_id` int(11) NOT NULL,
  `warehouse_name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`warehouse_id`, `warehouse_name`, `location`, `capacity`) VALUES
(4, 'Lahore Branch', 'Lahore', 20000),
(5, 'Main Branch', 'Gujranwala', 100000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `Order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`vendor_id`);

--
-- Indexes for table `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `vendor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`),
  ADD CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`Order_id`) REFERENCES `purchase_order` (`Order_id`),
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD CONSTRAINT `purchase_order_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`vendor_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
