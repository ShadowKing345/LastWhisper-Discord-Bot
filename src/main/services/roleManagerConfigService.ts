import {RoleManagerConfigRepository} from "../repositories/roleManagerConfigRepository.js";
import {RoleManagerConfig} from "../models/roleManager.model.js";

export class RoleManagerConfigService {
    private repo: RoleManagerConfigRepository;

    constructor() {
        this.repo = new RoleManagerConfigRepository();
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
