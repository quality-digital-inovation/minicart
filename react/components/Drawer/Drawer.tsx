import React, {
  Suspense,
  useReducer,
  MouseEventHandler,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { defineMessages } from 'react-intl'
import { IconMenu } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'
import { useChildBlock, ExtensionPoint } from 'vtex.render-runtime'
import { usePixelEventCallback, PixelEventTypes } from 'vtex.pixel-manager'
import {
  MaybeResponsiveValue,
  useResponsiveValue,
} from 'vtex.responsive-values'

import OpenIconContainer from '../openIconContainer'
import Portal from './Portal'
import Overlay from './Overlay'
import useLockScroll from './modules/useLockScroll'
import DrawerCloseButton from './DrawerCloseButton'
import { DrawerContextProvider } from './DrawerContext'
import { isElementInsideLink } from './modules/isElementInsideLink'

const Swipable = React.lazy(() => import('./Swipable'))

interface MenuState {
  isOpen: boolean
  hasBeenOpened: boolean
}

interface MenuAction {
  type: 'open' | 'close'
}

const initialMenuState: MenuState = {
  isOpen: false,
  hasBeenOpened: false,
}

type Position = 'left' | 'right' | 'up' | 'down'
type SlideDirection = 'vertical' | 'horizontal' | 'rightToLeft' | 'leftToRight'
type Height = '100%' | 'auto' | 'fullscreen'
type Width = '100%' | 'auto'
export type BackdropMode = 'visible' | 'none'
type RenderingStrategy = 'lazy' | 'eager'

interface Props {
  actionIconId?: string
  dismissIconId?: string
  position?: Position
  width?: Width
  height?: Height
  slideDirection?: SlideDirection
  isFullWidth?: boolean
  maxWidth?: number | string
  children: React.ReactNode
  customIcon?: React.ReactElement
  header?: React.ReactElement
  backdropMode?: MaybeResponsiveValue<BackdropMode>
  renderingStrategy?: RenderingStrategy
  customPixelEventId?: PixelEventTypes.PixelData['id']
  customPixelEventName?: PixelEventTypes.PixelData['event']
  onVisibilityChanged?: (visible: boolean) => void
  zIndex?: number
}

function menuReducer(state: MenuState, action: MenuAction) {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isOpen: true,
        hasBeenOpened: true,
      }

    case 'close':
      return {
        ...state,
        isOpen: false,
      }

    default:
      return state
  }
}

const useMenuState = () => {
  const [state, dispatch] = useReducer(menuReducer, initialMenuState)
  const setLockScroll = useLockScroll()

  const setMenuOpen = (value: boolean) => {
    dispatch({ type: value ? 'open' : 'close' })
    setLockScroll(value)
  }

  const openMenu = () => setMenuOpen(true)
  const closeMenu = () => setMenuOpen(false)

  return {
    state,
    openMenu,
    closeMenu,
  }
}

const CSS_HANDLES = [
  'drawer',
  'opened',
  'closed',
  'moving',
  'drawerContent',
  'childrenContainer',
  'closeIconContainer',
] as const

function Drawer(props: Props) {
  const {
    width,
    header,
    children,
    customIcon,
    isFullWidth,
    maxWidth = 450,
    slideDirection = 'horizontal',
    backdropMode: backdropModeProp = 'visible',
    renderingStrategy = 'lazy',
    customPixelEventId,
    customPixelEventName,
    onVisibilityChanged,
    zIndex = 999,
  } = props

  const handles = useCssHandles(CSS_HANDLES)
  const backdropMode = useResponsiveValue(backdropModeProp)
  const hasTriggerBlock = Boolean(useChildBlock({ id: 'drawer-trigger' }))
  const hasHeaderBlock = Boolean(useChildBlock({ id: 'drawer-header' }))
  const { state: menuState, openMenu, closeMenu } = useMenuState()
  const { isOpen: isMenuOpen, hasBeenOpened: hasMenuBeenOpened } = menuState
  const [shouldRenderChildren, setShouldRenderChildren] = useState(
    renderingStrategy === 'eager'
  )

  const [isMoving, setIsMoving] = useState(false)

  usePixelEventCallback({
    eventId: customPixelEventId,
    handler: openMenu,
    eventName: 'openDrawer',
  })

  usePixelEventCallback({
    eventId: customPixelEventId,
    handler: openMenu,
    eventName: customPixelEventName,
  })

  useEffect(() => {
    if (onVisibilityChanged !== undefined) {
      onVisibilityChanged(isMenuOpen)
    }
  }, [onVisibilityChanged, isMenuOpen])

  const handleContainerClick: MouseEventHandler<HTMLElement> = event => {
    const { target, currentTarget } = event

    if (isElementInsideLink(target as HTMLElement, currentTarget)) {
      closeMenu()
    }
  }

  const direction =
    slideDirection === 'horizontal' || slideDirection === 'leftToRight'
      ? 'left'
      : 'right'

  const swipeHandler = direction === 'left' ? 'onSwipeLeft' : 'onSwipeRight'

  const contextValue = useMemo(
    () => ({
      isOpen: isMenuOpen,
      open: openMenu,
      close: closeMenu,
    }),
    [isMenuOpen, openMenu, closeMenu]
  )

  const overlayVisible = backdropMode === 'visible' && isMenuOpen

  useEffect(() => {
    if (isMenuOpen || hasMenuBeenOpened || renderingStrategy === 'eager') {
      setShouldRenderChildren(true)
    }
  }, [
    hasMenuBeenOpened,
    renderingStrategy,
    setShouldRenderChildren,
    isMenuOpen,
  ])

  return (
    <DrawerContextProvider value={contextValue}>
      <OpenIconContainer onClick={openMenu}>
        {hasTriggerBlock ? (
          <ExtensionPoint id="drawer-trigger" />
        ) : (
          customIcon ?? <IconMenu size={20} />
        )}
      </OpenIconContainer>
      <Portal>
        <Overlay visible={overlayVisible} onClick={closeMenu} zIndex={zIndex} />
        <Suspense fallback={<React.Fragment />}>
          <Swipable
            {...{
              [swipeHandler]: closeMenu,
            }}
            enabled={isMenuOpen}
            position={isMenuOpen ? 'center' : direction}
            allowOutsideDrag
            onUpdateOffset={value => {
              setIsMoving(!(value === '0%' || value === '-100%'))
            }}
            className={`${handles.drawer} ${
              isMenuOpen ? handles.opened : handles.closed
            } ${isMoving ? handles.moving : ''} ${
              direction === 'right' ? 'right-0' : 'left-0'
            } fixed top-0 bottom-0 bg-base z-999 flex flex-column`}
            style={{
              width: width ?? (isFullWidth ? '100%' : '85%'),
              maxWidth,
              minWidth: 280,
              pointerEvents: isMenuOpen ? 'auto' : 'none',
              zIndex,
            }}
          >
            <div
              className={`${handles.drawerContent} overflow-y-auto`}
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {hasHeaderBlock ? (
                <ExtensionPoint id="drawer-header" />
              ) : (
                header ?? (
                  <div className={`flex ${handles.closeIconContainer}`}>
                    <DrawerCloseButton />
                  </div>
                )
              )}
              {/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <div
                className={`${handles.childrenContainer} flex flex-grow-1`}
                onClick={handleContainerClick}
              >
                {shouldRenderChildren ? children : <></>}
              </div>
              {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            </div>
          </Swipable>
        </Suspense>
      </Portal>
    </DrawerContextProvider>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.drawer.title',
  },
})

Drawer.schema = {
  title: messages.title.id,
}

export default Drawer
