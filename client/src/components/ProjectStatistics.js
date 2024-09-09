import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const ProjectStatistics = ({ tasks }) => {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { pending: 0, inprogress: 0, completed: 0, closed: 0 }
  );

  const data = [
    { name: "Pending", value: statusCounts.pending },
    { name: "In Progress", value: statusCounts.inprogress },
    { name: "Completed", value: statusCounts.completed },
    { name: "Closed", value: statusCounts.closed },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57"];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (percent === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex justify-center items-center h-full">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ProjectStatistics;

//  done redit percent west mn chart + ila kan 0 maybanch + ywely yban f ness 
//  a;hamullilah