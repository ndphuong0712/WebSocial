const getGoogleOAuthUrl = () => {
  const url = "https://accounts.google.com/o/oauth2/v2/auth"
  const query = {
    client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI,
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    response_type: "code",
    prompt: "consent"
  }
  return `${url}?${new URLSearchParams(query).toString()}`
}
export default getGoogleOAuthUrl
