import React, { memo, forwardRef, useImperativeHandle, useRef } from 'react';
import { GraphBase } from './GraphBase';
import { GraphBaseProps, ChartRef } from './types';

export interface ScatterPlotProps extends Omit<GraphBaseProps, 'type'> {}

export const ScatterPlot = forwardRef<ChartRef, ScatterPlotProps>((props, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

  return <GraphBase ref={internalRef} type="scatter" {...props} />;
});

ScatterPlot.displayName = 'ScatterPlot';

export default memo(ScatterPlot); 