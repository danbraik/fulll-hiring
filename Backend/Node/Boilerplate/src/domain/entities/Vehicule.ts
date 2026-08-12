import type { Location } from "../valueObjects/Location";
import type { PlateNumber } from "../valueObjects/PlateNumber";
import type { VehiculeId } from "../valueObjects/VehiculeId";
import { Result, type Result as ResultType } from "../../shared/Result";

export class VehicleAlreadyParkedAtLocationError extends Error {}

export class Vehicule {
    private constructor(
        private readonly id: VehiculeId,
        private plateNumber: PlateNumber,
        private location: Location | null,
    ) {}

    getId(): VehiculeId {
        return this.id;
    }

    getPlateNumber(): PlateNumber {
        return this.plateNumber;
    }

    getLocation(): Location | null {
        return this.location;
    }

    setLocation(
        location: Location | null,
    ): ResultType<void, VehicleAlreadyParkedAtLocationError> {
        if (this.location && location && this.location.equals(location)) {
            return Result.fail(new VehicleAlreadyParkedAtLocationError());
        }

        this.location = location;
        return Result.ok(undefined);
    }

    static create(
        id: VehiculeId,
        plateNumber: PlateNumber,
        location: Location | null,
    ): Vehicule {
        return new Vehicule(id, plateNumber, location);
    }
}
