import { debounce, throttle, memoize } from '../../utils/performance'

describe('Performance utilities', () => {
  describe('debounce', () => {
    it('should delay function execution', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
        done()
      }, 150)
    })

    it('should reset delay on subsequent calls', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      setTimeout(() => {
        debouncedFn()
        setTimeout(() => {
          expect(mockFn).toHaveBeenCalledTimes(1)
          done()
        }, 150)
      }, 50)
    })
  })

  describe('throttle', () => {
    it('should limit function execution frequency', (done) => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      setTimeout(() => {
        throttledFn()
        expect(mockFn).toHaveBeenCalledTimes(2)
        done()
      }, 150)
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      const mockFn = jest.fn((x: number) => x * 2)
      const memoizedFn = memoize(mockFn)

      const result1 = memoizedFn(5)
      const result2 = memoizedFn(5)

      expect(result1).toBe(10)
      expect(result2).toBe(10)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should call function for different arguments', () => {
      const mockFn = jest.fn((x: number) => x * 2)
      const memoizedFn = memoize(mockFn)

      memoizedFn(5)
      memoizedFn(10)

      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })
})
