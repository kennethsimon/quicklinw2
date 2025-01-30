import * as React from 'react';

export const navigationRef = React.createRef();

export const isReadyRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
