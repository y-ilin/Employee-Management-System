DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL
  -- CONSTRAINT FK_department_id FOREIGN KEY (department_id)
  -- REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
  -- CONSTRAINT FK_role_id FOREIGN KEY (role_id)
  -- REFERENCES role(id),
  -- CONSTRAINT FK_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id)
);