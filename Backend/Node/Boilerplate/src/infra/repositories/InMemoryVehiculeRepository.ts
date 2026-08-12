import { Vehicule } from '../../domain/entities/Vehicule';
import { VehiculeId } from '../../domain/valueObjects/VehiculeId';
import {
  VehiculeRepository,
} from '../../domain/repositories/VehiculeRepository';
import { Result } from '../../shared/Result';

export class InMemoryVehiculeRepository implements VehiculeRepository {
  private readonly vehicules = new Map<string, Vehicule>();

  async save(vehicule: Vehicule): Promise<Result<void, Error>> {
    const vehiculeKey = vehicule.getId().toString();

    this.vehicules.set(vehiculeKey, Vehicule.create(
      vehicule.getId(),
      vehicule.getPlateNumber(),
      vehicule.getLocation(),
    ));

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

}
