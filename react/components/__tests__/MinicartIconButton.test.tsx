import React from 'react'
import { render } from '@vtex/test-tools/react'

import MinicartIconButton from '../MinicartIconButton'
import { MinicartContextProvider } from '../../MinicartContext'

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
  'store/minicart.open-button-label': 'Open cart',
}

describe('MinicartIconButton', () => {
  it('should expose a non-empty accessible name on the open-cart button', () => {
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

    const button = getByRole('button', { name: 'Open cart' })

    expect(button).toBeDefined()
    expect(button.getAttribute('aria-label')).toBe('Open cart')
  })
})
