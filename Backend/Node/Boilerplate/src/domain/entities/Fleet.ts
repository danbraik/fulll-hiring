import { FleetId } from '../valueObjects/FleetId';
import { UserId } from '../valueObjects/UserId';
import { VehiculeId } from '../valueObjects/VehiculeId';

export class Fleet {
  private constructor(
    private readonly id: FleetId,
    private readonly ownerId: UserId,
    private vehiculeIds: VehiculeId[],
  ) { }

  getId(): FleetId {
    return this.id;
  }

  getOwnerId(): UserId {
    return this.ownerId;
  }

  getVehiculeIds(): VehiculeId[] {
    return [...this.vehiculeIds];
  }

  hasVehicule(vehiculeId: VehiculeId): boolean {
    return this.vehiculeIds.some((fleetVehiculeId) => fleetVehiculeId.equals(vehiculeId));
  }

  addVehicule(vehiculeId: VehiculeId): void {
    this.vehiculeIds.push(vehiculeId);
  }

  static create(id: FleetId, ownerId: UserId, vehiculeIds: VehiculeId[] = []): Fleet {
    return new Fleet(id, ownerId, [...vehiculeIds]);
  }
}
