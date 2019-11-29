# Useful command templates

```bash
togeojson ~/Downloads/RSPB_Reserves.kml > public/RSPB_Reserves.geojson
cat ~/Downloads/df20f1dfa1ca466b89d2e638e554d0be.gdb.geojson |  reproject --use-epsg-io --from=EPSG:27700 --to=EPSG:4326 > public/RSPB_Reserves.geojson
```

Most of the data we're using at the moment uses the `EPSG:27700` projection. Easiest way to convert it is to use `reproject`. We're using `EPSG:4326` on the map. Probably worth moving to Pseudo Mercator at some point for performance.

Data is stored using Git LFS storage via Netlify
