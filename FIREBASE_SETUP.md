# Firebase Setup Guide — Hyderabad Flower Decorators

## Your Firebase Project
- **Project ID**: `hyderabad-flower-decorators`
- **Auth Domain**: `hyderabad-flower-decorators.firebaseapp.com`
- **Storage Bucket**: `hyderabad-flower-decorators.firebasestorage.app`

## Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **hyderabad-flower-decorators**
3. Go to **Firestore Database** → **Create Database**
4. Choose **Production mode** → Select location (asia-south1 for Mumbai)
5. Deploy the security rules from `firestore.rules`

## Step 2: Enable Firebase Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Go to **Users** tab → **Add User**
4. Enter your admin email and password (e.g., `admin@hydflowerdecorators.com`)

## Step 3: Set Up Firebase Storage

1. Go to **Storage** → **Get started**
2. Select the same location as Firestore
3. Deploy the security rules from `storage.rules`

## Step 4: Deploy Security Rules

Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore and Storage
firebase deploy --only firestore:rules,storage:rules
```

Or manually paste the rules from `firestore.rules` and `storage.rules` into the Firebase Console.

## Step 5: Create Firestore Indexes (Optional)

For better query performance, create these composite indexes in Firestore:

1. **bookings** collection:
   - `status` (Ascending) + `created_at` (Descending)
   - `event_date` (Ascending) + `status` (Ascending)
   - `event_date` (Ascending)

2. **calendar_blocks** collection:
   - `date` (Ascending)

3. **gallery_images** collection:
   - `created_at` (Descending)

## Step 6: Set Up Resend (Email)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add `RESEND_API_KEY` to your deployment environment variables

## Architecture

```
Firebase Auth → Admin login (email/password)
Firestore → Bookings, Gallery, Calendar, Settings
Firebase Storage → Booking images, Gallery images
Resend → Email notifications
```

## Collections Schema

### bookings
| Field | Type | Description |
|-------|------|-------------|
| full_name | string | Customer name |
| phone | string | Phone number |
| email | string | Email address |
| event_type | string | housewarming/wedding/baby-shower/pooja/corporate/custom |
| event_date | string | ISO date |
| preferred_time | string | HH:MM format |
| venue_address | string | Full address |
| google_maps_link | string | Optional maps link |
| estimated_budget | string | Budget range |
| guest_count | string | Number of guests |
| special_notes | string | Additional notes |
| images | string[] | Firebase Storage URLs |
| status | string | pending/confirmed/completed/cancelled |
| created_at | string | ISO timestamp |
| updated_at | string | ISO timestamp |

### gallery_images
| Field | Type | Description |
|-------|------|-------------|
| url | string | Firebase Storage URL |
| title | string | Image title |
| category | string | Wedding/Housewarming/etc. |
| featured | boolean | Featured flag |
| created_at | string | ISO timestamp |

### calendar_blocks
| Field | Type | Description |
|-------|------|-------------|
| date | string | ISO date |
| blocked | boolean | Is blocked |
| reason | string | Block reason |

### business_settings
| Field | Type | Description |
|-------|------|-------------|
| business_name | string | Business name |
| phone | string | Phone |
| email | string | Email |
| whatsapp | string | WhatsApp |
| address | string | Address |
| brand_color | string | Hex color |
| business_hours | map | Day→hours mapping |
| social_links | map | Platform→URL mapping |
