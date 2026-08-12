import { Vehicule } from '../../domain/entities/Vehicule';
import { VehiculeId } from '../../domain/valueObjects/VehiculeId';
import { PlateNumber } from '../../domain/valueObjects/PlateNumber';
import {
  VehiculeRepository,
} from '../../domain/repositories/VehiculeRepository';
import { Result } from '../../shared/Result';

export class InMemoryVehiculeRepository implements VehiculeRepository {
  private readonly vehicules = new Map<string, Vehicule>();
  private readonly idByPlateNumber = new Map<string, string>();

  async save(vehicule: Vehicule): Promise<Result<void, Error>> {
    const vehiculeKey = vehicule.getId().toString();
    const plateNumberKey = vehicule.getPlateNumber().toString();

    this.vehicules.set(vehiculeKey, Vehicule.create(
      vehicule.getId(),
      vehicule.getPlateNumber(),
      vehicule.getLocation(),
    ));
    this.idByPlateNumber.set(plateNumberKey, vehiculeKey);

    return Result.ok(undefined);
  }

  async findById(vehiculeId: VehiculeId): Promise<Result<Vehicule | null, Error>> {
    const vehicule = this.vehicules.get(vehiculeId.toString());

    if (!vehicule) {
      return Result.ok(null);
    }

    return Result.ok(Vehicule.create(
      vehicule.getId(),
      vehicule.getPlateNumber(),
      vehicule.getLocation(),
    ));
  }

  async findByPlateNumber(plateNumber: PlateNumber): Promise<Result<Vehicule | null, Error>> {
    const vehiculeId = this.idByPlateNumber.get(plateNumber.toString());

    if (!vehiculeId) {
      return Result.ok(null);
    }

    const vehicule = this.vehicules.get(vehiculeId);

    if (!vehicule) {
      return Result.ok(null);
    }

    return Result.ok(Vehicule.create(
      vehicule.getId(),
      vehicule.getPlateNumber(),
      vehicule.getLocation(),
    ));
  }

}
