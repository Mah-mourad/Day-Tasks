let sheets = JSON.parse(localStorage.getItem('sheets')) || [];
let num = sheets.length > 0 ? sheets.length + 1 : 1; // Track the number of sheets based on saved data

// Function to add a new sheet
function addNewSheet() {
    let newSheet = {
        id: num, // unique ID for each sheet
        tasks: [], // Initialize an empty task list for each sheet
    };

    sheets.push(newSheet); // Add the new sheet to the array
    saveToLocalStorage(); // Save the state to localStorage

    renderSheets(); // Re-render all sheets with the new one added
    num++; // Increment num for the next sheet
}

// Function to save sheets array to localStorage
function saveToLocalStorage() {
    localStorage.setItem('sheets', JSON.stringify(sheets));
}

// Function to render sheets in the DOM
function renderSheets() {
    const resultDiv = document.querySelector('#result');
    resultDiv.innerHTML = ''; // Clear current sheet elements

    sheets.forEach((sheet, index) => {
        let sheetHTML = `
            <div class="body" id="sheet-${index + 1}" style="background-color: ${sheet.color}">
                <div class="head">
                    <h2>Sheet ${index + 1}</h2> 
                    <div class="settings">
                        <button class="add" onclick="showCustomPrompt(${index + 1})"><i class="fa-solid fa-plus"></i></button>
                        <button class="setting" onclick="showColorPalette(${index + 1})"><i class="fa-solid fa-gear"></i></button>
                    </div>
                </div>
                <div class="tasks" id="tasks-${index + 1}">
                </div>
            </div>
        `;
        resultDiv.innerHTML += sheetHTML;
        fillTask(index + 1); // Load tasks for each sheet
    });

    // Update the `num` variable to be the next sheet number
    num = sheets.length + 1;
}

// Function to fill tasks for a specific sheet
function fillTask(sheetId) {
    const sheet = sheets[sheetId - 1];
    const taskContainer = document.querySelector(`#tasks-${sheetId}`);
    if (taskContainer) {
        taskContainer.innerHTML = ''; // Clear previous tasks
        sheet.tasks.forEach((task, index) => {
            let content = `
                <div class="task" id="task-${index + 1}">
                    <div class="name">
                        <input class="check" type="checkbox" onclick="removeTask(this, ${index + 1})" ${task.isDone ? 'checked' : ''}>
                        <label>${index + 1}. ${task.title}</label>
                    </div>
                    <div class="time">
                        ${task.date}
                    </div>
                </div>
            `;
            taskContainer.innerHTML += content;
        });
    }
}

// Show custom prompt for adding a task to a specific sheet
function showCustomPrompt(sheetId) {
    document.getElementById('prompt-overlay').style.display = 'block';
    document.getElementById('custom-prompt').style.display = 'block';
    document.getElementById('custom-prompt').dataset.sheetId = sheetId; // Store the sheet ID in the prompt
}

// Submit the task to the corresponding sheet
function submitPrompt() {
    const sheetId = parseInt(document.getElementById('custom-prompt').dataset.sheetId); // Retrieve the sheet ID and convert to number
    const userInput = document.getElementById('prompt-input').value.trim(); // Get and trim user input

    if (userInput === "") {
        alert("Please enter a valid task.");
        return; // Prevent empty tasks
    }

    let now = new Date();
    let dateYear = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();

    let taskObj = {
        title: userInput,
        date: dateYear,
        isDone: false
    };

    const sheet = sheets[sheetId - 1]; // Find the specific sheet by ID
    if (sheet) {
        sheet.tasks.push(taskObj); // Add task to the specific sheet
        fillTask(sheetId); // Update the task list for that sheet
        saveToLocalStorage(); // Save the updated task list to localStorage

        // Hide the prompt after successful submission
        document.getElementById('prompt-overlay').style.display = 'none';
        document.getElementById('custom-prompt').style.display = 'none';
        document.getElementById('prompt-input').value = ''; // Clear input for next task
    } else {
        alert("Sheet not found. Please try again.");
    }
}

// Cancel the prompt
function cancelPrompt() {
    document.getElementById('prompt-overlay').style.display = 'none';
    document.getElementById('custom-prompt').style.display = 'none';
}

// Event listener for creating a new sheet
document.getElementById("createElement").addEventListener("click", function () {
    addNewSheet(); // Create a new sheet
});

// Add a default sheet on page load or load sheets from localStorage
document.addEventListener("DOMContentLoaded", function () {
    if (sheets.length > 0) {
        renderSheets(); // Load and render all sheets from localStorage
    } else {
        addNewSheet(); // Add a default sheet if none are present
    }
});

// Function to remove the task and reorder remaining tasks
function removeTask(checkbox, taskId) {
    const sheetId = parseInt(checkbox.closest('.body').id.split('-')[1]);
    const sheet = sheets[sheetId - 1];

    if (sheet) {
        sheet.tasks.splice(taskId - 1, 1); // Remove the task from the array based on its index
        fillTask(sheetId); // Refill the task list to maintain correct order and numbering
        saveToLocalStorage(); // Save the updated task list to localStorage
    }
}

// Show the color palette to change the background of the sheet
function showColorPalette(sheetId) {
    // Create a color palette div
    let colorPaletteHTML = `
        <div id="color-palette">
            <h3>Choose a background color:</h3>
            <div class="colors">
                <div class="color-option" style="background-color: #f28b82;" onclick="changeColor(${sheetId}, '#f28b82')"></div>
                <div class="color-option" style="background-color: #BB2649;" onclick="changeColor(${sheetId}, '#BB2649')"></div>
                <div class="color-option" style="background-color: #FFC196;" onclick="changeColor(${sheetId}, '#FFC196')"></div>
                <div class="color-option" style="background-color: #55B4B0;" onclick="changeColor(${sheetId}, '#55B4B0')"></div>
                <div class="color-option" style="background-color: #6667AB;" onclick="changeColor(${sheetId}, '#6667AB')"></div>
                <div class="color-option" style="background-color: #cbf0f8;" onclick="changeColor(${sheetId}, '#cbf0f8')"></div>
                <div class="color-option" style="background-color: #d7aefb;" onclick="changeColor(${sheetId}, '#d7aefb')"></div>
            </div>
            <div class="butns">
            <button class="delete" onclick="deleteSheet(${sheetId})">Delete Sheet</button>
            <button class="close" onclick="closeColorPalette()">Close</button>
            </div>
        </div>
    `;

    // Append the color palette to the body
    document.body.innerHTML += colorPaletteHTML;
}

// Change the background color of the selected sheet
function changeColor(sheetId, color) {
    const sheet = sheets[sheetId - 1]; // Find the specific sheet by ID
    sheet.color = color; // Update the sheet color in the array

    // Change the background color of the sheet in the DOM
    const sheetDiv = document.getElementById(`sheet-${sheetId}`);
    sheetDiv.style.backgroundColor = color;

    saveToLocalStorage(); // Save the updated color to localStorage

    // Close the color palette after choosing a color
    closeColorPalette();
}

// Delete the sheet and update localStorage
function deleteSheet(sheetId) {
    // Remove the sheet from the array
    sheets.splice(sheetId - 1, 1);

    // Re-render all the sheets with updated numbers
    renderSheets();
    saveToLocalStorage(); // Save the updated sheets array to localStorage

    // Close the color palette after deleting the sheet
    closeColorPalette();
}

// Close the color palette
function closeColorPalette() {
    const palette = document.getElementById('color-palette');
    if (palette) {
        palette.remove(); // Remove the palette div from the DOM
    }
}
