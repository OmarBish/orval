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
  DEFAULT_MOCK_OPTIONS: () => DEFAULT_MOCK_OPTIONS,
  generateMock: () => generateMock,
  generateMockImports: () => generateMockImports
});
module.exports = __toCommonJS(src_exports);

// src/msw/index.ts
var import_core7 = require("@orval/core");

// src/delay.ts
var getDelay = (override, options) => {
  var _a, _b, _c, _d;
  const overrideDelay = ((_a = override == null ? void 0 : override.mock) == null ? void 0 : _a.delay) !== void 0 ? (_b = override == null ? void 0 : override.mock) == null ? void 0 : _b.delay : options == null ? void 0 : options.delay;
  const delayFunctionLazyExecute = (_d = (_c = override == null ? void 0 : override.mock) == null ? void 0 : _c.delayFunctionLazyExecute) != null ? _d : options == null ? void 0 : options.delayFunctionLazyExecute;
  switch (typeof overrideDelay) {
    case "function":
      return delayFunctionLazyExecute ? overrideDelay : overrideDelay();
    case "number":
    case "boolean":
      return overrideDelay;
    default:
      return 1e3;
  }
};

// src/faker/getters/combine.ts
var import_core4 = require("@orval/core");
var import_lodash2 = __toESM(require("lodash.omit"));

// src/faker/resolvers/value.ts
var import_core3 = require("@orval/core");
var import_lodash = __toESM(require("lodash.get"));

// src/faker/getters/scalar.ts
var import_core2 = require("@orval/core");

// src/faker/constants.ts
var DEFAULT_FORMAT_MOCK = {
  bic: "faker.finance.bic()",
  binary: "new Blob(faker.helpers.arrayElements(faker.word.words(10).split(' ')))",
  city: "faker.location.city()",
  country: "faker.location.country()",
  date: "faker.date.past().toISOString().split('T')[0]",
  "date-time": "`${faker.date.past().toISOString().split('.')[0]}Z`",
  double: "faker.number.float()",
  email: "faker.internet.email()",
  firstName: "faker.person.firstName()",
  float: "faker.number.float()",
  gender: "faker.person.gender()",
  iban: "faker.finance.iban()",
  ipv4: "faker.internet.ipv4()",
  ipv6: "faker.internet.ipv6()",
  jobTitle: "faker.person.jobTitle()",
  lastName: "faker.person.lastName()",
  password: "faker.internet.password()",
  phoneNumber: "faker.phone.number()",
  streetName: "faker.location.street()",
  uri: "faker.internet.url()",
  url: "faker.internet.url()",
  userName: "faker.internet.userName()",
  uuid: "faker.string.uuid()",
  zipCode: "faker.location.zipCode()"
};
var DEFAULT_OBJECT_KEY_MOCK = "faker.string.alphanumeric(5)";

// src/faker/getters/object.ts
var import_core = require("@orval/core");
var overrideVarName = "overrideResponse";
var getMockObject = ({
  item,
  mockOptions,
  operationId,
  tags,
  combine,
  context,
  imports,
  existingReferencedProperties,
  splitMockImplementations,
  allowOverride = false
}) => {
  if ((0, import_core.isReference)(item)) {
    return resolveMockValue({
      schema: {
        ...item,
        name: item.name,
        path: item.path ? `${item.path}.${item.name}` : item.name
      },
      mockOptions,
      operationId,
      tags,
      context,
      imports,
      existingReferencedProperties,
      splitMockImplementations
    });
  }
  if (item.allOf || item.oneOf || item.anyOf) {
    const separator = item.allOf ? "allOf" : item.oneOf ? "oneOf" : "anyOf";
    return combineSchemasMock({
      item,
      separator,
      mockOptions,
      operationId,
      tags,
      combine,
      context,
      imports,
      existingReferencedProperties,
      splitMockImplementations
    });
  }
  if (Array.isArray(item.type)) {
    return combineSchemasMock({
      item: {
        anyOf: item.type.map((type) => ({ type })),
        name: item.name
      },
      separator: "anyOf",
      mockOptions,
      operationId,
      tags,
      combine,
      context,
      imports,
      existingReferencedProperties
    });
  }
  if (item.properties) {
    let value = !combine || (combine == null ? void 0 : combine.separator) === "oneOf" || (combine == null ? void 0 : combine.separator) === "anyOf" ? "{" : "";
    let imports2 = [];
    let includedProperties = [];
    const properyScalars = Object.entries(item.properties).sort((a, b) => {
      return a[0].localeCompare(b[0]);
    }).map(([key, prop]) => {
      if (combine == null ? void 0 : combine.includedProperties.includes(key)) {
        return void 0;
      }
      const isRequired = (mockOptions == null ? void 0 : mockOptions.required) || (Array.isArray(item.required) ? item.required : []).includes(key);
      if ("$ref" in prop && existingReferencedProperties.includes(
        (0, import_core.pascal)(prop.$ref.split("/").pop())
      )) {
        return void 0;
      }
      const resolvedValue = resolveMockValue({
        schema: {
          ...prop,
          name: key,
          path: item.path ? `${item.path}.${key}` : `#.${key}`
        },
        mockOptions,
        operationId,
        tags,
        context,
        imports: imports2,
        existingReferencedProperties,
        splitMockImplementations
      });
      imports2.push(...resolvedValue.imports);
      includedProperties.push(key);
      const keyDefinition = (0, import_core.getKey)(key);
      if (!isRequired && !resolvedValue.overrided) {
        return `${keyDefinition}: faker.helpers.arrayElement([${resolvedValue.value}, undefined])`;
      }
      return `${keyDefinition}: ${resolvedValue.value}`;
    }).filter(Boolean);
    if (allowOverride) {
      properyScalars.push(`...${overrideVarName}`);
    }
    value += properyScalars.join(", ");
    value += !combine || (combine == null ? void 0 : combine.separator) === "oneOf" || (combine == null ? void 0 : combine.separator) === "anyOf" ? "}" : "";
    return {
      value,
      imports: imports2,
      name: item.name,
      includedProperties
    };
  }
  if (item.additionalProperties) {
    if ((0, import_core.isBoolean)(item.additionalProperties)) {
      return { value: `{}`, imports: [], name: item.name };
    }
    if ((0, import_core.isReference)(item.additionalProperties) && existingReferencedProperties.includes(
      item.additionalProperties.$ref.split("/").pop()
    )) {
      return { value: `{}`, imports: [], name: item.name };
    }
    const resolvedValue = resolveMockValue({
      schema: {
        ...item.additionalProperties,
        name: item.name,
        path: item.path ? `${item.path}.#` : "#"
      },
      mockOptions,
      operationId,
      tags,
      context,
      imports,
      existingReferencedProperties,
      splitMockImplementations
    });
    return {
      ...resolvedValue,
      value: `{
        [${DEFAULT_OBJECT_KEY_MOCK}]: ${resolvedValue.value}
      }`
    };
  }
  return { value: "{}", imports: [], name: item.name };
};

// src/faker/getters/scalar.ts
var getMockScalar = ({
  item,
  imports,
  mockOptions,
  operationId,
  tags,
  combine,
  context,
  existingReferencedProperties,
  splitMockImplementations,
  allowOverride = false
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (item.isRef) {
    existingReferencedProperties = [...existingReferencedProperties, item.name];
  }
  const operationProperty = resolveMockOverride(
    (_b = (_a = mockOptions == null ? void 0 : mockOptions.operations) == null ? void 0 : _a[operationId]) == null ? void 0 : _b.properties,
    item
  );
  if (operationProperty) {
    return operationProperty;
  }
  const overrideTag = Object.entries((_c = mockOptions == null ? void 0 : mockOptions.tags) != null ? _c : {}).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  }).reduce(
    (acc, [tag, options]) => tags.includes(tag) ? (0, import_core2.mergeDeep)(acc, options) : acc,
    {}
  );
  const tagProperty = resolveMockOverride(overrideTag == null ? void 0 : overrideTag.properties, item);
  if (tagProperty) {
    return tagProperty;
  }
  const property = resolveMockOverride(mockOptions == null ? void 0 : mockOptions.properties, item);
  if (property) {
    return property;
  }
  if ((((_e = (_d = context.output.override) == null ? void 0 : _d.mock) == null ? void 0 : _e.useExamples) || (mockOptions == null ? void 0 : mockOptions.useExamples)) && item.example) {
    return {
      value: JSON.stringify(item.example),
      imports: [],
      name: item.name,
      overrided: true
    };
  }
  const ALL_FORMAT = {
    ...DEFAULT_FORMAT_MOCK,
    ...(_f = mockOptions == null ? void 0 : mockOptions.format) != null ? _f : {}
  };
  if (item.format && (item.format === "int64" || ALL_FORMAT[item.format])) {
    let value = ALL_FORMAT[item.format];
    const dateFormats = ["date", "date-time"];
    if (dateFormats.includes(item.format) && context.output.override.useDates) {
      value = `new Date(${value})`;
    }
    if (item.format === "int64") {
      value = context.output.override.useBigInt ? `faker.number.bigInt({min: ${item.minimum}, max: ${item.maximum}})` : `faker.number.int({min: ${item.minimum}, max: ${item.maximum}})`;
    }
    return {
      value: getNullable(value, item.nullable),
      imports: [],
      name: item.name,
      overrided: false
    };
  }
  const type = getItemType(item);
  switch (type) {
    case "number":
    case "integer": {
      let value = getNullable(
        `faker.number.int({min: ${item.minimum}, max: ${item.maximum}})`,
        item.nullable
      );
      let numberImports = [];
      if (item.enum) {
        const joinedEnumValues = item.enum.filter(Boolean).join(",");
        let enumValue = `[${joinedEnumValues}] as const`;
        if (item.isRef) {
          enumValue = `Object.values(${item.name})`;
          numberImports = [
            {
              name: item.name,
              values: true,
              ...!(0, import_core2.isRootKey)(context.specKey, context.target) ? { specKey: context.specKey } : {}
            }
          ];
        }
        value = ((_g = item.path) == null ? void 0 : _g.endsWith("[]")) ? `faker.helpers.arrayElements(${enumValue})` : `faker.helpers.arrayElement(${enumValue})`;
      }
      return {
        value,
        imports: numberImports,
        name: item.name
      };
    }
    case "boolean": {
      return {
        value: "faker.datatype.boolean()",
        imports: [],
        name: item.name
      };
    }
    case "array": {
      if (!item.items) {
        return { value: "[]", imports: [], name: item.name };
      }
      if ("$ref" in item.items && existingReferencedProperties.includes(
        (0, import_core2.pascal)(item.items.$ref.split("/").pop())
      )) {
        return { value: "[]", imports: [], name: item.name };
      }
      const {
        value,
        enums,
        imports: resolvedImports,
        name
      } = resolveMockValue({
        schema: {
          ...item.items,
          name: item.name,
          path: item.path ? `${item.path}.[]` : "#.[]"
        },
        combine,
        mockOptions,
        operationId,
        tags,
        context,
        imports,
        existingReferencedProperties,
        splitMockImplementations
      });
      if (enums) {
        if (!(0, import_core2.isReference)(item.items)) {
          return {
            value,
            imports: resolvedImports,
            name: item.name
          };
        }
        const enumImp = imports.find(
          (imp) => name.replace("[]", "") === imp.name
        );
        const enumValue = (enumImp == null ? void 0 : enumImp.name) || name;
        return {
          value: `faker.helpers.arrayElements(Object.values(${enumValue}))`,
          imports: enumImp ? [
            ...resolvedImports,
            {
              ...enumImp,
              values: true,
              ...!(0, import_core2.isRootKey)(context.specKey, context.target) ? { specKey: context.specKey } : {}
            }
          ] : resolvedImports,
          name: item.name
        };
      }
      let mapValue = value;
      if (combine && !value.startsWith("faker") && !value.startsWith("{")) {
        mapValue = `{${value}}`;
      }
      return {
        value: `Array.from({ length: faker.number.int({ min: ${mockOptions == null ? void 0 : mockOptions.arrayMin}, max: ${mockOptions == null ? void 0 : mockOptions.arrayMax} }) }, (_, i) => i + 1).map(() => (${mapValue}))`,
        imports: resolvedImports,
        name: item.name
      };
    }
    case "string": {
      let value = "faker.string.alpha(20)";
      let imports2 = [];
      if (item.enum) {
        const joindEnumValues = item.enum.filter(Boolean).map((e) => (0, import_core2.escape)(e)).join("','");
        let enumValue = `['${joindEnumValues}'] as const`;
        if (item.isRef) {
          enumValue = `Object.values(${item.name})`;
          imports2 = [
            {
              name: item.name,
              values: true,
              ...!(0, import_core2.isRootKey)(context.specKey, context.target) ? { specKey: context.specKey } : {}
            }
          ];
        }
        value = ((_h = item.path) == null ? void 0 : _h.endsWith("[]")) ? `faker.helpers.arrayElements(${enumValue})` : `faker.helpers.arrayElement(${enumValue})`;
      } else if (item.pattern) {
        value = `faker.helpers.fromRegExp('${item.pattern}')`;
      }
      return {
        value: getNullable(value, item.nullable),
        enums: item.enum,
        name: item.name,
        imports: imports2
      };
    }
    case "null":
      return {
        value: "null",
        imports: [],
        name: item.name
      };
    default: {
      return getMockObject({
        item,
        mockOptions,
        operationId,
        tags,
        combine,
        context,
        imports,
        existingReferencedProperties,
        splitMockImplementations,
        allowOverride
      });
    }
  }
};
function getItemType(item) {
  if (item.type) return item.type;
  if (!item.enum) return;
  const uniqTypes = new Set(item.enum.map((value) => typeof value));
  if (uniqTypes.size > 1) return;
  const type = Array.from(uniqTypes.values()).at(0);
  if (!type) return;
  return ["string", "number"].includes(type) ? type : void 0;
}

// src/faker/resolvers/value.ts
var isRegex = (key) => key[0] === "/" && key[key.length - 1] === "/";
var resolveMockOverride = (properties = {}, item) => {
  const path = item.path ? item.path : `#.${item.name}`;
  const property = Object.entries(properties).find(([key]) => {
    if (isRegex(key)) {
      const regex = new RegExp(key.slice(1, key.length - 1));
      if (regex.test(item.name) || regex.test(path)) {
        return true;
      }
    }
    if (`#.${key}` === path) {
      return true;
    }
    return false;
  });
  if (!property) {
    return;
  }
  return {
    value: getNullable(property[1], item.nullable),
    imports: [],
    name: item.name,
    overrided: true
  };
};
var getNullable = (value, nullable) => nullable ? `faker.helpers.arrayElement([${value}, null])` : value;
var resolveMockValue = ({
  schema,
  mockOptions,
  operationId,
  tags,
  combine,
  context,
  imports,
  existingReferencedProperties,
  splitMockImplementations,
  allowOverride
}) => {
  var _a;
  if ((0, import_core3.isReference)(schema)) {
    const {
      originalName,
      specKey = context.specKey,
      refPaths
    } = (0, import_core3.getRefInfo)(schema.$ref, context);
    const schemaRef = (0, import_lodash.default)(context.specs[specKey], refPaths);
    const newSchema = {
      ...schemaRef,
      name: (0, import_core3.pascal)(originalName),
      path: schema.path,
      isRef: true
    };
    const newSeparator = newSchema.allOf ? "allOf" : newSchema.oneOf ? "oneOf" : "anyOf";
    const scalar2 = getMockScalar({
      item: newSchema,
      mockOptions,
      operationId,
      tags,
      combine: combine ? {
        separator: combine.separator === "anyOf" ? newSeparator : combine.separator,
        includedProperties: newSeparator === "allOf" ? [] : combine.includedProperties
      } : void 0,
      context: {
        ...context,
        specKey
      },
      imports,
      existingReferencedProperties,
      splitMockImplementations,
      allowOverride
    });
    if (scalar2.value && (newSchema.type === "object" || newSchema.allOf) && (combine == null ? void 0 : combine.separator) === "oneOf") {
      const funcName = `get${(0, import_core3.pascal)(operationId)}Response${(0, import_core3.pascal)(newSchema.name)}Mock`;
      if (!(splitMockImplementations == null ? void 0 : splitMockImplementations.some(
        (f) => f.includes(`export const ${funcName}`)
      ))) {
        const discriminatedProperty = (_a = newSchema.discriminator) == null ? void 0 : _a.propertyName;
        let type = `Partial<${newSchema.name}>`;
        if (discriminatedProperty) {
          type = `Omit<${type}, '${discriminatedProperty}'>`;
        }
        const args = `${overrideVarName}: ${type} = {}`;
        const value = newSchema.oneOf ? `faker.helpers.arrayElement([${scalar2.value}])` : scalar2.value;
        const func = `export const ${funcName} = (${args}): ${newSchema.name} => ({...${value}, ...${overrideVarName}});`;
        splitMockImplementations == null ? void 0 : splitMockImplementations.push(func);
      }
      if (newSchema.nullable) {
        scalar2.value = `${funcName}()`;
      } else {
        scalar2.value = `{...${funcName}()}`;
      }
      scalar2.imports.push({
        name: newSchema.name,
        specKey: (0, import_core3.isRootKey)(specKey, context.target) ? void 0 : specKey
      });
    }
    if (scalar2.value && newSchema.allOf && (combine == null ? void 0 : combine.separator) === "anyOf") {
      scalar2.value = `{${scalar2.value}}`;
    }
    return {
      ...scalar2,
      type: newSchema.type
    };
  }
  const scalar = getMockScalar({
    item: schema,
    mockOptions,
    operationId,
    tags,
    combine,
    context,
    imports,
    existingReferencedProperties,
    splitMockImplementations,
    allowOverride
  });
  return {
    ...scalar,
    type: schema.type
  };
};

// src/faker/getters/combine.ts
var combineSchemasMock = ({
  item,
  separator,
  mockOptions,
  operationId,
  tags,
  combine,
  context,
  imports,
  existingReferencedProperties,
  splitMockImplementations
}) => {
  var _a, _b, _c, _d;
  let combineImports = [];
  let includedProperties = ((_a = combine == null ? void 0 : combine.includedProperties) != null ? _a : []).slice(
    0
  );
  const isRefAndNotExisting = (0, import_core4.isReference)(item) && !existingReferencedProperties.includes(item.name);
  const itemResolvedValue = isRefAndNotExisting || item.properties ? resolveMockValue({
    schema: (0, import_lodash2.default)(item, separator),
    combine: {
      separator: "allOf",
      includedProperties: []
    },
    mockOptions,
    operationId,
    tags,
    context,
    imports,
    existingReferencedProperties,
    splitMockImplementations
  }) : void 0;
  includedProperties.push(...(_b = itemResolvedValue == null ? void 0 : itemResolvedValue.includedProperties) != null ? _b : []);
  combineImports.push(...(_c = itemResolvedValue == null ? void 0 : itemResolvedValue.imports) != null ? _c : []);
  const value = ((_d = item[separator]) != null ? _d : []).reduce((acc, val, index, arr) => {
    var _a2, _b2;
    if ("$ref" in val && existingReferencedProperties.includes((0, import_core4.pascal)(val.$ref.split("/").pop()))) {
      if (arr.length === 1) {
        return "undefined";
      }
      return acc;
    }
    if (separator === "allOf" && item.required) {
      if ((0, import_core4.isSchema)(val) && val.required) {
        val = { ...val, required: [...item.required, ...val.required] };
      } else {
        val = { ...val, required: item.required };
      }
    }
    const resolvedValue = resolveMockValue({
      schema: {
        ...val,
        name: item.name,
        path: item.path ? item.path : "#"
      },
      combine: {
        separator,
        includedProperties: separator !== "oneOf" ? includedProperties : (_a2 = itemResolvedValue == null ? void 0 : itemResolvedValue.includedProperties) != null ? _a2 : []
      },
      mockOptions,
      operationId,
      tags,
      context,
      imports,
      existingReferencedProperties,
      splitMockImplementations
    });
    combineImports.push(...resolvedValue.imports);
    includedProperties.push(...(_b2 = resolvedValue.includedProperties) != null ? _b2 : []);
    const isLastElement = index === arr.length - 1;
    let currentValue = resolvedValue.value;
    if ((itemResolvedValue == null ? void 0 : itemResolvedValue.value) && separator === "oneOf") {
      const splitValues = resolvedValue.value.split("},{");
      const joined = splitValues.join(`,${itemResolvedValue.value}},{`);
      currentValue = `${joined.slice(0, -1)},${itemResolvedValue.value}}`;
    }
    if ((itemResolvedValue == null ? void 0 : itemResolvedValue.value) && separator !== "oneOf" && isLastElement) {
      currentValue = `${currentValue ? `${currentValue},` : ""}${itemResolvedValue.value}`;
    }
    if (resolvedValue.type === void 0 && currentValue && separator === "allOf") {
      currentValue = `...${currentValue}`;
    }
    const isObjectBounds = !combine || ["oneOf", "anyOf"].includes(combine.separator) && separator === "allOf";
    if (!index && isObjectBounds) {
      if (resolvedValue.enums || separator === "oneOf" || separator === "anyOf" || resolvedValue.type === "array") {
        if (arr.length === 1) {
          return `faker.helpers.arrayElement([${currentValue}])`;
        }
        return `faker.helpers.arrayElement([${currentValue},`;
      }
      if (arr.length === 1) {
        if (resolvedValue.type && resolvedValue.type !== "object") {
          return currentValue;
        }
        return `{${currentValue}}`;
      }
      return `{${currentValue},`;
    }
    if (isLastElement) {
      if (resolvedValue.enums || separator === "oneOf" || separator === "anyOf" || resolvedValue.type === "array") {
        return `${acc}${currentValue}${!combine ? "])" : ""}`;
      }
      if (currentValue === "{}") {
        currentValue = "";
        if (acc.toString().endsWith(",")) {
          acc = acc.toString().slice(0, -1);
        }
      }
      return `${acc}${currentValue}${isObjectBounds ? "}" : ""}`;
    }
    if (currentValue === "{}") {
      currentValue = "";
      if (acc.toString().endsWith(",")) {
        acc = acc.toString().slice(0, -1);
      }
    }
    if (!currentValue) {
      return acc;
    }
    return `${acc}${currentValue},`;
  }, "");
  return {
    value,
    imports: combineImports,
    name: item.name,
    includedProperties
  };
};

// src/faker/getters/route.ts
var import_core5 = require("@orval/core");
var hasParam = (path) => /[^{]*{[\w*_-]*}.*/.test(path);
var getRoutePath = (path) => {
  const matches = path.match(/([^{]*){?([\w*_-]*)}?(.*)/);
  if (!(matches == null ? void 0 : matches.length)) return path;
  const prev = matches[1];
  const param = (0, import_core5.sanitize)((0, import_core5.camel)(matches[2]), {
    es5keyword: true,
    underscore: true,
    dash: true,
    dot: true
  });
  const next = hasParam(matches[3]) ? getRoutePath(matches[3]) : matches[3];
  if (hasParam(path)) {
    return `${prev}:${param}${next}`;
  } else {
    return `${prev}${param}${next}`;
  }
};
var getRouteMSW = (route, baseUrl = "*") => {
  const splittedRoute = route.split("/");
  return splittedRoute.reduce((acc, path, i) => {
    if (!path && !i) {
      return acc;
    }
    if (!path.includes("{")) {
      return `${acc}/${path}`;
    }
    return `${acc}/${getRoutePath(path)}`;
  }, baseUrl);
};

// src/msw/mocks.ts
var import_core6 = require("@orval/core");
var getMockPropertiesWithoutFunc = (properties, spec) => Object.entries((0, import_core6.isFunction)(properties) ? properties(spec) : properties).reduce((acc, [key, value]) => {
  const implementation = (0, import_core6.isFunction)(value) ? `(${value})()` : (0, import_core6.stringify)(value);
  acc[key] = implementation == null ? void 0 : implementation.replace(
    /import_faker.defaults|import_faker.faker/g,
    "faker"
  );
  return acc;
}, {});
var getMockWithoutFunc = (spec, override) => {
  var _a, _b, _c, _d, _e;
  return {
    arrayMin: (_a = override == null ? void 0 : override.mock) == null ? void 0 : _a.arrayMin,
    arrayMax: (_b = override == null ? void 0 : override.mock) == null ? void 0 : _b.arrayMax,
    required: (_c = override == null ? void 0 : override.mock) == null ? void 0 : _c.required,
    ...((_d = override == null ? void 0 : override.mock) == null ? void 0 : _d.properties) ? {
      properties: getMockPropertiesWithoutFunc(
        override.mock.properties,
        spec
      )
    } : {},
    ...((_e = override == null ? void 0 : override.mock) == null ? void 0 : _e.format) ? {
      format: getMockPropertiesWithoutFunc(override.mock.format, spec)
    } : {},
    ...(override == null ? void 0 : override.operations) ? {
      operations: Object.entries(override.operations).reduce((acc, [key, value]) => {
        var _a2;
        if ((_a2 = value.mock) == null ? void 0 : _a2.properties) {
          acc[key] = {
            properties: getMockPropertiesWithoutFunc(
              value.mock.properties,
              spec
            )
          };
        }
        return acc;
      }, {})
    } : {},
    ...(override == null ? void 0 : override.tags) ? {
      tags: Object.entries(override.tags).reduce((acc, [key, value]) => {
        var _a2;
        if ((_a2 = value.mock) == null ? void 0 : _a2.properties) {
          acc[key] = {
            properties: getMockPropertiesWithoutFunc(
              value.mock.properties,
              spec
            )
          };
        }
        return acc;
      }, {})
    } : {}
  };
};
var getMockScalarJsTypes = (definition, mockOptionsWithoutFunc) => {
  const isArray = definition.endsWith("[]");
  const type = isArray ? definition.slice(0, -2) : definition;
  switch (type) {
    case "number":
      return isArray ? `Array.from({length: faker.number.int({min: ${mockOptionsWithoutFunc.arrayMin}, max: ${mockOptionsWithoutFunc.arrayMax}})}, () => faker.number.int())` : "faker.number.int()";
    case "string":
      return isArray ? `Array.from({length: faker.number.int({min: ${mockOptionsWithoutFunc == null ? void 0 : mockOptionsWithoutFunc.arrayMin},max: ${mockOptionsWithoutFunc == null ? void 0 : mockOptionsWithoutFunc.arrayMax}})}, () => faker.word.sample())` : "faker.word.sample()";
    default:
      return "undefined";
  }
};
var getResponsesMockDefinition = ({
  operationId,
  tags,
  returnType,
  responses,
  imports: responseImports,
  mockOptionsWithoutFunc,
  transformer,
  context,
  mockOptions,
  splitMockImplementations
}) => {
  return responses.reduce(
    (acc, { value: definition, originalSchema, example, examples, imports, isRef }) => {
      var _a, _b, _c, _d, _e, _f;
      if (((_b = (_a = context.output.override) == null ? void 0 : _a.mock) == null ? void 0 : _b.useExamples) || (mockOptions == null ? void 0 : mockOptions.useExamples)) {
        let exampleValue = example || (originalSchema == null ? void 0 : originalSchema.example) || Object.values(examples || {})[0] || ((_c = originalSchema == null ? void 0 : originalSchema.examples) == null ? void 0 : _c[0]);
        exampleValue = (_d = exampleValue == null ? void 0 : exampleValue.value) != null ? _d : exampleValue;
        if (exampleValue) {
          acc.definitions.push(
            transformer ? transformer(exampleValue, returnType) : JSON.stringify(exampleValue)
          );
          return acc;
        }
      }
      if (!definition || import_core6.generalJSTypesWithArray.includes(definition)) {
        const value = getMockScalarJsTypes(definition, mockOptionsWithoutFunc);
        acc.definitions.push(
          transformer ? transformer(value, returnType) : value
        );
        return acc;
      }
      if (!originalSchema) {
        return acc;
      }
      const resolvedRef = (0, import_core6.resolveRef)(originalSchema, context);
      const scalar = getMockScalar({
        item: {
          name: definition,
          ...resolvedRef.schema
        },
        imports,
        mockOptions: mockOptionsWithoutFunc,
        operationId,
        tags,
        context: isRef ? {
          ...context,
          specKey: (_f = (_e = responseImports[0]) == null ? void 0 : _e.specKey) != null ? _f : context.specKey
        } : context,
        existingReferencedProperties: [],
        splitMockImplementations,
        allowOverride: true
      });
      acc.imports.push(...scalar.imports);
      acc.definitions.push(
        transformer ? transformer(scalar.value, returnType) : scalar.value.toString()
      );
      return acc;
    },
    {
      definitions: [],
      imports: []
    }
  );
};
var getMockDefinition = ({
  operationId,
  tags,
  returnType,
  responses,
  imports: responseImports,
  override,
  transformer,
  context,
  mockOptions,
  splitMockImplementations
}) => {
  const mockOptionsWithoutFunc = getMockWithoutFunc(
    context.specs[context.specKey],
    override
  );
  const { definitions, imports } = getResponsesMockDefinition({
    operationId,
    tags,
    returnType,
    responses,
    imports: responseImports,
    mockOptionsWithoutFunc,
    transformer,
    context,
    mockOptions,
    splitMockImplementations
  });
  return {
    definition: "[" + definitions.join(", ") + "]",
    definitions,
    imports
  };
};
var getMockOptionsDataOverride = (operationId, override) => {
  var _a, _b, _c;
  const responseOverride = (_c = (_b = (_a = override == null ? void 0 : override.operations) == null ? void 0 : _a[operationId]) == null ? void 0 : _b.mock) == null ? void 0 : _c.data;
  const implementation = (0, import_core6.isFunction)(responseOverride) ? `(${responseOverride})()` : (0, import_core6.stringify)(responseOverride);
  return implementation == null ? void 0 : implementation.replace(
    /import_faker.defaults|import_faker.faker/g,
    "faker"
  );
};

// src/msw/index.ts
var getMSWDependencies = (options) => {
  const hasDelay = (options == null ? void 0 : options.delay) !== false;
  const locale = options == null ? void 0 : options.locale;
  const exports2 = [
    { name: "http", values: true },
    { name: "HttpResponse", values: true }
  ];
  if (hasDelay) {
    exports2.push({ name: "delay", values: true });
  }
  return [
    {
      exports: exports2,
      dependency: "msw"
    },
    {
      exports: [{ name: "faker", values: true }],
      dependency: locale ? `@faker-js/faker/locale/${locale}` : "@faker-js/faker"
    }
  ];
};
var generateMSWImports = ({
  implementation,
  imports,
  specsName,
  hasSchemaDir,
  isAllowSyntheticDefaultImports,
  options
}) => {
  return (0, import_core7.generateDependencyImports)(
    implementation,
    [...getMSWDependencies(options), ...imports],
    specsName,
    hasSchemaDir,
    isAllowSyntheticDefaultImports
  );
};
var generateDefinition = (name, route, getResponseMockFunctionNameBase, handlerNameBase, { operationId, response, verb, tags }, { override, context, mock }, returnType, status, responseImports, responses, contentTypes, splitMockImplementations) => {
  const oldSplitMockImplementations = [...splitMockImplementations];
  const { definitions, definition, imports } = getMockDefinition({
    operationId,
    tags,
    returnType,
    responses,
    imports: responseImports,
    override,
    context,
    mockOptions: !(0, import_core7.isFunction)(mock) ? mock : void 0,
    splitMockImplementations
  });
  const mockData = getMockOptionsDataOverride(operationId, override);
  let value = "";
  if (mockData) {
    value = mockData;
  } else if (definitions.length > 1) {
    value = `faker.helpers.arrayElement(${definition})`;
  } else if (definitions[0]) {
    value = definitions[0];
  }
  const isResponseOverridable = value.includes(overrideVarName);
  const isTextPlain = contentTypes.includes("text/plain");
  const isReturnHttpResponse = value && value !== "undefined";
  const getResponseMockFunctionName = `${getResponseMockFunctionNameBase}${(0, import_core7.pascal)(
    name
  )}`;
  const handlerName = `${handlerNameBase}${(0, import_core7.pascal)(name)}`;
  const addedSplitMockImplementations = splitMockImplementations.slice(
    oldSplitMockImplementations.length
  );
  splitMockImplementations.push(...addedSplitMockImplementations);
  const mockImplementations = addedSplitMockImplementations.length ? `${addedSplitMockImplementations.join("\n\n")}

` : "";
  const mockImplementation = isReturnHttpResponse ? `${mockImplementations}export const ${getResponseMockFunctionName} = (${isResponseOverridable ? `overrideResponse: Partial< ${returnType} > = {}` : ""})${mockData ? "" : `: ${returnType}`} => (${value})

` : mockImplementations;
  const delay = getDelay(override, !(0, import_core7.isFunction)(mock) ? mock : void 0);
  const infoParam = "info";
  const handlerImplementation = `
export const ${handlerName} = (overrideResponse?: ${returnType} | ((${infoParam}: Parameters<Parameters<typeof http.${verb}>[1]>[0]) => Promise<${returnType}> | ${returnType})) => {
  return http.${verb}('${route}', async (${infoParam}) => {${delay !== false ? `await delay(${(0, import_core7.isFunction)(delay) ? `(${delay})()` : delay});` : ""}
  ${isReturnHttpResponse ? "" : `if (typeof overrideResponse === 'function') {await overrideResponse(info); }`}
    return new HttpResponse(${isReturnHttpResponse ? isTextPlain ? `${getResponseMockFunctionName}()` : `JSON.stringify(overrideResponse !== undefined 
            ? (typeof overrideResponse === "function" ? await overrideResponse(${infoParam}) : overrideResponse) 
            : ${getResponseMockFunctionName}())` : null},
      { status: ${status === "default" ? 200 : status.replace(/XX$/, "00")},
        ${isReturnHttpResponse ? `headers: { 'Content-Type': ${isTextPlain ? "'text/plain'" : "'application/json'"} }` : ""}
      })
  })
}
`;
  const includeResponseImports = isReturnHttpResponse && !isTextPlain ? [
    ...imports,
    ...response.imports.filter((r) => {
      const reg = new RegExp(`\\b${r.name}\\b`);
      return reg.test(handlerImplementation) || reg.test(mockImplementation);
    })
  ] : imports;
  return {
    implementation: {
      function: mockImplementation,
      handlerName,
      handler: handlerImplementation
    },
    imports: includeResponseImports
  };
};
var generateMSW = (generatorVerbOptions, generatorOptions) => {
  var _a, _b, _c, _d;
  const { pathRoute, override, mock } = generatorOptions;
  const { operationId, response } = generatorVerbOptions;
  const route = getRouteMSW(
    pathRoute,
    (_b = (_a = override == null ? void 0 : override.mock) == null ? void 0 : _a.baseUrl) != null ? _b : !(0, import_core7.isFunction)(mock) ? mock == null ? void 0 : mock.baseUrl : void 0
  );
  const handlerName = `get${(0, import_core7.pascal)(operationId)}MockHandler`;
  const getResponseMockFunctionName = `get${(0, import_core7.pascal)(operationId)}ResponseMock`;
  const splitMockImplementations = [];
  const baseDefinition = generateDefinition(
    "",
    route,
    getResponseMockFunctionName,
    handlerName,
    generatorVerbOptions,
    generatorOptions,
    response.definition.success,
    (_d = (_c = response.types.success[0]) == null ? void 0 : _c.key) != null ? _d : "200",
    response.imports,
    response.types.success,
    response.contentTypes,
    splitMockImplementations
  );
  const mockImplementations = [baseDefinition.implementation.function];
  const handlerImplementations = [baseDefinition.implementation.handler];
  const imports = [...baseDefinition.imports];
  if (generatorOptions.mock && (0, import_core7.isObject)(generatorOptions.mock) && generatorOptions.mock.generateEachHttpStatus) {
    [...response.types.success, ...response.types.errors].forEach(
      (statusResponse) => {
        const definition = generateDefinition(
          statusResponse.key,
          route,
          getResponseMockFunctionName,
          handlerName,
          generatorVerbOptions,
          generatorOptions,
          statusResponse.value,
          statusResponse.key,
          response.imports,
          [statusResponse],
          [statusResponse.contentType],
          splitMockImplementations
        );
        mockImplementations.push(definition.implementation.function);
        handlerImplementations.push(definition.implementation.handler);
        imports.push(...definition.imports);
      }
    );
  }
  return {
    implementation: {
      function: mockImplementations.join("\n"),
      handlerName,
      handler: handlerImplementations.join("\n")
    },
    imports
  };
};

// src/index.ts
var DEFAULT_MOCK_OPTIONS = {
  type: "msw",
  useExamples: false
};
var generateMockImports = (importOptions) => {
  var _a;
  switch ((_a = importOptions.options) == null ? void 0 : _a.type) {
    default:
      return generateMSWImports(importOptions);
  }
};
var generateMock = (generatorVerbOptions, generatorOptions) => {
  switch (generatorOptions.mock.type) {
    default:
      return generateMSW(generatorVerbOptions, generatorOptions);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_MOCK_OPTIONS,
  generateMock,
  generateMockImports
});
//# sourceMappingURL=index.js.map