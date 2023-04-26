import { EntityBase } from "../../src/entities/entityBase.js";
import { Repository } from "../../src/repositories/base/repository.js";
import { constructor } from "tsyringe/dist/typings/types/index.js";
import { isArray } from "../../src/utils/index.js";
import { mock } from "node:test";

const _ = mock.fn<() => Promise<unknown>>( () => Promise.resolve() );
type MockFunction = typeof _;

export interface IMockRepository<T extends EntityBase> {
    _addItem( key: string, obj: T );

    _removeItem( key: string );

    _addItems( objs: [ string, T ][] );

    _removeItems( keys: string[] );

    _getItem( key: string );

    _clear();
}

export type MockRepository<G extends EntityBase, T extends Repository<G>> = T & IMockRepository<G>;

type internalItems<G extends EntityBase, T extends Repository<G>> =
    MockRepository<G, T>
    &
    {
        $items: { [key: string]: G },
        $findItem: ( filter: Partial<G> ) => G
        $findItems: ( filters: Partial<G>[] ) => G[]
    }

/**
 * Helper function used to check if a item matches the filter.
 * @param {Object} item Item to check.
 * @param {Object} filter The object to check against.
 * @return {boolean}
 */
function filterCall( item: object, filter: object ) {
    return Object.entries(item)
        .filter(item => Object.keys(filter).includes(item[0]))
        .every(item => filter[item[0]] === item[1]);
}

function createInterfaceFunctions<G extends EntityBase, T extends Repository<G>>( instance: internalItems<G, T> ) {
    instance.$items = {};


    instance.$findItem = function( filter ) {
        return Object.values( this.$items ).find( item => filterCall( item, filter ) );
    }

    instance.$findItems = function( filters ) {
        return Object.values( this.$items ).filter( item => filters.some( filter => filterCall( item, filter ) ) );
    }

    instance._clear = function() {
        this.$items = {};

        ( this.findOne as unknown as MockFunction ).mock?.resetCalls();
        ( this.findAll as unknown as MockFunction ).mock?.resetCalls();
        ( this.save as unknown as MockFunction ).mock?.resetCalls();
        ( this.bulkSave as unknown as MockFunction ).mock?.resetCalls();
        ( this.delete as unknown as MockFunction ).mock?.resetCalls();
    }

    instance._addItem = function( key, obj ) {
        this.$items[key] = obj;
    }

    instance._addItems = function( objs ) {
        for( const [ k, v ] of objs ) {
            this._addItem( k, v );
        }
    }

    instance._getItem = function( key ) {
        return this.$items[key];
    }

    instance._removeItem = function( key ) {
        delete this.$items[key];
    }

    instance._removeItem = function( keys ) {
        for( const k of keys ) {
            this._removeItem( k );
        }
    }
}

function overrideDefaultRepoMethods<G extends EntityBase, T extends Repository<G>>( instance: internalItems<G, T> ) {
    instance.findOne = function( filter ) {
        if( filter.where ) {
            if( isArray( filter.where ) ) {
                const result = this.$findItems( filter.where as G[] );
                return Promise.resolve( result[0] ?? null );
            } else if( filter.where.guildId ) {
                const result = this.$findItem( filter.where as G );
                return Promise.resolve( result );
            }
        }

        return Promise.resolve<G>( Object.values( this.$items )?.[0] );
    };

    instance.findAll = function( filter ) {
        if( filter.where ) {
            let items: G[];

            if( isArray( filter.where ) ) {
                items = this.$findItems( filter.where as G[] );
            } else if( filter.where.guildId ) {
                items = this.$findItems( [filter.where as G] );
            }

            return Promise.resolve( items );
        }

        return Promise.resolve<G[]>( Object.values( this.$items ) );
    };

    instance.save = mock.fn( ( obj ) => Promise.resolve( obj ) );

    instance.bulkSave = mock.fn( ( objs ) => Promise.resolve( objs ) );

    instance.delete = mock.fn( () => Promise.resolve() );
}

export function mockRepository<G extends EntityBase, T extends Repository<G>>( construct: constructor<T>, ...args ): MockRepository<G, T> {
    const instance = new construct( args ) as internalItems<G, T>;

    createInterfaceFunctions( instance );
    overrideDefaultRepoMethods( instance );

    return instance;
}