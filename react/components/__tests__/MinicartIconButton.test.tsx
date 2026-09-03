import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'

import MinicartIconButton from '../MinicartIconButton'
import {
  MinicartContextProvider,
  useMinicartState,
} from '../../MinicartContext'

jest.mock('vtex.order-manager/OrderForm', () => ({
  useOrderForm: () => ({
    orderForm: { items: [] },
    loading: false,
  }),
}))

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout' }),
}))

jest.mock('vtex.device-detector', () => ({
  useDevice: () => ({ isMobile: false }),
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

const Icon = () => <span data-testid="cart-icon">icon</span>

const messages = {
  'store/minicart.open-button-label': 'Open minicart',
}

const OpenState = () => {
  const { open } = useMinicartState()

  return <span data-testid="open-state">{open ? 'open' : 'closed'}</span>
}

describe('MinicartIconButton', () => {
  it('renders a native button with a non-empty aria-label', () => {
    const { getByRole } = render(
      <MinicartContextProvider variation="drawer">
        <MinicartIconButton
          Icon={Icon}
          quantityDisplay="not-empty"
          itemCountMode="distinct"
        />
      </MinicartContextProvider>,
      { locale: 'en', messages }
    )

    const button = getByRole('button', { name: 'Open minicart' })

    expect(button.tagName).toBe('BUTTON')
    expect(button.getAttribute('type')).toBe('button')
    expect(button.getAttribute('aria-label')).toBe('Open minicart')
  })

  it('opens the minicart when clicked', () => {
    const { getByRole, getByTestId } = render(
      <MinicartContextProvider variation="drawer">
        <MinicartIconButton
          Icon={Icon}
          quantityDisplay="not-empty"
          itemCountMode="distinct"
        />
        <OpenState />
      </MinicartContextProvider>,
      { locale: 'en', messages }
    )

    expect(getByTestId('open-state').textContent).toBe('closed')

    fireEvent.click(getByRole('button', { name: 'Open minicart' }))

    expect(getByTestId('open-state').textContent).toBe('open')
  })
})
