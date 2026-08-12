import { Vehicule } from "../entities/Vehicule";
import { VehiculeId } from "../valueObjects/VehiculeId";
import { PlateNumber } from "../valueObjects/PlateNumber";
import { Result } from "../../shared/Result";

export interface VehiculeRepository {
    save(vehicule: Vehicule): Promise<Result<void>>;
    findById(vehiculeId: VehiculeId): Promise<Result<Vehicule | null>>;
    findByPlateNumber(
        plateNumber: PlateNumber,
    ): Promise<Result<Vehicule | null>>;
}
