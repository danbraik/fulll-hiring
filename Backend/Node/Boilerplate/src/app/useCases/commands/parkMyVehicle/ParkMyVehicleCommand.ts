export class ParkMyVehicleCommand {
  constructor(
    public readonly fleetId: string,
    public readonly plateNumber: string,
    public readonly location: {
      latitude: number;
      longitude: number;
      altitude?: number | null;
    },
  ) { }
}
