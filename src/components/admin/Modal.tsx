import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-500 hover:text-red-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
