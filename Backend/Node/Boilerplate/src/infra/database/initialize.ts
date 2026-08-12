import Database from "better-sqlite3";

export function initializeDatabase(): Database.Database {
    const databasePath = process.env.FLEET_DATABASE_PATH ?? "fleet.sqlite";
    const database = new Database(databasePath);

    database.pragma("foreign_keys = ON");

    database.exec(`
        CREATE TABLE IF NOT EXISTS fleets (
            id TEXT PRIMARY KEY
                CHECK (length(trim(id)) > 0),
            owner_id TEXT NOT NULL
                CHECK (length(trim(owner_id)) > 0)
        );

        CREATE TABLE IF NOT EXISTS vehicles (
            id TEXT PRIMARY KEY
                CHECK (length(trim(id)) > 0),
            plate_number TEXT NOT NULL UNIQUE
                CHECK (length(trim(plate_number)) > 0),
            location_latitude REAL,
            location_longitude REAL,
            location_altitude REAL
        );

        CREATE TABLE IF NOT EXISTS fleet_vehicles (
            fleet_id TEXT NOT NULL,
            vehicle_id TEXT NOT NULL,
            PRIMARY KEY (fleet_id, vehicle_id),
            FOREIGN KEY (fleet_id) REFERENCES fleets (id) ON DELETE CASCADE,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE RESTRICT
        );

        CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number
            ON vehicles (plate_number);

        CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_vehicle_id
            ON fleet_vehicles (vehicle_id);
    `);

    return database;
}
