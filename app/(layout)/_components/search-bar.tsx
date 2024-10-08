'use client'

import { useRef } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useSearchBar } from '@/app/hooks/use-search-bar'
import { useClickOutside } from '@/app/hooks/use-clear-outside'

export const SearchBar = () => {
  const {
    form,
    results,
    handleFormSubmit,
    onClick,
    clearResults,
    handleKeyUp,
    selectedIndex,
  } = useSearchBar()
  const searchBarRef = useRef<HTMLDivElement>(null)

  useClickOutside(searchBarRef, clearResults)

  return (
    <div ref={searchBarRef} className='flex justify-center relative w-full'>
      <Form {...form}>
        <form
          onSubmit={handleFormSubmit}
          autoComplete='off'
          className='space-y-8 w-full'
        >
          <FormField
            control={form.control}
            name='search'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <Search className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer' />
                    <Input
                      className='pr-12'
                      placeholder='보고싶은 작품을 검색하세요.'
                      {...field}
                      onKeyUp={handleKeyUp}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {results.length > 0 && (
        <div className='absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-gray-200 rounded-md shadow-lg z-10'>
          {results.map((title, index) => (
            <div
              key={index}
              onClick={() => onClick(title)}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer ${
                index === selectedIndex ? 'bg-gray-200 dark:bg-slate-700' : ''
              }`}
            >
              {title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
