import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'

import MinicartIconButton from '../components/MinicartIconButton'

const Icon = () => <span data-testid="cart-icon" />

const mockDispatch = jest.fn()

const mockMinicartState = {
  variation: 'drawer' as const,
  open: false,
  hasBeenOpened: false,
  openOnHoverProp: false,
  openBehavior: 'click' as const,
}

jest.mock('../MinicartContext', () => ({
  useMinicartDispatch: () => mockDispatch,
  useMinicartState: () => mockMinicartState,
}))

jest.mock('../components/CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
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

jest.mock('../modules/checkoutHook', () => ({
  __esModule: true,
  default: () => jest.fn(),
}))

const renderMinicartIconButton = () =>
  render(
    <MinicartIconButton
      Icon={Icon}
      itemCountMode="distinct"
      quantityDisplay="not-empty"
    />
  )

describe('<MinicartIconButton />', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockMinicartState.open = false
    mockMinicartState.openBehavior = 'click'
    mockMinicartState.openOnHoverProp = false
  })

  it('renders a native button with a non-empty aria-label', () => {
    const { getByRole } = renderMinicartIconButton()
    const button = getByRole('button', { name: /abrir minicarrinho/i })

    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button.getAttribute('aria-label')?.trim()).not.toHaveLength(0)
  })

  it('opens the minicart when clicked while closed', () => {
    const { getByRole } = renderMinicartIconButton()

    fireEvent.click(getByRole('button', { name: /abrir minicarrinho/i }))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'OPEN_MINICART' })
  })

  it('closes the minicart when clicked while open', () => {
    mockMinicartState.open = true
    const { getByRole } = renderMinicartIconButton()

    fireEvent.click(getByRole('button', { name: /abrir minicarrinho/i }))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLOSE_MINICART' })
  })
})
