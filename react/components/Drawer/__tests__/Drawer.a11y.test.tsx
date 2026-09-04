import React from 'react'
import { render } from '@vtex/test-tools/react'

import Swipable from '../Swipable'

const defaultProps = {
  onSwipeLeft: jest.fn(),
  onSwipeRight: jest.fn(),
  onTriggerChange: jest.fn(),
  onLockScroll: jest.fn(),
  onUnlockScroll: jest.fn(),
  onDragStart: jest.fn(),
  onDragEnd: jest.fn(),
  onSetPosition: jest.fn(),
  onUpdateOffset: jest.fn(),
  threshold: 0.3,
  enabled: false,
  rubberBanding: false,
  element: <div />,
  position: 'right' as const,
  className: 'test-drawer closed',
  style: { width: '85%' },
  positionRight: '-100%',
  positionLeft: '0%',
  preserveMomentum: false,
  allowOutsideDrag: true,
}

describe('Drawer accessibility', () => {
  it('does not mark the closed drawer panel as aria-hidden', () => {
    const { container } = render(
      <Swipable {...defaultProps}>
        <button type="button">Checkout</button>
      </Swipable>
    )

    const drawer = container.firstChild as HTMLElement

    expect(drawer).not.toHaveAttribute('aria-hidden')
  })

  it('hides closed drawer content from keyboard focus via visibility', () => {
    const { container } = render(
      <Swipable {...defaultProps}>
        <button type="button">Checkout</button>
      </Swipable>
    )

    const drawer = container.firstChild as HTMLElement

    expect(drawer.style.visibility).toBe('hidden')
  })

  it('shows drawer content when enabled', () => {
    const { container } = render(
      <Swipable {...defaultProps} enabled>
        <button type="button">Checkout</button>
      </Swipable>
    )

    const drawer = container.firstChild as HTMLElement

    expect(drawer).not.toHaveAttribute('aria-hidden')
    expect(drawer.style.visibility).toBe('visible')
  })
})
