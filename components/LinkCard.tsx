'use client';

import { useState } from 'react';
import { GripVertical, Eye, EyeOff, Edit2, Trash2, MousePointerClick, DollarSign, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface LinkCardProps {
  link: {
    id: string;
    title: string;
    url: string;
    description?: string;
    thumbnailUrl?: string;
    enabled: boolean;
    clicks: number;
    orderIndex: number;
  };
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  payoutRate?: number;
}

export function LinkCard({ link, onToggle, onEdit, onDelete, isDragging, payoutRate = 0.10 }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const earnings = (link.clicks * payoutRate).toFixed(2);

  return (
    <div
      className={`bg-white rounded-lg sm:rounded-xl border-2 transition-all ${
        isDragging
          ? 'border-[#2EE6A6] shadow-2xl scale-105 rotate-2'
          : link.enabled
          ? 'border-gray-200 hover:border-[#2EE6A6]/50 hover:shadow-lg'
          : 'border-gray-100 opacity-60'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            title="Drag to reorder"
          >
            <GripVertical size={18} className="sm:w-5 sm:h-5 text-[#6B7280]" />
          </button>

          {link.thumbnailUrl && (
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
              <img
                src={link.thumbnailUrl}
                alt={link.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-base sm:text-lg truncate ${link.enabled ? 'text-[#111111]' : 'text-[#6B7280]'}`}>
                  {link.title}
                </h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-[#6B7280] hover:text-[#2EE6A6] truncate flex items-center gap-1 group"
                >
                  <span className="truncate">{link.url}</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              </div>

              <button
                onClick={() => onToggle(link.id, !link.enabled)}
                className={`flex-shrink-0 w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-all relative ${
                  link.enabled ? 'bg-[#2EE6A6]' : 'bg-gray-300'
                }`}
                title={link.enabled ? 'Disable link' : 'Enable link'}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-transform ${
                    link.enabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2EE6A6]/10 rounded-lg flex items-center justify-center">
                  <MousePointerClick size={14} className="sm:w-4 sm:h-4 text-[#2EE6A6]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] hidden sm:block">Clicks</p>
                  <p className="font-bold text-[#111111] text-sm sm:text-base">{link.clicks}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={14} className="sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] hidden sm:block">Earned</p>
                  <p className="font-bold text-green-600 text-sm sm:text-base">₹{earnings}</p>
                </div>
              </div>

              <div className={`ml-auto flex items-center gap-1 sm:gap-2 transition-opacity ${
                isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'
              }`}>
                <button
                  onClick={() => onEdit(link.id)}
                  className="p-1.5 sm:p-2 hover:bg-[#2EE6A6]/10 text-[#2EE6A6] rounded-lg transition-colors"
                  title="Edit link"
                >
                  <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => onDelete(link.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  title="Delete link"
                >
                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>

            {!link.enabled && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#6B7280] bg-gray-50 px-3 py-2 rounded-lg">
                <EyeOff size={14} />
                <span>This link is hidden from your page</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}