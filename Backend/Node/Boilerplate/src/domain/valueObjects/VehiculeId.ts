export class VehiculeId {
  private constructor(private readonly value: string) { }

  static create(value: string): VehiculeId {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new Error('VehiculeId cannot be empty.');
    }

    return new VehiculeId(normalizedValue);
  }

  equals(other: VehiculeId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
