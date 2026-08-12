import { Result, type Result as ResultType } from "../../shared/Result";
import type { Location } from "../valueObjects/Location";
import type { PlateNumber } from "../valueObjects/PlateNumber";
import type { VehicleId } from "../valueObjects/VehicleId";

export class VehicleAlreadyParkedAtLocationError extends Error {
    constructor() {
        super("Vehicle is already parked at the specified location");
    }
}

export class Vehicle {
    private constructor(
        private readonly id: VehicleId,
        private plateNumber: PlateNumber,
        private location: Location | null,
    ) {}

    getId(): VehicleId {
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
        id: VehicleId,
        plateNumber: PlateNumber,
        location: Location | null,
    ): Vehicle {
        return new Vehicle(id, plateNumber, location);
    }
}
