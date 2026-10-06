# Browser extension

The Manifest V3 extension uses a content script for `video`, `audio`, and `source` elements and a service worker for media-like request metadata. Browser permissions and CORS still apply. It is intentionally unable to read sensitive headers or protected media keys.
