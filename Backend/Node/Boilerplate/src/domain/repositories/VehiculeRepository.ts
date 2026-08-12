import { Vehicule } from '../entities/Vehicule';
import { VehiculeId } from '../valueObjects/VehiculeId';
import { Result } from '../../shared/Result';

export interface VehiculeRepository {
  save(vehicule: Vehicule): Promise<Result<void>>;
  findById(vehiculeId: VehiculeId): Promise<Result<Vehicule | null>>;
}
