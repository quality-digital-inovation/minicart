import React from 'react'
import { render } from '@vtex/test-tools/react'
import { IconCart } from 'vtex.store-icons'

import MinicartIconButton from '../components/MinicartIconButton'

const mockDispatch = jest.fn()

jest.mock('../MinicartContext', () => ({
  useMinicartState: () => ({
    open: false,
    openBehavior: 'click',
    openOnHoverProp: false,
    variation: 'drawer',
    hasBeenOpened: false,
  }),
  useMinicartDispatch: () => mockDispatch,
}))

jest.mock('../components/CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
    withModifiers: (handle: string) => handle,
  }),
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
  it('should expose a non-empty accessible name on the minicart trigger button', () => {
    const { getByRole } = render(
      <MinicartIconButton
        Icon={IconCart}
        itemCountMode="distinct"
        quantityDisplay="not-empty"
      />
    )

    const button = getByRole('button')

    expect(button.getAttribute('aria-label')).toBeTruthy()
    expect(button.getAttribute('aria-label')?.trim()).not.toBe('')
  })
})
