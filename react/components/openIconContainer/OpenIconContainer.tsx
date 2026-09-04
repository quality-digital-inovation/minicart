import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

export const CSS_HANDLES = ['openIconContainer'] as const

interface Props {
  onClick?: React.MouseEventHandler<HTMLDivElement>
  children: React.ReactNode
}

const OpenIconContainer: React.FC<Props> = ({ onClick, children }) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <div
      onClick={onClick}
      className={`pa4 pointer ${handles.openIconContainer}`}
    >
      {children}
    </div>
  )
}

export default OpenIconContainer
