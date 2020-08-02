const mysql = require("mysql");
const inquirer = require("inquirer");
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
    promptAction();
});

// Prompt user to choose an action
function promptAction() {
    return inquirer.prompt(
        {
            name: "action",
            type: "list",
            message: "What would you like to do? ",
            choices: ["View all employees", "Add an employee", "Update an employee's role", "Exit app"]
        }
    )
};

// View all employees

 
// Add an employee

// Update an employee's role


async function init() {
    const actionResponse = await promptAction();
    console.log(actionResponse);
    if (actionResponse.action === "View all employees") {
        view();
    } else if (actionResponse.action === "Add an employee") {
        addEmployee();
    } else if (actionResponse.action === "Update an employee's role") {
        updateEmployeeRole();
    } else {
        connection.end();
    }
}

init();

// Build a command-line application that at a minimum allows the user to:
    // Add departments, roles, employees
    // View departments, roles, employees
    // Update employee roles

// Bonus points if you're able to:
    // Update employee managers
    // View employees by manager
    // Delete departments, roles, and employees
    // View the total utilized budget of a department --
    // ie the combined salaries of all employees in that department