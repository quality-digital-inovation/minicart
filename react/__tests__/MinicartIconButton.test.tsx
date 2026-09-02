import React from 'react'
import { render } from '@vtex/test-tools/react'

import MinicartIconButton from '../components/MinicartIconButton'
import { MinicartContextProvider } from '../MinicartContext'

const Icon = () => <span data-testid="cart-icon" />

jest.mock('../components/CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
  MinicartCssHandlesProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

jest.mock('vtex.order-manager/OrderForm', () => ({
  useOrderForm: () => ({
    orderForm: { items: [] },
    loading: false,
  }),
}))

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout' }),
}))

jest.mock('../modules/checkoutHook', () => ({
  __esModule: true,
  default: () => jest.fn(),
}))

const renderMinicartIconButton = () =>
  render(
    <MinicartContextProvider variation="drawer">
      <MinicartIconButton
        Icon={Icon}
        itemCountMode="distinct"
        quantityDisplay="not-empty"
      />
    </MinicartContextProvider>
  )

describe('<MinicartIconButton />', () => {
  it('exposes a non-empty accessible name on the open button', () => {
    const { getByRole } = renderMinicartIconButton()
    const button = getByRole('button')

    expect(button.getAttribute('aria-label')).toBeTruthy()
    expect(button.getAttribute('aria-label')?.trim()).not.toHaveLength(0)
  })
})
