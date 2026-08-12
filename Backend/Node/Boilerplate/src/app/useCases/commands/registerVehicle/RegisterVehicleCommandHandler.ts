import { Vehicle } from "../../../../domain/entities/Vehicle";
import type { FleetRepository } from "../../../../domain/repositories/FleetRepository";
import type { VehicleRepository } from "../../../../domain/repositories/VehicleRepository";
import { PlateNumber } from "../../../../domain/valueObjects/PlateNumber";
import { VehicleId } from "../../../../domain/valueObjects/VehicleId";
import { Result } from "../../../../shared/Result";
import { getFleetOrFail } from "../../shared/handlerHelpers";
import type { RegisterVehicleCommand } from "./RegisterVehicleCommand";

export class RegisterVehicleCommandHandler {
    constructor(
        private readonly fleetRepository: FleetRepository,
        private readonly vehicleRepository: VehicleRepository,
    ) {}

    async handle(
        command: RegisterVehicleCommand,
    ): Promise<Result<void, Error>> {
        const fleetResult = await getFleetOrFail(
            this.fleetRepository,
            command.fleetId,
        );
        if (fleetResult.isFailure) {
            return Result.fail(fleetResult.error);
        }

        const fleet = fleetResult.getValue();

        const plateNumber = PlateNumber.create(command.plateNumber);
        const vehicleResult =
            await this.vehicleRepository.findByPlateNumber(plateNumber);
        if (vehicleResult.isFailure) {
            return Result.fail(vehicleResult.error);
        }

        let vehicle = vehicleResult.getValue();
        if (!vehicle) {
            vehicle = Vehicle.create(VehicleId.generate(), plateNumber, null);

            const saveVehicleResult =
                await this.vehicleRepository.save(vehicle);
            if (saveVehicleResult.isFailure) {
                return Result.fail(saveVehicleResult.error);
            }
        }

        const addVehicleResult = fleet.addVehicle(vehicle.getId());
        if (addVehicleResult.isFailure) {
            return Result.fail(addVehicleResult.error);
        }

        const saveFleetResult = await this.fleetRepository.save(fleet);
        if (saveFleetResult.isFailure) {
            return Result.fail(saveFleetResult.error);
        }

        return Result.ok(undefined);
    }
}
