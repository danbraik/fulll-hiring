import { Location } from "../valueObjects/Location";
import { PlateNumber } from "../valueObjects/PlateNumber";
import { VehiculeId } from "../valueObjects/VehiculeId";

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

    setPlateNumber(plateNumber: PlateNumber): void {
        this.plateNumber = plateNumber;
    }

    getLocation(): Location | null {
        return this.location;
    }

    setLocation(location: Location | null): void {
        this.location = location;
    }

    static create(
        id: VehiculeId,
        plateNumber: PlateNumber,
        location: Location | null,
    ): Vehicule {
        return new Vehicule(id, plateNumber, location);
    }
}
