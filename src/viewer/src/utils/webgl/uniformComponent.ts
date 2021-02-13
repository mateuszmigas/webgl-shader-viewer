import { createVector } from "../../components/inputVector";
import { createElementsDropdown } from "../../components/dropdown";
import { UniformInfo, UniformType } from "./uniform";
import { CompositeKeyMap } from "../compositeKeyMap";
import { createDiv, withLabel } from "../../components/wrappers";
import { uuidv4 } from "../../../../common/uuid";
import { Observable } from "../observable";

type CacheKey = {
  name: string;
  type: UniformType;
};

type CacheValue = {
  component: HTMLElement;
  uniformInfo: UniformInfo;
};

const keySelector = (key: CacheKey): string => `${key.name};${key.type}`;
const uniformComponentCache = new CompositeKeyMap<CacheKey, CacheValue>(
  keySelector
);

const rebuildCache = (newValues: { key: CacheKey; value: CacheValue }[]) => {
  const newValuesStrKeys = newValues.map(v => keySelector(v.key));
  const componentsToRemove = uniformComponentCache
    .entriesStrKey()
    .filter(e => !newValuesStrKeys.includes(e[0]));

  componentsToRemove.forEach(c => {
    uniformComponentCache.deleteStrKey(c[0]);
  });

  newValues.forEach(nw => {
    if (!uniformComponentCache.has(nw.key))
      uniformComponentCache.set(nw.key, nw.value);
  });
};

const getDefaultValue = (type: UniformType) => {
  if (type === UniformType.FLOAT_VEC4) {
    return [1, 0, 0, 1];
  }
  if (type === UniformType.FLOAT_VEC3) {
    return [1, 0, 0];
  }
  return [1, 0];
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
      const uniformInfo = new UniformInfo(
        context,
        program,
        uniform.name,
        uniform.type
      );

      const applicableBindings = uniformBindings.filter(
        b => b.type === uniformInfo.getUniformType()
      );

      const updateUniform = (value: any) => uniformInfo.setValue(value);

      const { element, dispose } = applicableBindings.length
        ? createSelectionComponent(
            [
              createCustomOption(uniformInfo),
              ...createBindingOptions(applicableBindings, uniformInfo),
            ],
            updateUniform
          )
        : createEditableComponent(uniformInfo, updateUniform);

      return {
        key,
        value: {
          component: withLabel(element, uniform.name),
          uniformInfo,
          dispose: () => {
            dispose?.();
          },
        },
      };
    }
  });

  rebuildCache(components);
  return components.map(uc => uc.value);
};

const createCustomOption = (uniformInfo: UniformInfo) => {
  return {
    id: "custom",
    display: "Custom",
    ...createEditableComponent(uniformInfo),
  };
};

const createBindingOptions = (
  uniformBindings: UniformBinding[],
  uniformInfo: UniformInfo
) => {
  return uniformBindings.map(binding => {
    const element = createElementForType(
      uniformInfo.getUniformType(),
      false,
      binding.value
    );

    return {
      id: uuidv4(),
      element,
      display: binding.name,
      value: binding.value,
    };
  });
};

const createSelectionComponent = (
  options: {
    id: string;
    display: string;
    value: Observable<any>;
    element: HTMLElement;
  }[],
  onChange: (value: any) => void
) => {
  let detach: () => void = null;
  const element = createDiv("column-with-gap", [
    createElementsDropdown(options, id => {
      detach?.();
      const option = options.find(o => o.id === id);
      const callback = (value: any) => onChange(value);
      option.value.attach(callback);
      callback(option.value.getValue());
      detach = () => option.value.detach(callback);
    }),
    ...options.map(o => o.element),
  ]);

  return {
    element,
    dispose: () => detach?.(),
  };
};

const createEditableComponent = (
  uniformInfo: UniformInfo,
  onChange?: (value: any) => void
) => {
  const initialValue = getDefaultValue(uniformInfo.getUniformType());
  const customValue = new Observable<any>(initialValue);

  if (onChange) {
    customValue.attach((value: any) => onChange(value));
    onChange(initialValue);
  }

  const element = createElementForType(
    uniformInfo.getUniformType(),
    true,
    customValue
  );

  return {
    element,
    value: customValue,
    dispose: () => customValue.detachAll(),
  };
};

const createElementForType = (
  uniformType: UniformType,
  editable: boolean,
  currentValue: Observable<any>
) => {
  switch (uniformType) {
    case UniformType.FLOAT_VEC2:
      return createUniformForVecX(2, currentValue, editable);
    case UniformType.FLOAT_VEC3:
      return createUniformForVecX(3, currentValue, editable);
    case UniformType.FLOAT_VEC4:
      return createUniformForVecX(4, currentValue, editable);
    case UniformType.SAMPLER_2D:
    default:
      return createUniformNotSupported();
  }
};

const createUniformNotSupported = () => {
  const div = document.createElement("div");
  div.className = "unsupported-error";
  div.innerText = "Not supported uniform";
  return div;
};

//todo editable
// const createUniformForVec2 = (
//   value: Observable<Vector2Array>,
//   editable: boolean
// ) => {
//   const [customElement, customController] = createVector2(v =>
//     value.setValue(v)
//   );
//   customController.setValues(value.getValue());

//   if (!editable) {
//     const listener = (value: Vector2Array) => customController.setValues(value);
//     value.attach(listener);
//   }

//   return customElement;
// };

const createUniformForVecX = <T extends number[]>(
  numElements: number,
  value: Observable<T>,
  editable: boolean
) => {
  const [customElement, customController] = createVector(numElements, v => {
    console.log("on change", v);

    value.setValue(v as T);
  });
  customController.setValues(value.getValue());

  if (!editable) {
    const listener = (value: T) => customController.setValues(value);
    value.attach(listener);
  }

  return customElement;
};

// const createUniformForVec3 = (
//   value: Observable<Vector3Array>,
//   editable: boolean
// ) => {
//   const [customElement, customController] = createVector3(v =>
//     value.setValue(v)
//   );
//   customController.setValues(value.getValue());

//   if (!editable) {
//     const listener = (value: Vector3Array) => customController.setValues(value);
//     value.attach(listener);
//   }

//   return customElement;
// };

// const createUniformForVec4 = (
//   value: Observable<Vector4Array>,
//   editable: boolean
// ) => {
//   const [customElement, customController] = createVector4(v =>
//     value.setValue(v)
//   );
//   customController.setValues(value.getValue());

//   if (!editable) {
//     const listener = (value: Vector4Array) => customController.setValues(value);
//     value.attach(listener);
//   }

//   return customElement;
// };
