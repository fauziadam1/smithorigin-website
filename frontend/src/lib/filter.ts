export type SortOption =
  | 'newest'
  | 'lowest-price'
  | 'highest-price'
  | 'name-asc'
  | 'name-desc'

export interface FilterSidebarProps {
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  tempPriceRange: [number, number]
  setTempPriceRange: (range: [number, number]) => void
  showBestSeller: boolean
  setShowBestSeller: (val: boolean) => void
  showDiscount: boolean
  setShowDiscount: (val: boolean) => void
  sortBy: SortOption
  setSortBy: (val: SortOption) => void
  resetFilters: () => void
  maxPrice: number
  className?: string
}
