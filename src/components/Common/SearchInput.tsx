'use client'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
}: SearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      aria-label={placeholder}
      tabIndex={0}
    />
  )
}

export default SearchInput