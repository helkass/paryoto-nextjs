// components/slider/range-slider.tsx
"use client";

import * as React from "react";
import { Slider } from "./slider";
import { RangeSliderProps } from "@/types/slider.types";

export function RangeSlider(props: RangeSliderProps) {
  const handleChange = (value: number | [number, number]) => {
    if (Array.isArray(value) && props.onChange) {
      props.onChange(value);
    }
  };

  return <Slider {...props} mode="range" onChange={handleChange} />;
}
