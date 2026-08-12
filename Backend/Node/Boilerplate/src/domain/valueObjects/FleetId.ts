import { randomUUID } from "crypto";

export class FleetId {
    private constructor(private readonly value: string) {}

    static create(value: string): FleetId {
        const normalizedValue = value.trim();

        if (normalizedValue.length === 0) {
            throw new Error("FleetId cannot be empty.");
        }

        return new FleetId(normalizedValue);
    }

    static generate(): FleetId {
        return new FleetId(randomUUID());
    }

    equals(other: FleetId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
