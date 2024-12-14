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
  fetchResponseTypeName: () => fetchResponseTypeName,
  generateClient: () => generateClient,
  generateRequestFunction: () => generateRequestFunction
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@orval/core");
var generateRequestFunction = ({
  queryParams,
  operationName,
  response,
  mutator,
  body,
  props,
  verb,
  formData,
  formUrlEncoded,
  override
}, { route, context, pathRoute }) => {
  var _a, _b, _c;
  const isRequestOptions = (override == null ? void 0 : override.requestOptions) !== false;
  const isFormData = (override == null ? void 0 : override.formData) !== false;
  const isFormUrlEncoded = (override == null ? void 0 : override.formUrlEncoded) !== false;
  const getUrlFnName = (0, import_core.camel)(`get-${operationName}-url`);
  const getUrlFnProps = (0, import_core.toObjectString)(
    props.filter(
      (prop) => prop.type === import_core.GetterPropType.PARAM || prop.type === import_core.GetterPropType.NAMED_PATH_PARAMS || prop.type === import_core.GetterPropType.QUERY_PARAM
    ),
    "implementation"
  );
  const spec = context.specs[context.specKey].paths[pathRoute];
  const parameters = ((_a = spec == null ? void 0 : spec[verb]) == null ? void 0 : _a.parameters) || [];
  const explodeParameters = parameters.filter((parameter) => {
    const { schema } = (0, import_core.resolveRef)(parameter, context);
    return schema.in === "query" && schema.explode;
  });
  const explodeParametersNames = explodeParameters.map((parameter) => {
    const { schema } = (0, import_core.resolveRef)(parameter, context);
    return schema.name;
  });
  const explodeArrayImplementation = explodeParameters.length > 0 ? `const explodeParameters = ${JSON.stringify(explodeParametersNames)};
      
    if (value instanceof Array && explodeParameters.includes(key)) {
      value.forEach((v) => normalizedParams.append(key, v === null ? 'null' : v.toString()));
      return;
    }
      ` : "";
  const isExplodeParametersOnly = explodeParameters.length === parameters.length;
  const nomalParamsImplementation = `if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }`;
  const getUrlFnImplementation = `export const ${getUrlFnName} = (${getUrlFnProps}) => {
${queryParams ? `  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    ${explodeArrayImplementation}
    ${!isExplodeParametersOnly ? nomalParamsImplementation : ""}
  });` : ""}

  ${queryParams ? `return normalizedParams.size ? \`${route}${"?${normalizedParams.toString()}"}\` : \`${route}\`` : `return \`${route}\``}
}
`;
  const responseTypeName = fetchResponseTypeName(
    override.fetch.includeHttpResponseReturnType,
    response.definition.success,
    operationName
  );
  const responseTypeImplementation = override.fetch.includeHttpResponseReturnType ? `export type ${responseTypeName} = {
  data: ${response.definition.success || "unknown"};
  status: number;
  headers: Headers;
}

` : "";
  const getUrlFnProperties = props.filter(
    (prop) => prop.type === import_core.GetterPropType.PARAM || prop.type === import_core.GetterPropType.QUERY_PARAM || prop.type === import_core.GetterPropType.NAMED_PATH_PARAMS
  ).map((param) => {
    if (param.type === import_core.GetterPropType.NAMED_PATH_PARAMS) {
      return param.destructured;
    } else {
      return param.name;
    }
  }).join(",");
  const args = `${(0, import_core.toObjectString)(props, "implementation")} ${isRequestOptions ? `options?: RequestInit` : ""}`;
  const retrunType = `Promise<${responseTypeName}>`;
  const globalFetchOptions = (0, import_core.isObject)(override == null ? void 0 : override.requestOptions) ? `${(_c = (_b = (0, import_core.stringify)(override == null ? void 0 : override.requestOptions)) == null ? void 0 : _b.slice(1, -1)) == null ? void 0 : _c.trim()}` : "";
  const fetchMethodOption = `method: '${verb.toUpperCase()}'`;
  const ignoreContentTypes = ["multipart/form-data"];
  const fetchHeadersOption = body.contentType && !ignoreContentTypes.includes(body.contentType) ? `headers: { 'Content-Type': '${body.contentType}', ...options?.headers }` : "";
  const requestBodyParams = (0, import_core.generateBodyOptions)(
    body,
    isFormData,
    isFormUrlEncoded
  );
  const fetchBodyOption = requestBodyParams ? isFormData && body.formData || isFormUrlEncoded && body.formUrlEncoded ? `body: ${requestBodyParams}` : `body: JSON.stringify(${requestBodyParams})` : "";
  const fetchFnOptions = `${getUrlFnName}(${getUrlFnProperties}),
  {${globalFetchOptions ? "\n" : ""}      ${globalFetchOptions}
    ${isRequestOptions ? "...options," : ""}
    ${fetchMethodOption}${fetchHeadersOption ? "," : ""}
    ${fetchHeadersOption}${fetchBodyOption ? "," : ""}
    ${fetchBodyOption}
  }
`;
  const fetchResponseImplementation = `const res = await fetch(${fetchFnOptions}
  )
  const data = await res.json()

  ${override.fetch.includeHttpResponseReturnType ? "return { status: res.status, data, headers: res.headers }" : `return data as ${responseTypeName}`}
`;
  const customFetchResponseImplementation = `return ${mutator == null ? void 0 : mutator.name}<${retrunType}>(${fetchFnOptions});`;
  const bodyForm = (0, import_core.generateFormDataAndUrlEncodedFunction)({
    formData,
    formUrlEncoded,
    body,
    isFormData,
    isFormUrlEncoded
  });
  const fetchImplementationBody = mutator ? customFetchResponseImplementation : fetchResponseImplementation;
  const fetchImplementation = `export const ${operationName} = async (${args}): ${retrunType} => {
  ${bodyForm ? `  ${bodyForm}` : ""}
  ${fetchImplementationBody}}
`;
  const implementation = `${responseTypeImplementation}${getUrlFnImplementation}
${fetchImplementation}
`;
  return implementation;
};
var fetchResponseTypeName = (includeHttpResponseReturnType, definitionSuccessResponse, operationName) => {
  return includeHttpResponseReturnType ? `${operationName}Response` : definitionSuccessResponse;
};
var generateClient = (verbOptions, options) => {
  const imports = (0, import_core.generateVerbImports)(verbOptions);
  const functionImplementation = generateRequestFunction(verbOptions, options);
  return {
    implementation: `${functionImplementation}
`,
    imports
  };
};
var fetchClientBuilder = {
  client: generateClient,
  dependencies: () => []
};
var builder = () => () => fetchClientBuilder;
var src_default = builder;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  fetchResponseTypeName,
  generateClient,
  generateRequestFunction
});
//# sourceMappingURL=index.js.map