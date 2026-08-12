export class PlateNumber {
    private constructor(private readonly value: string) {}

    static create(value: string): PlateNumber {
        const normalizedValue = value.trim();

        if (normalizedValue.length === 0) {
            throw new Error("PlateNumber cannot be empty.");
        }

        return new PlateNumber(normalizedValue);
    }

    equals(other: PlateNumber): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
