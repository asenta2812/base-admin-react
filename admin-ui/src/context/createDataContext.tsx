import React, { createContext, useReducer } from 'react';

export default function createDataContext<T, Y>(
  reducer: any,
  actions: any,
  initialSate: any,
): [React.Context<T>, React.FC<Y>] {
  const Context = createContext<T>(initialSate);

  const Provider: React.FC<Y> = ({ children, ...props }) => {
    const [state, dispatch] = useReducer<typeof initialSate>(reducer, initialSate);
    const boundDispatch: any = {};
    Object.entries(actions).forEach(([key, action]) => {
      if (action && typeof action === 'function') {
        boundDispatch[key] = action(dispatch);
      }
    });
    return (
      <Context.Provider value={{ data: state, ...props, ...boundDispatch }}>
        {children}
      </Context.Provider>
    );
  };
  return [Context, Provider];
}
