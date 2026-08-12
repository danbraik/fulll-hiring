import type { Result } from "../../shared/Result";
import type { Fleet } from "../entities/Fleet";
import type { FleetId } from "../valueObjects/FleetId";

export interface FleetRepository {
    save(fleet: Fleet): Promise<Result<void>>;
    findById(fleetId: FleetId): Promise<Result<Fleet | null>>;
}
