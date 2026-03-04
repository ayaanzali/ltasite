# Airtable Website Images Setup

Store all site images in a dedicated Airtable base for centralized management and faster loading via Airtable's CDN.

## 1. Create the base

1. Create a new Airtable base (e.g. "LTA Website Images")
2. Create a table named **Images**
3. Add columns:
   - **Name** (Single line text) – exact key, e.g. `Hero1`, `Bottom2`
   - **Image** (Attachment) – attach your compressed image file

## 2. Add records

| Name | Image |
|------|-------|
| Hero1 | (attach) |
| Hero2 | (attach) |
| Hero3 | (attach) |
| Hero4 | (attach) |
| Hero5 | (attach) |
| Hero6 | (attach) |
| Hero7 | (attach) |
| Hero8 | (attach) |
| Hero9 | (attach) |
| Hero10 | (attach) |
| Hero11 | (attach) |
| Hero12 | (attach) |
| Bottom1 | (attach) – top row left |
| Bottom2 | (attach) – top row right |
| Bottom3 | (attach) – bottom row 1 |
| Bottom4 | (attach) – bottom row 2 |
| Bottom5 | (attach) – bottom row 3 |
| Gallery1 | (attach) – Winning Team |
| Gallery2 | (attach) – Runner Up |
| OfficerAyaan | (attach) |
| OfficerRam | (attach) |
| OfficerTanisha | (attach) |
| OfficerAishah | (attach) |
| OfficerNethra | (attach) |
| OfficerAafiya | (attach) |
| OfficerNeha | (attach) |
| OfficerKhadijah | (attach) |
| Logo | (attach) |

## 3. Compress images

Use [Squoosh](https://squoosh.app/) or similar to compress before uploading. Target:
- Hero/Gallery: ~500KB–1MB each
- Officers: ~200–400KB each
- Logo: &lt;100KB

## 4. Environment variable

Add to `.env.local`:

```
AIRTABLE_IMAGES_BASE_ID=appXXXXXXXXXXXXXX
```

Get the base ID from the Airtable URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`

Use the same `AIRTABLE_API_KEY` as your main base (personal access token works across bases).

## 5. Fallback

If `AIRTABLE_IMAGES_BASE_ID` is not set, the site uses images from `/public` as before.
