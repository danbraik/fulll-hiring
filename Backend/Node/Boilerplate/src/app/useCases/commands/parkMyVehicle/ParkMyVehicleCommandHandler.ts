import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehicleRepository } from "../../../../domain/repositories/VehicleRepository";
import { Location } from "../../../../domain/valueObjects/Location";
import { Result } from "../../../../shared/Result";
import { getRegisteredVehicleOrFail } from "../../shared/handlerHelpers";
import type { ParkMyVehicleCommand } from "./ParkMyVehicleCommand";

export class ParkMyVehicleCommandHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehicleRepository: VehicleRepository,
    ) {}

    async handle(command: ParkMyVehicleCommand): Promise<Result<void, Error>> {
        const registeredVehicleResult = await getRegisteredVehicleOrFail(
            this.fleetRepository,
            this.vehicleRepository,
            command.fleetId,
            command.plateNumber,
        );
        if (registeredVehicleResult.isFailure) {
            return Result.fail(registeredVehicleResult.error);
        }

        const { vehicle } = registeredVehicleResult.getValue();
        const location = Location.create(
            command.location.latitude,
            command.location.longitude,
            command.location.altitude,
        );

        const setLocationResult = vehicle.setLocation(location);
        if (setLocationResult.isFailure) {
            return Result.fail(setLocationResult.error);
        }

        const saveVehicleResult = await this.vehicleRepository.save(vehicle);
        if (saveVehicleResult.isFailure) {
            return Result.fail(saveVehicleResult.error);
        }

        return Result.ok(undefined);
    }
}
