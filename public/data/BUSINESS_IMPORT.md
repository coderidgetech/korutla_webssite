# Using Google / Maps data in `businesses.json`

You can paste **many rows** from your Google Maps or spreadsheet categories into one JSON array.

## Each row (object)

| Field | Required | Example |
|-------|----------|---------|
| `name` | Yes | Shop name as on Google |
| `nameTe` | No | Telugu name |
| `category` | Yes | Your main bucket — see below |
| `description` | No | Address, hours, or note |
| `phone` | No | `+91 ...` |
| `link` | No | Website |
| `linkLabel` | No | Label for link, e.g. `Website` |
| `mapsUrl` | No | **Google Maps link** for this place (Share → Copy link) |
| `tags` | No | `["Dine-in", "Delivery"]` — extra labels from Google types |

## Map Google “types” → `category`

Use one main `category` per row (site groups by this). Examples:

- restaurant, meal_takeaway, food → **Restaurant** or **Cafe & bakery**
- supermarket, grocery_store → **Supermarket**
- shopping_mall, department_store → **Shopping mall** or **Retail**
- lodging, hotel → **Hotel & lodging**
- bank, atm → **Bank**
- hospital, pharmacy, doctor → **Healthcare** or **Pharmacy**
- school, university → **Education**
- Any new name you use will still appear — add it to the sort list in `src/main.js` if you want a fixed order.

## Tips

1. **Search** on the site matches name, Telugu name, description, and tags.
2. **Category dropdown** filters to one bucket.
3. Keep one JSON array — duplicate file to backup before bulk paste.
