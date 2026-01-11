import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SortOption = 'newest' | 'lowest-price' | 'highest-price' | 'name-asc' | 'name-desc'

export default function CustomDropdown({
  value,
  onChange,
  options,
}: {
  value: SortOption
  onChange: (value: SortOption) => void
  options: readonly { value: SortOption; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 cursor-pointer bg-white border border-gray-300 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
      >
        <span className="text-gray-900">{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition flex items-center justify-between ${value === option.value ? 'bg-red-50 text-red-800' : 'text-gray-700'
                }`}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}