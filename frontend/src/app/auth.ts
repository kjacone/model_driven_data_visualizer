import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


import Credentials from "next-auth/providers/credentials"
// import Apple from "next-auth/providers/apple"
// import Auth0 from "next-auth/providers/auth0"
// import Authentik from "next-auth/providers/authentik"
// import AzureAD from "next-auth/providers/azure-ad"
// import AzureB2C from "next-auth/providers/azure-ad-b2c"
// import Battlenet from "next-auth/providers/battlenet"
// import Box from "next-auth/providers/box"
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
// import Bungie from "next-auth/providers/bungie"
// import Cognito from "next-auth/providers/cognito"
// import Coinbase from "next-auth/providers/coinbase"
// import Discord from "next-auth/providers/discord"
// import Dropbox from "next-auth/providers/dropbox"
// import DuendeIDS6 from "next-auth/providers/duende-identity-server6"
// import Eveonline from "next-auth/providers/eveonline"
// import Facebook from "next-auth/providers/facebook"
// import Faceit from "next-auth/providers/faceit"
// import FortyTwoSchool from "next-auth/providers/42-school"
// import Foursquare from "next-auth/providers/foursquare"
// import Freshbooks from "next-auth/providers/freshbooks"
// import Fusionauth from "next-auth/providers/fusionauth"
// import GitHub from "next-auth/providers/github"
// import GitLab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
// import Hubspot from "next-auth/providers/hubspot"
// import Instagram from "next-auth/providers/instagram"
// import Kakao from "next-auth/providers/kakao"
// import Keycloak from "next-auth/providers/keycloak"
// import Line from "next-auth/providers/line"
// import LinkedIn from "next-auth/providers/linkedin"
// import Mailchimp from "next-auth/providers/mailchimp"
// import Mailru from "next-auth/providers/mailru"
// import Medium from "next-auth/providers/medium"
// import Naver from "next-auth/providers/naver"
// import Netlify from "next-auth/providers/netlify"
// import Okta from "next-auth/providers/okta"
// import Onelogin from "next-auth/providers/onelogin"
// import Osso from "next-auth/providers/osso"
// import Osu from "next-auth/providers/osu"
// import Passage from "next-auth/providers/passage"
// import Patreon from "next-auth/providers/patreon"
// import Pinterest from "next-auth/providers/pinterest"
// import Pipedrive from "next-auth/providers/pipedrive"
// import Reddit from "next-auth/providers/reddit"
// import Salesforce from "next-auth/providers/salesforce"
// import Slack from "next-auth/providers/slack"
// import Spotify from "next-auth/providers/spotify"
// import Strava from "next-auth/providers/strava"
// import Todoist from "next-auth/providers/todoist"
// import Trakt from "next-auth/providers/trakt"
// import Twitch from "next-auth/providers/twitch"
// import Twitter from "next-auth/providers/twitter"
// import UnitedEffects from "next-auth/providers/united-effects"
// import Vk from "next-auth/providers/vk"
// import Wikimedia from "next-auth/providers/wikimedia"
// import WordPress from "next-auth/providers/wordpress"
// import WorkOS from "next-auth/providers/workos"
// import Yandex from "next-auth/providers/yandex"
// import Zitadel from "next-auth/providers/zitadel"
// import Zoho from "next-auth/providers/zoho"
// import Zoom from "next-auth/providers/zoom"

import type { NextAuthConfig } from "next-auth"

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo-sm.png",
  },
  debug: true,
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "password") return null
        return {
          id: "test",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    // Apple,
    // Auth0,
    // Authentik,
    // AzureAD,
    // AzureB2C,
    // Battlenet,
    // Box,
    // BoxyHQSAML,
    // Bungie,
    // Cognito,
    // Coinbase,
    // Discord,
    // Dropbox,
    // DuendeIDS6,
    // Eveonline,
    // Facebook,
    // Faceit,
    // FortyTwoSchool,
    // Foursquare,
    // Freshbooks,
    // Fusionauth,
    // GitHub,
    // GitLab,
    Google,
    // Hubspot,
    // Instagram,
    // Kakao,
    // Keycloak,
    // Line,
    // LinkedIn,
    // Mailchimp,
    // Mailru,
    // Medium,
    // Naver,
    // Netlify,
    // Okta,
    // Onelogin,
    // Osso,
    // Osu,
    // Passage,
    // Patreon,
    // Pinterest,
    // Pipedrive,
    // Reddit,
    // Salesforce,
    // Slack,
    // Spotify,
    // Strava,
    // Todoist,
    // Trakt,
    // Twitch,
    // Twitter,
    // UnitedEffects,
    // Vk,
    // Wikimedia,
    // WordPress,
    // WorkOS,
    // Yandex,
    // Zitadel,
    // Zoho,
    // Zoom,
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (!auth) {
        // Redirect to error page if not authenticated
        request.nextUrl.pathname = "/auth/error"
        return Response.redirect(request.nextUrl)
      }
      if (pathname === "/profile" || pathname === "/coding") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
    

    async signIn({ user, account }) {
      try {
        if (!user.email) {
          console.error("No email provided by authentication provider")
          return false
        }

        // Check if user exists by email first
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (!dbUser) {
          // Create new user if doesn't exist
          console.log("Creating new user...")
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              avatar: user.image ?? null,
              // Set the appropriate provider ID based on the account type
              ...(account?.provider === 'google' 
                ? { googleId: account.providerAccountId }
                : account?.provider === 'github'
                ? { githubId: account.providerAccountId }
                : {}),
            },
          })
        } else {
          // Update provider ID if it's not set
          console.log("Updating provider ID...")
          if (account?.provider === 'google' && !dbUser.googleId) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { googleId: account.providerAccountId },
            })
          } else if (account?.provider === 'github' && !dbUser.githubId) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { githubId: account.providerAccountId },
            })
          }
        }

        return true
      } catch (error) {
        console.error("Error during sign in:", error)
        return false
      }
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        
        if (dbUser) {
          return {
            ...session,
            user: {
              ...session.user,
              id: dbUser.id,
            },
          }
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle unauthorized access
      if (url.includes("/auth/error")) return `${baseUrl}/auth/error`
      
      // Normal redirect handling
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    
  },
} satisfies NextAuthConfig


export const { handlers, auth, signIn, signOut } = NextAuth(config)
