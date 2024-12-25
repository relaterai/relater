"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design-system/components/ui/tooltip';

const generateMockData = (baseDate: Date) => {
  const data = [];

  for (let i = 0; i < 84; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    data.unshift({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10)
    });
  }

  return data;
};

const Heatmap = () => {
  const [data, setData] = useState<Array<{ date: string, count: number }>>([]);

  useEffect(() => {
    setData(generateMockData(new Date()));
  }, []);

  const getColor = (count: number) => {
    if (count === 0) return 'rgb(235, 237, 240)';
    if (count <= 3) return 'rgb(155, 233, 168)';
    if (count <= 6) return 'rgb(64, 196, 99)';
    if (count <= 9) return 'rgb(48, 161, 78)';
    return 'rgb(33, 110, 57)';
  };

  const weeks: Array<Array<{ date: string; count: number }>> = [];
  let week: Array<{ date: string; count: number }> = [];

  data.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0 || index === data.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="p-4">
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <Link
                    key={day.date}
                    href={`#/notes/${day.date}`}
                    className="block"
                  >
                    <div
                      className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-blue-400 transition-all"
                      style={{ backgroundColor: getColor(day.count) }}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {`${day.date}: ${day.count} Notes`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center text-xs text-gray-500 gap-2">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 3, 6, 9].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(level) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
