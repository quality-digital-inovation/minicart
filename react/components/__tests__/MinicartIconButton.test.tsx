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

jest.mock('../../modules/checkoutHook', () => () => jest.fn())

jest.mock('../CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
}))

const Icon = () => <span data-testid="cart-icon">cart</span>

describe('<MinicartIconButton />', () => {
  it('should expose a non-empty accessible name via aria-label', () => {
    const { getByRole } = render(
      <MinicartContextProvider variation="drawer">
        <MinicartIconButton
          Icon={Icon}
          itemCountMode="distinct"
          quantityDisplay="not-empty"
        />
      </MinicartContextProvider>
    )

    const button = getByRole('button', { name: /open minicart/i })

    expect(button).toHaveAttribute('aria-label')
    expect(button.getAttribute('aria-label')).not.toBe('')
  })
})
