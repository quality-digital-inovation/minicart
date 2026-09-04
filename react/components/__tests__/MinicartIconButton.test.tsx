import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import MinicartIconButton from '../MinicartIconButton'
import {
  MinicartContextProvider,
  useMinicartState,
} from '../../MinicartContext'

const MockIcon = () => <svg data-testid="minicart-icon" />

jest.mock('vtex.device-detector', () => ({
  useDevice: () => ({ isMobile: false }),
}))

jest.mock('vtex.order-manager/OrderForm', () => ({
  useOrderForm: () => ({
    orderForm: { items: [] },
    loading: false,
  }),
}))

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout/#/cart' }),
}))

jest.mock('../../modules/checkoutHook', () => ({
  __esModule: true,
  default: () => jest.fn(),
}))

jest.mock('../CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
}))

const OpenStateProbe = () => {
  const { open } = useMinicartState()

  return <span data-testid="open-state">{open ? 'open' : 'closed'}</span>
}

describe('<MinicartIconButton />', () => {
  it('renders a native button with accessible aria-label', () => {
    const { container } = render(
      <MinicartContextProvider>
        <MinicartIconButton
          Icon={MockIcon}
          quantityDisplay="not-empty"
          itemCountMode="total"
        />
      </MinicartContextProvider>
    )

    const button = container.querySelector('button[type="button"]')

    expect(button).not.toBeNull()
    expect(button?.getAttribute('aria-label')).toBe('Abrir minicarrinho')
    expect(button?.getAttribute('aria-label')).not.toBe('')
  })

  it('opens the minicart when clicked', () => {
    const { container, getByTestId } = render(
      <MinicartContextProvider>
        <MinicartIconButton
          Icon={MockIcon}
          quantityDisplay="not-empty"
          itemCountMode="total"
        />
        <OpenStateProbe />
      </MinicartContextProvider>
    )

    expect(getByTestId('open-state').textContent).toBe('closed')

    const button = container.querySelector('button[type="button"]')

    fireEvent.click(button!)

    expect(getByTestId('open-state').textContent).toBe('open')
  })
})
