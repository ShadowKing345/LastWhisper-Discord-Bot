import { isStringNullOrEmpty } from "../utils/index.js";

export class ServiceResponse<T = unknown> {
    public type: ServiceResponseType;
    public value?: T;
    public reason?: string;
    public error?: Error;

    public constructor( data: Partial<ServiceResponse> & Pick<ServiceResponse, "type"> ) {
        this.merge( data );
    }

    public merge( obj: Partial<ServiceResponse> ): ServiceResponse {
        if( obj.type ) {
            this.type = obj.type;
        }
        
        if( obj.value ) {
            this.value = obj.value as T;
        }
        
        if( !isStringNullOrEmpty(obj.reason) ) {
            this.reason = obj.reason;
        }
        
        if( obj.error ) {
            this.error = obj.error;
        }
        
        return this;
    }

    public static success<T>( value: T = null ): ServiceResponse<T> {
        return new ServiceResponse<T>( { type: ServiceResponseType.SUCCESS, value } );
    }

    public static failure<T>( reason: string = null ): ServiceResponse<T> {
        return new ServiceResponse<T>( { type: ServiceResponseType.FAILURE, reason } );
    }

    public static error<T>( error: Error = null ): ServiceResponse<T> {
        return new ServiceResponse<T>( { type: ServiceResponseType.ERROR, error } );
    }
    
    public get isSuccess(): boolean {
        return this.type === ServiceResponseType.SUCCESS;
    }
    
    public get isFailure(): boolean {
        return this.type === ServiceResponseType.FAILURE;
    }
    
    public get isError(): boolean {
        return this.type === ServiceResponseType.ERROR;
    }
}

export enum ServiceResponseType {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    ERROR = "ERROR",
}