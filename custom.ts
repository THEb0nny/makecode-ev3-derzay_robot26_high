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
    manipulatorMotor.pauseUntilStalled();
    manipulatorMotor.setBrake(hold);
    manipulatorMotor.stop();
}

// Механизм сброса
function UnloadingMechanism(state: UnloadingMechanismState, hold: boolean, v: number = 30) {
    const dir = state == UnloadingMechanismState.Down ? 1 : -1;
    unloadingMechanismMotor.run(Math.abs(v) * dir);
    pause(10);
    unloadingMechanismMotor.pauseUntilStalled();
    unloadingMechanismMotor.setBrake(hold);
    unloadingMechanismMotor.stop();
}

// Получить цвет
function GetColor(debug: boolean = false): number {
    const rgbHsvl = sensors.getRgbHsvl(colorSensor);
    const color = sensors.convertHsvlToColorNum(rgbHsvl[1], sensors.getHsvlToColorNumBoundaries(colorSensor));
    if (debug) {
        brick.clearScreen();
        brick.printValue("r", rgbHsvl[0][0], 1);
        brick.printValue("g", rgbHsvl[0][1], 2);
        brick.printValue("b", rgbHsvl[0][2], 3);
        brick.printValue("h", rgbHsvl[1][0], 5);
        brick.printValue("s", rgbHsvl[1][1], 6);
        brick.printValue("v", rgbHsvl[1][2], 7);
        brick.printValue("l", rgbHsvl[1][3], 8);
        brick.printValue("color", color, 10);
    }
    return color;
}

// Проверка цвета
function CheckColor(time: number, debug: boolean): number {
    let colorSamples: number[] = [];
    control.timer1.reset();
    let prevTime = control.millis();
    while (control.timer1.millis() < time) {
        const currTime = control.millis();
        const dt = currTime - prevTime;
        prevTime = currTime;
        const color = GetColor(debug);
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