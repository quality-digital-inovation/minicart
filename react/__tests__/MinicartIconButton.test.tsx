/* eslint-disable global-require */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import MinicartIconButton from '../components/MinicartIconButton'
import { MinicartContextProvider } from '../MinicartContext'

jest.mock('vtex.order-manager/OrderForm', () => {
  const mockData = require('../legacy/__fixtures__/orderForm')

  return {
    useOrderForm: jest.fn(() => ({
      orderForm: mockData.default,
      loading: false,
    })),
  }
})

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout/#/cart' }),
}))

jest.mock('vtex.device-detector', () => ({
  useDevice: () => ({ isMobile: false }),
}))

jest.mock('../modules/checkoutHook', () => ({
  __esModule: true,
  default: () => jest.fn(),
}))

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

const Icon = () => <span>cart-icon</span>

const renderMinicartIconButton = () =>
  render(
    <MinicartContextProvider variation="drawer">
      <MinicartIconButton
        Icon={Icon}
        itemCountMode="distinct"
        quantityDisplay="not-empty"
        variation="drawer"
      />
    </MinicartContextProvider>
  )

describe('<MinicartIconButton />', () => {
  it('should expose a non-empty accessible name on the open button', () => {
    const { getByRole } = renderMinicartIconButton()

    const button = getByRole('button', { name: /open minicart/i })

    expect(button).toBeDefined()
    expect(button.getAttribute('aria-label')).toBeTruthy()
  })
})
