enum ManipulatorState {
    Down,
    Up
}

enum UnloadingMechanismState {
    Down,
    Up
}

// Манипулятор захвата
function Manipulator(state: ManipulatorState, hold: boolean, v: number = 50) {
    const dir = state == ManipulatorState.Down ? 1 : -1;
    manipulatorMotor.run(Math.abs(v) * dir);
    pause(10);
    manipulatorMotor.pauseUntilStalled(1500);
    manipulatorMotor.setBrake(hold);
    manipulatorMotor.stop();
}

// Механизм сброса
function UnloadingMechanism(state: UnloadingMechanismState, hold: boolean, v: number = 30) {
    const dir = state == UnloadingMechanismState.Down ? 1 : -1;
    unloadingMechanismMotor.run(Math.abs(v) * dir);
    pause(10);
    unloadingMechanismMotor.pauseUntilStalled(1500);
    unloadingMechanismMotor.setBrake(hold);
    unloadingMechanismMotor.stop();
}

// Получить цвет
function GetHtColor(debug: boolean = false): number {
    const rgbwHsvl = htColorSensor.getActiveRGBWHSVL();
    const color = sensors.convertHsvlToColorNum(rgbwHsvl[1], sensors.getHsvlToColorNumBoundariesHtColorSensor(htColorSensor));
    if (debug) {
        brick.clearScreen();
        brick.printValue("r", rgbwHsvl[0][0], 1);
        brick.printValue("g", rgbwHsvl[0][1], 2);
        brick.printValue("b", rgbwHsvl[0][2], 3);
        brick.printValue("w", rgbwHsvl[0][3], 4);
        brick.printValue("h", rgbwHsvl[1][0], 6);
        brick.printValue("s", rgbwHsvl[1][1], 7);
        brick.printValue("v", rgbwHsvl[1][2], 8);
        brick.printValue("l", rgbwHsvl[1][3], 9);
        brick.printValue("color", color, 11);
    }
    return color;
}

// Проверка цвета
function CheckHtColor(time: number, debug: boolean): number {
    let colorSamples: number[] = [];
    control.timer1.reset();
    let prevTime = control.millis();
    while (control.timer1.millis() < time) {
        const currTime = control.millis();
        prevTime = currTime;
        const color = GetHtColor(debug);
        colorSamples.push(color);
        control.pauseUntilTimeMs(currTime, 10);
    }
    const colorResult = custom.mostFrequentNumber(colorSamples);
    return colorResult;
}

// Озвучить цвет
function VoiceColor(color: number) {
    if (color == 1) music.playSoundEffect(sounds.colorsBlack);
    if (color == 2) music.playSoundEffect(sounds.colorsBlue);
    else if (color == 3) music.playSoundEffect(sounds.colorsGreen);
    else if (color == 4) music.playSoundEffect(sounds.colorsYellow);
    else if (color == 5) music.playSoundEffect(sounds.colorsRed);
    else if (color == 6) music.playSoundEffect(sounds.colorsWhite);
    else music.playSoundEffect(sounds.communicationNo);
}