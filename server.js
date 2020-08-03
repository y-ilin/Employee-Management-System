const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
require('dotenv').config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    init();
});

// Prompt user to choose an action
function promptAction() {
    return inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do? ",
            choices: ["View all employees", "Add an employee", "Update an employee's role", "Add a department", "Add a role", "Delete an employee", "Exit app"]
        }
    )
};

////////////////////// All possible user actions below //////////////////////

// View all employee tracker info
function view() {
    const query = `SELECT a.id, a.first_name, a.last_name, role.title, department.name AS department, role.salary, CONCAT(b.first_name, " ", b.last_name) AS manager
    FROM employee a
    LEFT JOIN role ON role.id = a.role_id
    LEFT JOIN department ON department.id = role.department_id
    LEFT JOIN employee b ON a.manager_id = b.id;`
    connection.query(query, function(err, res) {
      if (err) throw err;
      console.table(res);
      return init();
    });
}

function addEmployee() {
    // Get current data in database for options for roles and managers
    // connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager, r.title FROM employee e JOIN role r ON r.id = e.role_id", function(err, res) {
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee e", function(err, res) {
        if (err) throw err;

        connection.query("SELECT title FROM role", function(err, res2) {
            if (err) throw err;

            const roleChoices = res2.map((role) => role.title);
            const managerChoices = res.map((employee) => employee.manager)
            managerChoices.push("null");

            // Prompt user for new employee information
            inquirer.prompt(
                [{
                    name: "first_name",
                    type: "input",
                    message: "New employee's first name: ",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "New employee's last name: ",
                },
                {
                    name: "role",
                    type: "list",
                    message: "New employee's role: ",
                    choices: roleChoices.filter((item, index) => roleChoices.indexOf(item) === index),
                },
                {
                    name: "manager",
                    type: "list",
                    message: "New employee's manager: ",
                    choices: managerChoices,
                }],
            ).then(function(result){
                // Add new empoyee to database
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, (SELECT id FROM role WHERE title = ?), (SELECT id FROM employee b WHERE CONCAT(b.first_name, ' ', b.last_name) = ?))`,
                [result.first_name, result.last_name, result.role, result.manager], function(err, result) {
                    if (err) throw err;
                    
                    console.log("=====================================================")
                    console.log("================  New employee added. ===============")
                    console.log("=====================================================")
                    return init();
                })
            })
        })
    });
};

function updateEmployeeRole() {
    // Get current data in database for options for employees and roles
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title FROM employee e LEFT JOIN role r ON r.id = e.role_id", function(err, res) {
        if (err) throw err;

        const roleChoices = res.map((role) => role.title);
        const employeeChoices = res.map((employee) => employee.employee)

        // Prompt user for new employee information
        inquirer.prompt(
            [{
                name: "employee",
                type: "list",
                message: "Update role for this employee: ",
                choices: employeeChoices,
            },
            {
                name: "role",
                type: "list",
                message: "New employee's role: ",
                choices: roleChoices.filter((item, index) => roleChoices.indexOf(item) === index),
            }],
        ).then(function(res){
            // Add new empoyee to database
            connection.query(`UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE id = (SELECT id FROM(SELECT id FROM employee b WHERE CONCAT(b.first_name, ' ', b.last_name) = ?) as t)`,
            [res.role, res.employee], function(err, res) {
                if (err) throw err;
                
                console.log("=====================================================")
                console.log("==============  Employee role updated. ==============")
                console.log("=====================================================")
                return init();
            })
        })
    });
}

function addDepartment() {
    connection.query("SELECT name FROM department", function(err, res) {
        if (err) throw err;
        console.log("Existing departments:\n");
        console.table(res);

        const existingDepartments = res.map((department) => department.name);

        // Prompt user for new department information
        inquirer.prompt(
            [{
                name: "department",
                type: "input",
                message: "Name of new department: ",
            }],
        ).then(function(res){
            if (existingDepartments.includes(res.department)) {
                console.log("=====================================================")
                console.log("=========  This department already exists. ==========")
                console.log("=====================================================")

                return init();
            } else {
                // Add new department to database
                connection.query(`INSERT INTO department (name) VALUES (?)`,
                res.department, function(err, res) {
                    if (err) throw err;
                    
                    console.log("=====================================================")
                    console.log("===============  New department added. ==============")
                    console.log("=====================================================")
                    return init();
                })
            }
        })
    });
}

function addRole() {
    // connection.query("SELECT role.title, department.name FROM role LEFT JOIN department ON department.id = role.department_id", function(err, res) {
    connection.query("SELECT title FROM role", function(err, res) {
        if (err) throw err;
        console.log("Existing roles:\n")
        console.table(res);

        connection.query("SELECT name FROM department", function(err, res2) {
            if (err) throw err;

            const existingRoles = res.map((role) => role.title);
            const departmentChoices = res2.map((department) => department.name)

            // Prompt user for new employee information
            inquirer.prompt(
                [{
                    name: "title",
                    type: "input",
                    message: "Name of new role: ",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "Salary for the role: ",
                },
                {
                    name: "department",
                    type: "list",
                    message: "Department the role belongs to: ",
                    choices: departmentChoices.filter((item, index) => departmentChoices.indexOf(item) === index),
                }],
            ).then(function(result){
                // Check for this role title in this department
                if (existingRoles.includes(result.title)) {
                    console.log("=====================================================")
                    console.log("=============  This role already exists. ============")
                    console.log("=====================================================")
                    return init();
                } else {
                    // Add new role to this department in database
                    connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT d.id FROM department d WHERE d.name = ?))`,
                    [result.title, result.salary, result.department], function(err, result) {
                        if (err) throw err;

                        console.log("=====================================================")
                        console.log("==================  New role added. =================")
                        console.log("=====================================================")
                        return init();
                    })
                }
            })
        })
    });
}

function deleteEmployee() {
    // Get current data in database for options for employees and roles
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee FROM employee e", function(err, res) {
        if (err) throw err;

        const existingEmployees = res.map((employee) => employee.employee)
        
        // Prompt user for new employee information
        inquirer.prompt(
            {
                name: "employee",
                type: "list",
                message: "Delete the following employee: ",
                choices: existingEmployees,
            },
        ).then(function(res){
            // Add new empoyee to database
            connection.query(`DELETE FROM employee e WHERE CONCAT(e.first_name, ' ', e.last_name) = ?`,
            res.employee, function(err, res) {
                if (err) throw err;
                
                console.log("=====================================================")
                console.log("=================  Employee deleted. ================")
                console.log("=====================================================")
                return init();
            })
        })
    });}


async function init() {
    const actionResponse = await promptAction();
    switch (actionResponse.action) {
        case "View all employees":
            view();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee's role":
            updateEmployeeRole();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Delete an employee":
            deleteEmployee();
            break;
        case "Exit app":
            console.log("=====================================================")
            console.log("===================  Exiting app. ===================")
            console.log("=====================================================")
            connection.end(); 
    }
}