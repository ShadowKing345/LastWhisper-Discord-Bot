import {ManagerUtilsConfigRepository} from "../repositories/managerUtilsConfigRepository.js";
import {ManagerUtilsConfig} from "../models/mangerUtils.js";

export class ManagerUtilsConfigService {
    private repo: ManagerUtilsConfigRepository;

    constructor() {
        this.repo = new ManagerUtilsConfigRepository();
    }

    public async findOne(id: string): Promise<ManagerUtilsConfig> {
        return this.repo.findOne({guildId: id});
    }

    public async findOneOrCreate(id: string): Promise<ManagerUtilsConfig> {
        let result = await this.repo.findOne({guildId: id})
        if (result) return result;

        result = new ManagerUtilsConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }

    public async update(config: ManagerUtilsConfig): Promise<ManagerUtilsConfig> {
        return this.repo.save(config);
    }

    public async getAll(): Promise<ManagerUtilsConfig[]> {
        return this.repo.find({});
    }
}