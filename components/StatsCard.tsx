import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, iconColor = 'bg-[#2EE6A6]/20 text-[#2EE6A6]', description }: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group h-full">
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <dt className="text-xs md:text-sm font-medium text-gray-500 mb-2.5 truncate">{title}</dt>
            <dd>
              <div className="text-2xl md:text-3xl font-display font-bold text-[#111111] mb-2 truncate leading-tight">{value}</div>
              {description && (
                <div className="text-xs md:text-sm text-gray-500 font-medium truncate">{description}</div>
              )}
            </dd>
          </div>
          <div className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${iconColor} group-hover:scale-105 transition-transform shadow-sm`}>
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}