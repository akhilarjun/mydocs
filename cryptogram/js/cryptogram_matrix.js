const matrixTable = [
    ['A','B','C','D','E'],
    ['F','G','H','I','J'],
    ['K','L','M','N','O'],
    ['P','Q','R','S','T'],
    ['U','V','W','X','Y'],
    ['Z','0','1','2','3']
];

let startingY = 3;
let startingX = 2;
let nextChar = '';

const findNextCharacter = (dir, times) => {
    switch(dir) {
        case 'L':
            startingX -= Number(times);
            nextChar = matrixTable[startingY][startingX];
            break;
        case 'R':
            startingX += Number(times);
            nextChar = matrixTable[startingY][startingX];
            break;
        case 'U':
            startingY -= Number(times);
            nextChar = matrixTable[startingY][startingX];
            break;
        case 'D':
            startingY += Number(times);
            nextChar = matrixTable[startingY][startingX];
            break;
        case ' ':
            nextChar = ' ';
            break;
    }
};

const runMatrixLogic = (steps) => {
    let solution = '';

    const stepArray = steps.split(',');
    for (keyCode in stepArray) {
        const step = stepArray[keyCode];
        for (let characterIndex = 0; characterIndex < step.length; characterIndex++){
            const direction = step[characterIndex];
            characterIndex++;
            const numberOfSteps = step[characterIndex];
            findNextCharacter(direction, numberOfSteps);
        }
        solution += nextChar;
    }

    return solution;
}

// Code for getting input from html
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
    const inputSteps = document.getElementById('input').value;
    const solution = runMatrixLogic(inputSteps);
    document.getElementById('result').textContent = solution;
})

//runMatrixLogic('L2U2R1D4R1U2,U2L2U1,R4D4L2U1L2,R4U1L1U1,L2U1R2, ,D5L3U2R2U3R1,D1R1U1,D3L4,U1R1,R3D2L1U2R1,D2,L3U2R1,L1U2R3,L1D2,L3D3R2U2R2');