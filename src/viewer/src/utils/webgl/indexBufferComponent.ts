// import { Observable } from "../observable";
// import { createSelectionComponent, createElementArray } from "./common";

// export const createIndexBufferComponent = (
//   indexBufferBinding: Observable<number[]>,
//   onChange: (newValue: number[]) => void
// ) => {
//   const customIndicesValue = new Observable<number[]>([0, 1, 2]);
//   return createSelectionComponent(
//     [
//       {
//         id: "custom",
//         display: "Custom",
//         value: customIndicesValue,
//         element: createElementArray(1, customIndicesValue, true),
//       },
//       {
//         id: "binding",
//         display: "Binding - Mesh indices",
//         value: indexBufferBinding,
//         element: createElementArray(1, indexBufferBinding, false),
//       },
//     ],
//     onChange
//   );
// };
