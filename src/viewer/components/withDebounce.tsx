import { debounce, shallowEqual } from "@utils/function";
import React from "react";

export const withDebounce = <T extends object>(
  ComponentToDebounce: React.ComponentType<T>,
  options: {
    shouldDebounce: (oldProps: T, newProps: T) => boolean;
    waitMs: number;
  }
) =>
  class DebouncedContainer extends React.Component<T> {
    debounceRender = debounce(() => this.forceUpdate(), options.waitMs);

    shouldComponentUpdate(nextProps: T) {
      if (options.shouldDebounce(this.props, nextProps)) {
        this.debounceRender();
        return false;
      }

      return true;
    }

    componentWillUnmount() {
      this.debounceRender.cancel();
    }

    render() {
      return <ComponentToDebounce {...this.props} />;
    }
  };
