import type { Vehicule } from "../entities/Vehicule";
import type { VehiculeId } from "../valueObjects/VehiculeId";
import type { PlateNumber } from "../valueObjects/PlateNumber";
import type { Result } from "../../shared/Result";

export interface VehiculeRepository {
    save(vehicule: Vehicule): Promise<Result<void>>;
    findById(vehiculeId: VehiculeId): Promise<Result<Vehicule | null>>;
    findByPlateNumber(
        plateNumber: PlateNumber,
    ): Promise<Result<Vehicule | null>>;
}
