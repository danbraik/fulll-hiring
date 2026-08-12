import type { Fleet } from "../../../domain/entities/Fleet";
import type { Vehicule } from "../../../domain/entities/Vehicule";
import type { FleetRepository } from "../../../domain/repositories/FleetRepository";
import type { VehiculeRepository } from "../../../domain/repositories/VehiculeRepository";
import { FleetId } from "../../../domain/valueObjects/FleetId";
import { PlateNumber } from "../../../domain/valueObjects/PlateNumber";
import { Result } from "../../../shared/Result";

export class FleetNotFoundError extends Error {}

export class VehicleNotRegisteredInFleetError extends Error {}

type RegisteredVehicle = {
    fleet: Fleet;
    vehicule: Vehicule;
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
    vehiculeRepository: VehiculeRepository,
    fleetId: string,
    plateNumber: string,
): Promise<Result<RegisteredVehicle, Error>> {
    const fleetResult = await getFleetOrFail(fleetRepository, fleetId);
    if (fleetResult.isFailure) {
        return Result.fail(fleetResult.error);
    }

    const vehiculeResult = await vehiculeRepository.findByPlateNumber(
        PlateNumber.create(plateNumber),
    );
    if (vehiculeResult.isFailure) {
        return Result.fail(vehiculeResult.error);
    }

    const fleet = fleetResult.getValue();
    const vehicule = vehiculeResult.getValue();
    if (!vehicule || !fleet.hasVehicule(vehicule.getId())) {
        return Result.fail(new VehicleNotRegisteredInFleetError());
    }

    return Result.ok({
        fleet,
        vehicule,
    });
}
