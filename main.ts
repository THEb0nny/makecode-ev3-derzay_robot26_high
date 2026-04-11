chassis.setMotors(motors.mediumB, motors.mediumC, true, false); // Установка моторов шасси
chassis.setSyncRegulatorGains(0.02, 0.0001, 0.5); // Установка коэффицентов синхронизации моторов
chassis.setWheelDiametr(62.4); // Установка диаметра колёс
chassis.setBaseLength(180); // Установка расстония между центрами колёс
chassis.setBrakeSettleTime(150); // Время для стабилизации после торможения

sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight1, sensors.nxtLight4); // Установка датчиков отражения в качестве датчиков линии
sensors.setLineSensorsRawRefValues(2068, 1388, 2380, 1664); // Установка калибровочных значений отражения для нормализации отражения

motions.setDistRollingAfterIntersection(60); // Установка расстояния прокатки после опредления перекрёстка при движении по линии
motions.setMinPwrAtEndMovement(30); // Установка минимальной скорости при завершении движений

motions.setLineFollowLoopDt(2); // Установить время регулирования движения по линии

const manipulatorMotor = motors.mediumA; // Переменная объекта мотора манипулятора
const unloadingMechanismMotor = motors.mediumD; // Переменная объекта мотора механизма сброса кубиков

// const colorSensor = sensors.color3; // Установка датчика цвета определяющий цвет кубика

// sensors.setColorSensorMinRgbValues(colorSensor, 8, 9, 9); // Значения датчика цвета когда ничего нет
// sensors.setColorSensorMaxRgbValues(colorSensor, 123, 133, 135); // Значения датчика цвета для белоо кубика
// sensors.setHsvlToColorNumBoundaries(colorSensor, {
//     coloredBoundary: 50, // S
//     whiteBoundary: 50, // V
//     blackBoundary: 10, // V
//     redBoundary: 98, // H
//     orangeBoundary: -1, // H
//     brownBoundary: -1, // H
//     yellowBoundary: 100, // H
//     greenBoundary: 185, // H
//     blueBoundary: 270, // H
//     purpleBoundary: -1
// }); // Установить границы преобразования hsvl в цветовые коды

const htColorSensor = sensors.htColor3; // Установка ht датчика цвета определяющий цвет кубика

sensors.setHsvlToColorNumBoundariesHtColorSensor(htColorSensor, {
    coloredBoundary: 50, // S
    whiteBoundary: 10, // V
    blackBoundary: 5, // V
    redBoundary: 30, // H
    orangeBoundary: -1, // H
    brownBoundary: -1, // H
    yellowBoundary: 100, // H
    greenBoundary: 185, // H
    blueBoundary: 270, // H
    purpleBoundary: -1
}); // Установить границы преобразования hsvl в цветовые коды

navigation.setNodesCount(29); // Количество узловых точек, используем не все
navigation.buildGraph([
    { from: 0, to: 1, direction: NavDirection.RightLeft, weight: 7 },
    { from: 1, to: 2, direction: NavDirection.UpDown, weight: 2.8 },
    { from: 1, to: 3, direction: NavDirection.RightLeft, weight: 2 },
    { from: 3, to: 4, direction: NavDirection.UpDown, weight: 2.8 },
    { from: 3, to: 5, direction: NavDirection.RightLeft, weight: 2 },
    { from: 5, to: 6, direction: NavDirection.UpDown, weight: 2.8 },
    { from: 5, to: 7, direction: NavDirection.RightLeft, weight: 5 },
    { from: 7, to: 8, direction: NavDirection.UpDown, weight: 1.5 },
    { from: 8, to: 9, direction: NavDirection.RightLeft, weight: 2.5 },
    { from: 8, to: 10, direction: NavDirection.UpDown, weight: 1.5 },
    { from: 10, to: 11, direction: NavDirection.RightLeft, weight: 2.5 },
    { from: 10, to: 12, direction: NavDirection.UpDown, weight: 1.5 },
    { from: 12, to: 13, direction: NavDirection.RightLeft, weight: 2.5 },
    { from: 12, to: 14, direction: NavDirection.LeftRight, weight: 4 },
    { from: 12, to: 15, direction: NavDirection.UpDown, weight: 1.5 },
    { from: 15, to: 16, direction: NavDirection.RightLeft, weight: 2.5 },
    { from: 15, to: 17, direction: NavDirection.UpDown, weight: 1.5 },
    { from: 17, to: 18, direction: NavDirection.RightLeft, weight: 2.5 },
    { from: 17, to: 19, direction: NavDirection.UpDown, weight: 1.5 },
    { from: 19, to: 20, direction: NavDirection.LeftRight, weight: 55 },
    { from: 20, to: 21, direction: NavDirection.DownUp, weight: 2.8 },
    { from: 20, to: 22, direction: NavDirection.LeftRight, weight: 2 },
    { from: 22, to: 23, direction: NavDirection.DownUp, weight: 2.8 },
    { from: 22, to: 24, direction: NavDirection.LeftRight, weight: 2 },
    { from: 24, to: 25, direction: NavDirection.DownUp, weight: 2.8 },
    { from: 24, to: 26, direction: NavDirection.LeftRight, weight: 12 },
    { from: 26, to: 27, direction: NavDirection.RightLeft, weight: 7.5 },
    { from: 26, to: 28, direction: NavDirection.DownUp, weight: 3 },
]);


let cubeColors: number[] = []; // Массив, чтобы сохранить цвета кубиков

let path: number[] = []; // Переменная для хранения пути

const redZoneCross: number[] = [2, 25, 27]; // Переменная для хранения перекрёстков с красной зоной
const greenZoneCross: number[] = [4, 23]; // Переменная для хранения перекрёстков с зелёной зоной
const blueZoneCross: number[] = [6, 21, 14]; // Переменная для хранения перекрёстков с синей зоной

// let btnLeftEventDone = false; // Переменная-флаг выполнения события нажатия на левую кнопку
let btnRightEventDone = false; // Переменная-флаг выполнения события нажатия на правую кнопку

// // Событие нажатия на левую кнопку
// brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
//     if (btnLeftEventDone) return;
//     btnLeftEventDone = true;

//     // Чтобы найти мин и макс датчика цвета
//     brick.clearScreen();
//     sensors.searchRgbMinMax(colorSensor);
//     pause(500);
// });

// Событие нажатия на правую кнопку
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    if (btnRightEventDone) return; // Отключаем обработчик
    // btnRightEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    brick.clearScreen();
    const color = CheckHtColor(2000, true);
    brick.clearScreen();
    brick.printValue("color", color, 1);
    VoiceColor(color);
    pause(500);
});

function GetCubeColor() {
    const color = CheckHtColor(300, false); // Запрашиваем цвет
    cubeColors.push(color); // Сохраняем цвет в массив
    const lastCubeIndex = cubeColors.length - 1; // Получить индекс последнего добавленного элемента cubeColors
    brick.printValue(`cubeColors${lastCubeIndex}`, cubeColors[lastCubeIndex], lastCubeIndex + 1); // Выводим на экран цвет N-го кубика
    VoiceColor(cubeColors[lastCubeIndex]); // Озвучиваем цвет N-го кубика
}

// Главная функция решения задачи
function Main() {
    sensors.preparationLineSensor(); // Опрос датчиков цвет
    // for (let i = 0; i < 10; i++) { // Опрос датчиков, чтобы те включились
    //     colorSensor.rgbRaw();
    //     pause(5);
    // }
    manipulatorMotor.setInverted(true); // Включить реверс мотора манипулятора
    unloadingMechanismMotor.setInverted(true); // Включить реверс мотора механизма сброса
    Manipulator(ManipulatorState.Down, true, 40); // Предустановить манипулятор в положение раскрытия
    UnloadingMechanism(UnloadingMechanismState.Up, true, 10); // Предустановить механизм сброса в положение закрыт
    htColorSensor.setHz(60); // Установить частоту подстветки ht датчика цвета

    brick.setStatusLight(StatusLight.GreenFlash); // Сигнал о готовности светодиодами
    brick.printString("RUN", 7, 13);
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ожидание нажатие кнопки
    brick.setStatusLight(StatusLight.Off); // Выключаем светодиоды
    // btnLeftEventDone = true; // Выключить обработчик левой кнопки
    btnRightEventDone = true; // Выключить обработчик правой кнопки
    brick.clearScreen(); // Очистить экран

    // Едет с базы до точки 8
    navigation.setCurrentPosition(0);
    navigation.setCurrentDirection(0);
    path = navigation.algorithmDFS(0, 8);
    // console.log(`path: ${path.join(', ')}`);
    chassis.accelStartLinearDistMove(30, 50, 100, 50); // Плавный старт с стартовой зоны
    navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { moveStartV: 50, moveMaxV: 60, accelStartDist: 50, turnV: 60, Kp: 0.2, Kd: 1 });

    // Поворачиваемся первому ряду кубиков снизу
    navigation.directionSpinTurn(0, 60);

    for (let i = 0; i < 3; i++) {
        motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });

        Manipulator(ManipulatorState.Up, true, 20); // Манипулятор поднять для захвата N-го кубика
        GetCubeColor();
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика

        // pause(50);
        chassis.linearDistMove(80, 40, MotionBraking.Hold); // Подъезжаем к дальнему кубику
        // pause(50);

        if (i != 2) {
            Manipulator(ManipulatorState.Up, true, 50); // Манипулятор поднять для захвата N-го кубика
            GetCubeColor();
            Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика
        } else {
            Manipulator(ManipulatorState.Up, true, 20); // Манипулятор поднять для захвата N-го кубика
        }

        chassis.spinTurn(180, 60);
        // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
        motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.SmoothRolling, { vStart: 30, vMax: 50, vFinish: 40, Kp: 0.2, Kd: 0.5 })

        if (i != 2) {
            chassis.spinTurn(90, 70);
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
            chassis.spinTurn(90, 70);
        }
    }

    navigation.setCurrentPosition(12);
    navigation.setCurrentDirection(2);

    for (let c = 0; c < 6; c++) {
        let bestPathLength = Infinity;
        if (cubeColors[c] == 2) { // Синий
            for (let i = 0; i < blueZoneCross.length; i++) {
                const currentPos = navigation.getCurrentPosition();
                const tempPath = navigation.algorithmDFS(currentPos, blueZoneCross[i]);
                console.log(`tempPath[${i}](B): ${tempPath.join(', ')}`);
                if (tempPath.length <= bestPathLength) {
                    bestPathLength = tempPath.length;
                    path = tempPath;
                }
            }
        } else if (cubeColors[c] == 3) { // Зелёный
            for (let i = 0; i < greenZoneCross.length; i++) {
                const currentPos = navigation.getCurrentPosition();
                const tempPath = navigation.algorithmDFS(currentPos, greenZoneCross[i]);
                console.log(`tempPath[${i}](G): ${tempPath.join(', ')}`);
                if (tempPath.length <= bestPathLength) {
                    bestPathLength = tempPath.length;
                    path = tempPath;
                }
            }
        } else if (cubeColors[c] == 5) { // Красный
            for (let i = 0; i < redZoneCross.length; i++) {
                const currentPos = navigation.getCurrentPosition();
                const tempPath = navigation.algorithmDFS(currentPos, redZoneCross[i]);
                console.log(`tempPath[${i}](R): ${tempPath.join(', ')}`);
                if (tempPath.length <= bestPathLength) {
                    bestPathLength = tempPath.length;
                    path = tempPath;
                }
            }
        } else { // Какая-то жопа
            music.playSoundEffectUntilDone(sounds.informationError);
            brick.exitProgram();
        }

        console.log(`path: ${path.join(', ')}`);
        const vertexCross = path.pop(); // Получить и удалить последнюю вершину из найденного пути
        navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { moveStartV: 30, moveMaxV: 60, accelStartDist: 50, turnV: 60, Kp: 0.2, Kd: 0.5 });

        if ([1, 3, 5].indexOf(navigation.getCurrentPosition()) !== -1) { // Снизу
            navigation.directionSpinTurn(1, 70);
        } else if ([24, 22, 20].indexOf(navigation.getCurrentPosition()) !== -1) { // Сверху
            navigation.directionSpinTurn(3, 70);
        }

        if (vertexCross != navigation.getCurrentPosition()) {
            motions.setLineFollowRefThreshold(70); // Повысить пороговое значение определения перекрёстка
            // motions.lineFollowToCrossIntersection(AfterLineMotion.HoldStop, { v: 30, Kp: 0.2, Kd: 0.5 });
            motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.HoldStop, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 })
            motions.setLineFollowRefThreshold(40); // Установить стандартным пороговое значение определения перекрёстка
            pause(100);
            chassis.linearDistMove(-50, 40, MotionBraking.Hold);
            if (navigation.getCurrentDirection() == 1) {
                navigation.directionSpinTurn(3, 60);
            } else if (navigation.getCurrentDirection() == 3) {
                navigation.directionSpinTurn(1, 60);
            } else {
                // chassis.spinTurn(180, 70);
                navigation.directionSpinTurn(0, 60);
            }
        }

        // Выгрузка
        UnloadingMechanism(UnloadingMechanismState.Down, false, 20);
        pause(50);
        UnloadingMechanism(UnloadingMechanismState.Up, true);

        navigation.setCurrentPosition(vertexCross); // Запись где мы были

        if (c == 4) {
            Manipulator(ManipulatorState.Down, true, 10); // Отпускаем манипулятор после определения цвета кубика
            pause(50);
            chassis.linearDistMove(50, 40, MotionBraking.Hold);
            Manipulator(ManipulatorState.Up, true, 60); // Поднимаем манипулятор после определения цвета кубика
            cubeColors.push(CheckHtColor(300, false)); // Сохраняем цвет в массив
            brick.printValue(`cubeColors${6}`, cubeColors[5], 6); // Выводим на экран цвет N-го кубика
            VoiceColor(cubeColors[5]); // Озвучиваем цвет N-го кубика
            chassis.linearDistMove(-50, 40, MotionBraking.Hold);
            Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика
            control.runInParallel(function () {
                pause(100);
                Manipulator(ManipulatorState.Up, true, 50); // Поднимаем манипулятор
            });
        }
    }

    // Двигаемся за оставшимися 4-я кубиками
    control.runInParallel(function () {
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика
    })
    path = navigation.algorithmDFS(navigation.getCurrentPosition(), 15);
    console.log(`path: ${path.join(', ')}`);
    navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { moveStartV: 30, moveMaxV: 60, accelStartDist: 50, turnV: 60, Kp: 0.2, Kd: 1 });
    navigation.directionSpinTurn(0, 60);

    for (let i = 0; i < 2; i++) {
        motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });

        Manipulator(ManipulatorState.Up, true, 20); // Манипулятор поднять для захвата N-го кубика
        GetCubeColor();
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика

        pause(50);
        chassis.linearDistMove(80, 40, MotionBraking.Hold); // Подъезжаем к дальнему кубику
        pause(50);

        Manipulator(ManipulatorState.Up, true, 50); // Манипулятор поднять для захвата N-го кубика
        GetCubeColor();
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика

        chassis.spinTurn(180, 60);
        // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
        motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.SmoothRolling, { vStart: 30, vMax: 50, vFinish: 40, Kp: 0.2, Kd: 0.5 })

        if (i != 1) {
            chassis.spinTurn(90, 70);
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
            chassis.spinTurn(90, 70);
        }
    }

    navigation.setCurrentPosition(17);
    navigation.setCurrentDirection(2);

    for (let c = 6; c < 10; c++) {
        let bestPathLength = Infinity;
        if (cubeColors[c] == 2) { // Синий
            for (let i = 0; i < blueZoneCross.length; i++) {
                const currentPos = navigation.getCurrentPosition();
                const tempPath = navigation.algorithmDFS(currentPos, blueZoneCross[i]);
                console.log(`tempPath[${i}](B): ${tempPath.join(', ')}`);
                if (tempPath.length <= bestPathLength) {
                    bestPathLength = tempPath.length;
                    path = tempPath;
                }
            }
        } else if (cubeColors[c] == 3) { // Зелёный
            for (let i = 0; i < greenZoneCross.length; i++) {
                const currentPos = navigation.getCurrentPosition();
                const tempPath = navigation.algorithmDFS(currentPos, greenZoneCross[i]);
                console.log(`tempPath[${i}](G): ${tempPath.join(', ')}`);
                if (tempPath.length <= bestPathLength) {
                    bestPathLength = tempPath.length;
                    path = tempPath;
                }
            }
        } else if (cubeColors[c] == 5) { // Красный
            for (let i = 0; i < redZoneCross.length; i++) {
                const currentPos = navigation.getCurrentPosition();
                const tempPath = navigation.algorithmDFS(currentPos, redZoneCross[i]);
                console.log(`tempPath[${i}](R): ${tempPath.join(', ')}`);
                if (tempPath.length <= bestPathLength) {
                    bestPathLength = tempPath.length;
                    path = tempPath;
                }
            }
        } else { // Какая-то жопа
            music.playSoundEffectUntilDone(sounds.informationError);
            brick.exitProgram();
        }

        console.log(`path: ${path.join(', ')}`);
        const vertexCross = path.pop(); // Получить и удалить последнюю вершину из найденного пути
        navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { moveStartV: 30, moveMaxV: 60, accelStartDist: 50, turnV: 60, Kp: 0.2, Kd: 1 });

        if ([1, 3, 5].indexOf(navigation.getCurrentPosition()) !== -1) { // Снизу
            navigation.directionSpinTurn(1, 70);
        } else if ([24, 22, 20].indexOf(navigation.getCurrentPosition()) !== -1) { // Сверху
            navigation.directionSpinTurn(3, 70);
        }

        if (vertexCross != navigation.getCurrentPosition()) {
            motions.setLineFollowRefThreshold(70); // Повысить пороговое значение определения перекрёстка
            // motions.lineFollowToCrossIntersection(AfterLineMotion.HoldStop, { v: 30, Kp: 0.2, Kd: 0.5 });
            motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.HoldStop, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 })
            motions.setLineFollowRefThreshold(40); // Установить стандартным пороговое значение определения перекрёстка
            pause(100);
            chassis.linearDistMove(-50, 40, MotionBraking.Hold);
            if (navigation.getCurrentDirection() == 1) {
                navigation.directionSpinTurn(3, 60);
            } else if (navigation.getCurrentDirection() == 3) {
                navigation.directionSpinTurn(1, 60);
            } else {
                // chassis.spinTurn(180, 70);
                navigation.directionSpinTurn(0, 60);
            }
        }

        // Выгрузка
        UnloadingMechanism(UnloadingMechanismState.Down, false, 20);
        pause(50);
        UnloadingMechanism(UnloadingMechanismState.Up, true);

        navigation.setCurrentPosition(vertexCross); // Запись где мы были
    }

    //// Едем домой
    motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });
    if ([1, 3, 5].indexOf(navigation.getCurrentPosition()) !== -1) { // Снизу
        path = navigation.algorithmDFS(navigation.getCurrentPosition(), 0);
    } else if ([24, 22, 20].indexOf(navigation.getCurrentPosition()) !== -1) { // Сверху
        path = navigation.algorithmDFS(navigation.getCurrentPosition(), 28);
    }
    navigation.followLineByPath(path, AfterLineMotion.Continue, { moveStartV: 30, moveMaxV: 60, accelStartDist: 50, turnV: 60, Kp: 0.2, Kd: 1 });
    chassis.decelFinishLinearDistMove(70, 30, 170, 100, AfterMotion.HoldStop); // Заезжаем в базу плавным замедлением
    music.playSoundEffectUntilDone(sounds.communicationGameOver); // Издаём звук завершения
}
Main(); // Запуск главной функции