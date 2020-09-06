-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2020 at 05:34 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project4`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `role` varchar(10) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'image'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `role`, `phone`, `email`, `password`, `image`) VALUES
(1, 'Leonard Graham', 'Owner', '1-770-736-8031', 'Sincere@april.biz', '1234', 'http://localhost:3001/man3.jpg'),
(2, 'Ervin Howell', 'Manager', '010-692-6593', 'Shanna@melissa.tv', '1234', 'http://localhost:3001/man4.jpg'),
(3, 'Clementine Bauch', 'Manager', '1-463-123-4447', 'Nathan@yesenia.net', '1234', 'http://localhost:3001/woman4.jpg'),
(4, 'Patrick Lebsack', 'Sales', '493-170-9623', 'Julianne.OConner@kory.org', '1234', 'http://localhost:3001/man5.jpg'),
(5, 'Chelsey Dietrich', 'Sales', '(254)954-1289', 'Lucio_Hettinger@annie.ca', '1234', 'http://localhost:3001/woman5.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `name`, `description`, `image`) VALUES
(1, 'Art', 'Students will explore basic art media and techniques, such as drawing, painting, graphic design, photography, collage, ceramics, printmaking, and sculpture and more!', 'http://localhost:3001/art.jpg'),
(2, 'Business', 'This course provides a comprehensive overview of organizational functions and processes.', 'http://localhost:3001/business.jpg'),
(3, ' Chemistry', 'Introduction to the general principles of chemistry for students planning a professional career in chemistry , a related science, the health professions, or engineering.', 'http://localhost:3001/chemistry.jpg'),
(4, ' Data Science ', 'Complete Data Science Training: Mathematics, Statistics, Python, Advanced Statistics in Python, Machine & Deep Learning.', 'http://localhost:3001/data-science.jpg'),
(5, 'Education', 'Basic Education: Grades PK-12 ', 'http://localhost:3001/education.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `enrolled`
--

CREATE TABLE `enrolled` (
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enrolled`
--

INSERT INTO `enrolled` (`course_id`, `student_id`) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 3),
(3, 3),
(3, 4),
(4, 4),
(4, 5),
(5, 1),
(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `name`, `phone`, `email`, `image`) VALUES
(1, 'Mrs. Dennis Schulist', '1-477-935-8478', 'Karley_Dach@jasper.info', 'http://localhost:3001/woman1.jpg'),
(2, 'Kurtis Weissnat', '210.067.6132', 'Telly.Hoeger@billy.biz', 'http://localhost:3001/man1.jpg'),
(3, 'Nicholas Runolfsdottir V', '586.493.6943', 'Sherwood@rosamond.me', 'http://localhost:3001/man2.jpeg'),
(4, 'Glenna Reichert', '(775)976-6794', 'Chaim_McDermott@dana.io', 'http://localhost:3001/woman2.jpg'),
(5, 'Clementina DuBuque', '024-648-3804', 'Rey.Padberg@karina.biz', 'http://localhost:3001/woman3.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrolled`
--
ALTER TABLE `enrolled`
  ADD PRIMARY KEY (`course_id`,`student_id`),
  ADD KEY `fk_student_id` (`student_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enrolled`
--
ALTER TABLE `enrolled`
  ADD CONSTRAINT `fk_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
