import { randomUUID } from "crypto";

export class VehicleId {
    private constructor(private readonly value: string) {}

    static create(value: string): VehicleId {
        const normalizedValue = value.trim();

        if (normalizedValue.length === 0) {
            throw new Error("VehicleId cannot be empty.");
        }

        return new VehicleId(normalizedValue);
    }

    equals(other: VehicleId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static generate(): VehicleId {
        return new VehicleId(randomUUID());
    }
}
