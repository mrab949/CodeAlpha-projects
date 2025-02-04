window.addEventListener('load', () => {
    setTimeout(() => {
        window.alert('The "%" operator calculates the remainder, not the percentage!');
    }, 1000);
});
let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let answer = document.getElementById('answer');
let operators = ['+', '-', '*', '/', '%', '.']; // List of operators

let string = "";
let lastChtr = '';
let arr = Array.from(buttons);

// Handle input and update the display
function handleInput(clickedChar) {
    try {
        if (string === "") {
            answer.value = "";
        }
        if (clickedChar === '=') {
            if (string === "" || operators.includes(lastChtr)) {
                string = string.slice(0, -1); 
                input.value = string;
                //return;
            }
            if (string.includes('/0')) {
                answer.value = '∞';
                return;
            }
            answer.value = eval(string); 
        }
        else if (clickedChar === 'AC') {
            string = "";
            input.value = string;
            answer.value = string;
        }
        else if (clickedChar === 'DEL') {
            string = string.slice(0, -1);
            input.value = string;
            lastChtr = string[string.length - 1] || ''; // Update last character
        }
        else {
            if (operators.includes(clickedChar) && operators.includes(lastChtr)) {
                lastChtr = clickedChar;
                input.value = string.slice(0, -1) + clickedChar;
                return;
            }
            if (string === '' && clickedChar === '(') {
                string += clickedChar;
                input.value = string;
                lastChtr = clickedChar;
            }
            if (!(string.includes('(')) && clickedChar === ')') {
                return;
            }
            if (!(operators.includes(lastChtr)) && clickedChar === '(') {
                return; // Ignore '(' if the last character is not an operator
            }
            if ((string === '0' || string === '00') && (clickedChar === '0' || clickedChar === '00')) {
                return;
            }
            string += clickedChar;
            input.value = string;
            lastChtr = clickedChar; 
        }
    } catch (error) {
        // Handle errors
        answer.value = "Error";
        console.error(error.message);
    }
}

// For button clicks
arr.forEach(button => {
    button.addEventListener('click', (e) => {
        handleInput(e.target.innerHTML);
    });
});

// For keyboard input (desktop and external keyboards)
document.addEventListener('keydown', (e) => {
    let key = e.key;

    // Prevent actions for certain keys
    if (key === 'Enter' || key === 'Backspace' || operators.includes(key) || /[0-9]/.test(key) || key === '(' || key === ')') {
        e.preventDefault();
        if (key === 'Enter') {
            key = '=';
        } else if (key === 'Backspace') {
            key = 'DEL';
        }
        handleInput(key);
    }
});

// Handle inputs from mobile keyboard 
input.addEventListener('input', (e) => {
    string = e.target.value;
    
    // Allow only numbers and operators
    if (!/^[0-9+\-*/%().]*$/.test(string)) {
        input.value = string.slice(0, -1);
        string = input.value;
        return;
    }

    lastChtr = string[string.length - 1] || '';

    if (operators.includes(lastChtr) && string.length > 1) {
        const secondLastChtr = string[string.length - 2];
        if (operators.includes(secondLastChtr)) {
            string = string.slice(0, -2) + lastChtr;
            input.value = string;
        }
    }

    if (lastChtr === '=') {
        string = string.slice(0, -1);
        if (string === "" || operators.includes(string[string.length - 1])) {
            input.value = string.slice(0, -1);
            string = input.value;
        }
        if (string.includes('/0')) {
            answer.value = '∞';
            return;
        }
        answer.value = eval(string);
        input.value = string;
    }
});