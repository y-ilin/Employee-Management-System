-- Create database
DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- Create tables
CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL
);

CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
);

-- Insert foreign keys to existing tables
ALTER TABLE role ADD CONSTRAINT FK_department_id FOREIGN KEY (department_id) REFERENCES department(id);
ALTER TABLE employee ADD CONSTRAINT FK_role_id FOREIGN KEY (role_id) REFERENCES role(id);

-- Join all 3 tables
SELECT a.id, a.first_name, a.last_name, role.title, department.name AS department, role.salary, CONCAT(b.first_name, " ", b.last_name) AS manager
FROM employee a
LEFT JOIN role ON role.id = a.role_id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee b ON a.manager_id = b.id;