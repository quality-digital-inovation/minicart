import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import { IntlProvider } from 'react-intl'

import MinicartIconButton from '../components/MinicartIconButton'

const messages = {
  'store/minicart.open-button-label': 'Abrir minicarrinho',
}

const MockIcon = () => <span data-testid="minicart-icon">icon</span>

const mockDispatch = jest.fn()

const defaultState = {
  variation: 'drawer' as const,
  open: false,
  hasBeenOpened: false,
  openOnHoverProp: false,
  openBehavior: 'click' as const,
}

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

jest.mock('../components/CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
}))

jest.mock('../MinicartContext', () => {
  const actual = jest.requireActual('../MinicartContext')

  return {
    ...actual,
    useMinicartState: jest.fn(),
    useMinicartDispatch: jest.fn(),
  }
})

const { useMinicartState, useMinicartDispatch } = jest.requireMock(
  '../MinicartContext'
)

const renderMinicartIconButton = (state = defaultState) => {
  useMinicartState.mockReturnValue(state)
  useMinicartDispatch.mockReturnValue(mockDispatch)

  return render(
    <IntlProvider locale="pt" messages={messages}>
      <MinicartIconButton
        Icon={MockIcon}
        quantityDisplay="not-empty"
        itemCountMode="distinct"
      />
    </IntlProvider>
  )
}

describe('MinicartIconButton', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
  })

  it('renders a native button with a non-empty aria-label', () => {
    const { container } = renderMinicartIconButton()

    const button = container.querySelector('button[type="button"]')

    expect(button).toBeTruthy()
    expect(button?.getAttribute('aria-label')).toBe('Abrir minicarrinho')
  })

  it('opens the minicart when clicked while closed', () => {
    const { container } = renderMinicartIconButton()

    const button = container.querySelector('button[type="button"]')

    fireEvent.click(button!)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'OPEN_MINICART' })
  })

  it('closes the minicart when clicked while open', () => {
    const { container } = renderMinicartIconButton({
      ...defaultState,
      open: true,
    })

    const button = container.querySelector('button[type="button"]')

    fireEvent.click(button!)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLOSE_MINICART' })
  })
})
