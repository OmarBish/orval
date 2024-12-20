"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  builder: () => builder,
  default: () => src_default,
  generateZod: () => generateZod,
  generateZodValidationSchemaDefinition: () => generateZodValidationSchemaDefinition,
  getZodDependencies: () => getZodDependencies,
  parseZodValidationSchemaDefinition: () => parseZodValidationSchemaDefinition
});
module.exports = __toCommonJS(src_exports);
var import_core = require("@orval/core");
var import_lodash = __toESM(require("lodash.uniq"));
var ZOD_DEPENDENCIES = [
  {
    exports: [
      {
        name: "z",
        alias: "zod",
        values: true
      }
    ],
    dependency: "zod"
  }
];
var getZodDependencies = () => ZOD_DEPENDENCIES;
var possibleSchemaTypes = [
  "integer",
  "number",
  "string",
  "boolean",
  "object",
  "null",
  "array"
];
var resolveZodType = (schema) => {
  const schemaTypeValue = schema.type;
  const type = Array.isArray(schemaTypeValue) ? schemaTypeValue.find((t) => possibleSchemaTypes.includes(t)) : schemaTypeValue;
  if (schema.type === "array" && "prefixItems" in schema) {
    return "tuple";
  }
  switch (type) {
    case "integer":
      return "number";
    default:
      return type != null ? type : "any";
  }
};
var constsUniqueCounter = {};
var COERCIBLE_TYPES = ["string", "number", "boolean", "bigint", "date"];
var minAndMaxTypes = ["number", "string", "array"];
var removeReadOnlyProperties = (schema) => {
  if (schema.properties) {
    return {
      ...schema,
      properties: Object.entries(schema.properties).reduce((acc, [key, value]) => {
        if ("readOnly" in value && value.readOnly) return acc;
        acc[key] = value;
        return acc;
      }, {})
    };
  }
  if (schema.items && "properties" in schema.items) {
    return {
      ...schema,
      items: removeReadOnlyProperties(schema.items)
    };
  }
  return schema;
};
var generateZodValidationSchemaDefinition = (schema, context, name, strict, rules) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  if (!schema) return { functions: [], consts: [] };
  const consts = [];
  const constsCounter = typeof constsUniqueCounter[name] === "number" ? constsUniqueCounter[name] + 1 : 0;
  const constsCounterValue = constsCounter ? (0, import_core.pascal)((0, import_core.getNumberWord)(constsCounter)) : "";
  constsUniqueCounter[name] = constsCounter;
  const functions = [];
  const type = resolveZodType(schema);
  const required = schema.default !== void 0 ? false : (_a = rules == null ? void 0 : rules.required) != null ? _a : false;
  const nullable = (_b = schema.nullable) != null ? _b : Array.isArray(schema.type) && schema.type.includes("null");
  const min = (_d = (_c = schema.minimum) != null ? _c : schema.minLength) != null ? _d : schema.minItems;
  const max = (_f = (_e = schema.maximum) != null ? _e : schema.maxLength) != null ? _f : schema.maxItems;
  const matches = (_g = schema.pattern) != null ? _g : void 0;
  switch (type) {
    case "tuple":
      if ("prefixItems" in schema) {
        const schema31 = schema;
        if (schema31.prefixItems && schema31.prefixItems.length > 0) {
          functions.push([
            "tuple",
            schema31.prefixItems.map(
              (item, idx) => generateZodValidationSchemaDefinition(
                deference(item, context),
                context,
                (0, import_core.camel)(`${name}-${idx}-item`),
                strict,
                {
                  required: true
                }
              )
            )
          ]);
          if (schema.items) {
            if ((max || Number.POSITIVE_INFINITY) > schema31.prefixItems.length) {
              functions.push([
                "rest",
                generateZodValidationSchemaDefinition(
                  schema.items,
                  context,
                  (0, import_core.camel)(`${name}-item`),
                  strict,
                  {
                    required: true
                  }
                )
              ]);
            }
          }
        }
      }
      break;
    case "array":
      const items = schema.items;
      functions.push([
        "array",
        generateZodValidationSchemaDefinition(
          items,
          context,
          (0, import_core.camel)(`${name}-item`),
          strict,
          {
            required: true
          }
        )
      ]);
      break;
    case "string": {
      if (schema.enum && type === "string") {
        break;
      }
      if (context.output.override.useDates && (schema.format === "date" || schema.format === "date-time")) {
        functions.push(["date", void 0]);
        break;
      }
      functions.push([type, void 0]);
      if (schema.format === "date") {
        functions.push(["date", void 0]);
        break;
      }
      if (schema.format === "date-time") {
        functions.push(["datetime", void 0]);
        break;
      }
      if (schema.format === "email") {
        functions.push(["email", void 0]);
        break;
      }
      if (schema.format === "uri" || schema.format === "hostname") {
        functions.push(["url", void 0]);
        break;
      }
      if (schema.format === "uuid") {
        functions.push(["uuid", void 0]);
        break;
      }
      break;
    }
    case "object":
    default: {
      if (schema.allOf || schema.oneOf || schema.anyOf) {
        const separator = schema.allOf ? "allOf" : schema.oneOf ? "oneOf" : "anyOf";
        const schemas = (_i = (_h = schema.allOf) != null ? _h : schema.oneOf) != null ? _i : schema.anyOf;
        functions.push([
          separator,
          schemas.map(
            (schema2) => generateZodValidationSchemaDefinition(
              schema2,
              context,
              (0, import_core.camel)(name),
              strict,
              {
                required: true
              }
            )
          )
        ]);
        break;
      }
      if (schema.properties) {
        functions.push([
          "object",
          Object.keys(schema.properties).map((key) => {
            var _a2, _b2;
            return {
              [key]: generateZodValidationSchemaDefinition(
                (_a2 = schema.properties) == null ? void 0 : _a2[key],
                context,
                (0, import_core.camel)(`${name}-${key}`),
                strict,
                {
                  required: (_b2 = schema.required) == null ? void 0 : _b2.includes(key)
                }
              )
            };
          }).reduce((acc, curr) => ({ ...acc, ...curr }), {})
        ]);
        if (strict) {
          functions.push(["strict", void 0]);
        }
        break;
      }
      if (schema.additionalProperties) {
        functions.push([
          "additionalProperties",
          generateZodValidationSchemaDefinition(
            (0, import_core.isBoolean)(schema.additionalProperties) ? {} : schema.additionalProperties,
            context,
            name,
            strict,
            {
              required: true
            }
          )
        ]);
        break;
      }
      functions.push([type, void 0]);
      break;
    }
  }
  if (minAndMaxTypes.includes(type)) {
    if (min !== void 0) {
      if (min === 1) {
        functions.push(["min", `${min}`]);
      } else {
        consts.push(`export const ${name}Min${constsCounterValue} = ${min};
`);
        functions.push(["min", `${name}Min${constsCounterValue}`]);
      }
    }
    if (max !== void 0) {
      consts.push(`export const ${name}Max${constsCounterValue} = ${max};
`);
      functions.push(["max", `${name}Max${constsCounterValue}`]);
    }
  }
  if (matches) {
    const isStartWithSlash = matches.startsWith("/");
    const isEndWithSlash = matches.endsWith("/");
    const regexp = `new RegExp('${(0, import_core.jsStringEscape)(
      matches.slice(isStartWithSlash ? 1 : 0, isEndWithSlash ? -1 : void 0)
    )}')`;
    consts.push(
      `export const ${name}RegExp${constsCounterValue} = ${regexp};
`
    );
    functions.push(["regex", `${name}RegExp${constsCounterValue}`]);
  }
  if (schema.enum && type !== "number") {
    functions.push([
      "enum",
      [
        `[${schema.enum.map((value) => (0, import_core.isString)(value) ? `'${(0, import_core.escape)(value)}'` : `${value}`).join(", ")}]`
      ]
    ]);
  }
  if (!required && nullable) {
    functions.push(["nullish", void 0]);
  } else if (nullable) {
    functions.push(["nullable", void 0]);
  } else if (!required) {
    functions.push(["optional", void 0]);
  }
  return { functions, consts: (0, import_lodash.default)(consts) };
};
var parseZodValidationSchemaDefinition = (input, context, coerceTypes = false, preprocessResponse) => {
  if (!input.functions.length) {
    return { zod: "", consts: "" };
  }
  let consts = "";
  const parseProperty = (property) => {
    const [fn, args = ""] = property;
    if (fn === "allOf") {
      return args.reduce(
        (acc, { functions }) => {
          const value2 = functions.map(parseProperty).join("");
          const valueWithZod = `${value2.startsWith(".") ? "zod" : ""}${value2}`;
          if (!acc) {
            acc += valueWithZod;
            return acc;
          }
          acc += `.and(${valueWithZod})`;
          return acc;
        },
        ""
      );
    }
    if (fn === "oneOf" || fn === "anyOf") {
      return args.reduce(
        (acc, {
          functions,
          consts: argConsts
        }) => {
          const value2 = functions.map(parseProperty).join("");
          const valueWithZod = `${value2.startsWith(".") ? "zod" : ""}${value2}`;
          if (argConsts.length) {
            consts += argConsts.join("");
          }
          if (!acc) {
            acc += valueWithZod;
            return acc;
          }
          acc += `.or(${valueWithZod})`;
          return acc;
        },
        ""
      );
    }
    if (fn === "additionalProperties") {
      const value2 = args.functions.map(parseProperty).join("");
      const valueWithZod = `${value2.startsWith(".") ? "zod" : ""}${value2}`;
      consts += args.consts;
      return `zod.record(zod.string(), ${valueWithZod})`;
    }
    if (fn === "object") {
      return `zod.object({
${Object.entries(args).map(([key, schema2]) => {
        const value2 = schema2.functions.map(parseProperty).join("");
        consts += schema2.consts.join("\n");
        return `  "${key}": ${value2.startsWith(".") ? "zod" : ""}${value2}`;
      }).join(",\n")}
})`;
    }
    if (fn === "array") {
      const value2 = args.functions.map(parseProperty).join("");
      if (typeof args.consts === "string") {
        consts += args.consts;
      } else if (Array.isArray(args.consts)) {
        consts += args.consts.join("\n");
      }
      return `.array(${value2.startsWith(".") ? "zod" : ""}${value2})`;
    }
    if (fn === "strict") {
      return ".strict()";
    }
    if (fn === "tuple") {
      return `zod.tuple([${args.map((x) => "zod" + x.functions.map(parseProperty).join(",")).join(",\n")}])`;
    }
    if (fn === "rest") {
      return `.rest(zod${args.functions.map(parseProperty)})`;
    }
    const shouldCoerceType = coerceTypes && (Array.isArray(coerceTypes) ? coerceTypes.includes(fn) : COERCIBLE_TYPES.includes(fn));
    if (fn !== "date" && shouldCoerceType || fn === "date" && shouldCoerceType && context.output.override.useDates) {
      return `.coerce.${fn}(${args})`;
    }
    return `.${fn}(${args})`;
  };
  consts += input.consts.join("\n");
  const schema = input.functions.map(parseProperty).join("");
  const value = preprocessResponse ? `.preprocess(${preprocessResponse.name}, ${schema.startsWith(".") ? "zod" : ""}${schema})` : schema;
  const zod = `${value.startsWith(".") ? "zod" : ""}${value}`;
  return { zod, consts };
};
var deferenceScalar = (value, context) => {
  if ((0, import_core.isObject)(value)) {
    return deference(value, context);
  } else if (Array.isArray(value)) {
    return value.map((item) => deferenceScalar(item, context));
  } else {
    return value;
  }
};
var deference = (schema, context) => {
  var _a;
  const refName = "$ref" in schema ? schema.$ref : void 0;
  if (refName && ((_a = context.parents) == null ? void 0 : _a.includes(refName))) {
    return {};
  }
  const childContext = {
    ...context,
    ...refName ? { parents: [...context.parents || [], refName] } : void 0
  };
  const { schema: resolvedSchema } = (0, import_core.resolveRef)(
    schema,
    childContext
  );
  return Object.entries(resolvedSchema).reduce((acc, [key, value]) => {
    acc[key] = deferenceScalar(value, childContext);
    return acc;
  }, {});
};
var parseBodyAndResponse = ({
  data,
  context,
  name,
  strict,
  generate,
  parseType
}) => {
  var _a, _b, _c, _d, _e, _f;
  if (!data || !generate) {
    return {
      input: { functions: [], consts: [] },
      isArray: false
    };
  }
  const resolvedRef = (0, import_core.resolveRef)(
    data,
    context
  ).schema;
  if (!((_b = (_a = resolvedRef.content) == null ? void 0 : _a["application/json"]) == null ? void 0 : _b.schema)) {
    return {
      input: { functions: [], consts: [] },
      isArray: false
    };
  }
  const resolvedJsonSchema = deference(
    resolvedRef.content["application/json"].schema,
    context
  );
  if (resolvedJsonSchema.items) {
    const min = (_d = (_c = resolvedJsonSchema.minimum) != null ? _c : resolvedJsonSchema.minLength) != null ? _d : resolvedJsonSchema.minItems;
    const max = (_f = (_e = resolvedJsonSchema.maximum) != null ? _e : resolvedJsonSchema.maxLength) != null ? _f : resolvedJsonSchema.maxItems;
    return {
      input: generateZodValidationSchemaDefinition(
        parseType === "body" ? removeReadOnlyProperties(resolvedJsonSchema.items) : resolvedJsonSchema.items,
        context,
        name,
        strict,
        {
          required: true
        }
      ),
      isArray: true,
      rules: {
        ...typeof min !== "undefined" ? { min } : {},
        ...typeof max !== "undefined" ? { max } : {}
      }
    };
  }
  return {
    input: generateZodValidationSchemaDefinition(
      parseType === "body" ? removeReadOnlyProperties(resolvedJsonSchema) : resolvedJsonSchema,
      context,
      name,
      strict,
      {
        required: true
      }
    ),
    isArray: false
  };
};
var parseParameters = ({
  data,
  context,
  operationName,
  strict,
  generate
}) => {
  if (!data) {
    return {
      headers: {
        functions: [],
        consts: []
      },
      queryParams: {
        functions: [],
        consts: []
      },
      params: {
        functions: [],
        consts: []
      }
    };
  }
  const defintionsByParameters = data.reduce(
    (acc, val) => {
      var _a;
      const { schema: parameter } = (0, import_core.resolveRef)(val, context);
      if (!parameter.schema) {
        return acc;
      }
      const schema = deference(parameter.schema, context);
      const mapStrict = {
        path: strict.param,
        query: strict.query,
        header: strict.header
      };
      const mapGenerate = {
        path: generate.param,
        query: generate.query,
        header: generate.header
      };
      const definition = generateZodValidationSchemaDefinition(
        schema,
        context,
        (0, import_core.camel)(`${operationName}-${parameter.in}-${parameter.name}`),
        (_a = mapStrict[parameter.in]) != null ? _a : false,
        {
          required: parameter.required
        }
      );
      if (parameter.in === "header" && mapGenerate.header) {
        return {
          ...acc,
          headers: { ...acc.headers, [parameter.name]: definition }
        };
      }
      if (parameter.in === "query" && mapGenerate.query) {
        return {
          ...acc,
          queryParams: { ...acc.queryParams, [parameter.name]: definition }
        };
      }
      if (parameter.in === "path" && mapGenerate.path) {
        return {
          ...acc,
          params: { ...acc.params, [parameter.name]: definition }
        };
      }
      return acc;
    },
    {
      headers: {},
      queryParams: {},
      params: {}
    }
  );
  const headers = {
    functions: [],
    consts: []
  };
  if (Object.keys(defintionsByParameters.headers).length) {
    headers.functions.push(["object", defintionsByParameters.headers]);
    if (strict.header) {
      headers.functions.push(["strict", void 0]);
    }
  }
  const queryParams = {
    functions: [],
    consts: []
  };
  if (Object.keys(defintionsByParameters.queryParams).length) {
    queryParams.functions.push(["object", defintionsByParameters.queryParams]);
    if (strict.query) {
      queryParams.functions.push(["strict", void 0]);
    }
  }
  const params = {
    functions: [],
    consts: []
  };
  if (Object.keys(defintionsByParameters.params).length) {
    params.functions.push(["object", defintionsByParameters.params]);
    if (strict.param) {
      params.functions.push(["strict", void 0]);
    }
  }
  return {
    headers,
    queryParams,
    params
  };
};
var generateZodRoute = async ({ operationName, verb, override }, { pathRoute, context, output }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const spec = context.specs[context.specKey].paths[pathRoute];
  const parameters = (_a = spec == null ? void 0 : spec[verb]) == null ? void 0 : _a.parameters;
  const parsedParameters = parseParameters({
    data: parameters,
    context,
    operationName,
    strict: override.zod.strict,
    generate: override.zod.generate
  });
  const requestBody = (_b = spec == null ? void 0 : spec[verb]) == null ? void 0 : _b.requestBody;
  const parsedBody = parseBodyAndResponse({
    data: requestBody,
    context,
    name: (0, import_core.camel)(`${operationName}-body`),
    strict: override.zod.strict.body,
    generate: override.zod.generate.body,
    parseType: "body"
  });
  const responses = context.output.override.zod.generateEachHttpStatus ? Object.entries((_d = (_c = spec == null ? void 0 : spec[verb]) == null ? void 0 : _c.responses) != null ? _d : {}) : [["", (_e = spec == null ? void 0 : spec[verb]) == null ? void 0 : _e.responses[200]]];
  const parsedResponses = responses.map(
    ([code, response]) => parseBodyAndResponse({
      data: response,
      context,
      name: (0, import_core.camel)(`${operationName}-${code}-response`),
      strict: override.zod.strict.response,
      generate: override.zod.generate.response,
      parseType: "response"
    })
  );
  const inputParams = parseZodValidationSchemaDefinition(
    parsedParameters.params,
    context,
    override.zod.coerce.param
  );
  if (override.coerceTypes) {
    console.warn(
      "override.coerceTypes is deprecated, please use override.zod.coerce instead."
    );
  }
  const inputQueryParams = parseZodValidationSchemaDefinition(
    parsedParameters.queryParams,
    context,
    (_f = override.zod.coerce.query) != null ? _f : override.coerceTypes
  );
  const inputHeaders = parseZodValidationSchemaDefinition(
    parsedParameters.headers,
    context,
    override.zod.coerce.header
  );
  const inputBody = parseZodValidationSchemaDefinition(
    parsedBody.input,
    context,
    override.zod.coerce.body
  );
  const preprocessResponse = ((_g = override.zod.preprocess) == null ? void 0 : _g.response) ? await (0, import_core.generateMutator)({
    output,
    mutator: override.zod.preprocess.response,
    name: `${operationName}PreprocessResponse`,
    workspace: context.workspace,
    tsconfig: context.output.tsconfig
  }) : void 0;
  const inputResponses = parsedResponses.map(
    (parsedResponse) => parseZodValidationSchemaDefinition(
      parsedResponse.input,
      context,
      override.zod.coerce.response,
      preprocessResponse
    )
  );
  if (!inputParams.zod && !inputQueryParams.zod && !inputHeaders.zod && !inputBody.zod && !inputResponses.some((inputResponse) => inputResponse.zod)) {
    return {
      implemtation: "",
      mutators: []
    };
  }
  return {
    implementation: [
      ...inputParams.consts ? [inputParams.consts] : [],
      ...inputParams.zod ? [`export const ${operationName}Params = ${inputParams.zod}`] : [],
      ...inputQueryParams.consts ? [inputQueryParams.consts] : [],
      ...inputQueryParams.zod ? [`export const ${operationName}QueryParams = ${inputQueryParams.zod}`] : [],
      ...inputHeaders.consts ? [inputHeaders.consts] : [],
      ...inputHeaders.zod ? [`export const ${operationName}Header = ${inputHeaders.zod}`] : [],
      ...inputBody.consts ? [inputBody.consts] : [],
      ...inputBody.zod ? [
        parsedBody.isArray ? `export const ${operationName}BodyItem = ${inputBody.zod}
export const ${operationName}Body = zod.array(${operationName}BodyItem)${((_h = parsedBody.rules) == null ? void 0 : _h.min) ? `.min(${(_i = parsedBody.rules) == null ? void 0 : _i.min})` : ""}${((_j = parsedBody.rules) == null ? void 0 : _j.max) ? `.max(${(_k = parsedBody.rules) == null ? void 0 : _k.max})` : ""}` : `export const ${operationName}Body = ${inputBody.zod}`
      ] : [],
      ...inputResponses.map((inputResponse, index) => {
        var _a2, _b2, _c2, _d2;
        const operationResponse = (0, import_core.camel)(
          `${operationName}-${responses[index][0]}-response`
        );
        return [
          ...inputResponse.consts ? [inputResponse.consts] : [],
          ...inputResponse.zod ? [
            parsedResponses[index].isArray ? `export const ${operationResponse}Item = ${inputResponse.zod}
export const ${operationResponse} = zod.array(${operationResponse}Item)${((_a2 = parsedResponses[index].rules) == null ? void 0 : _a2.min) ? `.min(${(_b2 = parsedResponses[index].rules) == null ? void 0 : _b2.min})` : ""}${((_c2 = parsedResponses[index].rules) == null ? void 0 : _c2.max) ? `.max(${(_d2 = parsedResponses[index].rules) == null ? void 0 : _d2.max})` : ""}` : `export const ${operationResponse} = ${inputResponse.zod}`
          ] : []
        ];
      }).flat()
    ].join("\n\n"),
    mutators: preprocessResponse ? [preprocessResponse] : []
  };
};
var generateZod = async (verbOptions, options) => {
  const { implementation, mutators } = await generateZodRoute(
    verbOptions,
    options
  );
  return {
    implementation: implementation ? `${implementation}

` : "",
    imports: [],
    mutators
  };
};
var zodClientBuilder = {
  client: generateZod,
  dependencies: getZodDependencies
};
var builder = () => () => zodClientBuilder;
var src_default = builder;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  builder,
  generateZod,
  generateZodValidationSchemaDefinition,
  getZodDependencies,
  parseZodValidationSchemaDefinition
});
//# sourceMappingURL=index.js.map