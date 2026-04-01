# Operational hazards

- Missing VITE_PGRST_URL causes DBApiClient to throw at runtime
- Missing or invalid VITE_BACKEND_MAIN_URL breaks HTTPApiClient requests
- Auth header mismatches can lead to silent login failures and 401 loops
- Locale bundle drift can cause missing text or fallback behavior
- PAGE_ID and PAGE_PATH mismatches can break navigation
