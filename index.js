const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tasksFilePath = path.join(__dirname, "tasks.txt");

// Function to ask for an operation
function askForOperation() {
  rl.question(
    "Choose an operation: (add, view, complete, remove, exit) ",
    (operation) => {
      switch (operation) {
        case "add":
          rl.question("Enter a new task: ", (task) => {
            addTask(task);
          });
          break;
        case "view":
          viewTasks();
          break;
        case "complete":
          rl.question(
            "Enter the task number to mark as complete: ",
            (number) => {
              markTaskAsComplete(parseInt(number));
            }
          );
          break;
        case "remove":
          rl.question("Enter the task number to remove: ", (number) => {
            removeTask(parseInt(number));
          });
          break;
        case "exit":
          rl.close();
          break;
        default:
          console.log("Invalid operation.");
          askForOperation();
      }
    }
  );
}

// Function to add a task
function addTask(task) {
  fs.appendFile(tasksFilePath, `${task}\n`, (err) => {
    if (err) throw err;
    console.log("Task added successfully.");
    askForOperation();
  });
}

// Function to view tasks
function viewTasks() {
  fs.readFile(tasksFilePath, "utf8", (err, data) => {
    if (err) throw err;
    const tasks = data.trim().split("\n");
    console.log("Tasks:");
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task}`);
    });
    askForOperation();
  });
}

// Function to mark a task as complete
function markTaskAsComplete(taskNumber) {
  fs.readFile(tasksFilePath, "utf8", (err, data) => {
    if (err) throw err;
    let tasks = data.trim().split("\n");
    if (taskNumber > 0 && taskNumber <= tasks.length) {
      tasks[taskNumber - 1] += " (completed)";
      fs.writeFile(tasksFilePath, tasks.join("\n"), (err) => {
        if (err) throw err;
        console.log("Task marked as complete.");
        askForOperation();
      });
    } else {
      console.log("Task number does not exist.");
      askForOperation();
    }
  });
}

// Function to remove a task
function removeTask(taskNumber) {
  fs.readFile(tasksFilePath, "utf8", (err, data) => {
    if (err) throw err;
    let tasks = data.trim().split("\n");
    if (taskNumber > 0 && taskNumber <= tasks.length) {
      tasks = tasks.filter((_, index) => index !== taskNumber - 1);
      fs.writeFile(tasksFilePath, tasks.join("\n"), (err) => {
        if (err) throw err;
        console.log("Task removed.");
        askForOperation();
      });
    } else {
      console.log("Task number does not exist.");
      askForOperation();
    }
  });
}

// Start the application by asking for an operation
askForOperation();
