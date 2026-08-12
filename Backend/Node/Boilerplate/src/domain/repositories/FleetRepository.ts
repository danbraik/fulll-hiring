import { Fleet } from "../entities/Fleet";
import { FleetId } from "../valueObjects/FleetId";
import { Result } from "../../shared/Result";

export interface FleetRepository {
    save(fleet: Fleet): Promise<Result<void>>;
    findById(fleetId: FleetId): Promise<Result<Fleet | null>>;
}
