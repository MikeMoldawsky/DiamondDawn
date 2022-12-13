import { useMediaQuery } from "react-responsive"

export const useDesktopMediaQuery = () =>
  useMediaQuery({ query: "(min-width: 1200px)" })

export const useMobileOrTablet = () =>
  useMediaQuery({ query: "(max-width: 1199px)" })

export const Desktop = ({ children }) => {
  const isDesktop = useDesktopMediaQuery()

  return isDesktop ? children : null
}

export const MobileOrTablet = ({ children }) => {
  const mobileOrTablet = useMobileOrTablet()

  return mobileOrTablet ? children : null
}