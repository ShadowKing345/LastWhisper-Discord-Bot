import {EventManagerRepository} from "../repositories/eventManagerRepository.js";
import {EventManagerConfig} from "../models/eventManager.model.js";

export class EventManagerConfigService {
    private repo: EventManagerRepository;

    constructor() {
        this.repo = new EventManagerRepository();
    }

    public async findOne(id: string): Promise<EventManagerConfig> {
        return this.repo.findOne({guildId: id});
    }

    public async findOneOrCreate(id: string): Promise<EventManagerConfig> {
        let result = await this.repo.findOne({guildId: id})
        if (result) return result;

        result = new EventManagerConfig();
        result.guildId = id;

        return await this.repo.save(result);
    }

    public async update(config: EventManagerConfig): Promise<EventManagerConfig> {
        return this.repo.save(config);
    }

    public async getAll(): Promise<EventManagerConfig[]> {
        return this.repo.find({});
    }

    async bulkUpdate(configs: EventManagerConfig[]) {
        return this.repo.bulkSave(configs);
    }
}
