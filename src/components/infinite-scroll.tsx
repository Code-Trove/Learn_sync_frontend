import type React from "react"
import "../styles/infinite-scroll.css"

interface InfiniteScrollProps {
  children: React.ReactNode
  duration?: number
  direction?: "left" | "right"
  loop?: boolean
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ children, duration = 20, direction = "left", loop = true }) => {
  return (
    <div className="relative flex overflow-x-hidden">
      <div
        className={`flex py-12 whitespace-nowrap ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
        style={{ 
          animationDuration: `${duration}s`,
          animationIterationCount: 'infinite'
        }}
      >
        {children}
        {loop && children}
      </div>
      {loop && (
        <div
          className={`absolute top-0 flex py-12 whitespace-nowrap ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
          style={{ 
            animationDuration: `${duration}s`,
            animationIterationCount: 'infinite'
          }}
        >
          {children}
          {children}
        </div>
      )}
    </div>
  )
}