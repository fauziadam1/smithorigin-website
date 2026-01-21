import { SlidersHorizontal } from "lucide-react"
import CustomDropdown from "./dropdown"
import type { FilterSidebarProps, SortOption } from "@/lib/filter";

const sortOptions: readonly { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'lowest-price', label: 'Lowest Price' },
  { value: 'highest-price', label: 'Highest Price' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
]

export default function FilterSidebar({
  setPriceRange,
  tempPriceRange,
  setTempPriceRange,
  showBestSeller,
  setShowBestSeller,
  showDiscount,
  setShowDiscount,
  sortBy,
  setSortBy,
  resetFilters,
  maxPrice,
  className = ''
}: FilterSidebarProps) {
  return (
    <div className={`w-64 shrink-0 ${className}`}>
      <div className="sticky top-32 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm cursor-pointer text-red-800 hover:underline font-medium"
          >
            Reset
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Sort By</h3>
          <CustomDropdown
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <input
                type="number"
                value={tempPriceRange[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value)
                  setTempPriceRange([newMin, tempPriceRange[1]])
                }}
                onBlur={() => {
                  setPriceRange(tempPriceRange)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Min"
                min="0"
                max={maxPrice}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={tempPriceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value)
                  setTempPriceRange([tempPriceRange[0], newMax])
                }}
                onBlur={() => {
                  setPriceRange(tempPriceRange)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Max"
                min="0"
                max={maxPrice}
              />
            </div>

            <div className="relative pt-2 pb-4">
              <div className="relative h-1 bg-gray-200 rounded">
                <div
                  className="absolute h-1 bg-red-800 rounded"
                  style={{
                    left: `${(tempPriceRange[0] / maxPrice) * 100}%`,
                    right: `${100 - (tempPriceRange[1] / maxPrice) * 100}%`
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={tempPriceRange[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value)
                  if (newMin <= tempPriceRange[1]) {
                    setTempPriceRange([newMin, tempPriceRange[1]])
                    setPriceRange([newMin, tempPriceRange[1]])
                  }
                }}
                className="absolute w-full h-1 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              />
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={tempPriceRange[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value)
                  if (newMax >= tempPriceRange[0]) {
                    setTempPriceRange([tempPriceRange[0], newMax])
                    setPriceRange([tempPriceRange[0], newMax])
                  }
                }}
                className="absolute w-full h-1 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Rp {tempPriceRange[0].toLocaleString('id-ID')}</span>
              <span>Rp {tempPriceRange[1].toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Quick Filters</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showBestSeller}
                onChange={(e) => setShowBestSeller(e.target.checked)}
                className="w-4 h-4 accent-red-800 cursor-pointer"
              />
              <span className="text-sm group-hover:text-red-800 transition">
                ⭐ Best Seller Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showDiscount}
                onChange={(e) => setShowDiscount(e.target.checked)}
                className="w-4 h-4 accent-red-800 cursor-pointer"
              />
              <span className="text-sm group-hover:text-red-800 transition">
                🏷️ Discounted Only
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
