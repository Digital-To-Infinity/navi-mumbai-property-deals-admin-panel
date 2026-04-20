# 🏢 Navi Mumbai Property Deals — Full Backend API Specification

> **For the backend team.** This document covers **both** the public-facing website (Next.js) and the Admin Panel (React). It defines every required REST API endpoint, request/response schema, data model, and integration detail needed to connect the full platform to a real backend and database.

---

## 📦 Tech Stack (Frontend)

| Item | Details |
|---|---|
| Public Website | Next.js 14 (App Router) — `navimumbaipropertydeals.com` |
| Admin Panel | React (Vite) — `/admin-panel/*` routes |
| HTTP Client | Axios |
| Base URL | `https://api.navimumbaipropertydeals.com/api` |
| Auth | Bearer Token (JWT via `Authorization: Bearer <token>` header) |
| Token Storage | `localStorage` key: `token` |
| CORS | Allow origin: `https://navimumbaipropertydeals.com` |

---

## 🔑 URL Pattern Convention

```
# ─────── PUBLIC WEBSITE (No auth needed) ───────
GET  /properties           → public listings
GET  /properties/:slug     → single property detail
GET  /blogs                → published blogs
GET  /blogs/:slug          → single blog detail
POST /enquiries            → contact form submission
POST /auth/login           → website user login
POST /auth/register        → website user signup

# ─────── ADMIN PANEL (JWT required for all) ───────
GET  /admin/properties     → all properties (incl. Draft/Archived)
POST /admin/properties     → create property
...
GET  /admin/blogs          → all blogs
GET  /admin/users          → all users
GET  /admin/dashboard/**   → dashboard data
GET  /admin/enquiries      → CRM / leads
```

> **Rule:** Everything under `/admin/*` requires a valid JWT Bearer Token.
> Everything outside `/admin/*` is public (no auth needed unless noted).

---

## 🔐 1. Authentication (Website Users + Admin)

There are **two types of authenticated users**:

| Type | Role | Portal |
|---|---|---|
| **Admin / Agent** | `Admin`, `Agent` | Admin Panel |
| **Website User** | `User` | Public Website |

Both share the same users table, differentiated by `role`.

### 1a. Public Website Auth

#### `POST /auth/register` — Website User Registration
**Request Body:**
```json
{
  "fullName": "Alex Johnson",
  "phone": "9876543210",
  "email": "alex@example.com",
  "password": "SecurePass@1"
}
```
**Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "fullName": "Alex Johnson",
    "email": "alex@example.com",
    "role": "User"
  }
}
```

#### `POST /auth/login` — Website User Login
**Request Body:**
```json
{ "email": "alex@example.com", "password": "SecurePass@1" }
```
**Response:** Same shape as register.

#### `POST /auth/google` — Google OAuth (Website + Admin)
**Request Body:**
```json
{ "idToken": "GOOGLE_ID_TOKEN_FROM_FRONTEND" }
```
**Response:** Same shape as login.

#### `POST /auth/forgot-password`
**Request Body:** `{ "email": "alex@example.com" }`
**Response:** `{ "message": "Password reset link sent." }`

#### `POST /auth/reset-password`
**Request Body:** `{ "token": "RESET_TOKEN", "newPassword": "NewPass@1" }`

---

### 1b. Admin Panel Auth

#### `POST /auth/admin/login` — Admin Login
**Request Body:**
```json
{ "email": "admin@navimumbaipropertydeals.com", "password": "adminPass" }
```
**Response:**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "name": "NM Property Deals",
    "email": "admin@navimumbaipropertydeals.com",
    "role": "Admin"
  }
}
```

#### `POST /auth/logout`
**Response:** `{ "message": "Logged out successfully." }`

#### `GET /auth/me` — Get Current Logged-in User
**Response:** Full user object (based on token).

---

## 📊 2. Dashboard Module — Admin Panel

**Base:** `/admin/dashboard`
All require Admin/Agent JWT.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard/stats` | Summary KPIs |
| `GET` | `/admin/dashboard/chart` | Monthly performance chart |
| `GET` | `/admin/dashboard/recent-properties` | Latest 3 properties |
| `GET` | `/admin/dashboard/recent-leads` | Latest 3 enquiries |
| `GET` | `/admin/dashboard/recent-blogs` | Latest 2 blog articles |
| `GET` | `/admin/dashboard/top-agents` | Top 3 agents by lead count |
| `GET` | `/admin/dashboard/category-distribution` | Property count by category |
| `GET` | `/admin/dashboard/regional-activity` | Lead counts per location |

#### `GET /admin/dashboard/stats` — Response
```json
{
  "totalProperties": 1284,
  "activeListings": 842,
  "newLeads": 156,
  "totalAgents": 42,
  "resolvedLeads": 124,
  "pendingReviews": 12,
  "draftArticles": 4
}
```

#### `GET /admin/dashboard/chart?period=monthly` — Response
```json
[
  { "name": "Jan", "properties": 40, "leads": 24 },
  { "name": "Feb", "properties": 30, "leads": 13 }
]
```

#### `GET /admin/dashboard/category-distribution` — Response
```json
[
  { "name": "Apartments", "value": 450 },
  { "name": "Villas", "value": 230 },
  { "name": "Commercial", "value": 180 },
  { "name": "Plots/Land", "value": 120 },
  { "name": "Others", "value": 80 }
]
```

#### `GET /admin/dashboard/regional-activity` — Response
```json
[
  { "name": "CBD Belapur", "leads": 840, "growth": "+12%" },
  { "name": "Kharghar", "leads": 620, "growth": "+18%" }
]
```

---

## 🏠 3. Property Module

### Data Model — Property
```json
{
  "id": "string (UUID)",
  "title": "string",
  "slug": "string (auto-generated from title + location)",
  "purpose": "sell | rent",
  "propertyType": "Apartment | Villa | Flat | Penthouse | Commercial | House | Studio | Plot | 1RK",
  "category": "string (derived from propertyType)",
  "configuration": "string (e.g. 2BHK, 3BHK, Studio)",
  "configDetails": "string (e.g. 2 Bed | 2 Bath | 1200 sqft)",
  "postedBy": "owner | agent | builder",
  "description": "string (rich text / HTML)",
  "suitableFor": ["Bachelors", "Family", "Couples"],
  "availableFrom": "date (YYYY-MM-DD)",
  "price": "string (e.g. ₹4.5 Cr)",
  "priceNumeric": "number",
  "priceType": "fixed | negotiable",
  "pricePerSqft": "string",
  "maintenance": "string",
  "isReraVerified": "boolean",
  "rentPrice": "string",
  "securityDeposit": "string",
  "address": "string",
  "location": "string (e.g. CBD Belapur, Navi Mumbai)",
  "area": "string (e.g. 1200 sqft)",
  "furnishing": "Unfurnished | Semi-Furnished | Fully Furnished",
  "facing": "North | South | East | West | North-East | North-West | South-East | South-West",
  "floor": "string",
  "totalFloors": "string",
  "parking": "string (e.g. 2 Covered)",
  "constructionStatus": "Ready to Move | Under Construction | New Launch",
  "age": "string (e.g. 0-1 Years)",
  "amenities": ["Gym", "Swimming Pool", "Clubhouse"],
  "features": ["Modular Kitchen", "Vastu Compliant"],
  "gallery": ["image_url_1", "image_url_2"],
  "nearbyPlaces": [{ "name": "Belapur Station", "distance": "0.5 km", "type": "transit" }],
  "status": "Active | Sold | Draft | Archived",
  "featured": "boolean",
  "date": "date (YYYY-MM-DD)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 3a. Public Website Endpoints (No Auth)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/properties` | Get active properties (paginated, with filters) |
| `GET` | `/properties/:slug` | Get single property by slug |
| `GET` | `/properties/search` | Search & filter properties |
| `GET` | `/properties/featured` | Get featured properties for homepage |
| `POST` | `/properties/submit` | Submit property listing (sets status=Draft) |

#### `GET /properties` — Query Parameters

| Param | Type | Example |
|---|---|---|
| `purpose` | string | `sell`, `rent` |
| `propertyType` | string | `Apartment`, `Villa` |
| `location` | string | `Kharghar` |
| `configuration` | string | `2BHK`, `3BHK` |
| `furnishing` | string | `Fully Furnished` |
| `minPrice` | number | `5000000` |
| `maxPrice` | number | `20000000` |
| `page` | integer | `1` |
| `limit` | integer | `12` |

#### `POST /properties/submit` — Public Listing Submission
```json
{
  "title": "3BHK Apartment in Kharghar",
  "purpose": "sell",
  "propertyType": "Apartment",
  "configuration": "3BHK",
  "price": "₹85 Lac",
  "priceNumeric": 8500000,
  "location": "Kharghar, Navi Mumbai",
  "address": "Sector 35, Kharghar",
  "area": "1450 sqft",
  "furnishing": "Semi-Furnished",
  "amenities": ["Gym", "Lift", "Parking"],
  "gallery": ["image_url_1"],
  "contactName": "Suresh Patil",
  "contactPhone": "9876543210",
  "contactEmail": "suresh@example.com"
}
```
**Response:**
```json
{
  "message": "Property submitted. Our team will review it within 24 hours.",
  "id": "draft-uuid"
}
```

> [!NOTE]
> Backend must auto-set `status: "Draft"` on submit. Admin reviews it from the admin panel and publishes it.

---

### 3b. Admin Panel Endpoints (JWT Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/properties` | Get all properties incl. Draft/Archived (paginated) |
| `POST` | `/admin/properties` | Create a new property |
| `GET` | `/admin/properties/:id` | Get a single property by ID |
| `PUT` | `/admin/properties/:id` | Update a property |
| `DELETE` | `/admin/properties/:id` | Delete a property |
| `PATCH` | `/admin/properties/:id/status` | Update status only |
| `PATCH` | `/admin/properties/:id/featured` | Toggle featured flag |
| `POST` | `/admin/properties/:id/duplicate` | Duplicate a property |

#### `GET /admin/properties` — Query Parameters

| Param | Type | Example |
|---|---|---|
| `status` | string | `Active`, `Sold`, `Draft`, `Archived` |
| `search` | string | `Belapur` |
| `page` | integer | `1` |
| `limit` | integer | `10`, `20`, `50` |
| `sortBy` | string | [date](file:///C:/Users/admin/Desktop/navi-mumbai-property-deals/components/Register/Login.tsx#27-39), `price` |
| `sortOrder` | string | `asc`, `desc` |

#### Paginated Response Shape
```json
{
  "data": [ { "...property" } ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

#### `PATCH /admin/properties/:id/status`
```json
{ "status": "Active | Sold | Draft | Archived" }
```

#### `PATCH /admin/properties/:id/featured`
```json
{ "featured": true }
```

---

## ✍️ 4. Blog Module

### Data Model — Blog Post
```json
{
  "id": "string or integer",
  "title": "string",
  "slug": "string (auto-generated from title)",
  "content": "string (rich text HTML from Quill editor)",
  "status": "Published | Draft | Archived",
  "category": "Market Insights | Buying Guide | Investment | Lifestyle | Real Estate News",
  "author": "string",
  "authorRole": "string (e.g. Editor, Journalist)",
  "readTime": "string (e.g. 5 min read)",
  "images": ["image_url_1", "image_url_2"],
  "coverImage": "string (primary image URL)",
  "tags": ["string"],
  "views": "integer",
  "featured": "boolean",
  "date": "date (YYYY-MM-DD)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 4a. Public Website Endpoints (No Auth)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/blogs` | Get published blogs (listing page + home BlogSection) |
| `GET` | `/blogs/:slug` | Get single blog by slug (detail page) |

#### `GET /blogs` — Query Parameters

| Param | Type | Example |
|---|---|---|
| `category` | string | `Investment` |
| `featured` | boolean | `true` |
| `page` | integer | `1` |
| `limit` | integer | `6` |

---

### 4b. Admin Panel Endpoints (JWT Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/blogs` | Get all blogs incl. Draft/Archived |
| `POST` | `/admin/blogs` | Create a new blog post |
| `GET` | `/admin/blogs/:id` | Get a single blog by ID |
| `PUT` | `/admin/blogs/:id` | Update a blog post |
| `DELETE` | `/admin/blogs/:id` | Delete a blog post |
| `PATCH` | `/admin/blogs/:id/status` | Update status only |
| `PATCH` | `/admin/blogs/:id/featured` | Toggle featured flag |
| `POST` | `/admin/blogs/:id/duplicate` | Duplicate a blog post |
| `PATCH` | `/admin/blogs/:id/increment-views` | Increment view count |

#### `GET /admin/blogs` — Query Parameters

| Param | Type | Example |
|---|---|---|
| `status` | string | `Published`, `Draft`, `Archived` |
| `search` | string | `Metro Navi Mumbai` |
| `category` | string | `Market Insights` |
| `page` | integer | `1` |
| `limit` | integer | `10` |

---

## 📋 5. CRM / Enquiries Module

### Data Model — Enquiry / Lead
```json
{
  "id": "string or integer",
  "name": "string",
  "email": "string",
  "phone": "string (Indian format: +91 XXXXX XXXXX)",
  "propertyTitle": "string (property title displayed to user)",
  "propertyId": "string (reference to property ID, optional)",
  "enquiryType": "buy | rent | sell | investment | other",
  "message": "string",
  "status": "Pending | Resolved",
  "date": "date (YYYY-MM-DD)",
  "createdAt": "datetime",
  "source": "website-contact | property-detail | add-property | phone | walk-in"
}
```

### 5a. Public Website Endpoint (No Auth)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/enquiries` | Submit enquiry from Contact page |

#### `POST /enquiries` — Request Body
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "enquiryType": "buy",
  "message": "Looking for a 3BHK in Kharghar.",
  "source": "website-contact"
}
```

### 5b. Admin Panel Endpoints (JWT Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/enquiries` | Get all enquiries (paginated, filtered) |
| `GET` | `/admin/enquiries/:id` | Get a single enquiry |
| `PATCH` | `/admin/enquiries/:id/status` | Update status (Pending → Resolved) |
| `DELETE` | `/admin/enquiries/:id` | Delete enquiry |

#### `GET /admin/enquiries` — Query Parameters

| Param | Type | Example |
|---|---|---|
| `status` | string | `Pending`, `Resolved` |
| `search` | string | `Rahul`, `Belapur` |
| `page` | integer | `1` |
| `limit` | integer | `10` |

#### `GET /admin/enquiries` — Response
```json
{
  "data": [ { "...enquiry" } ],
  "total": 45,
  "pendingCount": 20,
  "resolvedCount": 25
}
```

#### `PATCH /admin/enquiries/:id/status`
```json
{ "status": "Pending | Resolved" }
```

> [!NOTE]
> WhatsApp, Call, and Email actions in the CRM are direct browser links (`tel:`, `mailto:`, `https://wa.me/`). No API endpoint is needed for those.

---

## 👥 6. User Management Module — Admin Panel Only

### Data Model — User
```json
{
  "id": "string or integer",
  "name": "string",
  "email": "string",
  "role": "Admin | Agent | User",
  "status": "Active | Inactive",
  "joinDate": "date (YYYY-MM-DD)",
  "avatar": "string (URL, optional)",
  "phone": "string (optional)",
  "totalLeads": "integer (optional, for agents)"
}
```

### Admin Panel Endpoints (JWT + Admin Role Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/users` | Get all users (paginated, filtered) |
| `POST` | `/admin/users` | Create a new user |
| `GET` | `/admin/users/:id` | Get a single user by ID |
| `PUT` | `/admin/users/:id` | Update user profile |
| `DELETE` | `/admin/users/:id` | Delete user |
| `PATCH` | `/admin/users/:id/status` | Activate / Deactivate user |
| `PATCH` | `/admin/users/:id/role` | Change user role |
| `POST` | `/admin/users/:id/reset-password` | Send password reset email |

#### `GET /admin/users` — Query Parameters

| Param | Type | Example |
|---|---|---|
| `role` | string | `Admin`, `Agent`, `User` |
| `status` | string | `Active`, `Inactive` |
| `search` | string | `Sandeep`, `rahul@example.com` |
| `page` | integer | `1` |
| `limit` | integer | `10` |

#### `PATCH /admin/users/:id/status`
```json
{ "status": "Active | Inactive" }
```

#### `PATCH /admin/users/:id/role`
```json
{ "role": "Admin | Agent | User" }
```

---

## 🖼️ 7. File Upload

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload/image` | Upload a single image |
| `POST` | `/upload/images` | Upload multiple images |

**Request:** `Content-Type: multipart/form-data`

**Response:**
```json
{
  "url": "https://cdn.navimumbaipropertydeals.com/images/abc123.jpg"
}
```
Or for multiple:
```json
{
  "urls": ["url1", "url2", "url3"]
}
```

> [!TIP]
> Use Cloudinary or AWS S3. These upload endpoints are used by both the public Add Property form and the Admin Panel's property/blog editors.

---

## 🔒 8. Auth & Security Rules (Full Table)

| Endpoint | Auth Required | Role |
|---|---|---|
| `POST /auth/register` | ❌ No | — |
| `POST /auth/login` | ❌ No | — |
| `POST /auth/google` | ❌ No | — |
| `POST /auth/forgot-password` | ❌ No | — |
| `POST /auth/admin/login` | ❌ No | — |
| `GET /auth/me` | ✅ Yes | Any |
| `POST /auth/logout` | ✅ Yes | Any |
| `GET /properties` | ❌ No | — |
| `GET /properties/:slug` | ❌ No | — |
| `GET /properties/search` | ❌ No | — |
| `GET /properties/featured` | ❌ No | — |
| `POST /properties/submit` | ❌ No | — |
| `GET /blogs` | ❌ No | — |
| `GET /blogs/:slug` | ❌ No | — |
| `POST /enquiries` | ❌ No | — |
| `POST /upload/image` | ✅ Yes | Any logged-in |
| `GET /admin/dashboard/**` | ✅ Yes | Admin or Agent |
| `ANY /admin/properties/**` | ✅ Yes | Admin or Agent |
| `ANY /admin/blogs/**` | ✅ Yes | Admin or Agent |
| `GET /admin/enquiries` | ✅ Yes | Admin or Agent |
| `PATCH /admin/enquiries/**` | ✅ Yes | Admin or Agent |
| `DELETE /admin/enquiries/**` | ✅ Yes | Admin or Agent |
| `ANY /admin/users/**` | ✅ Yes | **Admin only** |

**Auth Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📌 9. Enum References

### Property Status
`Active` | `Sold` | `Draft` | `Archived`

### Property Type
`Apartment` | `Villa` | `Flat` | `Penthouse` | `Commercial` | `House` | `Studio` | `1RK` | `Plot`

### Property Purpose
`sell` | `rent`

### Furnishing Status
`Unfurnished` | `Semi-Furnished` | `Fully Furnished`

### Construction Status
`Ready to Move` | `Under Construction` | `New Launch`

### Blog Status
`Published` | `Draft` | `Archived`

### Blog Category
`Market Insights` | `Buying Guide` | `Investment` | `Lifestyle` | `Real Estate News`

### Enquiry Status
`Pending` | `Resolved`

### Enquiry Type
`buy` | `rent` | `sell` | `investment` | `other`

### Enquiry Source
`website-contact` | `property-detail` | `add-property` | `phone` | `walk-in`

### User Role
`Admin` | `Agent` | `User`

### User Status
`Active` | `Inactive`

---

## 🗂️ 10. Complete Route Map

### Public Website → API Mapping

| Page / Route | Action | API Endpoint |
|---|---|---|
| Homepage `/` | Load featured properties | `GET /properties/featured` |
| Homepage `/` | Load home blog section | `GET /blogs?featured=true&limit=3` |
| Buy Page `/buy` or `/<slug>` | Property listings | `GET /properties?purpose=sell` |
| Rent Page `/rent` or `/<slug>` | Property listings | `GET /properties?purpose=rent` |
| Property Detail `/<property-slug>` | Load property | `GET /properties/:slug` |
| Blog List `/blogs` | Load all blogs | `GET /blogs` |
| Blog Detail `/blogs/<slug>` | Load blog | `GET /blogs/:slug` |
| Blog Detail — view count | Track view | `PATCH /admin/blogs/:id/increment-views` |
| Contact `/contact` | Submit form | `POST /enquiries` |
| Add Property `/add-property` | Submit listing | `POST /properties/submit` + `POST /upload/images` |
| Login `/login` | User login | `POST /auth/login` |
| Signup `/signup` | User register | `POST /auth/register` |
| Google Auth | Social login | `POST /auth/google` |

### Admin Panel → API Mapping

| Page / Route | Action | API Endpoint |
|---|---|---|
| Admin Login `/login` | Login | `POST /auth/admin/login` |
| Dashboard `/admin-panel` | Load stats & charts | `GET /admin/dashboard/**` |
| Property List `/admin-panel/properties` | Load all | `GET /admin/properties` |
| Add Property `?action=add` | Create | `POST /admin/properties` + `POST /upload/images` |
| Edit Property `?action=edit&id=X` | Load + update | `GET /admin/properties/:id` + `PUT /admin/properties/:id` |
| Blog List `/admin-panel/blogs` | Load all | `GET /admin/blogs` |
| Add Blog `/admin-panel/blogs/add` | Create | `POST /admin/blogs` + `POST /upload/image` |
| Edit Blog `/admin-panel/blogs/edit/:id` | Load + update | `GET /admin/blogs/:id` + `PUT /admin/blogs/:id` |
| CRM `/admin-panel/inquiries` | Load leads | `GET /admin/enquiries` |
| CRM — resolve lead | Update status | `PATCH /admin/enquiries/:id/status` |
| User Management `/admin-panel/users` | Load users | `GET /admin/users` |
| User Management — edit/delete | Manage | `PUT /admin/users/:id`, `DELETE /admin/users/:id` |

---

## ⚡ 11. Priority Build Order (Suggested)

1. **Auth** — Register, Login (User + Admin), Google OAuth, JWT middleware, `/auth/me`
2. **Properties** — Public `GET /properties` + `GET /properties/:slug` + Admin `/admin/properties` CRUD
3. **Enquiries** — `POST /enquiries` (contact form, no auth) + `GET /admin/enquiries`
4. **Blogs** — Public `GET /blogs` + `GET /blogs/:slug` + Admin `/admin/blogs` CRUD
5. **File Upload** — Shared `/upload/image` & `/upload/images`
6. **Add Property (Submit)** — `POST /properties/submit`
7. **Users** — `/admin/users` CRUD (Admin only)
8. **Dashboard** — All `/admin/dashboard/*` aggregation endpoints (last, depends on all collections)

---

> [!IMPORTANT]
> **Frontend Base URL:** Update the Axios config base URL from the placeholder to your deployed backend:
> ```
> https://api.navimumbaipropertydeals.com/api
> ```

> [!NOTE]
> **Slug generation:** All property and blog slugs must be auto-generated on the backend at creation time. Format: `{title-kebab-case}-{location-kebab-case}` for properties (e.g. `3bhk-apartment-kharghar-navi-mumbai`).
