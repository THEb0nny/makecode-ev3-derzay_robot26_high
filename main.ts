chassis.setMotors(motors.mediumB, motors.mediumC, true, false); // Установка моторов шасси
chassis.setSyncRegulatorGains(0.02, 0.0001, 0.5); // Установка коэффицентов синхронизации моторов
chassis.setWheelDiametr(62.4); // Установка диаметра колёс
chassis.setBaseLength(180); // Установка расстония между центрами колёс
chassis.setBrakeSettleTime(150); // Время для стабилизации после торможения

sensors.setNxtLightSensorsAsLineSensors(sensors.nxtLight2, sensors.nxtLight3); // Установка датчиков отражения в качестве датчиков линии
sensors.setLineSensorsRawRefValues(2068, 1388, 2380, 1664); // Установка калибровочных значений отражения для нормализации отражения

motions.setDistRollingAfterIntersection(60); // Установка расстояния прокатки после опредления перекрёстка при движении по линии
motions.setMinPwrAtEndMovement(30); // Установка минимальной скорости при завершении движений

motions.setLineFollowLoopDt(2); // Установить время регулирования движения по линии

const manipulatorMotor = motors.mediumA; // Переменная объекта мотора манипулятора
const unloadingMechanismMotor = motors.mediumD; // Переменная объекта мотора механизма сроса кубиков

const colorSensor = sensors.color4; // Установка датчика цвета определяющий цвет кубика

sensors.setColorSensorMinRgbValues(colorSensor, 8, 9, 9); // Значения датчика цвета когда ничего нет
sensors.setColorSensorMaxRgbValues(colorSensor, 123, 133, 135); // Значения датчика цвета для белоо кубика
sensors.setHsvlToColorNumBoundaries(colorSensor, {
    coloredBoundary: 50, // S
    whiteBoundary: -1, // V
    blackBoundary: -1, // V
    redBoundary: 98, // H
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


// Функция для одного ряда кубиков
function Cube2Row(firstCube: number, secondCube: number) {
    CubeCapture(firstCube, 20); // Захватываем ближний кубик
    pause(50);
    chassis.linearDistMove(80, 50, MotionBraking.Hold); // Подъезжаем к дальнему кубику
    pause(50);
    CubeCapture(secondCube, 60); // Захватываем дальний кубик
}

// Функция для одного ряда кубиков
function Cube1Row(cube: number) {
    CubeCapture(cube, 30); // Захватываем ближний кубик
}

// Функция захвата и определение одного кубика
function CubeCapture(cubeNumber: number, v: number = 50) {
    Manipulator(ManipulatorState.Up, true, v); // Манипулятор поднять для захвата N-го кубика
    const color = CheckColor(300, false); // Запрашиваем и цвет
    cubeColors.push(color); // Сохраняем цвет в массив
    brick.printValue(`cubeColors${cubeNumber + 1}`, cubeColors[cubeNumber], cubeNumber + 1); // Выводим на экран цвет N-го кубика
    VoiceColor(cubeColors[cubeNumber]); // Озвучиваем цвет N-го кубика
    Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика
}

// Функция, для возвращения к перекрёстку ряда кубиков
// function ReturnToCrossRowCubes() {
//     chassis.linearDistMove(-20, 60, MotionBraking.Hold); // Отъезжаем назад на линию
//     pause(50);
//     chassis.spinTurn(180, 70); // Поворачиваемся
//     pause(50);
//     motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling); // Движемся до перекрёстка
//     pause(50);
// }

let cubeColors: number[] = []; // Массив, чтобы сохранить цвета кубиков

let path: number[] = []; // Переменная для хранения пути

const redZoneCross: number[] = [1, 24]; // Переменная для хранения перекрёстков с красной зоной
const greenZoneCross: number[] = [3, 22]; // Переменная для хранения перекрёстков с зелёной зоной
const blueZoneCross: number[] = [5, 20, 12]; // Переменная для хранения перекрёстков с синей зоной


let btnLeftEventDone = false; // Переменная-флаг выполнения события нажатия на левую кнопку
let btnRightEventDone = false; // Переменная-флаг выполнения события нажатия на правую кнопку

// Событие нажатия на левую кнопку
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    if (btnLeftEventDone) return;
    btnLeftEventDone = true;

    // Чтобы найти мин и макс датчика цвета
    brick.clearScreen();
    sensors.searchRgbMinMax(colorSensor);
    pause(500);
});

// Событие нажатия на правую кнопку
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    if (btnRightEventDone) return; // Отключаем обработчик
    // btnRightEventDone = true; // Переставляе флаг, чтобы событие больше не работало
    // for (let i = 0; i < 10; i++) { // Предварительно перевести датчик цвета в режим цвета
    //     colorSensor.rgbRaw();
    //     pause(10);
    // }
    brick.clearScreen();
    let color = CheckColor(1000, true);
    brick.clearScreen();
    brick.printValue("color", color, 1);
    VoiceColor(color);
    pause(1000);
});


// Главная функция решения задачи
function Main() {
    sensors.preparationLineSensor(); // Опрос датчиков цвет
    for (let i = 0; i < 10; i++) { // Опрос датчиков, чтобы те включились
        colorSensor.rgbRaw();
        pause(5);
    }
    manipulatorMotor.setInverted(true); // Включить реверс мотора манипулятора
    unloadingMechanismMotor.setInverted(true); // Включить реверс мотора механизма сброса
    Manipulator(ManipulatorState.Down, true, 40); // Предустановить манипулятор в положение раскрытия
    UnloadingMechanism(UnloadingMechanismState.Up, true, 10); // Предустановить механизм сброса в положение закрыт

    brick.setStatusLight(StatusLight.GreenPulse); // Сигнал о готовности светодиодами
    brick.printString("RUN", 7, 13);
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ожидание нажатие кнопки
    btnLeftEventDone = true; // Выключить обработчик левой кнопки
    btnRightEventDone = true; // Выключить обработчик правой кнопки
    brick.clearScreen(); // Очистить экран

    navigation.setCurrentPosition(0);
    navigation.setCurrentDirection(0);
    path = navigation.algorithmDFS(0, 8);
    // console.log(`path: ${path.join(', ')}`);

    chassis.accelStartLinearDistMove(30, 60, 100, 50); // Плавный старт с стартовой зоны
    navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { moveStartV: 60, moveMaxV: 80, accelStartDist: 50, turnV: 70, Kp: 0.2, Kd: 0.5 });
    navigation.directionSpinTurn(0, 70);
    motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });
    Cube2Row(0, 1);

    chassis.spinTurn(180, 70);
    motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
    chassis.spinTurn(90, 70);
    motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
    chassis.spinTurn(90, 70);
    motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });
    Cube2Row(2, 3);
    chassis.spinTurn(180, 70);

    motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
    chassis.spinTurn(90, 70);
    motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });
    chassis.spinTurn(90, 70);
    motions.rampLineFollowToDistanceByTwoSensors(160, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });
    Cube1Row(4);
    control.runInParallel(function () {
        pause(100);
        Manipulator(ManipulatorState.Up, true, 50); // Поднимаем манипулятор
    })
    chassis.spinTurn(180, 70);
    motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.2, Kd: 0.5 });

    navigation.setCurrentPosition(12);
    navigation.setCurrentDirection(2);

    if (cubeColors[0] == 2) {
        let tempPath: number[][] = [];
        for (let i = 0; i < 2; i++) {
            tempPath[i] = navigation.algorithmDFS(navigation.getCurrentPosition(), blueZoneCross[i]);
            console.log(`tempPath[${i}](B): ${tempPath[i].join(', ')}`);
        }
        if (tempPath[0].length <= tempPath[1].length) {
            path = tempPath[0];
        } else {
            path = tempPath[1];
        }
    } else if (cubeColors[0] == 3) {
        let tempPath: number[][] = [];
        for (let i = 0; i < 2; i++) {
            tempPath[i] = navigation.algorithmDFS(navigation.getCurrentPosition(), greenZoneCross[i]);
            console.log(`tempPath[${i}](G): ${tempPath[i].join(', ')}`);
        }
        if (tempPath[0].length <= tempPath[1].length) {
            path = tempPath[0];
        } else {
            path = tempPath[1];
        }
    } else if (cubeColors[0] == 5) {
        let tempPath: number[][] = [];
        for (let i = 0; i < 2; i++) {
            tempPath[i] = navigation.algorithmDFS(navigation.getCurrentPosition(), redZoneCross[i]);
            console.log(`tempPath[${i}](R): ${tempPath[i].join(', ')}`);
        }
        if (tempPath[0].length <= tempPath[1].length) {
            path = tempPath[0];
        } else {
            path = tempPath[1];
        }
    } else {
        music.playSoundEffectUntilDone(sounds.informationError);
    }

    console.log(`path: ${path.join(', ')}`);
    navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { moveStartV: 30, moveMaxV: 70, accelStartDist: 50, turnV: 70, Kp: 0.2, Kd: 0.5 });

    if ([1, 3, 5].indexOf(navigation.getCurrentPosition()) !== -1) { // Снизу
        navigation.directionSpinTurn(1, 70);
    } else if ([24, 22, 20].indexOf(navigation.getCurrentPosition()) !== -1) { // Сверху
        navigation.directionSpinTurn(3, 70);
    }
    motions.lineFollowToCrossIntersection(AfterLineMotion.HoldStop, { v: 30, Kp: 0.2, Kd: 0.5 });
    chassis.linearDistMove(-50, 50, MotionBraking.Hold);
    chassis.spinTurn(180, 70);
    UnloadingMechanism(UnloadingMechanismState.Down, false);
    pause(100);
    UnloadingMechanism(UnloadingMechanismState.Up, true);

    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling); // На следующем перекрёстке останавливаемся
    // pause(50);

    // chassis.spinTurn(-90, 70); // Поворачиваемся влево к зонам с кубиками
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.3, Kd: 0.5 }); // Проезжаем ещё перекрёсток
    // pause(50);
    // chassis.spinTurn(90, 70); // Поворачиваемся вправо к кубикам
    // pause(50);
    // motions.rampLineFollowToDistanceByTwoSensors(170, 50, 70, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 20, Kp: 0.3, Kd: 0.5 }); // Подъезжаем плавно к 1 кубику

    // CubeRow(0, 1); // Захватываем первый ряд кубиков (1 и 2 кубики)
    // console.log(`colors: ${colors.join(", ")}`); // Записываем в консоль все цвета 4х кубиков

    // ReturnToCrossRowCubes(); // Возвращаемся к перекрёстку ряда кубиков

    // // Двигаемся ко второму ряду кубиков
    // chassis.spinTurn(90, 70); // Поворачиваемся ко 2 ряду с кубиками
    // pause(50);
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.3, Kd: 0.5 }); // Двигаемся к перекрёстку 2 ряда кубиков
    // pause(50);
    // chassis.spinTurn(90, 70); // Поворачиваемся вправо к 3 и 4 кубику
    // pause(50);
    // motions.rampLineFollowToDistanceByTwoSensors(170, 50, 70, MotionBraking.Hold); // Подъезжаем плавно к 3 кубику

    // CubeRow(2, 3); // Захватываем второй ряд кубиков (3 и 4 кубики)
    // console.log(`colors: ${colors.join(", ")}`); // Записываем в консоль все цвета 4х кубиков

    // ReturnToCrossRowCubes(); // Возвращаемся к перекрёстку ряда кубиков

    // // Двигаемся к перекрёстку / вершине 3
    // chassis.spinTurn(-90, 70); // Поворачиваемся влево
    // pause(50);
    // motions.lineFollowToCrossIntersection(AfterLineMotion.LineContinueRoll, { v: 60, Kp: 0.3, Kd: 0.5 });
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60 });
    // pause(50);
    // chassis.spinTurn(90, 70); // Поворачиваем вправо

    // navigation.setCurrentPositon(3); // Установить позицию перекрёстка для навигации
    // navigation.setCurrentDirection(2); // Установить направление на перекрёстке для навигации

    // // brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ждём нажатия для продолжения

    // let targetPos = -1; // Переменная для хранения позиции, в которую нужно приехать

    // // Цикл, чтобы отвезти 4 кубика
    // for (let i = 0; i < 4; i++) {
    //     const startMovementPos = navigation.getCurrentPositon(); // Стартовая позиция движения

    //     if (colors[i] == 2) targetPos = 2; // Синий
    //     else if (colors[i] == 3) targetPos = 1; // Зелёный
    //     else if (colors[i] == 5) targetPos = 0; // Красный
    //     // Иначе позиция предыдущего сброшеного кубика
    //     console.log(`targetPos: ${targetPos}`); // Вывести в консоль целевую позицию выгрузки кубика

    //     const path = navigation.algorithmBFS(startMovementPos, targetPos); // Находим и сохраняем путь
    //     console.log(`path${i}: ${path.join(", ")}`); // Записывае в консоль найденный путь

    //     // Доехать до точки
    //     navigation.followLineByPath(path, { moveStartV: 30, moveMaxV: 70, turnV: 70, Kp: 0.3, Kd: 0.5 });
    //     pause(50);

    //     if (startMovementPos >= 3 || startMovementPos > targetPos) chassis.spinTurn(90, 70); // Повернуться к перекрёстку
    //     else if (startMovementPos < targetPos) chassis.spinTurn(-90, 70); // Повернуться к точке, находясь на 0 или 1 точке
    //     else chassis.spinTurn(180, 70); // Тот же самый цвет, а это значит повернуться жопкой
    //     pause(50);

    //     navigation.setCurrentPositon(targetPos); // Сохраняем в каком месте мы теперь находимся, а вроде даже не нужно это!

    //     // Снизу с перекрёстков доехать до мест сброса
    //     motions.rampLineFollowToDistanceByTwoSensors(100, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 20, Kp: 0.3, Kd: 0.5 }); // Плано по линии
    //     pause(50);
    //     chassis.spinTurn(180, 70); // Повернуться жопкой
    //     pause(50);
    //     chassis.linearDistMove(-50, 60, MotionBraking.Hold); // Немного назад жопкой

    //     // Сброс кубика
    //     UnloadingMechanism(UnloadingMechanismState.Down, false);
    //     pause(100);
    //     UnloadingMechanism(UnloadingMechanismState.Up, true);

    //     motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 70, Kp: 0.3, Kd: 0.5 }); // Двигаемся обратно до вершины
    //     navigation.setCurrentDirection(3); // Устанавливаем в какое направление мы теперь повёрнуты
    //     music.playSoundEffect(sounds.communicationGo); // Чисто тест, что дальше идёт продолжение
    //     pause(50);
    // }


    // //// ДАЛЬШЕ
    // // Движемся до перекрёстка/вершины 3
    // chassis.spinTurn(-90, 70); // Поворачиваемся влево к зонам с кубиками
    // motions.rampLineFollowToDistanceByTwoSensors(420, 100, 100, MotionBraking.Continue, { vStart: 30, vMax: 80, vFinish: 70, Kp: 0.3, Kd: 0.5 }) // Движемся на расстояние
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 70, Kp: 0.3, Kd: 0.5 }); // На следующем перекрёстке останавливаемся
    // pause(50);
    // chassis.spinTurn(-90, 70); // Поворачиваемся влево к зонам с кубиками
    // for (let i = 0; i < 2; i++) {
    //     motions.lineFollowToCrossIntersection(AfterLineMotion.LineContinueRoll, { v: 60, Kp: 0.3, Kd: 0.5 }); // Проезжаем ещё перекрёсток
    // }
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling); // Проезжаем ещё перекрёсток
    // pause(50);
    // chassis.spinTurn(90, 70); // Поворачиваемся вправо к кубикам
    // pause(50);
    // motions.rampLineFollowToDistanceByTwoSensors(175, 50, 70, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 20, Kp: 0.3, Kd: 0.5 }); // Подъезжаем плавно к 1 кубику

    // CubeRow(4, 5); // Захватываем второй ряд кубиков (5 и 6 кубики)
    // console.log(`colors: ${colors.join(", ")}`); // Записываем в консоль все цвета 4х кубиков

    // ReturnToCrossRowCubes(); // Возвращаемся к перекрёстку ряда кубиков

    // // Двигаемся ко второму ряду кубиков
    // chassis.spinTurn(90, 70); // Поворачиваемся ко 2 ряду с кубиками
    // pause(50);
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60, Kp: 0.3, Kd: 0.5 }); // Двигаемся к перекрёстку 2 ряда кубиков
    // pause(50);
    // chassis.spinTurn(90, 70); // Поворачиваемся вправо к 3 и 4 кубику
    // pause(50);
    // motions.rampLineFollowToDistanceByTwoSensors(170, 50, 70, MotionBraking.Hold); // Подъезжаем плавно к 3 кубику

    // CubeRow(6, 7); // Захватываем второй ряд кубиков (7 и 8 кубики)
    // console.log(`colors: ${colors.join(", ")}`); // Записываем в консоль все цвета 4х кубиков

    // ReturnToCrossRowCubes(); // Возвращаемся к перекрёстку ряда кубиков

    // // Двигаемся к перекрёстку / вершине 3
    // chassis.spinTurn(-90, 70); // Поворачиваемся влево
    // pause(50);
    // for (let i = 0; i < 3; i++) {
    //     motions.lineFollowToCrossIntersection(AfterLineMotion.LineContinueRoll, { v: 60, Kp: 0.3, Kd: 0.5 });
    // }
    // motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 60 });
    // pause(50);
    // chassis.spinTurn(90, 70); // Поворачиваем вправо

    // navigation.setCurrentPositon(3); // Установить позицию перекрёстка для навигации
    // navigation.setCurrentDirection(2); // Установить направление на перекрёстке для навигации

    // // brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ждём нажатия для продолжения

    // targetPos = -1; // Переменная для хранения позиции, в которую нужно приехать

    // // Цикл, чтобы отвезти 4 кубика
    // for (let i = 4; i < 8; i++) {
    //     const startMovementPos = navigation.getCurrentPositon(); // Стартовая позиция движения

    //     if (colors[i] == 2) targetPos = 2; // Синий
    //     else if (colors[i] == 3) targetPos = 1; // Зелёный
    //     else if (colors[i] == 5) targetPos = 0; // Красный
    //     // Иначе позиция предыдущего сброшеного кубика
    //     console.log(`targetPos: ${targetPos}`); // Вывести в консолiь целевую позицию выгрузки кубика

    //     const path = navigation.algorithmBFS(startMovementPos, targetPos); // Находим и сохраняем путь
    //     console.log(`path${i}: ${path.join(", ")}`); // Записывае в консоль найденный путь

    //     // Доехать до точки
    //     navigation.followLineByPath(path, { moveStartV: 30, moveMaxV: 70, turnV: 70, Kp: 0.3, Kd: 0.5 });
    //     pause(50);

    //     if (startMovementPos >= 3 || startMovementPos > targetPos) chassis.spinTurn(90, 70); // Повернуться к перекрёстку
    //     else if (startMovementPos < targetPos) chassis.spinTurn(-90, 70); // Повернуться к точке, находясь на 0 или 1 точке
    //     else chassis.spinTurn(180, 70); // Тот же самый цвет, а это значит повернуться жопкой

    //     navigation.setCurrentPositon(targetPos); // Сохраняем в каком месте мы теперь находимся, а вроде даже не нужно это!

    //     // Снизу с перекрёстков доехать до мест сброса
    //     motions.rampLineFollowToDistanceByTwoSensors(100, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 20, Kp: 0.3, Kd: 0.5 }); // Плано по линии
    //     pause(50);
    //     chassis.spinTurn(180, 70); // Повернуться жопкой
    //     pause(50);
    //     chassis.linearDistMove(-50, 60, MotionBraking.Hold); // Немного назад жопкой

    //     // Сброс кубика
    //     UnloadingMechanism(UnloadingMechanismState.Down, false);
    //     pause(100);
    //     UnloadingMechanism(UnloadingMechanismState.Up, true);

    //     motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 70, Kp: 0.3, Kd: 0.5 }); // Двигаемся обратно до вершины
    //     navigation.setCurrentDirection(3); // Устанавливаем в какое направление мы теперь повёрнуты
    //     music.playSoundEffectUntilDone(sounds.communicationGo); // Чисто тест, что дальше идёт продолжение
    // }

    // //// ДАЛЬШЕ
    // // Едем домой с перекрёстока / вершин 0 или 1 или 2!!!
    // chassis.spinTurn(90, 70); // Поворачиваемся от стенки вправо
    // motions.rampLineFollowToDistanceByTwoSensors(500, 100, 100, MotionBraking.Continue, { vStart: 30, vMax: 80, vFinish: 70, Kp: 0.3, Kd: 0.5 }) // Движемся на расстояние
    // motions.lineFollowToCrossIntersection(AfterLineMotion.Continue, { v: 70, Kp: 0.3, Kd: 0.5 }); // Движемся до линии (перекрёстка) базы
    // chassis.decelFinishLinearDistMove(70, 30, 170, 100, AfterMotion.HoldStop); // Заезжаем в базу плавным замедлением
    // music.playSoundEffectUntilDone(sounds.communicationGameOver); // Издаём звук завершения

}
Main(); // Запуск главной функции