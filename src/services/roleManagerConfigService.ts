import {RoleManagerConfigRepository} from "../repositories/roleManagerConfigRepository";
import {RoleManagerConfig} from "../models/roleManager";
import {Service} from "typedi";

@Service()
export class RoleManagerConfigService {

    constructor(private repo: RoleManagerConfigRepository) {
    }

    public async findOne(id: string): Promise<RoleManagerConfig> {
        return this.repo.findOne({guildId: id});
    }

    public async findOneOrCreate(id: string): Promise<RoleManagerConfig> {
        let result = await this.repo.findOne({guildId: id})
        if (result) return result;

        result = new RoleManagerConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }

    public async update(config: RoleManagerConfig): Promise<RoleManagerConfig> {
        return this.repo.save(config);
    }

    public async getAll(): Promise<RoleManagerConfig[]> {
        return this.repo.find({});
    }
}