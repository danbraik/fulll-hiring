import type { Vehicle } from "../entities/Vehicle";
import type { VehicleId } from "../valueObjects/VehicleId";
import type { PlateNumber } from "../valueObjects/PlateNumber";
import type { Result } from "../../shared/Result";

export interface VehicleRepository {
    save(vehicle: Vehicle): Promise<Result<void>>;
    findById(vehicleId: VehicleId): Promise<Result<Vehicle | null>>;
    findByPlateNumber(
        plateNumber: PlateNumber,
    ): Promise<Result<Vehicle | null>>;
}
