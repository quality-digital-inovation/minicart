import React from 'react'
import { render } from '@vtex/test-tools/react'

import Swipable from '../Swipable'

jest.mock('../modules/animation', () => ({
  animate: jest.fn(),
}))

describe('Drawer accessibility', () => {
  it('does not mark a closed drawer panel as aria-hidden', () => {
    const { getByTestId } = render(
      <Swipable
        enabled={false}
        position="right"
        className="test-drawer closed"
        style={{}}
        onSwipeLeft={jest.fn()}
        onSwipeRight={jest.fn()}
        onTriggerChange={jest.fn()}
        onLockScroll={jest.fn()}
        onUnlockScroll={jest.fn()}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onSetPosition={jest.fn()}
        onUpdateOffset={jest.fn()}
        threshold={0}
        rubberBanding={false}
        element={<div />}
        positionRight="100%"
        positionLeft="-100%"
        preserveMomentum
        allowOutsideDrag
      >
        <div data-testid="drawer-panel">
          <button type="button">Checkout</button>
        </div>
      </Swipable>
    )

    const panel = getByTestId('drawer-panel').parentElement as HTMLElement

    expect(panel).not.toHaveAttribute('aria-hidden')
    expect(panel).toHaveAttribute('inert')
  })

  it('keeps an open drawer panel interactive without inert', () => {
    const { getByTestId } = render(
      <Swipable
        enabled
        position="center"
        className="test-drawer opened"
        style={{}}
        onSwipeLeft={jest.fn()}
        onSwipeRight={jest.fn()}
        onTriggerChange={jest.fn()}
        onLockScroll={jest.fn()}
        onUnlockScroll={jest.fn()}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onSetPosition={jest.fn()}
        onUpdateOffset={jest.fn()}
        threshold={0}
        rubberBanding={false}
        element={<div />}
        positionRight="100%"
        positionLeft="-100%"
        preserveMomentum
        allowOutsideDrag
      >
        <div data-testid="drawer-panel">
          <button type="button">Checkout</button>
        </div>
      </Swipable>
    )

    const panel = getByTestId('drawer-panel').parentElement as HTMLElement

    expect(panel).not.toHaveAttribute('aria-hidden')
    expect(panel).not.toHaveAttribute('inert')
  })
})
