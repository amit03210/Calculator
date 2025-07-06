let screen = document.querySelector('.screens');
// let operandLeft = "";
// let operandRight = "";
// let operator = "";
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
}

let buttons = document.querySelector(".buttonsAllContainer");
let button = document.querySelectorAll('[class^="row-"] button');
let screen1 = document.querySelector('.screen-operand');
let screen2 = document.querySelector('.screen-operator');

let display = function(e) {
    const val = e.target.textContent;
    
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

let clearAll = function (e) {
    const val = e.target.textContent;
    let display1 = screen1.textContent;
    console.log(val)
    if(val == 'C'){
        exp.operandLeft = '';
        exp.operandRight = '';
        exp.isOperator = false;
        screen1.textContent = '\u00A0';
        screen2.textContent = '\u00A0';
    }

    //backspace effect
    if(val == '⬅'){
        screen1.textContent = !screen1.textContent || screen1.textContent.length<=1? '0': display1.slice(0, -1);
        if(!exp.isOperator)
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
        exp.operator = data;
    }
}

let calculation = function(e){
    let result = 0;
    leftInt = parseFloat(exp.operandLeft);
    rightInt = parseFloat(exp.operandRight);
    if(e.target.textContent == '='){
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
            case '÷': result = (leftInt / rightInt).toFixed(greatestDecimal());
            break;
            case 'x': result = (leftInt * rightInt).toFixed(greatestDecimal());
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
    if(e.target.textContent == '.'){
        if(exp.operandRight){
            exp.operandRight += "."; 
        }else{
            exp.operandLeft += ".";
        }

        screen1.textContent = screen1.textContent + ".";
    }
    
    if(e.target.textContent == "±"){
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
    display(e);
    //handle clear and backspace operation;
    clearAll(e);
    //Calculation
    calculation(e);    
    })
})



// operatorList = ['+','-','/','*'];
// // let isOperator = false;
// let btnContainer = document.querySelector('.buttonsAllContainer')
// let buttonArr = [
//     {value: 1,},
//     {value: 2,},
//     {value: 3,},
//     {value: 4,},
//     {value: 5,},
//     {value: 6,},
//     {value: 7,},
//     {value: 8,},
//     {value: 9,},
//     {value: 0,},
//     {value: '+',},
//     {value: '-',},
//     {value: '/',},
//     {value: '*',},
//     {value: '=',},
//     {value: '.'},
// ]

// buttonArr = buttonArr.map(item => ({
//   ...item,
//   class: 'btn-' + item.value
// }));

// buttonArr.unshift({value: '⌫', class: 'btn-back'})
// buttonArr.unshift({value: 'AC', class: 'btn-AC'})

// buttonArr.map(item => {
//     let btn = document.createElement('button');
//     btn.classList.add(item.class);
//     btn.textContent = item.value;
//     btnContainer.appendChild(btn);
// })


// function setOperand(e, exp){
//     if(e.target.textContent == '.'){
//         if(!exp.isDecimal){
//             if(exp.isOperator){
//                 exp.operandRight += e.target.textContent;
//                 exp.isDecimal = true;
//                 return null;
//             }else {
//                 exp.operandLeft += e.target.textContent;
//                 exp.isDecimal = true;
//                 return null;
//             } 
//         } else {
//             return null;
//         }
//     } else {
//         if(exp.isOperator){
//             if(operatorList.includes(e.target.textContent) == false){
//             exp.operandRight += e.target.textContent;
//         }
//     }
//         else{
//         exp.operandLeft += e.target.textContent;
//         }
//     }
// }

// function setOperator(eventObj, exp) {
//     let operVal = eventObj.target.textContent;
//     if(['+' ,'-', '/', '*'].includes(operVal)){
//         screen.textContent = "";
//         exp.operator = operVal;
//         exp.isOperator = true;
//     }
// }

// function display(e, exp){
//     console.log(e);
//     //If first time enter number, remove preceding 0.
//     if(exp.operandRight == "" && exp.operandLeft == ""){
//         screen.textContent = "";
//     }    
//     let numStr = e.target.textContent;
//     if(isNaN(parseInt(numStr)) == false)
//         screen.textContent += numStr;
    
// }

// let operation = (ex) => {
//     let left = parseFloat(ex.operandLeft);
//     let right = parseFloat(ex.operandRight);
//     exp.isDecimal = false;
//     switch(ex.operator){
//         case '+': return left + right;
//         case '-': return left - right;
//         case '/': return left / right;
//         case ('*'): return left * right;
//     }
// }

// function reset(ex){
//     ex.operandLeft = "";
//     ex.operandRight = "";
//     ex.prevResult = "";
//     ex.operator = "";
//     ex.isOperator = false;
//     screen.textContent = "";
// }

// function resultOperation(exp){
//     screen.textContent = operation(exp);
//     exp.prevResult = operation(exp);
//     exp.operandLeft = operation(exp);
//     exp.operandRight = "";
// }

// btnContainer.addEventListener('click', (e) =>  {
//     eventObjContent = e.target.textContent

//     if(e.target.textContent == 'AC'){
//         reset(exp);
//     }else if(eventObjContent == '=')
//         resultOperation(exp)
//     else if (operatorList.includes(eventObjContent) && exp.operandLeft != "" && exp.operandRight != ""){
//             setOperator(e,exp);
//             resultOperation(exp)
//     }
//     else{
//         display(e, exp);
//         setOperator(e, exp);
//         setOperand(e, exp);
//     }
    
    
    
//     console.log(`Operator = ${exp.operator}
//         operand Left = ${exp.operandLeft}
//         operand Right = ${exp.operandRight}`)
        
//     })
    
    