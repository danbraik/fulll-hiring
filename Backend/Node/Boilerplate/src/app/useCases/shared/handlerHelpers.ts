import type { Fleet } from "../../../domain/entities/Fleet";
import type { Vehicle } from "../../../domain/entities/Vehicle";
import type { FleetRepository } from "../../../domain/repositories/FleetRepository";
import type { VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { FleetId } from "../../../domain/valueObjects/FleetId";
import { PlateNumber } from "../../../domain/valueObjects/PlateNumber";
import { Result } from "../../../shared/Result";

export class FleetNotFoundError extends Error {
    constructor() {
        super("Fleet not found");
    }
}

export class VehicleNotRegisteredInFleetError extends Error {
    constructor() {
        super("Vehicle is not registered in the fleet");
    }
}

type RegisteredVehicle = {
    fleet: Fleet;
    vehicle: Vehicle;
};

export async function getFleetOrFail(
    fleetRepository: FleetRepository,
    fleetId: string,
): Promise<Result<Fleet, Error>> {
    const fleetResult = await fleetRepository.findById(FleetId.create(fleetId));
    if (fleetResult.isFailure) {
        return Result.fail(fleetResult.error);
    }

    const fleet = fleetResult.getValue();
    if (!fleet) {
        return Result.fail(new FleetNotFoundError());
    }

    return Result.ok(fleet);
}

export async function getRegisteredVehicleOrFail(
    fleetRepository: FleetRepository,
    vehicleRepository: VehicleRepository,
    fleetId: string,
    plateNumber: string,
): Promise<Result<RegisteredVehicle, Error>> {
    const fleetResult = await getFleetOrFail(fleetRepository, fleetId);
    if (fleetResult.isFailure) {
        return Result.fail(fleetResult.error);
    }

    const vehicleResult = await vehicleRepository.findByPlateNumber(
        PlateNumber.create(plateNumber),
    );
    if (vehicleResult.isFailure) {
        return Result.fail(vehicleResult.error);
    }

    const fleet = fleetResult.getValue();
    const vehicle = vehicleResult.getValue();
    if (!vehicle || !fleet.hasVehicle(vehicle.getId())) {
        return Result.fail(new VehicleNotRegisteredInFleetError());
    }

    return Result.ok({
        fleet,
        vehicle,
    });
}
