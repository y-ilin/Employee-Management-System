-- Insert sample data
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jessica", "Pearson", 1, null), ("Harvey", "Specter", 1, 1), ("Louis", "Litt", 2, 1), ("Mike", "Ross", 3, 2), ("Rachael", "Zane", 3, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Boss", 100000, 1), ("Manager", 50000, 2), ("Engineer", 1000, 2);

INSERT INTO department (name)
VALUES ("Business & Strategy"), ("Engineering");




-- Add employee prompts
-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("yo", "yo", (SELECT id FROM role WHERE title = "Boss"), (SELECT id FROM employee b WHERE CONCAT(b.first_name, ' ', b.last_name) = "YL L"));

-- Update employee prompts
-- UPDATE employee SET role_id = (SELECT id FROM role WHERE title = "Worker") WHERE id = (SELECT id FROM(SELECT id FROM employee b WHERE CONCAT(b.first_name, ' ', b.last_name) = "B T") as t);


-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
-- FROM employee
-- LEFT JOIN role ON role.id = employee.role_id
-- LEFT JOIN department ON department.id = role.department_id;