import type { Result } from "../../shared/Result";
import type { Vehicle } from "../entities/Vehicle";
import type { PlateNumber } from "../valueObjects/PlateNumber";
import type { VehicleId } from "../valueObjects/VehicleId";

export interface VehicleRepository {
    save(vehicle: Vehicle): Promise<Result<void>>;
    findById(vehicleId: VehicleId): Promise<Result<Vehicle | null>>;
    findByPlateNumber(
        plateNumber: PlateNumber,
    ): Promise<Result<Vehicle | null>>;
}
