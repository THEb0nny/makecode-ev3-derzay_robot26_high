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

const htColorSensor = sensors.htColor3; // Установка ht датчика цвета определяющий цвет кубика

// Установить границы преобразования hsvl в цветовые коды
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
    purpleBoundary: -1 // H
});

navigation.setNodesCount(29); // Количество узловых точек
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
]); // Строим матрицы смежности навигации по рёбрам


// let btnLeftEventDone = false; // Переменная-флаг выполнения события нажатия на левую кнопку
let btnRightEventDone = false; // Переменная-флаг выполнения события нажатия на правую кнопку

// Событие нажатия на левую кнопку
// brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
//     if (btnLeftEventDone) return;
//     btnLeftEventDone = true;
    
//     // Чтобы найти мин и макс датчика цвета
//     // brick.clearScreen();
//     // sensors.searchRgbMinMax(colorSensor);
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


let cubeColors: number[] = []; // Массив, чтобы сохранить цвета кубиков

let path: number[] = []; // Переменная для хранения пути

const baseIntersection = [0]; // Номера перекрёстков, которые ведут на базу
const validColors = [2, 3, 5] // Цвета, с которыми мы работаем
const redZoneIntersection = [2, 25]; // Переменная для хранения перекрёстков с красной зоной
const greenZoneIntersection = [4, 23]; // Переменная для хранения перекрёстков с зелёной зоной
const blueZoneIntersection = [6, 21]; // Переменная для хранения перекрёстков с синей зоной

// Узнать цвет кубика и озвучить
function GetCubeColor() {
    const color = CheckHtColor(200, false); // Запрашиваем цвет
    cubeColors.push(color); // Сохраняем цвет в массив
    const lastCubeColorsIndex = cubeColors.length - 1; // Получить индекс последнего добавленного элемента cubeColors
    brick.printValue(`cubeColors${lastCubeColorsIndex}`, cubeColors[lastCubeColorsIndex], lastCubeColorsIndex + 1); // Выводим на экран цвет кубика
    VoiceColor(cubeColors[lastCubeColorsIndex]); // Озвучиваем цвет кубика
}

// Главная функция решения задачи
function Main() {
    sensors.preparationLineSensor(); // Опрос датчиков линии
    manipulatorMotor.setInverted(true); // Включить реверс мотора манипулятора
    unloadingMechanismMotor.setInverted(true); // Включить реверс мотора механизма сброса
    Manipulator(ManipulatorState.Down, true, 30); // Предустановить манипулятор в положение раскрытия
    UnloadingMechanism(UnloadingMechanismState.Up, true, 10); // Предустановить механизм сброса в положение закрыт
    htColorSensor.setHz(60); // Установить частоту подстветки ht датчика цвета

    brick.setStatusLight(StatusLight.OrangeFlash); // Сигнал о готовности светодиодами
    brick.printString("RUN", 7, 13);
    brick.buttonEnter.pauseUntil(ButtonEvent.Pressed); // Ожидание нажатие кнопки
    brick.setStatusLight(StatusLight.Off); // Выключаем светодиоды
    brick.clearScreen(); // Очистить экран
    // btnLeftEventDone = true; // Выключить обработчик левой кнопки
    btnRightEventDone = true; // Выключить обработчик правой кнопки

    //// Решение задачи
    // Едет с базы до точки 8
    navigation.setCurrentPosition(0);
    navigation.setCurrentDirection(0);
    path = navigation.algorithmDFS(navigation.getCurrentPosition(), 8); // Расчитываем как доехать до вершины
    // console.log(`path: ${path.join(', ')}`);
    chassis.accelStartLinearDistMove(30, 50, 100, 50); // Плавный старт с стартовой зоны
    navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { vStartMove: 50, vMaxMove: 70, accelStartDist: 50, vTurn: 60, Kp: 0.2, Kd: 1 });

    navigation.directionSpinTurn(0, 60); // Поворачиваемся к первому ряду кубиков снизу

    for (let i = 0; i < 3; i++) { // Хватаем 3 ряда кубиков
        // Двигаемся к кубикам на расстояние по линии
        motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });

        Manipulator(ManipulatorState.Up, true, 20); // Манипулятор поднять для захвата кубика
        GetCubeColor(); // Узнать цвет поднятого кубика и озвучить
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика

        // pause(50);
        chassis.linearDistMove(80, 40, MotionBraking.Hold); // Подъезжаем к дальнему кубику
        // pause(50);

        if (i != 2) { // Если не второй ряд кубиков
            Manipulator(ManipulatorState.Up, true, 50); // Манипулятор поднять для захвата кубика
            GetCubeColor(); // Узнать цвет поднятого кубика и озвучить
            Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика
        } else { // Хватаем 6 кубик, который не помещается
            Manipulator(ManipulatorState.Up, true, 20); // Манипулятор поднять для захвата кубика
        }

        chassis.spinTurn(180, 60); // Развернуться в противоположную сторону
        motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.SmoothRolling, { vStart: 30, vMax: 60, vFinish: 40, Kp: 0.2, Kd: 0.5 });

        if (i != 2) { // Если i не второй, тогда двигаться к следующему ряду
            chassis.spinTurn(90, 70);
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 50, Kp: 0.2, Kd: 0.5 });
            chassis.spinTurn(90, 70);
        }
    }

    // Устанавливаем где находимся и в какое направление повёрнуты
    navigation.setCurrentPosition(12);
    navigation.setCurrentDirection(2);

    for (let i = 0; i < 6; i++) { // Едем раскладывать 6 кубиков
        let targetZones: number[] = []; // Целевая зона
        let color = cubeColors[i]; // Цвет текущего кубика
        // Если определился неправильный цвет, ищем первый нормальный цвет
        if (validColors.indexOf(color) == -1) {
            music.playSoundEffectUntilDone(sounds.informationError);
            for (let j = i; j < cubeColors.length; j++) { // Ищем в массиве, начиная от i-го, чтобы приехать в новую зону, а не в старую
                if (validColors.indexOf(cubeColors[j]) != -1) {
                    color = cubeColors[j];
                    break;
                }
            }
        }
        // Выбираем зону по цвету
        if (color == 2) targetZones = blueZoneIntersection; // Синяя зона
        else if (color == 3) targetZones = greenZoneIntersection; // Зелёная зона
        else if (color == 5) targetZones = redZoneIntersection; // Красная зона
        else {
            music.playSoundEffectUntilDone(sounds.informationError);
            brick.exitProgram(); // Вообще не нашли нормальный цвет
        }

        let bestPathLength = Infinity; // Вспомогательная переменная для определния самого короткого пути
        for (let j = 0; j < targetZones.length; j++) {
            const currentPos = navigation.getCurrentPosition(); // Получить текущую позицию
            const tempPath = navigation.algorithmDFS(currentPos, targetZones[j]); // Путь от текущей позиции к i позиции цветной зоны
            console.log(`tempPath[${j}](${cubeColors[i]}): ${tempPath.join(', ')}`); // Вывести в консоль
            if (tempPath.length <= bestPathLength) { // Обновляем путь, если он короткий или равен прошлому
                bestPathLength = tempPath.length;
                path = tempPath;
            }
        }

        console.log(`path: ${path.join(', ')}`);
        const targetIntersaction = path.pop(); // Получить и удалить последнюю вершину из найденного пути
        navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { vStartMove: 30, vMaxMove: 60, accelStartDist: 50, vTurn: 60, Kp: 0.2, Kd: 0.5 });

        const newDir = navigation.getDirection(navigation.getCurrentPosition(), targetIntersaction);
        console.log(`from ${navigation.getCurrentPosition()} to ${targetIntersaction} dir -> ${newDir}`);
        navigation.directionSpinTurn(newDir, 70);

        // Если робот находится не на перекрёстке, до которого нужно доехать
        if (targetIntersaction != navigation.getCurrentPosition()) {
            motions.setLineFollowRefThreshold(70); // Повысить пороговое значение определения перекрёстка
            motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.HoldStop, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 }); // Двигаемся к цветной зоны
            motions.setLineFollowRefThreshold(40); // Установить стандартным пороговое значение определения перекрёстка
            pause(100);
            chassis.linearDistMove(-60, 40, MotionBraking.Hold); // Отъезжаем назад для последующего поворота, чтобы не заехать на цветные зоны
            navigation.relativeSpinTurn(2, 70); // Повернуться в противоположном направлении (180 вправо) от цветной зоны, чтобы выгрузить кубик
        }

        // Выгрузка
        UnloadingMechanism(UnloadingMechanismState.Down, false, 20);
        pause(50);
        UnloadingMechanism(UnloadingMechanismState.Up, true);

        navigation.setCurrentPosition(targetIntersaction); // Записать на каком перекрёстке цветной зоны выгрузки были

        if (i == 4) { // Если всё выгрузили, то нужно кубик, который тащили в манипуляторе загрузить и распознать
            Manipulator(ManipulatorState.Down, true, 10); // Отпускаем манипулятор после определения цвета кубика
            pause(50);
            chassis.linearDistMove(50, 40, MotionBraking.Hold); // Подъезжаем к кубику вперёд, чтобы если он выпал чуть дальше, то захватить его
            Manipulator(ManipulatorState.Up, true, 50); // Манипулятор поднять для захвата кубика
            GetCubeColor(); // Узнать цвет поднятого кубика и озвучить
            chassis.linearDistMove(-50, 40, MotionBraking.Hold); // Отъезжаем на место где были
            Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика, чтобы его отпустить на горку
            pause(100);
            Manipulator(ManipulatorState.Up, true, 50); // Поднимаем манипулятор, чтобы он потом не задевал зону цветную
        }
    }

    // Двигаемся за оставшимися 4-я кубиками
    control.runInParallel(function () {
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика
    })
    path = navigation.algorithmDFS(navigation.getCurrentPosition(), 15);
    console.log(`path: ${path.join(', ')}`);
    navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { vStartMove: 30, vMaxMove: 60, accelStartDist: 50, vTurn: 60, Kp: 0.2, Kd: 1 }); // Двигаемся
    navigation.directionSpinTurn(0, 60); // Поворачиваемся к кубикам

    for (let i = 0; i < 2; i++) { // Два ряда кубиков
        motions.rampLineFollowToDistanceByTwoSensors(170, 50, 50, MotionBraking.Hold, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 });

        Manipulator(ManipulatorState.Up, true, 20); // Манипулятор поднять для захвата ближнего кубика
        GetCubeColor(); // Узнать цвет кубика и озвучить
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика

        // pause(50);
        chassis.linearDistMove(80, 40, MotionBraking.Hold); // Подъезжаем к дальнему кубику
        // pause(50);

        Manipulator(ManipulatorState.Up, true, 50); // Манипулятор поднять для захвата дальнего кубика
        GetCubeColor(); // Узнать цвет кубика и озвучить
        Manipulator(ManipulatorState.Down, true, 60); // Отпускаем манипулятор после определения цвета кубика

        chassis.spinTurn(180, 60); // Поворачиваем в противоположную сторону, чтобы выехать из зоны
        motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.SmoothRolling, { vStart: 30, vMax: 50, vFinish: 40, Kp: 0.2, Kd: 0.5 });

        if (i != 1) {  // Если i не первый, тогда двигаться к следующему ряду
            chassis.spinTurn(90, 70);
            motions.lineFollowToCrossIntersection(AfterLineMotion.SmoothRolling, { v: 50, Kp: 0.2, Kd: 0.5 });
            chassis.spinTurn(90, 70);
        }
    }

    // Записываем где сейчас находимся и указываем текущее направление
    navigation.setCurrentPosition(17);
    navigation.setCurrentDirection(2);

    for (let i = 6; i < 10; i++) {
        let targetZones: number[] = []; // Целевая зона
        let color = cubeColors[i]; // Цвет текущего кубика
        // Если определился неправильный цвет, ищем первый нормальный цвет
        if (validColors.indexOf(color) == -1) {
            music.playSoundEffectUntilDone(sounds.informationError);
            for (let j = 0; j < cubeColors.length; j++) {
                if (validColors.indexOf(cubeColors[j]) != -1) {
                    color = cubeColors[j];
                    break;
                }
            }
        }
        // Выбираем зону по цвету
        if (color == 2) targetZones = blueZoneIntersection; // Синяя зона
        else if (color == 3) targetZones = greenZoneIntersection; // Зелёная зона
        else if (color == 5) targetZones = redZoneIntersection; // Красная зона
        else {
            music.playSoundEffectUntilDone(sounds.informationError);
            brick.exitProgram(); // Вообще не нашли нормальный цвет
        }

        let bestPathLength = Infinity; // Вспомогательная переменная для определния самого короткого пути
        for (let j = 0; j < targetZones.length; j++) {
            const currentPos = navigation.getCurrentPosition(); // Получить текущую позицию
            const tempPath = navigation.algorithmDFS(currentPos, targetZones[j]); // Путь от текущей позиции к i позиции цветной зоны
            console.log(`tempPath[${j}](${cubeColors[i]}): ${tempPath.join(', ')}`); // Вывести в консоль
            if (tempPath.length <= bestPathLength) { // Обновляем путь, если он короткий или равен прошлому
                bestPathLength = tempPath.length;
                path = tempPath;
            }
        }

        console.log(`path: ${path.join(', ')}`); // Записать в консоль путь
        const targetIntersaction = path.pop(); // Получить и удалить последнюю вершину из найденного пути
        navigation.followLineByPath(path, AfterLineMotion.SmoothRolling, { vStartMove: 30, vMaxMove: 60, accelStartDist: 50, vTurn: 60, Kp: 0.2, Kd: 1 });

        const newDir = navigation.getDirection(navigation.getCurrentPosition(), targetIntersaction);
        console.log(`from ${navigation.getCurrentPosition()} to ${targetIntersaction} dir -> ${newDir}`);
        navigation.directionSpinTurn(newDir, 70);

        if (targetIntersaction != navigation.getCurrentPosition()) {
            motions.setLineFollowRefThreshold(70); // Повысить пороговое значение определения перекрёстка цветной зоны
            motions.rampLineFollowToCrossIntersection(200, 50, 50, AfterLineMotion.HoldStop, { vStart: 30, vMax: 60, vFinish: 30, Kp: 0.2, Kd: 0.5 })
            motions.setLineFollowRefThreshold(40); // Установить стандартным пороговое значение определения перекрёстка
            pause(100);
            chassis.linearDistMove(-60, 40, MotionBraking.Hold);
            navigation.relativeSpinTurn(2, 70); // Повернуться в противоположном направлении (180 вправо) от цветной зоны, чтобы выгрузить кубик
        }

        // Выгрузка
        UnloadingMechanism(UnloadingMechanismState.Down, false, 20);
        pause(50);
        UnloadingMechanism(UnloadingMechanismState.Up, true);

        navigation.setCurrentPosition(targetIntersaction); // Запись где мы были
    }

    /// Едем домой
    for (let i = 0, bestBasePathLength = Infinity; i < baseIntersection.length; i++) {
        const currentPos = navigation.getCurrentPosition();
        const tempBasePath = navigation.algorithmDFS(currentPos, baseIntersection[i]);
        console.log(`tempBasePath[${i}]: ${tempBasePath.join(', ')}`);
        if (tempBasePath.length <= bestBasePathLength) {
            bestBasePathLength = tempBasePath.length;
            path = tempBasePath;
        }
    }
    navigation.followLineByPath(path, AfterLineMotion.Continue, { vStartMove: 30, vMaxMove: 60, accelStartDist: 50, vTurn: 60, Kp: 0.3, Kd: 0.7 });
    chassis.decelFinishLinearDistMove(70, 30, 170, 100, AfterMotion.HoldStop); // Заезжаем в базу плавным замедлением
    music.playSoundEffectUntilDone(sounds.communicationGameOver); // Издаём звук завершения
}

Main(); // Запуск главной функции