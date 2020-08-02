-- Insert sample data
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("B", "T", 1, null), ("K", "L", 1, null), ("CF", "L", 2, 1), ("YL", "L", 3, 2), ("CS", "L", 3, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Boss", 100000, 1), ("Supervisor", 50000, 1), ("Worker", 1000, 2);

INSERT INTO department (name)
VALUES ("Business Strategy"), ("Engineering");

-- Insert foreign keys to existing tables
ALTER TABLE role ADD CONSTRAINT FK_department_id FOREIGN KEY (department_id) REFERENCES department(id);
ALTER TABLE employee ADD CONSTRAINT FK_role_id FOREIGN KEY (role_id) REFERENCES role(id);

-- Join all 3 tables
SELECT a.id, a.first_name, a.last_name, role.title, department.name AS department, role.salary, CONCAT(b.first_name, " ", b.last_name) AS manager
FROM employee a
LEFT JOIN role ON role.id = a.role_id
LEFT JOIN department ON department.id = role.department_id
LEFT JOIN employee b ON a.manager_id = b.id;

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
-- FROM employee
-- LEFT JOIN role ON role.id = employee.role_id
-- LEFT JOIN department ON department.id = role.department_id;