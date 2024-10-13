declare namespace PactV2 {
    /**
 * Schema for a Pact file
 */
    export type PactFile = {
        consumer: Pacticipant;
        interactions: Interaction[];
        metadata?: Metadata;
        provider: Pacticipant;
        [property: string]: any;
    }

    export type Pacticipant = {
        name: string;
        [property: string]: any;
    }

    export type Interaction<TResponse = any, TRequest = any,> = {
        description: string;
        providerState?: string;
        request: Request<TRequest>;
        response: Response<TResponse>;
    }

    export type Request<T = any> = {
        body?: T;
        headers?: { [key: string]: any };
        matchingRules?: MatchingRules;
        method: Method;
        path: string;
        query?: string;
    }

    export type MatchingRules = {
    }

    export type Method = "connect" | "CONNECT" | "delete" | "DELETE" | "get" | "GET" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "trace" | "TRACE";

    export type Response<T = any> = {
        body?: T;
        headers?: { [key: string]: any };
        matchingRules?: MatchingRules;
        status: number;
    }

    export type Metadata = {
        "pact-specification"?: PactSpecification;
        pactSpecification?: PactSpecificationClass;
        pactSpecificationVersion?: string;
        [property: string]: any;
    }

    export type PactSpecification = {
        version: string;
    }

    export type PactSpecificationClass = {
        version: string;
    }

}