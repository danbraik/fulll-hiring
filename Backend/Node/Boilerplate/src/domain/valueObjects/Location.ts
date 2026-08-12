export class Location {
  private constructor(
    private readonly latitude: number,
    private readonly longitude: number,
  ) { }

  static create(latitude: number, longitude: number): Location {
    if (!Number.isFinite(latitude)) {
      throw new Error('Location latitude must be a finite number.');
    }

    if (!Number.isFinite(longitude)) {
      throw new Error('Location longitude must be a finite number.');
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Location latitude must be between -90 and 90.');
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error('Location longitude must be between -180 and 180.');
    }

    return new Location(latitude, longitude);
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  equals(other: Location): boolean {
    return this.latitude === other.latitude && this.longitude === other.longitude;
  }

  toString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}
