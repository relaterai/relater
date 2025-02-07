"use client"

import { useStats } from '@/swr/use-stats';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design-system/components/ui/tooltip';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Heatmap = () => {
  const { stats, isLoading } = useStats();

  const [data, setData] = useState<Array<{ date: string, count: number }>>([]);

  useEffect(() => {
    if (stats?.dailySnapshotsCount) {
      const dailyData = Object.entries(stats.dailySnapshotsCount).map(([date, count]) => ({
        date: date.split('T')[0],
        count
      }));
      setData(dailyData);
    }
  }, [stats]);

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

  if (isLoading) {
    return (
      <div className="p-4">
        <div className='mb-4 grid grid-cols-3 gap-4 text-gray-600 text-sm'>
          <div className="text-center">
            <div className='my-1'>
              <Skeleton className='h-6 w-6 m-auto' />
            </div>
            <div className='text-muted-foreground text-xs'>NOTE</div>
          </div>
          <div className="text-center">
            <div className='my-1'>
              <Skeleton className='h-6 w-6 m-auto' />
            </div>
            <div className='text-muted-foreground text-xs'>TAG</div>
          </div>
          <div className="text-center">
            <div className='my-1'>
              <Skeleton className='h-6 w-6 m-auto' />
            </div>
            <div className='text-muted-foreground text-xs'>DAY</div>
          </div>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 13 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <Skeleton key={dayIndex} className='h-3 w-3 rounded-sm' />
              ))}
            </div>
          ))}
        </div>

        <div className='mt-2 flex items-center gap-2 text-gray-500 text-xs'>
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 3, 6, 9].map((level) => (
              <div
                key={level}
                className='h-3 w-3 rounded-sm'
                style={{ backgroundColor: getColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className='mb-4 grid grid-cols-3 gap-4 text-gray-600 text-sm'>
        <div className="text-center">
          <div className="font-bold text-2xl text-muted-foreground">{stats?.snapshotsCount || 0}</div>
          <div className='text-muted-foreground text-xs'>NOTE</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-2xl text-muted-foreground">{stats?.tagsCount || 0}</div>
          <div className='text-muted-foreground text-xs'>TAG</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-2xl text-muted-foreground">{stats?.regDays || 0}</div>
          <div className='text-muted-foreground text-xs'>DAY</div>
        </div>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <Link
                    key={day.date}
                    href={`/?date=${day.date}`}
                    className="block"
                  >
                    <div
                      className='h-3 w-3 rounded-sm transition-all hover:ring-2 hover:ring-blue-400'
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

      <div className='mt-2 flex items-center gap-2 text-gray-500 text-xs'>
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 3, 6, 9].map((level) => (
            <div
              key={level}
              className='h-3 w-3 rounded-sm'
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
