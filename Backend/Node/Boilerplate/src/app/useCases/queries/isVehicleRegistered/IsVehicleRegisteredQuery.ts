export class IsVehicleRegisteredQuery {
    constructor(
        public readonly fleetId: string,
        public readonly plateNumber: string,
    ) {}
}
