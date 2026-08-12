export class Location {
  private constructor(
    private readonly latitude: number,
    private readonly longitude: number,
    private readonly altitude: number | null,
  ) { }

  static create(latitude: number, longitude: number, altitude?: number | null): Location {
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

    if (altitude !== undefined && altitude !== null && !Number.isFinite(altitude)) {
      throw new Error('Location altitude must be a finite number.');
    }

    return new Location(latitude, longitude, altitude ?? null);
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  getAltitude(): number | null {
    return this.altitude;
  }

  equals(other: Location): boolean {
    return this.latitude === other.latitude
      && this.longitude === other.longitude
      && (this.altitude === null || other.altitude === null || this.altitude === other.altitude);
  }

  toString(): string {
    if (this.altitude === null) {
      return `${this.latitude},${this.longitude}`;
    }

    return `${this.latitude},${this.longitude},${this.altitude}`;
  }
}
