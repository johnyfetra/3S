"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { bimester: "B1", average: 72, completion: 68 },
  { bimester: "B2", average: 76, completion: 74 },
  { bimester: "B3", average: 81, completion: 79 },
  { bimester: "B4", average: 78, completion: 83 },
  { bimester: "B5", average: 84, completion: 91 }
];

export function AcademicChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72" aria-hidden="true" />;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="bimester" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="average" stroke="#111111" fill="#fbbf24" fillOpacity={0.32} />
          <Area type="monotone" dataKey="completion" stroke="#ef4444" fill="#ef4444" fillOpacity={0.16} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
