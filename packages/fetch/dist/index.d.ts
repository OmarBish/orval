import { GeneratorVerbOptions, GeneratorOptions, ClientBuilder, ClientGeneratorsBuilder } from '@orval/core';

declare const generateRequestFunction: ({ queryParams, operationName, response, mutator, body, props, verb, formData, formUrlEncoded, override, }: GeneratorVerbOptions, { route, context, pathRoute }: GeneratorOptions) => string;
declare const fetchResponseTypeName: (includeHttpResponseReturnType: boolean, definitionSuccessResponse: string, operationName: string) => string;
declare const generateClient: ClientBuilder;
declare const builder: () => () => ClientGeneratorsBuilder;

export { builder, builder as default, fetchResponseTypeName, generateClient, generateRequestFunction };
