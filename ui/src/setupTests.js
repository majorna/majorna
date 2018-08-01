// jsdom doesn't provide all of the global constants so we need to mock them out
global.TextEncoder = global.TextEncoder || class {}