//import { createMatrix3 } from "./../../components/inputMatrix";
import { assertNever } from "./../typeGuards";
import { createVector } from "../../components/inputVector";
import { createElementsDropdown } from "../../components/dropdown";
import { UniformInfo, UniformType } from "./uniform";
import { CompositeKeyMap } from "../compositeKeyMap";
import { createDiv, withLabel } from "../../components/wrappers";
import { uuidv4 } from "../../../../common/uuid";
import { Observable } from "../observable";
import { createElementNotSupported } from "./common";
import { createMatrix } from "../../components/inputMatrix";

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

//todo
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
      return createElementVector(2, currentValue, editable);
    case UniformType.FLOAT_VEC3:
      return createElementVector(3, currentValue, editable);
    case UniformType.FLOAT_VEC4:
      return createElementVector(4, currentValue, editable);
    case UniformType.FLOAT_MAT4:
      return createElementMatrix(4, currentValue, editable);
    //case UniformType.SAMPLER_2D:
    default:
      return createElementNotSupported();
  }
};

const createElementVector = <T extends number[]>(
  size: number,
  value: Observable<T>,
  editable: boolean
) => {
  const [customElement, customController] = createVector(size, v => {
    value.setValue(v as T);
  });
  customController.setValues(value.getValue());

  if (!editable) {
    const listener = (value: T) => customController.setValues(value);
    value.attach(listener);
  }

  return customElement;
};

const createElementMatrix = <T extends number[]>(
  size: number,
  value: Observable<T>,
  editable: boolean
) => {
  const onChange = editable
    ? (v: T) => {
        value.setValue(v as T);
      }
    : undefined;
  const [customElement, customController] = createMatrix(size, onChange);
  customController.setValues(value.getValue());

  if (!editable) {
    const listener = (value: T) => customController.setValues(value);
    value.attach(listener);
  }

  return customElement;
};
