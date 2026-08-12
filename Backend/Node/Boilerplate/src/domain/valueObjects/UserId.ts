export class UserId {
    private constructor(private readonly value: string) {}

    static create(value: string): UserId {
        const normalizedValue = value.trim();

        if (normalizedValue.length === 0) {
            throw new Error("UserId cannot be empty.");
        }

        return new UserId(normalizedValue);
    }

    equals(other: UserId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
