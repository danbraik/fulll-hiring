import { Vehicle } from "../../../../domain/entities/Vehicle";
import type { VehicleRepository } from "../../../../domain/repositories/VehicleRepository";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { VehicleId } from "../../../../domain/valueObjects/VehicleId";
import { Result } from "../../../../shared/Result";
import type { CreateVehicleCommand } from "./CreateVehicleCommand";

export class CreateVehicleCommandHandler {
    constructor(private readonly vehicleRepository: VehicleRepository) {}

    async handle(command: CreateVehicleCommand): Promise<Result<Vehicle>> {
        const vehicle = Vehicle.create(
            VehicleId.generate(),
            PlateNumber.create(command.plateNumber),
            null,
        );

        const saveResult = await this.vehicleRepository.save(vehicle);
        if (saveResult.isFailure) {
            return Result.fail(saveResult.error);
        }

        return Result.ok(vehicle);
    }
}
