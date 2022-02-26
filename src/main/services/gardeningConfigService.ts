import {GardeningConfig} from "../models/gardeningConfig.model.js";
import {GardeningConfigRepository} from "../repositories/gardeningConfigRepository.js";

export class GardeningConfigService {
    private repo: GardeningConfigRepository;

    constructor() {
        this.repo = new GardeningConfigRepository();
    }

    public async findOne(id: string): Promise<GardeningConfig> {
        return this.repo.findOne({guildId: id});
    }

    public async findOneOrCreate(id: string): Promise<GardeningConfig> {
        let result = await this.repo.findOne({guildId: id})
        if (result) return result;

        result = new GardeningConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }

    public async update(config: GardeningConfig): Promise<GardeningConfig> {
        return this.repo.save(config);
    }

    public async getAll(): Promise<GardeningConfig[]> {
        return this.repo.find({});
    }
}
