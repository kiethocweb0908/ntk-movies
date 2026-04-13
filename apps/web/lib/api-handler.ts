export const handleApiError = (error: any) => {
  // const isUnauthorized = error.status === 401 || error.message?.includes("401")
  // const isSessionExpired =
  //   error.code === "SESSION_EXPIRED" || error.message === "SESSION_EXPIRED"
  // if (isUnauthorized || isSessionExpired)
  //   return {
  //     shouldRedirect: true,
  //     message: "Phiên đăng nhập của bạn đã hết hạn!",
  //   }

  if (error.status === 401) {
    if (error.code === "SESSION_EXPIRED") {
      return {
        shouldRedirect: true,
        message: "Phiên đăng nhập của bạn đã hết hạn!",
      }
    } else if (error.code === "NOT_LOGGED_IN") {
      return {
        shouldRedirect: false,
        message: "Bạn cần đăng nhập để sử dụng tính năng này!",
      }
    }
  }
  return { shouldRedirect: false, message: error.message }
}
