import React from 'react'
import { render } from '@vtex/test-tools/react'
import { IconCart } from 'vtex.store-icons'

import MinicartIconButton from '../components/MinicartIconButton'

jest.mock('../components/CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
}))

jest.mock('../MinicartContext', () => ({
  useMinicartState: () => ({
    open: false,
    openBehavior: 'click',
    openOnHoverProp: false,
  }),
  useMinicartDispatch: () => jest.fn(),
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

jest.mock('../modules/checkoutHook', () => () => jest.fn())

describe('<MinicartIconButton />', () => {
  it('should expose an accessible name for the minicart trigger button', () => {
    const { getByRole } = render(
      <MinicartIconButton
        Icon={IconCart}
        itemCountMode="distinct"
        quantityDisplay="not-empty"
      />
    )

    const button = getByRole('button')

    expect(button.getAttribute('aria-label')).toBeTruthy()
    expect(button.getAttribute('aria-label')).not.toBe('')
  })
})
