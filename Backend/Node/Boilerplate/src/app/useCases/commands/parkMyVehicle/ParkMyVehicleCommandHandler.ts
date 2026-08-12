import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehiculeRepository } from "../../../../domain/repositories/VehiculeRepository";
import { Location } from "../../../../domain/valueObjects/Location";
import { Result } from "../../../../shared/Result";
import { getRegisteredVehicleOrFail } from "../../shared/handlerHelpers";
import type { ParkMyVehicleCommand } from "./ParkMyVehicleCommand";

export class ParkMyVehicleCommandHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehiculeRepository: VehiculeRepository,
    ) {}

    async handle(command: ParkMyVehicleCommand): Promise<Result<void, Error>> {
        const registeredVehicleResult = await getRegisteredVehicleOrFail(
            this.fleetRepository,
            this.vehiculeRepository,
            command.fleetId,
            command.plateNumber,
        );
        if (registeredVehicleResult.isFailure) {
            return Result.fail(registeredVehicleResult.error);
        }

        const { vehicule } = registeredVehicleResult.getValue();
        const location = Location.create(
            command.location.latitude,
            command.location.longitude,
            command.location.altitude,
        );

        const setLocationResult = vehicule.setLocation(location);
        if (setLocationResult.isFailure) {
            return Result.fail(setLocationResult.error);
        }

        const saveVehiculeResult = await this.vehiculeRepository.save(vehicule);
        if (saveVehiculeResult.isFailure) {
            return Result.fail(saveVehiculeResult.error);
        }

        return Result.ok(undefined);
    }
}
