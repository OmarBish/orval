"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  builder: () => builder,
  default: () => src_default,
  generateSwr: () => generateSwr,
  generateSwrHeader: () => generateSwrHeader,
  getSwrDependencies: () => getSwrDependencies
});
module.exports = __toCommonJS(src_exports);
var import_core2 = require("@orval/core");

// src/client.ts
var import_core = require("@orval/core");
var import_fetch = require("@orval/fetch");
var AXIOS_DEPENDENCIES = [
  {
    exports: [
      {
        name: "axios",
        default: true,
        values: true,
        syntheticDefaultImport: true
      },
      { name: "AxiosRequestConfig" },
      { name: "AxiosResponse" },
      { name: "AxiosError" }
    ],
    dependency: "axios"
  }
];
var generateSwrRequestFunction = (verbOptions, options) => {
  if (options.context.output.httpClient === import_core.OutputHttpClient.AXIOS) {
    return generateAxiosRequestFunction(verbOptions, options);
  } else {
    return (0, import_fetch.generateRequestFunction)(verbOptions, options);
  }
};
var generateAxiosRequestFunction = ({
  headers,
  queryParams,
  operationName,
  response,
  mutator,
  body,
  props,
  verb,
  formData,
  formUrlEncoded,
  override,
  paramsSerializer
}, { route, context }) => {
  var _a, _b;
  const isRequestOptions = (override == null ? void 0 : override.requestOptions) !== false;
  const isFormData = (override == null ? void 0 : override.formData) !== false;
  const isFormUrlEncoded = (override == null ? void 0 : override.formUrlEncoded) !== false;
  const isExactOptionalPropertyTypes = !!((_b = (_a = context.output.tsconfig) == null ? void 0 : _a.compilerOptions) == null ? void 0 : _b.exactOptionalPropertyTypes);
  const isSyntheticDefaultImportsAllowed = (0, import_core.isSyntheticDefaultImportsAllow)(
    context.output.tsconfig
  );
  const bodyForm = (0, import_core.generateFormDataAndUrlEncodedFunction)({
    formData,
    formUrlEncoded,
    body,
    isFormData,
    isFormUrlEncoded
  });
  if (mutator) {
    const mutatorConfig = (0, import_core.generateMutatorConfig)({
      route,
      body,
      headers,
      queryParams,
      response,
      verb,
      isFormData,
      isFormUrlEncoded,
      hasSignal: false,
      isExactOptionalPropertyTypes
    });
    const propsImplementation = (mutator == null ? void 0 : mutator.bodyTypeName) && body.definition ? (0, import_core.toObjectString)(props, "implementation").replace(
      new RegExp(`(\\w*):\\s?${body.definition}`),
      `$1: ${mutator.bodyTypeName}<${body.definition}>`
    ) : (0, import_core.toObjectString)(props, "implementation");
    const requestOptions = isRequestOptions ? (0, import_core.generateMutatorRequestOptions)(
      override == null ? void 0 : override.requestOptions,
      mutator.hasSecondArg
    ) : "";
    const requestImplementation = `export const ${operationName} = (
    ${propsImplementation}
 ${isRequestOptions && mutator.hasSecondArg ? `options${context.output.optionsParamRequired ? "" : "?"}: SecondParameter<typeof ${mutator.name}>` : ""}) => {${bodyForm}
    return ${mutator.name}<${response.definition.success || "unknown"}>(
    ${mutatorConfig},
    ${requestOptions});
  }
`;
    return requestImplementation;
  }
  const options = (0, import_core.generateOptions)({
    route,
    body,
    headers,
    queryParams,
    response,
    verb,
    requestOptions: override == null ? void 0 : override.requestOptions,
    isFormData,
    isFormUrlEncoded,
    paramsSerializer,
    paramsSerializerOptions: override == null ? void 0 : override.paramsSerializerOptions,
    isExactOptionalPropertyTypes,
    hasSignal: false
  });
  return `export const ${operationName} = (
    ${(0, import_core.toObjectString)(
    props,
    "implementation"
  )} ${isRequestOptions ? `options?: AxiosRequestConfig
` : ""} ): Promise<AxiosResponse<${response.definition.success || "unknown"}>> => {${bodyForm}
    return axios${!isSyntheticDefaultImportsAllowed ? ".default" : ""}.${verb}(${options});
  }
`;
};
var getSwrRequestOptions = (httpClient, mutator) => {
  if (!mutator) {
    return httpClient === import_core.OutputHttpClient.AXIOS ? "axios?: AxiosRequestConfig" : "fetch?: RequestInit";
  } else if (mutator == null ? void 0 : mutator.hasSecondArg) {
    return `request?: SecondParameter<typeof ${mutator.name}>`;
  } else {
    return "";
  }
};
var getSwrErrorType = (response, httpClient, mutator) => {
  if (mutator) {
    return mutator.hasErrorType ? `ErrorType<${response.definition.errors || "unknown"}>` : response.definition.errors || "unknown";
  } else {
    const errorType = httpClient === import_core.OutputHttpClient.AXIOS ? "AxiosError" : "Promise";
    return `${errorType}<${response.definition.errors || "unknown"}>`;
  }
};
var getSwrRequestSecondArg = (httpClient, mutator) => {
  if (!mutator) {
    return httpClient === import_core.OutputHttpClient.AXIOS ? "axios: axiosOptions" : "fetch: fetchOptions";
  } else if (mutator == null ? void 0 : mutator.hasSecondArg) {
    return "request: requestOptions";
  } else {
    return "";
  }
};
var getHttpRequestSecondArg = (httpClient, mutator) => {
  if (!mutator) {
    return httpClient === import_core.OutputHttpClient.AXIOS ? `axiosOptions` : `fetchOptions`;
  } else if (mutator == null ? void 0 : mutator.hasSecondArg) {
    return "requestOptions";
  } else {
    return "";
  }
};
var getSwrMutationFetcherOptionType = (httpClient, mutator) => {
  if (!mutator) {
    return httpClient === import_core.OutputHttpClient.AXIOS ? "AxiosRequestConfig" : "RequestInit";
  } else if (mutator.hasSecondArg) {
    return `SecondParameter<typeof ${mutator.name}>`;
  } else {
    return "";
  }
};
var getSwrMutationFetcherType = (response, httpClient, includeHttpResponseReturnType, operationName, mutator) => {
  if (httpClient === import_core.OutputHttpClient.FETCH) {
    const responseType = (0, import_fetch.fetchResponseTypeName)(
      includeHttpResponseReturnType,
      response.definition.success,
      operationName
    );
    return `Promise<${responseType}>`;
  } else if (mutator) {
    return `Promise<${response.definition.success || "unknown"}>`;
  } else {
    return `Promise<AxiosResponse<${response.definition.success || "unknown"}>>`;
  }
};

// src/index.ts
var PARAMS_SERIALIZER_DEPENDENCIES = [
  {
    exports: [
      {
        name: "qs",
        default: true,
        values: true,
        syntheticDefaultImport: true
      }
    ],
    dependency: "qs"
  }
];
var SWR_DEPENDENCIES = [
  {
    exports: [
      { name: "useSwr", values: true, default: true },
      { name: "SWRConfiguration" },
      { name: "Key" },
      { name: "Arguments" }
    ],
    dependency: "swr"
  }
];
var SWR_INFINITE_DEPENDENCIES = [
  {
    exports: [
      { name: "useSWRInfinite", values: true, default: true },
      { name: "SWRInfiniteConfiguration" },
      { name: "SWRInfiniteKeyLoader" }
    ],
    dependency: "swr/infinite"
  }
];
var SWR_MUTATION_DEPENDENCIES = [
  {
    exports: [
      { name: "useSWRMutation", values: true, default: true },
      { name: "SWRMutationConfiguration" },
      { name: "SWRMutationKey" }
    ],
    dependency: "swr/mutation"
  }
];
var getSwrDependencies = (hasGlobalMutator, hasParamsSerializerOptions, _packageJson, httpClient) => [
  ...!hasGlobalMutator && httpClient === import_core2.OutputHttpClient.AXIOS ? AXIOS_DEPENDENCIES : [],
  ...hasParamsSerializerOptions ? PARAMS_SERIALIZER_DEPENDENCIES : [],
  ...SWR_DEPENDENCIES,
  ...SWR_INFINITE_DEPENDENCIES,
  ...SWR_MUTATION_DEPENDENCIES
];
var generateSwrArguments = ({
  operationName,
  mutator,
  isRequestOptions,
  isInfinite,
  httpClient
}) => {
  const configType = isInfinite ? "SWRInfiniteConfiguration" : "SWRConfiguration";
  const optionsType = isInfinite ? "{ swrKeyLoader?: SWRInfiniteKeyLoader, enabled?: boolean }" : "{ swrKey?: Key, enabled?: boolean }";
  const definition = `${configType}<Awaited<ReturnType<typeof ${operationName}>>, TError> & ${optionsType}`;
  if (!isRequestOptions) {
    return `swrOptions?: ${definition}`;
  }
  return `options?: { swr?:${definition}, ${getSwrRequestOptions(httpClient, mutator)} }
`;
};
var generateSwrMutationArguments = ({
  operationName,
  isRequestOptions,
  mutator,
  swrBodyType,
  httpClient
}) => {
  const definition = `SWRMutationConfiguration<Awaited<ReturnType<typeof ${operationName}>>, TError, Key, ${swrBodyType}, Awaited<ReturnType<typeof ${operationName}>>> & { swrKey?: string }`;
  if (!isRequestOptions) {
    return `swrOptions?: ${definition}`;
  }
  return `options?: { swr?:${definition}, ${getSwrRequestOptions(httpClient, mutator)}}
`;
};
var generateSwrImplementation = ({
  operationName,
  swrKeyFnName,
  swrKeyLoaderFnName,
  swrProperties,
  swrKeyProperties,
  params,
  mutator,
  isRequestOptions,
  response,
  swrOptions,
  props,
  doc,
  httpClient
}) => {
  var _a, _b;
  const swrProps = (0, import_core2.toObjectString)(props, "implementation");
  const hasParamReservedWord = props.some(
    (prop) => prop.name === "query"
  );
  const queryResultVarName = hasParamReservedWord ? "_query" : "query";
  const httpFunctionProps = swrProperties;
  const enabledImplementation = `const isEnabled = swrOptions?.enabled !== false${params.length ? ` && !!(${params.map(({ name }) => name).join(" && ")})` : ""}`;
  const swrKeyImplementation = `const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? ${swrKeyFnName}(${swrKeyProperties}) : null);`;
  const swrKeyLoaderImplementation = `const swrKeyLoader = swrOptions?.swrKeyLoader ?? (() => isEnabled ? ${swrKeyLoaderFnName}(${swrKeyProperties}) : null);`;
  const errorType = getSwrErrorType(response, httpClient, mutator);
  const swrRequestSecondArg = getSwrRequestSecondArg(httpClient, mutator);
  const httpRequestSecondArg = getHttpRequestSecondArg(httpClient, mutator);
  const useSWRInfiniteImplementation = swrOptions.useInfinite ? `
export type ${(0, import_core2.pascal)(
    operationName
  )}InfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
export type ${(0, import_core2.pascal)(operationName)}InfiniteError = ${errorType}

${doc}export const ${(0, import_core2.camel)(
    `use-${operationName}-infinite`
  )} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrArguments({
    operationName,
    mutator,
    isRequestOptions,
    isInfinite: true,
    httpClient
  })}) => {
  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${enabledImplementation}
  ${swrKeyLoaderImplementation}
  const swrFn = () => ${operationName}(${httpFunctionProps}${httpFunctionProps && httpRequestSecondArg ? ", " : ""}${httpRequestSecondArg})

  const ${queryResultVarName} = useSWRInfinite<Awaited<ReturnType<typeof swrFn>>, TError>(swrKeyLoader, swrFn, ${swrOptions.swrInfiniteOptions ? `{
    ${(_a = (0, import_core2.stringify)(swrOptions.swrInfiniteOptions)) == null ? void 0 : _a.slice(1, -1)}
    ...swrOptions
  }` : "swrOptions"})

  return {
    swrKeyLoader,
    ...${queryResultVarName}
  }
}
` : "";
  const useSwrImplementation = `
export type ${(0, import_core2.pascal)(
    operationName
  )}QueryResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
export type ${(0, import_core2.pascal)(operationName)}QueryError = ${errorType}

${doc}export const ${(0, import_core2.camel)(`use-${operationName}`)} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrArguments({
    operationName,
    mutator,
    isRequestOptions,
    isInfinite: false,
    httpClient
  })}) => {
  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${enabledImplementation}
  ${swrKeyImplementation}
  const swrFn = () => ${operationName}(${httpFunctionProps}${httpFunctionProps && httpRequestSecondArg ? ", " : ""}${httpRequestSecondArg})

  const ${queryResultVarName} = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, ${swrOptions.swrOptions ? `{
    ${(_b = (0, import_core2.stringify)(swrOptions.swrOptions)) == null ? void 0 : _b.slice(1, -1)}
    ...swrOptions
  }` : "swrOptions"})

  return {
    swrKey,
    ...${queryResultVarName}
  }
}
`;
  return useSWRInfiniteImplementation + useSwrImplementation;
};
var generateSwrMutationImplementation = ({
  isRequestOptions,
  operationName,
  swrKeyFnName,
  swrMutationFetcherName,
  swrKeyProperties,
  swrMutationFetcherProperties,
  swrProps,
  props,
  response,
  mutator,
  swrOptions,
  doc,
  swrBodyType,
  httpClient
}) => {
  var _a;
  const hasParamReservedWord = props.some(
    (prop) => prop.name === "query"
  );
  const queryResultVarName = hasParamReservedWord ? "_query" : "query";
  const swrKeyImplementation = `const swrKey = swrOptions?.swrKey ?? ${swrKeyFnName}(${swrKeyProperties});`;
  const errorType = getSwrErrorType(response, httpClient, mutator);
  const swrRequestSecondArg = getSwrRequestSecondArg(httpClient, mutator);
  const httpRequestSecondArg = getHttpRequestSecondArg(httpClient, mutator);
  const useSwrImplementation = `
export type ${(0, import_core2.pascal)(
    operationName
  )}MutationResult = NonNullable<Awaited<ReturnType<typeof ${operationName}>>>
export type ${(0, import_core2.pascal)(operationName)}MutationError = ${errorType}

${doc}export const ${(0, import_core2.camel)(`use-${operationName}`)} = <TError = ${errorType}>(
  ${swrProps} ${generateSwrMutationArguments({
    operationName,
    isRequestOptions,
    mutator,
    swrBodyType,
    httpClient
  })}) => {

  ${isRequestOptions ? `const {swr: swrOptions${swrRequestSecondArg ? `, ${swrRequestSecondArg}` : ""}} = options ?? {}` : ""}

  ${swrKeyImplementation}
  const swrFn = ${swrMutationFetcherName}(${swrMutationFetcherProperties}${swrMutationFetcherProperties && httpRequestSecondArg ? ", " : ""}${httpRequestSecondArg});

  const ${queryResultVarName} = useSWRMutation(swrKey, swrFn, ${swrOptions.swrMutationOptions ? `{
    ${(_a = (0, import_core2.stringify)(swrOptions.swrMutationOptions)) == null ? void 0 : _a.slice(1, -1)}
    ...swrOptions
  }` : "swrOptions"})

  return {
    swrKey,
    ...${queryResultVarName}
  }
}
`;
  return useSwrImplementation;
};
var generateSwrHook = ({
  queryParams,
  operationName,
  body,
  props,
  verb,
  params,
  override,
  mutator,
  response,
  summary,
  deprecated
}, { route, context }) => {
  var _a, _b;
  const isRequestOptions = (override == null ? void 0 : override.requestOptions) !== false;
  const httpClient = context.output.httpClient;
  const doc = (0, import_core2.jsDoc)({ summary, deprecated });
  if (verb === import_core2.Verbs.GET) {
    const swrKeyProperties = props.filter((prop) => prop.type !== import_core2.GetterPropType.HEADER).map((param) => {
      if (param.type === import_core2.GetterPropType.NAMED_PATH_PARAMS)
        return param.destructured;
      return param.type === import_core2.GetterPropType.BODY ? body.implementation : param.name;
    }).join(",");
    const swrProperties = props.map((param) => {
      if (param.type === import_core2.GetterPropType.NAMED_PATH_PARAMS)
        return param.destructured;
      return param.type === import_core2.GetterPropType.BODY ? body.implementation : param.name;
    }).join(",");
    const queryKeyProps = (0, import_core2.toObjectString)(
      props.filter((prop) => prop.type !== import_core2.GetterPropType.HEADER),
      "implementation"
    );
    const swrKeyFnName = (0, import_core2.camel)(`get-${operationName}-key`);
    const swrKeyFn = `
export const ${swrKeyFnName} = (${queryKeyProps}) => [\`${route}\`${queryParams ? ", ...(params ? [params]: [])" : ""}] as const;
`;
    const swrKeyLoaderFnName = (0, import_core2.camel)(
      `get-${operationName}-infinite-key-loader`
    );
    const swrKeyLoader = override.swr.useInfinite ? `export const ${swrKeyLoaderFnName} = (${queryKeyProps}) => {
  return (_: number, previousPageData: Awaited<ReturnType<typeof ${operationName}>>) => {
    if (previousPageData && !previousPageData.data) return null

    return [\`${route}\`${queryParams ? ", ...(params ? [params]: [])" : ""}${body.implementation ? `, ${body.implementation}` : ""}] as const;
  }
}
` : "";
    const swrImplementation = generateSwrImplementation({
      operationName,
      swrKeyFnName,
      swrKeyLoaderFnName,
      swrProperties,
      swrKeyProperties,
      params,
      props,
      mutator,
      isRequestOptions,
      response,
      swrOptions: override.swr,
      doc,
      httpClient
    });
    return swrKeyFn + swrKeyLoader + swrImplementation;
  } else {
    const queryKeyProps = (0, import_core2.toObjectString)(
      props.filter(
        (prop) => prop.type === import_core2.GetterPropType.PARAM || prop.type === import_core2.GetterPropType.NAMED_PATH_PARAMS || prop.type === import_core2.GetterPropType.QUERY_PARAM
      ),
      "implementation"
    );
    const swrProps = (0, import_core2.toObjectString)(
      props.filter(
        (prop) => prop.type === import_core2.GetterPropType.PARAM || prop.type === import_core2.GetterPropType.QUERY_PARAM || prop.type === import_core2.GetterPropType.NAMED_PATH_PARAMS
      ),
      "implementation"
    );
    const swrMutationFetcherProperties = props.filter(
      (prop) => prop.type === import_core2.GetterPropType.PARAM || prop.type === import_core2.GetterPropType.QUERY_PARAM || prop.type === import_core2.GetterPropType.NAMED_PATH_PARAMS
    ).map((param) => {
      if (param.type === import_core2.GetterPropType.NAMED_PATH_PARAMS) {
        return param.destructured;
      } else {
        return param.name;
      }
    }).join(",");
    const httpFnProperties = props.filter((prop) => prop.type !== import_core2.GetterPropType.HEADER).map((prop) => {
      if (prop.type === import_core2.GetterPropType.NAMED_PATH_PARAMS) {
        return prop.destructured;
      } else if (prop.type === import_core2.GetterPropType.BODY) {
        return `arg`;
      } else {
        return prop.name;
      }
    }).join(", ");
    const swrKeyProperties = props.filter(
      (prop) => prop.type === import_core2.GetterPropType.PARAM || prop.type === import_core2.GetterPropType.NAMED_PATH_PARAMS || prop.type === import_core2.GetterPropType.QUERY_PARAM
    ).map((prop) => {
      if (prop.type === import_core2.GetterPropType.NAMED_PATH_PARAMS) {
        return prop.destructured;
      } else {
        return prop.name;
      }
    }).join(",");
    const swrKeyFnName = (0, import_core2.camel)(`get-${operationName}-mutation-key`);
    const swrMutationKeyFn = `export const ${swrKeyFnName} = (${queryKeyProps}) => [\`${route}\`${queryParams ? ", ...(params ? [params]: [])" : ""}] as const;
`;
    const swrMutationFetcherName = (0, import_core2.camel)(
      `get-${operationName}-mutation-fetcher`
    );
    const swrMutationFetcherType = getSwrMutationFetcherType(
      response,
      httpClient,
      override.fetch.includeHttpResponseReturnType,
      operationName,
      mutator
    );
    const swrMutationFetcherOptionType = getSwrMutationFetcherOptionType(
      httpClient,
      mutator
    );
    const swrMutationFetcherOptions = isRequestOptions && swrMutationFetcherOptionType ? `options${context.output.optionsParamRequired ? "" : "?"}: ${swrMutationFetcherOptionType}` : "";
    const swrMutationFetcherArg = props.some(
      (prop) => prop.type === import_core2.GetterPropType.BODY
    ) ? "{ arg }" : "__";
    const swrBodyType = (_b = (_a = props.find((prop) => prop.type === import_core2.GetterPropType.BODY)) == null ? void 0 : _a.implementation.split(": ")[1]) != null ? _b : "Arguments";
    const swrMutationFetcherFn = `
export const ${swrMutationFetcherName} = (${swrProps} ${swrMutationFetcherOptions}) => {
  return (_: Key, ${swrMutationFetcherArg}: { arg: ${swrBodyType} }): ${swrMutationFetcherType} => {
    return ${operationName}(${httpFnProperties}${swrMutationFetcherOptions.length ? (httpFnProperties.length ? ", " : "") + "options" : ""});
  }
}
`;
    const swrImplementation = generateSwrMutationImplementation({
      operationName,
      swrKeyFnName,
      swrMutationFetcherName,
      swrKeyProperties,
      swrMutationFetcherProperties,
      swrProps,
      props,
      isRequestOptions,
      response,
      mutator,
      swrOptions: override.swr,
      doc,
      swrBodyType,
      httpClient: context.output.httpClient
    });
    return swrMutationFetcherFn + swrMutationKeyFn + swrImplementation;
  }
};
var generateSwrHeader = ({
  isRequestOptions,
  isMutator,
  hasAwaitedType
}) => `
  ${!hasAwaitedType ? `type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

` : ""}
  ${isRequestOptions && isMutator ? `type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

` : ""}`;
var generateSwr = (verbOptions, options) => {
  const imports = (0, import_core2.generateVerbImports)(verbOptions);
  const functionImplementation = generateSwrRequestFunction(
    verbOptions,
    options
  );
  const hookImplementation = generateSwrHook(verbOptions, options);
  return {
    implementation: `${functionImplementation}

${hookImplementation}`,
    imports
  };
};
var swrClientBuilder = {
  client: generateSwr,
  header: generateSwrHeader,
  dependencies: getSwrDependencies
};
var builder = () => () => swrClientBuilder;
var src_default = builder;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  generateSwr,
  generateSwrHeader,
  getSwrDependencies
});
//# sourceMappingURL=index.js.map