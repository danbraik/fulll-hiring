import { Vehicle } from "../../domain/entities/Vehicle";
import type { VehicleId } from "../../domain/valueObjects/VehicleId";
import type { PlateNumber } from "../../domain/valueObjects/PlateNumber";
import type { VehicleRepository } from "../../domain/repositories/VehicleRepository";
import { Result } from "../../shared/Result";

export class InMemoryVehicleRepository implements VehicleRepository {
    private readonly vehicles = new Map<string, Vehicle>();
    private readonly idByPlateNumber = new Map<string, string>();

    async save(vehicle: Vehicle): Promise<Result<void, Error>> {
        const vehicleKey = vehicle.getId().toString();
        const plateNumberKey = vehicle.getPlateNumber().toString();

        this.vehicles.set(
            vehicleKey,
            Vehicle.create(
                vehicle.getId(),
                vehicle.getPlateNumber(),
                vehicle.getLocation(),
            ),
        );
        this.idByPlateNumber.set(plateNumberKey, vehicleKey);

        return Result.ok(undefined);
    }

    async findById(
        vehicleId: VehicleId,
    ): Promise<Result<Vehicle | null, Error>> {
        const vehicle = this.vehicles.get(vehicleId.toString());

        if (!vehicle) {
            return Result.ok(null);
        }

        return Result.ok(
            Vehicle.create(
                vehicle.getId(),
                vehicle.getPlateNumber(),
                vehicle.getLocation(),
            ),
        );
    }

    async findByPlateNumber(
        plateNumber: PlateNumber,
    ): Promise<Result<Vehicle | null, Error>> {
        const vehicleId = this.idByPlateNumber.get(plateNumber.toString());

        if (!vehicleId) {
            return Result.ok(null);
        }

        const vehicle = this.vehicles.get(vehicleId);

        if (!vehicle) {
            return Result.ok(null);
        }

        return Result.ok(
            Vehicle.create(
                vehicle.getId(),
                vehicle.getPlateNumber(),
                vehicle.getLocation(),
            ),
        );
    }
}
