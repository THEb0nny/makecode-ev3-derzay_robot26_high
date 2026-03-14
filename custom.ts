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