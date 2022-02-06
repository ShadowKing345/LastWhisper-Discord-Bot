import {BuffManagerConfig} from "../models/buffManager.js";
import {BuffManagerConfigRepository} from "../repositories/buffManagerConfigRepository.js";

export class BuffManagerConfigService {
    private repo: BuffManagerConfigRepository;

    constructor() {
        this.repo = new BuffManagerConfigRepository();
    }

    public async findOne(id: string): Promise<BuffManagerConfig> {
        return this.repo.findOne({guildId: id});
    }

    public async findOneOrCreate(id: string): Promise<BuffManagerConfig> {
        let result = await this.repo.findOne({guildId: id})
        if (result) return result;

        result = new BuffManagerConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }

    public async update(config: BuffManagerConfig): Promise<BuffManagerConfig> {
        return this.repo.save(config);
    }

    public async getAll(): Promise<BuffManagerConfig[]> {
        return this.repo.find({});
    }
}