# Architecture

MediaSniff uses a pnpm workspace. Parsers accept strings and return serializable shared types, making them safe to run in a browser, API process, or extension. The web app owns presentation and local state; the API is optional and does not proxy credentials. The extension captures only media-like request metadata and DOM media URLs.
