import {EntityBase} from "../../src/entities/entityBase.js";
import {Repository} from "../../src/repositories/base/repository.js";
import {constructor} from "tsyringe/dist/typings/types/index.js";
import {isArray} from "../../src/utils/index.js";
import {mock} from "node:test";

export interface IMockRepository<T extends EntityBase> {
    _addItem(key: string, obj: T);

    _removeItem(key: string);

    _addItems(objs: [string, T][]);

    _removeItems(keys: string[]);

    _clear();
}

export type MockRepository<G extends EntityBase, T extends Repository<G>> = T & IMockRepository<G>;

type internalItems<G extends EntityBase, T extends Repository<G>> =
    MockRepository<G, T>
    &
    {
        $items: { [key: string]: G },
        $findItem: (guildId: string) => G
        $findItems: (guildId: string) => G[]
    }

function createInterfaceFunctions<G extends EntityBase, T extends Repository<G>>(instance: internalItems<G, T>) {
    instance.$items = {};
    instance.$findItem = function (guildId) {
        return Object.values(this.$items).find(item => item.guildId === guildId);
    }

    instance.$findItems = function (guildId) {
        return Object.values(this.$items).filter(item => item.guildId === guildId);
    }

    instance._clear = function () {
        this.$items = {};
    }

    instance._addItem = function (key, obj) {
        this.$items[key] = obj;
    }

    instance._addItems = function (objs) {
        for (const [k, v] of objs) {
            this._addItem(k, v);
        }
    }

    instance._removeItem = function (key) {
        delete this.$items[key];
    }

    instance._removeItem = function (keys) {
        for (const k of keys) {
            this._removeItem(k);
        }
    }
}

function overrideDefaultRepoMethods<G extends EntityBase, T extends Repository<G>>(instance: internalItems<G, T>) {
    instance.findOne = mock.fn((filter) => {
        if (isArray(filter.where)) {
            const arr = filter.where.filter(item => item.guildId).map(item => item.guildId) as string[];
            return Promise.resolve(Object.values(instance.$items).filter(obj => arr.every(guildId => obj.guildId === guildId))[0] ?? null);
        } else if (filter.where.guildId) {
            return Promise.resolve(instance.$findItem(filter.where.guildId as string));
        }

        return Promise.resolve<G>(null);
    });

    instance.findAll = mock.fn((filter) => {
        if (isArray(filter.where)) {
            const arr = filter.where.filter(item => item.guildId).map(item => item.guildId) as string[];
            return Promise.resolve(Object.values(instance.$items).filter(obj => arr.every(guildId => obj.guildId === guildId)));
        } else if (filter.where.guildId) {
            return Promise.resolve(instance.$findItems(filter.where.guildId as string));
        }

        return Promise.resolve<G[]>([]);
    });

    instance.save = mock.fn((obj) => Promise.resolve(obj));

    instance.bulkSave = mock.fn((objs) => Promise.resolve(objs));

    instance.delete = mock.fn(() => Promise.resolve());
}

export function mockRepository<G extends EntityBase, T extends Repository<G>>(construct: constructor<T>, ...args): MockRepository<G, T> {
    const instance = new construct(args) as internalItems<G, T>;

    createInterfaceFunctions(instance);
    overrideDefaultRepoMethods(instance);

    return instance;
}