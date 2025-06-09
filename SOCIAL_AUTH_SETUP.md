# Social Authentication Setup Guide

## Overview
This guide will help you configure Google and Facebook authentication for your C Cube application in the Firebase Console.

## 🔧 Firebase Console Setup

### 1. Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `c-cube-eg`
3. Navigate to **Authentication** → **Sign-in method**

### 2. Enable Google Authentication

#### Step 1: Enable Google Provider
1. In the Sign-in method tab, find **Google**
2. Click on **Google** to configure it
3. Toggle **Enable** to ON
4. Enter your **Project support email** (your email address)
5. Click **Save**

#### Step 2: Configure OAuth Consent Screen (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Fill in required information:
   - App name: "C Cube"
   - User support email: your email
   - Developer contact information: your email
5. Save and continue

### 3. Enable Facebook Authentication

#### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** as app type
4. Fill in app details:
   - App name: "C Cube"
   - Contact email: your email
5. Create the app

#### Step 2: Configure Facebook Login
1. In your Facebook app dashboard, go to **Products**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform
4. Enter your site URL: `https://your-domain.com` (or localhost for testing)
5. Go to **Facebook Login** → **Settings**
6. Add these Valid OAuth Redirect URIs:
   ```
   https://c-cube-eg.firebaseapp.com/__/auth/handler
   http://localhost:3000/__/auth/handler (for local development)
   ```

#### Step 3: Get Facebook App Credentials
1. In Facebook app dashboard, go to **Settings** → **Basic**
2. Copy your **App ID** and **App Secret**

#### Step 4: Configure in Firebase
1. Back in Firebase Console → Authentication → Sign-in method
2. Click on **Facebook**
3. Toggle **Enable** to ON
4. Enter your Facebook **App ID** and **App Secret**
5. Copy the **OAuth redirect URI** from Firebase
6. Go back to Facebook app settings and add this URI to Valid OAuth Redirect URIs
7. Click **Save** in Firebase

## 🌐 Domain Configuration

### For Production
1. In Firebase Console → Authentication → Settings → Authorized domains
2. Add your production domain (e.g., `your-domain.com`)

### For Development
- `localhost` should already be authorized by default
- If not, add `localhost` to authorized domains

## 🔒 Security Considerations

### Facebook App Settings
1. In Facebook app dashboard → Settings → Advanced
2. Set **Client OAuth Login** to YES
3. Set **Web OAuth Login** to YES
4. Set **Enforce HTTPS** to YES (for production)

### Google OAuth Settings
1. In Google Cloud Console → APIs & Services → Credentials
2. Find your OAuth 2.0 client ID
3. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
4. Add authorized redirect URIs:
   - `https://c-cube-eg.firebaseapp.com/__/auth/handler`

## 🧪 Testing

### Local Testing
1. Start your development server: `npm run dev`
2. Open the authentication modal
3. Try signing in with Google and Facebook
4. Check browser console for any errors

### Common Issues & Solutions

#### Google Sign-In Issues
- **Error: "popup_closed_by_user"** → User closed popup, normal behavior
- **Error: "popup_blocked"** → Browser blocked popup, ask user to allow popups
- **Error: "auth-domain-config-required"** → Check Firebase hosting configuration

#### Facebook Sign-In Issues
- **Error: "App Not Setup"** → Ensure Facebook app is properly configured
- **Error: "Invalid OAuth access token"** → Check App ID and App Secret in Firebase
- **Error: "URL Blocked"** → Add your domain to Facebook app's Valid OAuth Redirect URIs

## 📱 Mobile Considerations

For mobile apps (if you plan to create them later):
- Google: Configure Android/iOS OAuth clients
- Facebook: Add mobile platforms in Facebook app settings

## 🔄 Environment Variables (Optional)

For additional security, you can store sensitive keys in environment variables:

```env
# .env.local
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

## ✅ Verification Checklist

- [ ] Google authentication enabled in Firebase
- [ ] Facebook app created and configured
- [ ] Facebook authentication enabled in Firebase
- [ ] OAuth redirect URIs properly configured
- [ ] Authorized domains added for your environment
- [ ] Local testing successful
- [ ] Error handling working properly

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Check browser developer console
3. Verify all URLs and credentials are correct
4. Ensure your Firebase project billing is set up (required for some features)

## 🚀 Next Steps

After setup is complete:
1. Test both Google and Facebook login
2. Verify user data is properly stored
3. Test on different browsers
4. Consider adding email verification for social accounts
5. Implement user profile management
