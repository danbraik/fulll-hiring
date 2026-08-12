export class RegisterVehiculeCommand {
    constructor(
        public readonly fleetId: string,
        public readonly plateNumber: string,
    ) {}
}
