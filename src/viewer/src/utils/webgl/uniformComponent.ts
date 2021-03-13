//import { createMatrix3 } from "./../../components/inputMatrix";
import { assertNever } from "./../typeGuards";
import { UniformInfo, UniformType } from "./uniform";
import { CompositeKeyMap } from "../compositeKeyMap";
import { uuidv4 } from "../../../../common/uuid";
import { Observable } from "../observable";

type CacheKey = {
  name: string;
  type: UniformType;
};

type CacheValue = {
  uniformInfo: UniformInfo;
};

const keySelector = (key: CacheKey): string => `${key.name};${key.type}`;
const uniformComponentCache = new CompositeKeyMap<CacheKey, CacheValue>(keySelector);

const rebuildCache = (newValues: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newValues.map(v => keySelector(v.key));
  const componentsToRemove = uniformComponentCache
    .entriesStrKey()
    .filter(e => !newValuesStrKeys.includes(e[0]));

  componentsToRemove.forEach(c => {
    uniformComponentCache.deleteStrKey(c[0]);
  });

  newValues.forEach(nw => {
    if (!uniformComponentCache.has(nw.key)) uniformComponentCache.set(nw.key, nw.value);
  });
};

const getDefaultValue = (type: UniformType) => {
  switch (type) {
    case UniformType.FLOAT_VEC2:
      return [1, 1];
    case UniformType.FLOAT_VEC3:
      return [1, 1, 1];
    case UniformType.FLOAT_VEC4:
      return [1, 1, 1, 1];
    case UniformType.FLOAT_MAT4:
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    default:
      assertNever(type);
  }
};

export type UniformBinding = {
  name: string;
  type: UniformType;
  value: Observable<any>;
};

export const createUniformComponents = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  uniforms: { name: string; type: UniformType }[],
  uniformBindings: UniformBinding[]
) => {
  const components = uniforms.map(uniform => {
    const key = {
      ...uniform,
    };

    const fromCache = uniformComponentCache.get(key);

    if (fromCache) {
      fromCache.uniformInfo.attachToProgram(program);
      return { key, value: fromCache };
    } else {
      const uniformInfo = new UniformInfo(context, program, uniform.name, uniform.type);

      const applicableBindings = uniformBindings.filter(
        b => b.type === uniformInfo.getUniformType()
      );

      const updateUniform = (value: any) => uniformInfo.setValue(value);

      return {
        key,
        value: {
          uniformInfo,
          dispose: () => {},
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(uc => uc.value);
};

// const createCustomOption = (uniformInfo: UniformInfo) => {
//   return {
//     id: "custom",
//     display: "Custom",
//     ...createObservableElement(
//       value => createElementForType(uniformInfo.getUniformType(), true, value),
//       getDefaultValue(uniformInfo.getUniformType())
//     ),
//   };
// };

// const createBindingOptions = (uniformBindings: UniformBinding[], uniformInfo: UniformInfo) => {
//   return uniformBindings.map(binding => {
//     const element = createElementForType(uniformInfo.getUniformType(), false, binding.value);

//     return {
//       id: uuidv4(),
//       element,
//       display: binding.name,
//       value: binding.value,
//     };
//   });
// };

// const createElementForType = (
//   uniformType: UniformType,
//   readonly: boolean,
//   value: Observable<any>
// ) => {
//   switch (uniformType) {
//     case UniformType.FLOAT_VEC2:
//       return createElementVector(2, value, readonly);
//     case UniformType.FLOAT_VEC3:
//       return createElementVector(3, value, readonly);
//     case UniformType.FLOAT_VEC4:
//       return createElementVector(4, value, readonly);
//     case UniformType.FLOAT_MAT4:
//       return createElementMatrix(4, value, readonly);
//     default:
//       return createElementNotSupported();
//   }
// };
