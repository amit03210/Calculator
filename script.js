let exp = {
    operandLeft: '',
    operandRight: '',
    operator: '',
    maxDigit: 13,
    isOperator: false,
    isDecimal: false,
}

let symbols = {
    '+': 'add',
    '-': 'subtract',
    'x': 'multiply',
    '÷': 'divide',
    '%': 'percent',
    '/': 'division Keyboard',
    '*': 'multiply keyboard',
}

let buttons = document.querySelector(".buttonsAllContainer");
let button = document.querySelectorAll('[class^="row-"] button');
let screen1 = document.querySelector('.screen-operand');
let screen2 = document.querySelector('.screen-operator');
let body    = document.querySelector('body');

let display = function(str) {
    const val = str;
    // const val = e.target.textContent || e.key;

    //take Input
    operandInput(val);

    //display operands
    screen1.textContent = exp.operandLeft;
    if(exp.isOperator && exp.operandRight)
        screen1.textContent = exp.operandRight;
        //display left operand alongside with operator.
        if(exp.isOperator)
            screen2.textContent = `${exp.operandLeft} ${exp.operator}`

    //display operator
    if(symbols[val])
        screen2.textContent = val;
}

let clearAll = function (str) {
    const val = str;
    let display1 = screen1.textContent;
    console.log(val)
    if(val == 'C' || val == "Escape"){
        exp.operandLeft = '';
        exp.operandRight = '';
        exp.isOperator = false;
        screen1.textContent = '0';
        screen2.textContent = '\u00A0';
    }

    //backspace effect
    if(val == '⬅' || val == "Backspace"){
        screen1.textContent = screen1.textContent.length<=1? '0': display1.slice(0, -1);
        if(!exp.isOperator || (exp.isOperator && exp.operandLeft))
            exp.operandLeft = exp.operandLeft? exp.operandLeft.slice(0, exp.operandLeft.length-1):0;
        exp.operandRight = exp.operandRight? exp.operandRight.slice(0, exp.operandRight.length-1):0;
    }

}

let operandInput = function(data) {
    
    //operand input after checking if data == number
    if(!isNaN(parseInt(data))){
        let maxInputDigit = exp.maxDigit;
        if(!exp.isOperator){
            if(exp.operandLeft == '0')
                exp.operandLeft = data
            else
                if(exp.operandLeft.length<maxInputDigit)
                    exp.operandLeft += data;
        } else{
            if(exp.operandRight.length<maxInputDigit)
                exp.operandRight += data;
        }
    }

    //if pressed any operator then turn isOperator = true;
    if(symbols[data]){
        exp.isOperator = true;
        if(data == '/')
            exp.operator = "÷";
        else
        exp.operator = data;
    }
}

let calculation = function(strInput){
    let result = 0;
    leftInt = parseFloat(exp.operandLeft);
    rightInt = parseFloat(exp.operandRight);
    if(strInput == '=' || strInput == "Enter"){ //modification needed to make it modular
        if(!exp.isOperator || exp.isOperator && !exp.operandRight || exp.isOperator && !exp.operandLeft){
            if (exp.isOperator && !exp.operandLeft){
                screen1.textContent = '0';
                exp.operandRight = "";
                exp.operandLeft = "0";
                exp.isOperator = false;
            }
            else
                screen1.textContent = exp.operandLeft;
            return
        }
        switch(exp.operator) {
            case '+': result = (leftInt + rightInt).toFixed(greatestDecimal());
            break;
            case '-': result = (leftInt - rightInt).toFixed(greatestDecimal());
            break;
            case '÷': 
            case '/':result = (leftInt / rightInt).toFixed(greatestDecimal());
            break;
            case 'x': 
            case '*':result = (leftInt * rightInt).toFixed(greatestDecimal());
            break;
            case '%': {
                result = (leftInt * (rightInt)/100);
                screen2.textContent = screen2.textContent.slice(0, screen2.textContent.length-1) + "*";
                exp.operandRight = exp.operandRight/100;
            }
            break;
            default: result = leftInt;
        }
        if(result.toString().length>exp.maxDigit){
            console.log(typeof result)
            result = parseFloat(result).toExponential(exp.maxDigit-5);
        }
        screen1.textContent = result;
        screen2.textContent += ` ${exp.operandRight}`;
        exp.operandLeft = String(result);
        exp.operandRight = '';
    }
    if(strInput == '.'){

        if(exp.operandRight){
                if(!exp.operandRight.includes('.')){
                    exp.operandRight += "."; 
                    screen1.textContent = screen1.textContent + ".";
                }
        }else{
            if(!exp.operandLeft.includes(".")){
                exp.operandLeft += ".";
                screen1.textContent = screen1.textContent + ".";
            }
        }

    }
    
    if(strInput == "±"){
        if(exp.operandRight){
            exp.operandRight *= -1;
            exp.operandRight = String(exp.operandRight);
        }else
        {
            exp.operandLeft *= -1;
            exp.operandLeft = String(exp.operandLeft);
        }
        
        if(screen1.textContent[0] == "-")
            screen1.textContent = screen1.textContent.slice(1, screen1.textContent.length);
        else{
            screen1.textContent = "-" + screen1.textContent;
        }
        
    }

    function greatestDecimal(){
        const dR = exp.operandRight.split('.')[1]?exp.operandRight.split('.')[1].length: 0;
        const dL = exp.operandLeft.split('.')[1]?exp.operandLeft.split('.')[1].length: 0;
        return Math.max(dR, dL);

    }
}

button.forEach(btn => {
    let symbol = btn.innerText.trim();
    btn.dataset.value = symbols[symbol] || symbol;
})


button.forEach(btn => {
    btn.addEventListener('click', (e) => {
    //handle display
    display(e.target.textContent);
    // handle clear and backspace operation;
    clearAll(e.target.textContent);
    //Calculation
    calculation(e.target.textContent);    
    })
})

body.addEventListener('keydown', (e) =>{
    display(e.key);
    // handle clear and backspace operation;
    clearAll(e.key);
    //Calculation
    calculation(e.key);

    document.querySelectorAll(".buttonsAllContainer div button").forEach(btn => {
        if(btn.textContent.trim() == e.key)
            btn.classList.add('pressed');
    });
});

body.addEventListener('keyup', (e) => {
    document.querySelectorAll(".buttonsAllContainer button").forEach(btn => {
        if(btn.textContent.trim() == e.key)
            btn.classList.remove('pressed');
    })
})
