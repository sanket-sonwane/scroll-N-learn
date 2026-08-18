"use client";

import { useCallback, useState } from "react";

export function usePlayKey() {
  const [playKey, setPlayKey] = useState(0);

  const replay = useCallback(() => setPlayKey((k) => k + 1), []);

  return { playKey, replay };
}