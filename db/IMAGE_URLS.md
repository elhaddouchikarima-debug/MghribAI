# How to add photos to the trip plan

Edit `db/planner_images.json`. Every destination, activity, food option, and accommodation style already has a row with an empty `url` field.

```json
"activities": {
  "marrakech/medina-souks-and-artisan-lanes-walk": {
    "name": "Medina souks and artisan lanes walk",
    "url": "https://example.com/medina-photo.jpg",
    "alt": "Covered artisan stalls in Marrakech"
  }
}
```

- Set `url` to an `https://...` image address or to a local path such as `/assets/photos/medina.jpg`.
- Put local images in `public/assets/` and use their path beginning with `/assets/`.
- `alt` is optional; it provides accessible text for the image.
- Keys follow `city-id/item-slug`. Meal keys are under `food`; accommodation keys use the budget tier (`low`, `moderate`, `comfortable`, `luxury`); destination cover keys use `/default`.
- Save the JSON and generate a new itinerary. The app rereads this file when building each itinerary. No database reseed or server restart is needed.
- Leave `url` empty to keep the automatic city image fallback. Invalid or empty URLs are ignored.
