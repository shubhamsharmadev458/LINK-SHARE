'use client';

import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleVisibility, deleteBlock, updateBlockOrder } from '@/app/admin/actions';

type BlockProps = {
  id: string;
  type: string;
  data: string;
  isVisible: boolean;
};

export default function ReorderableBlocks({ initialBlocks }: { initialBlocks: BlockProps[] }) {
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleReorder = async (newOrder: BlockProps[]) => {
    setBlocks(newOrder);
    const ids = newOrder.map(b => b.id);
    await updateBlockOrder(ids);
  };

  if (blocks.length === 0) return <p className="text-gray-500">No blocks yet.</p>;

  return (
    <Reorder.Group axis="y" values={blocks} onReorder={handleReorder} className="flex flex-col gap-4">
      {blocks.map(block => {
        let data: any = {};
        try { data = JSON.parse(block.data); } catch(e) {}
        
        return (
          <Reorder.Item 
            key={block.id} 
            value={block}
            className={cn("flex items-center justify-between p-4 border rounded-lg bg-gray-50 transition-opacity", !block.isVisible && "opacity-50 grayscale")}
          >
            <div className="flex items-center gap-4">
              <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
                <GripVertical size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold flex items-center gap-2">
                  {data.title || data.text || 'Embed Block'}
                  {!block.isVisible && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Hidden</span>}
                </span>
                <span className="text-sm text-gray-500 truncate max-w-[200px]">{data.url || block.type}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={async () => await toggleVisibility(block.id, block.isVisible)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition-colors" 
                title={block.isVisible ? "Hide Block" : "Show Block"}
              >
                {block.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              
              <button 
                onClick={async () => await deleteBlock(block.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" 
                title="Delete Block"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </Reorder.Item>
        )
      })}
    </Reorder.Group>
  );
}
